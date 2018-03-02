const parseFileName = (fileName) => {
  if (!fileName) return
  // remove file extension and split to array by '-'
  const fileArray = fileName.replace(/[.csv|.sql]/g, '').split('-')
  const fileTitle = fileArray.shift()
  const sumOfIds = fileArray.reduce((a, b) => Number(a) + Number(b), 0)
  const fileId = fileArray.join('-')

  return {
    title: fileTitle,
    id: fileId,
    sum: sumOfIds,
  }
}

const fileHandler = ({
  fs,
  directory,
  names,
}) => ({
  findFilesWithId: (fileId = null) => {
    if (!fileId) return

    const fileArray = fs.readdirSync(directory, 'utf8')

    if (fileArray.length === 0) return []

    const {
      sum: targetSum,
    } = parseFileName(fileId)

    const onlyFilesWithSameId = fileArray.filter((fileName) => {
      const {
        sum,
      } = parseFileName(fileName)

      return targetSum === sum
    })

    return onlyFilesWithSameId.map((file) => Promise.resolve(file))
  },
  readDirectory: () => {
    const fileArray = fs.readdirSync(directory, 'utf8')

    if (fileArray.length === 0) return []

    const fileArraySorted = fileArray.sort((a, b) => {
      const {
        title: aTitle,
        sum: aSum,
      } = parseFileName(a)
      const {
        title: bTitle,
        sum: bSum,
      } = parseFileName(b)

      if (aSum === bSum) {
        return names.indexOf(aTitle) - names.indexOf(bTitle)
      }

      return aSum - bSum
    })

    const {
      sum: smallestId,
    } = parseFileName(fileArraySorted[0])

    const onlyFilesWithSameId = fileArraySorted.filter((fileName) => {
      const {
        sum,
      } = parseFileName(fileName)

      return smallestId === sum
    })

    return onlyFilesWithSameId.map((file) => Promise.resolve(file))
  },
  deleteFile: (fileName) => {
    const FILE_LOCATION = (fileName) => `${directory}/${fileName}`

    try {
      fs.unlinkSync(FILE_LOCATION(fileName))
      console.log(`Deleted file: ${fileName}`)
      return true
    } catch (error) {
      console.error(`Could not delete file: ${fileName}`)
      throw error
    }

    return false
  },
})


module.exports = {
  parseFileName,
  fileHandler,
}