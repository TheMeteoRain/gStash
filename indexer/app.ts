import 'dotenv/config'
import axios from 'axios'
import Stash from './class/Stash'
import db from './db'
import query from './query'


/**
 * The amount of milliseconds when a new request is sent to the poe api.
 */
const POLL_SERVER_INTERVAL: number = 1000

/**
 * Current next_change_id.
 * Change this to the last visited next_change_id to resume where indexer left off.
 */
const ID: string = '0'

const config = {
    headers: {
        'Accept-Encoding': 'gzip'
    },
    responseType: 'json'
}

const poll = (ID: string): void => {
    async function fetchData() {
        console.log(`Downloading data with ID [${ID}]`)
        console.time("Downloading took")

        try {
            const { data: { next_change_id, stashes } } = await axios.get(`${process.env.POE_ENDPOINT}?id=${ID}`, config)
            console.timeEnd("Downloading took")
            console.log(`Downloaded ${stashes.length} stashes`)
            await query.updateCurrentNextChangeId(ID, 1)
            poll(next_change_id)
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
            poll(ID)
        }
    }

    setTimeout(fetchData, POLL_SERVER_INTERVAL)
}

poll(ID)