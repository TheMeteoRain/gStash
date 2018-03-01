const fs = require('fs')
const pg = require('pg')
const copyFrom = require('pg-copy-streams').from

const client = new pg.Client({
  user: 'Mete',
  host: 'localhost',
  database: 'poe',
  password: null,
  port: 5432,
})

const tables = ['items', 'properties', 'mods', 'sockets', 'requirements']

const parseFileName = (fileName) => {
  const fileArray = fileName.substring(0, fileName.length - 4).split('-')
  const tableName = fileArray.shift()
  const sumOfIds = fileArray.reduce((a, b) => Number(a) + Number(b), 0)

  return {
    name: tableName,
    sum: sumOfIds,
  }
}

const readDirectory = (name) => {
  const fileArray = fs.readdirSync(name, 'utf8')

  if (fileArray.length > 4) {
    const fileArraySorted = fileArray.sort((a, b) => {
      const {
        name: aName,
        sum: aSum,
      } = parseFileName(a)
      const {
        name: bName,
        sum: bSum,
      } = parseFileName(b)

      if (aSum === bSum) {
        return tables.indexOf(aName) - tables.indexOf(bName)
      }

      return aSum - bSum
    })
    const {
      sum: smallestId
    } = parseFileName(fileArray[0])

    const onlyFilesWithSameId = fileArray.filter((fileName) => {
      const {
        sum
      } = parseFileName(fileName)

      return smallestId === sum
    })

    return onlyFilesWithSameId.map((file) => Promise.resolve(file))
  }

  return []
}

const deleteFile = async (file) => {
  const DIRECTORY = '../../csv'
  const FILE_LOCATION = (fileName) => `${DIRECTORY}/${fileName}`

  try {
    fs.unlinkSync(FILE_LOCATION(file))
    //console.log(`Deleted file: ${file}`)
    return true
  } catch (error) {
    console.error(`Could not delete file: ${file}`)
    throw error
  }

  return false
}



client.connect((err, client) => {
  const loop = () => {
    const fileArray = readDirectory('../../csv')

    const doNext = (fileArray) => {
      if (fileArray.length === 0) return setTimeout(loop, 1000)


      fileArray.shift().then((resolved) => {
        const {
          name: fileName
        } = parseFileName(resolved)
        const stream = client.query(copyFrom(`COPY ${fileName} FROM STDIN DELIMITER '|' CSV HEADER QUOTE e'\x01'`))
        const fileStream = fs.createReadStream(`../../csv/${resolved}`)

        console.time(`COPY DATA ${resolved}`)

        fileStream.on('error', (error) => {
          console.log(resolved + '\n', error)
        })
        stream.on('error', (error) => {
          console.log('xd', resolved, error)
        })

        fileStream
          .pipe(stream)
          .on(('finish'), () => {
            console.timeEnd(`COPY DATA ${resolved}`)
            fileStream.destroy()
            deleteFile(resolved)
            doNext(fileArray)
          })
      })
    }


    doNext(fileArray)
  }

  loop()
})

//deleteFiles(fileArray)