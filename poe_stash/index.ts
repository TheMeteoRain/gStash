import * as express from 'express'
import fetch from 'node-fetch'

const router: express.Router = express.Router()

router.get('/stashes', (req: express.Request, res: express.Response, next) => {
  const url: string = 'http://api.pathofexile.com/public-stash-tabs'
  fetch(url)
    .then((res: any) => {
      return res.json()
    }).then((json: any) => {
    res.json(json.stashes[4])
  }).catch(next)
})

module.exports = router