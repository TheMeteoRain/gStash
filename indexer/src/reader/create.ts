import * as fs from 'fs'

import { pgp } from '../db'

const concatQueries = (queryArray: string[]): string => pgp.helpers.concat([...queryArray])

export const checkArrayLength = (array: any[] | undefined, method: any) => {
  if (Array.isArray(array)) {
    return array.length > 0 ? method(array) : ''
  }

  return ''
}

export const sqlFile = ({ title, directory = 'sql' }: { title: string, directory: string }) => {
  const sqlQueryArray = new Array<string>()

  return {
    addQuery: (array: any[], method: any) => {
      sqlQueryArray.push(checkArrayLength(array, method))
    },
    createFile: () => {
      const sqlQueryString: string = concatQueries(sqlQueryArray)

      const fileName = `${title}.sql`
      const filePath = directory + '/' + fileName

      const sqlQueryStringModified =
        sqlQueryString
          .replace(/INSERT INTO/g, '\nINSERT INTO') // Add new line in front of every INSERT INTO
          .replace('DELETE FROM', '\nDELETE FROM')  // Add new line in front of every DELETE FROM
          .replace('\n', '')  // Remove the first new line

      try {
        fs.writeFileSync(filePath, sqlQueryStringModified)
      } catch (error) {
        console.error(`Could not save file: '${fileName}' to directory: '${directory}/'`)
        console.error(error)
        return false
      }
      console.log(`File: ${fileName} has been saved`)

      return true
    },
  }
}
