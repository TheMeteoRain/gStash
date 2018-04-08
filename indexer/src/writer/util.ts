import * as fs from 'fs'

export const parseFileName = (fileName: string) => {
  if (!fileName) return
  // remove file extension and split to array by '-'
  const fileArray = fileName.replace(/.csv|.sql$/g, '').split('-')
  // check if the first --- is not a number, shift array
  const fileTitle = Number.isNaN(Number(fileArray[0])) ? fileArray.shift() : ''
  const fileId = fileArray.join('-')
  const sumOfIds = fileArray.reduce((a, b) => Number(a) + Number(b), 0)

  return {
    title: fileTitle,
    id: fileId,
    sum: sumOfIds,
  }
}

export const findFilesWithId = ({ directory, fileId }: { directory: string, fileId: string }): any => {
  if (!directory || !fileId) return

  const fileArray = fs.readdirSync(directory, 'utf8')

  if (fileArray.length === 0) return []

  const {
    sum: targetSum,
  } = parseFileName(fileId)

  const onlyFilesWithSameId = fileArray.filter((fileName: string) => {
    const {
      sum,
      id,
    } = parseFileName(fileName)

    return targetSum === sum && fileId === id
  })

  return onlyFilesWithSameId.map((file: string) => Promise.resolve(file))
}

export const sortDirectory = ({ directory, names }: { directory: string, names: string[] }): any => {
  const fileArray = fs.readdirSync(directory, 'utf8')

  if (fileArray.length === 0) return []

  const fileArraySorted = fileArray.sort((a: string, b: string) => {
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

  const onlyFilesWithSameId = fileArraySorted.filter((fileName: string) => {
    const {
      sum,
    } = parseFileName(fileName)

    return smallestId === sum
  })

  return onlyFilesWithSameId.map((file: string) => Promise.resolve(file))
}

export const deleteFile = ({ directory, fileName }: { directory: string, fileName: string }) => {
  try {
    fs.unlinkSync(`${directory}/${fileName}`)
    console.log(`Deleted file: ${fileName}`)
    return true
  } catch (error) {
    console.error(`Could not delete file: ${fileName}`)
    throw error
  }

  return false
}
