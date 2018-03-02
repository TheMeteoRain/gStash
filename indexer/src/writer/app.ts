import 'dotenv/config'

import * as fs from 'fs'
import { db } from '../db'
import queries from './queries'

import { parseFileName, fileHandler } from './util'

const { readDirectory, deleteFile, findFilesWithId } = fileHandler({
  fs,
  directory: 'sql',
  names: ['data'],
})

const DIRECTORY = 'sql'
const FILE_LOCATION = (fileName: string): string => `${DIRECTORY}/${fileName}`

/**
 * Main starting point of this application.
 */
async function main() {
  let nextChangeId: string | null = null
  try {
    nextChangeId = await queries.getLatestNextchangeId(db)
  } catch (error) {
    console.error(error)
    return setTimeout(main, 5000)
  }

  const fileArray: Array<Promise<string>> | any[] = findFilesWithId(nextChangeId)
  console.log(nextChangeId, fileArray)
  const doNext = () => {
    if (fileArray.length === 0) return setTimeout(main, 1000)

    fileArray.shift().then(async (fileName: string) => {
      const {
        title: fileTitle,
        id: fileId,
      } = parseFileName(fileName)
      console.log(fileId)

      const arrayOfQueries: string[] = fs.readFileSync(FILE_LOCATION(fileName), 'utf8')
        .replace(/\n/g, 'DELETE_ME')
        .split('DELETE_ME')


      await db.task('Saving data', (t: any) => t.batch(arrayOfQueries.map((sqlQuery: string) => t.result(sqlQuery))))
        .then((events) => {
          const calculateTotal = (property: string) => {
            let total = 0
            for (const event of events)
              total = total + (event ? event[property] : 0)

            return total
          }

          console.log(calculateTotal('rowCount'))
        })
        .catch((error: any) => {
          console.error('Something went wrong')
          throw error
        })
      const a = await queries.updateCurrentNextChangeId(db, fileId, true)
      console.log(a)
      deleteFile(fileName)
    })
  }

  doNext()
}

main()
