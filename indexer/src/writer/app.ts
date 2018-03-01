import 'dotenv/config'

import * as fs from 'fs'
import { db } from '../db'
import queries from './queries'

const DIRECTORY = 'sql'
const FILE_LOCATION = (fileName: string): string => `${DIRECTORY}/${fileName}`
const FILE_ID = (fileName: string): string => fileName.substring(fileName.indexOf('_') + 1, fileName.indexOf('.'))
const extractNumberFromFileName = (value: string): number => Number(value.match(/\d+/)[0])

const readDirectory = (): string[] => {
  try {
    const sqlDirectory: string[] = fs.readdirSync(DIRECTORY, 'utf8').sort((a: string, b: string): number => {
      const aNumber: number = extractNumberFromFileName(a)
      const bNumber: number = extractNumberFromFileName(b)

      if (aNumber < bNumber)
        return -1

      if (aNumber > bNumber)
        return 1

      return 0
    }).slice(0, 5)

    const importantFile = sqlDirectory.filter((directory: string) => directory === 'data.sql')

    if (importantFile.length > 0) {
      return importantFile
    }

    if (sqlDirectory.length > 4) {
      return sqlDirectory
    }

    return []
  } catch (error) {
    console.error('ERROR', `Could not read directory: ${DIRECTORY}/`)
    throw error
  }
}

const writeFilesToDatabase = async (fileArray: string[]): Promise<boolean> => {
  // Filter empty files
  const fileArrayFiltered: string[] = fileArray
    .filter((fileName: string) => {
      try {
        return fs.readFileSync(FILE_LOCATION(fileName), 'utf8').length > 0
      } catch (error) {
        console.error('ERROR', `Could not read file: ${fileName}`)
        throw error
      }
    })

  // Filtered array must not be empty
  if (fileArrayFiltered.length > 0) {
    // Extract queries from all files
    const sqlQueryArray: string[] = fileArrayFiltered.map((fileName: string) => {
      try {
        return fs.readFileSync(FILE_LOCATION(fileName), 'utf8')
      } catch (error) {
        console.error('ERROR', `Could not read file: ${fileName}`)
        throw error
      }
    })
      .join('DELETE_ME')
      .replace(/\n/g, 'DELETE_ME')
      .split('DELETE_ME')

    // Write queries to database
    await db.task('Saving data', (t: any) => t.batch(sqlQueryArray.map((sqlQuery: string) => t.result(sqlQuery))))
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
        // console.error('ERROR', `Failed to process file: ${fileId}`)

      })

    /* const getNextData = (t, pageIndex: number): Promise<string> => {
      const data = sqlQueryArray[pageIndex]

      process.stdout.clearLine()
      process.stdout.cursorTo(0)
      process.stdout.write(`${pageIndex} of ${sqlQueryArray.length} ${data ? `(${data.substr(13, 12)})` : ''}`)

      return Promise.resolve(data)
    }

    const calculateTotal = (event, property: string) => {
      return event ? event[property] : 0
    }

    await db.task('massive-insert', (t) => {
      let total = 0
      return t.sequence((index: number) =>
        getNextData(t, index).then((data: any) => {
          if (data) {
            return t.result(data)
          } else {
            process.stdout.write('\n')
          }
        }).then((event) => {
          total += calculateTotal(event, 'rowCount')
          return event
        })).then(() => total)
    })
      .then((data: any) => {
        // COMMIT has been executed
        console.log('Total inserts:', data)
      })
      .catch((error) => {
        // ROLLBACK has been executed
        console.error('Something went wrong')
        throw error
      }) */

    return true
  }

  return false
}

const deleteFiles = async (fileArray: string[]): Promise<boolean> => {
  /* await db.task('Update ID status', (t: any) => {
    return t.batch(fileArray.map((fileName: string) => {
      return queries.updateCurrentNextChangeId(t, FILE_ID(fileName), true)
    }))
  }).catch((error) => {
    console.error('Could not update ID status')
    throw error
  }) */

  fileArray.forEach((fileName: string) => {
    try {
      fs.unlinkSync(FILE_LOCATION(fileName))
      console.log(`Deleted file: ${fileName}`)
    } catch (error) {
      console.error(`Could not delete file: ${fileName}`)
      throw error
    }
  })

  return true
}

/**
 * Main starting point of this application.
 */
async function main() {
  try {
    const fileArray: string[] = readDirectory()

    if (fileArray.length > 0) {
      const writeSuccessful: boolean = await writeFilesToDatabase(fileArray)
      if (writeSuccessful)
        deleteFiles(fileArray)
      console.log(' ')
    }

    setTimeout(main, 1000)
  } catch (error) {
    console.error(error)
    setTimeout(main, 5000)
  }
}

main()
