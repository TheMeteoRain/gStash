const fs = require('fs')
const pg = require('pg')
const copyFrom = require('pg-copy-streams').from

const {
  parseFileName,
  fileHandler,
} = require('./util')

const client = new pg.Client({
  user: 'Mete',
  host: 'localhost',
  database: 'poe',
  password: null,
  port: 5432,
})

const {
  readDirectory,
  deleteFile,
} = fileHandler({
  fs,
  directory: 'csv',
  names: ['items', 'properties', 'mods', 'sockets', 'requirements'],
})


client.connect((err, client) => {
  const loop = () => {
    const fileArray = readDirectory()

    const doNext = (fileArray) => {
      if (fileArray.length === 0) return setTimeout(loop, 1000)

      fileArray.shift().then((resolved) => {
        const {
          title: fileTitle,
        } = parseFileName(resolved)
        const stream = client.query(copyFrom(`COPY ${fileTitle} FROM STDIN DELIMITER '|' CSV HEADER QUOTE e'\x01'`))
        const fileStream = fs.createReadStream(`csv/${resolved}`)

        console.time(`COPY DATA ${resolved}`)

        fileStream.on('error', (error) => {
          console.log(resolved + '\n', error)
          return
        })
        stream.on('error', (error) => {
          console.log('xd', resolved, error)
          return
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