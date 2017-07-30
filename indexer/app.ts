import 'dotenv/config'
import axios from 'axios'

import db from './db'
import query from './query'

import { Stash, Account, Item, ModType } from './interface'

import transformStash from './transform/Stash'
import transformAccount from './transform/Account'
import transformItem from './transform/Item'
import transformProperty from './transform/Property'
import transformRequirement from './transform/Requirement'
import transformSocket from './transform/Socket'
import transformMod from './transform/Mod'

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
        let batch: Array<any> = []
        for (const stash of stashes) {
            const { accountName, id, items } = stash
            delete stash['items']
            batch.push(query.setAccount(t, transformAccount(stash)))
            batch.push(query.setStash(t, transformStash(stash)))

            for (const item of items) {
                const { properties, requirements, sockets, explicitMods, implicitMods, enchantMods, craftedMods } = item

                delete item['properties']
                delete item['requirements']
                delete item['explicitMods']
                delete item['implicitMods']
                item.accountName = accountName
                item.stashId = id
                batch.push(query.setItem(t, transformItem(item)))

                if (sockets) {
                    for (const socket of sockets) {
                        socket.itemId = item.id
                        batch.push(query.setSocket(t, transformSocket(socket)))
                    }
                }

                if (properties) {
                    for (const property of properties) {
                        property.itemId = item.id
                        batch.push(query.setProperty(t, transformProperty(property)))
                    }
                }

                if (requirements) {
                    for (const requirement of requirements) {
                        requirement.itemId = item.id
                        batch.push(query.setRequirement(t, transformRequirement(requirement)))
                    }
                }

                if (explicitMods) {
                    for (const mod of explicitMods) {
                        batch.push(query.setMod(t, transformMod(mod, item.id, ModType[ModType.EXPLICIT])))
                    }
                }

                if (implicitMods) {
                    for (const mod of implicitMods) {
                        batch.push(query.setMod(t, transformMod(mod, item.id, ModType[ModType.IMPLICIT])))
                    }
                }

                if (enchantMods) {
                    for (const mod of enchantMods) {
                        batch.push(query.setMod(t, transformMod(mod, item.id, ModType[ModType.ENCHANTED])))
                    }
                }

                if (craftedMods) {
                    for (const mod of craftedMods) {
                        batch.push(query.setMod(t, transformMod(mod, item.id, ModType[ModType.CRAFTED])))
                    }
                }
            }
        }

        return t.batch(batch, (index: any, success: boolean, result: any, delay: any) => {
            //console.log(index, success, delay)
        })
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
