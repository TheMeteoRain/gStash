import 'dotenv/config'
import axios from 'axios'

import { pgp, db } from './db'
import query, { tables } from './query'

import { Stash, Account, Item, Socket, Requirement, Property, Mod, ModType } from './interface'

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

const saveAccountsTask = async (stashes: any): Promise<any> => {

    const batchAccount: Array<Account> = []
    const batchStash: Array<Stash> = []
    const batchItem: Array<Item> = []
    const batchSocket: Array<Socket> = []
    const batchProperty: Array<Property> = []
    const batchRequirement: Array<Requirement> = []
    const batchMod: Array<Mod> = []

    for (const stash of stashes) {
        const { accountName: account_name, id: stash_id, items }: { accountName: string, id: string, items: any } = stash
        delete stash['items']

        if (stash.accountName !== null) {
            let add: boolean = false
            for (let i = 0; i < batchAccount.length && !add; i++) {
                if (batchAccount[i].account_name === account_name) {
                    batchAccount.splice(i, 1, transformAccount(stash))
                    add = true
                }

            }

            if (!add) {
                batchAccount.push(transformAccount(stash))

            }

            batchStash.push(transformStash(stash))

            if (items.length > 0) {
                for (const item of items) {
                    const { id: item_id, properties, requirements, sockets, explicitMods, implicitMods, enchantMods, craftedMods } = item

                    delete item['properties']
                    delete item['requirements']
                    delete item['explicitMods']
                    delete item['implicitMods']
                    item.account_name = account_name
                    item.stash_id = stash_id
                    batchItem.push(transformItem(item))

                    if (sockets) {
                        for (const socket of sockets) {
                            batchSocket.push(transformSocket(socket, item_id))
                        }
                    }

                    if (properties) {
                        for (const property of properties) {
                            batchProperty.push(transformProperty(property, item_id))
                        }
                    }

                    if (requirements) {
                        for (const requirement of requirements) {
                            batchRequirement.push(transformRequirement(requirement, item_id))
                        }
                    }

                    if (explicitMods) {
                        for (const mod of explicitMods) {
                            batchMod.push(transformMod(mod, item.id, ModType[ModType.EXPLICIT]))
                        }
                    }
                    if (implicitMods) {
                        for (const mod of implicitMods) {
                            batchMod.push(transformMod(mod, item.id, ModType[ModType.IMPLICIT]))
                        }
                    }
                    if (enchantMods) {
                        for (const mod of enchantMods) {
                            batchMod.push(transformMod(mod, item.id, ModType[ModType.ENCHANTED]))
                        }
                    }
                    if (craftedMods) {
                        for (const mod of craftedMods) {
                            batchMod.push(transformMod(mod, item.id, ModType[ModType.CRAFTED]))
                        }
                    }
                }
            }
        }

    }
    console.log('Total length', stashes.length)

    const resultAccount = await query.insert(batchAccount, tables.accounts)
    const resultStash = await query.insert(batchStash, tables.stashes)
    const resultItem = batchItem.length > 0 ? await query.insert(batchItem, tables.items) : []
    const resultSocket = batchSocket.length > 0 ? await query.insert(batchSocket, tables.sockets) : []
    const resultProperty = batchProperty.length > 0 ? await query.insert(batchProperty, tables.properties) : []
    const resultRequirement = batchRequirement.length > 0 ? await query.insert(batchRequirement, tables.requirements) : []
    const resultMod = batchMod.length > 0 ? await query.insert(batchMod, tables.mods) : []
    console.log('Accounts', resultAccount.rowCount)
    console.log('Stashes', resultStash.rowCount)
    console.log('Items', resultItem.rowCount)
    console.log('Sockets', resultSocket.rowCount)
    console.log('Properties', resultProperty.rowCount)
    console.log('Requirements', resultRequirement.rowCount)
    console.log('Mods', resultMod.rowCount)
    const stats = {
        total: 0,
        saved: 0
    }

    stats.total = batchItem.length + batchSocket.length + batchProperty.length + batchRequirement.length + batchMod.length
    stats.saved = resultAccount.rowCount + resultStash.rowCount + resultItem ? resultItem.rowCount : 0 + resultSocket ? resultSocket.rowCount : 0 + resultProperty ? resultProperty.rowCount : 0 + resultRequirement ? resultRequirement.rowCount : 0 + resultMod ? resultMod.rowCount : 0
    return stats
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
