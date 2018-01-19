import axios from 'axios'

const config = {
  headers: {
    'Accept-Encoding': 'gzip',
  },
  responseType: 'json',
}

const requests = {
  getStashes(LATEST_ID: string) {
    return axios.get(`http://api.pathofexile.com/public-stash-tabs?id=${LATEST_ID}`, config).then((data: any) => {
      const { data: { next_change_id, stashes } }: { data: { next_change_id: string, stashes: any } } = data
      return { next_change_id, stashes }
    })
  },
}

export default requests
