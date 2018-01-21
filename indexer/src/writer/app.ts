import 'dotenv/config'

import * as fs from 'fs'
import { db, pgp } from '../db'
import statistics from './statistics'

const readDirectory = (): string | null => {
  try {
    const sqlDirectory: string[] = fs.readdirSync('sql', 'utf8')

    if (sqlDirectory.length > 0) {
      const extractNumberFromFileName = (value: string): number => Number(value.substring(5, value.indexOf('-')))

      const fileLocation = 'sql/' + sqlDirectory.reduce((prev: string, cur: string) => {
        const prevNumber: number = extractNumberFromFileName(prev)
        const curNumber: number = extractNumberFromFileName(cur)

        if (prevNumber < curNumber) {
          return prev
        }

        return cur
      })

      return fileLocation
    }

    return null
  } catch (error) {
    console.error('ERROR', `Could not read directory: sql`)
    throw error
  }
}

const readFile = (fileLocation: string): string[] => {
  try {
    const sqlQueryFile: string =
      fs.readFileSync(fileLocation, 'utf8')
    const sqlQueryArray: string[] =
      sqlQueryFile
        .split('\n')

    return sqlQueryArray
  } catch (error) {
    console.error('ERROR', `Could not read file: ${fileLocation}`)
    throw error
  }
}

const writeToDatabase = async (sqlQueryArray: string[], fileLocation: string): Promise<void> => {
  console.log(`Processing file: ${fileLocation}`)
  await db.task('Saving data', (t: any) => t.batch(sqlQueryArray.map((sqlQuery: string) => t.result(sqlQuery))))
    .then(statistics)
    .then((events: any) => {
      console.log(`Processed file: ${fileLocation}`)
    })
    .catch((error: any) => {
      console.error('ERROR', `Failed to process file: ${fileLocation}`)
      throw error
    })
}

const deleteFile = (fileLocation: string): void => {
  try {
    fs.unlinkSync(fileLocation)
    console.log(`Deleted file: ${fileLocation}`)
  } catch (error) {
    console.error('ERROR', `Could not delete file: ${fileLocation}`)
    throw error
  }
}

/**
 * Main starting point of this application.
 */
(async function main() {
  const fileLocation: string | null = readDirectory()

  if (fileLocation) {
    const sqlQueryArray: string[] = readFile(fileLocation)
    await writeToDatabase(sqlQueryArray, fileLocation)
    deleteFile(fileLocation)
  }

  console.log(' ')
  setTimeout(main, 1000)
})().catch((error) => {
  console.error(error)
})
