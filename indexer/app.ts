import 'dotenv/config'
import axios from 'axios'

import db from './db'
import query from './query'

import transformStash, { Stash } from './class/Stash'
import transformAccount, { Account } from './class/Account'


/**
 * The amount of milliseconds when a new request is sent to the poe api.
 */
const POLL_SERVER_INTERVAL: number = 1000

/**
 * Current next_change_id.
 * Change this to the last visited next_change_id to resume where indexer left off.
 */
let ID: string = '0'

const config = {
    headers: {
        'Accept-Encoding': 'gzip'
    },
    responseType: 'json'
}

const saveAccountsTask = (stashes: any): any => {
    return db.task((t: any) => {
        const a = stashes.map((stash: any) => {
            return query.setAccount(t, transformAccount(stash))
        })
        const b = stashes.map((stash: any) => {
            return query.setStash(t, transformStash(stash))
        })

        return t.batch([...a, ...b])
    }).then((events: any) => {
        const stats = {
            total: events.length,
            saved: 0
        }
        events.map((event: any) => {
            stats.saved = event.rowCount > 0 ? stats.saved + 1 : stats.saved
        })

        return stats
    }).catch((error: any) => {
        console.log(error)
    })
}

const poll = (ID: string): void => {
    console.log(" ")

    async function fetchData() {
        console.log(`Downloading data with ID [${ID}]`)
        console.time("Downloading took")

        try {
            const { data: { next_change_id, stashes } }: { data: { next_change_id: string, stashes: any } } = await axios.get(`${process.env.POE_ENDPOINT}?id=${ID}`, config)
            console.timeEnd("Downloading took")
            //console.log(`Downloaded ${stashes.length} stashes`)
            await query.updateCurrentNextChangeId(ID, 1)
            saveData(next_change_id, stashes)
        } catch (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
            } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
            }
            console.log(error.config);
            await query.updateCurrentNextChangeId(ID, 0)
            poll(ID)
        }
    }

    async function saveData(next_change_id: string, stashes: any) {
        console.time("Saving data took")

        try {
            const { total, saved } = await saveAccountsTask(stashes)
            console.log(`Total downloaded: ${total}, saved: ${saved}, failed: ${total - saved}`)
            console.timeEnd("Saving data took")
            poll(next_change_id)
        } catch (error) {
            poll(ID)
            console.log(error)
        }
    }

    setTimeout(fetchData, POLL_SERVER_INTERVAL)
}

query.getLatestNextChangeId().then((LATEST_ID: string) => {
    ID = LATEST_ID ? LATEST_ID : '0'
    poll(ID)
}).catch((error) => {
    console.log(error)
})
