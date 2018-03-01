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

export const csvFile = ({ directory = 'csv' }: { directory: string }) => {
  const csvArray = new Array<string>()

  return {
    createFile: ({ data, title }: { data: any, title: string }) => {

      if (data.length > 0) {
        const headers = Object.keys(data[0])

        data = data.map((element: any, index: number) => headers.map((header) => {
          if (header === 'variable_data')
            return JSON.stringify(element[header])

          return element[header]
        }).join('|'))

        const fileName = `${title}.csv`
        const filePath = directory + '/' + fileName
        const text = headers.join('|') + '\n' + data.join('\n')

        try {
          fs.writeFileSync(filePath, text)
        } catch (error) {
          console.error(`Could not save file: '${fileName}' to directory: '${directory}/'`)
          console.error(error)
          return false
        }
        console.log(`File: ${fileName} has been saved`)

        return true
      }

      return false
    },
  }
}
