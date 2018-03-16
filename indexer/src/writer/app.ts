import 'dotenv/config'

import * as fs from 'fs'
import { db } from '../db'
import queries from './queries'
import { Client, Pool } from 'pg'
// @ts-ignore
import * as copy from 'pg-copy-streams'

import { parseFileName, findFilesWithId, deleteFile } from './util'

// @ts-ignore
const pool: Pool = new Pool({
  user: 'katri',
  host: 'localhost',
  database: 'poe',
  password: null,
  port: 5432,
  // number of milliseconds to wait before timing out when connecting a new client
  // by default this is 0 which means no timeout
  connectionTimeoutMillis: 0,
  // number of milliseconds a client must sit idle in the pool and not be checked out
  // before it is disconnected from the backend and discarded
  idleTimeoutMillis: 60000,
  // maximum number of clients the pool should contain
  max: 5,
})

pool.on('connect', (client) => {
  console.log('wow a connection')
})

pool.on('error', (error, client) => {
  console.error('Something went badly wrong ', error)
});

/**
 * Main starting point of this application.
 */
(async function main() {
  const client = await pool.connect()

  let nextChangeId: string | null = null

  try {
    const nextChangeId = await queries.getLatestNextchangeId(client)
      .then((res) => res.rows[0].next_change_id)
    client.release()
    console.log(`Preparing to insert id: ${nextChangeId}`)
  } catch (error) {
    console.log(`No id found. Retrying in ${5000 / 1000} seconds.`)
    client.release()
    return setTimeout(main, 5000)
  }

  const fileArraySql = findFilesWithId({
    directory: 'sql', fileId: nextChangeId,
  })

  const fileArrayCsv = findFilesWithId({
    directory: 'csv', fileId: nextChangeId,
  })

  const updateCurrentNextChangeId = async () => {
    const client = await pool.connect()

    await queries.updateCurrentNextChangeId(client, nextChangeId, true)
      .catch((error: Error) => console.error(error))

    client.release()

    return main()
  }

  const insertCsv = async () => {
    if (fileArrayCsv.length === 0) return setTimeout(updateCurrentNextChangeId, 1000)

    const client = await pool.connect();

    (function recursion() {
      if (fileArrayCsv.length === 0) {
        client.release()
        return setTimeout(updateCurrentNextChangeId, 1000)
      }

      fileArrayCsv.shift().then(async (fileName: string) => {
        const {
          title: fileTitle,
        } = parseFileName(fileName)

        const stream = client.query(copy.from(`COPY ${fileTitle} FROM STDIN DELIMITER '|' CSV HEADER QUOTE e'\x01'`))
        const fileStream = fs.createReadStream(`csv/${fileName}`)

        console.time(`COPY DATA ${fileName}`)

        fileStream.on('error', (error: Error) => {
          console.log(fileName + '\n', error)
          return
        })
        stream.on('error', (error: Error) => {
          console.log('xd', fileName, error)
          return
        })

        fileStream
          .pipe(stream)
          .on(('finish'), () => {
            console.timeEnd(`COPY DATA ${fileName}`)
            fileStream.destroy()
            // deleteFile(fileName)
            recursion()
          })
      }).catch((error: Error) => {
        console.error('Inserting CSV failed')
        console.error(error)
      })

    })()
  }

  (async function insertSql() {
    if (fileArraySql.length === 0) return setTimeout(insertCsv, 1000)

    fileArraySql.shift().then(async (fileName: string) => {
      const {
        title: fileTitle,
        id: fileId,
      } = parseFileName(fileName)

      const arrayOfQueries: string[] = fs.readFileSync(`sql/${fileName}`, 'utf8')
        .replace(/\n/g, 'DELETE_ME')
        .split('DELETE_ME')

      await db.task('Saving SQL data', (t: any) =>
        t.batch(arrayOfQueries.map((sqlQuery: string) => t.result(sqlQuery))))

      // deleteFile({directory: 'sql', fileName})
      return insertCsv()
    }).catch((error: Error) => {
      console.error('Inserting SQL failed')
      console.error(error)
    })
  })()

})()
