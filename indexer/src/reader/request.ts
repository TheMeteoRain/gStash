import axios from 'axios'

const config = {
  headers: {
    'Accept-Encoding': 'gzip',
  },
  responseType: 'json',
}

const fetch = (url: string) => axios.get(url, config).then((data: any) => data)

export default fetch
