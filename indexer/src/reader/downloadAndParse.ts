import request from './request'

const downloadAndParse = async ({ url, parser }: { url: string, parser: any }): Promise<any> => {
  console.log(' ')
  console.log(`Downloading data from ${url}`)

  console.time('Downloading data took')
  const data: any = await request(url)
  console.timeEnd('Downloading data took')

  console.time('Parsing data took')
  const parsedData: any[] = await parser(data)
  console.timeEnd('Parsing data took')

  return parsedData
}

export default downloadAndParse
