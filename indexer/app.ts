import 'dotenv/config'
import axios from 'axios'

import { pgp, db } from './db'
import query, { tables } from './query'

import { ModType } from './enum'
import { Stash, Account, Item, Socket, Requirement, Property, Mod } from './interface'
import { transformStash, transformAccount, transformItem, transformProperty, transformRequirement, transformSocket, transformMod } from './transform'


/**
 * The amount of milliseconds when a new request is sent to the poe api.
 * New poll cycle will being only after the previous has finished.
 */
const POLL_CYCLE: number = 1000

const config = {
    headers: {
        'Accept-Encoding': 'gzip'
    },
    responseType: 'json'
}

/**
 * Check for account duplicates in an array and replace them.
 *
 * If there is an duplicate, replace it with the new one.
 */
const replaceDuplicateAccount = (account_name: string, stash: any, accountArray: Array<Account>): void => {
    const accountIndex = accountArray.findIndex((account: Account) => {
        return account.account_name === account_name
    })

    if (accountIndex > -1)
        accountArray.splice(accountIndex, 1, transformAccount(stash))
    else
        accountArray.push(transformAccount(stash))
}


const saveData = async (stashes: any): Promise<any> => {

    const batchAccount: Array<Account> = []
    const batchStash: Array<Stash> = []
    const batchItem: Array<Item> = []
    const batchSocket: Array<Socket> = []
    const batchProperty: Array<Property> = []
    const batchRequirement: Array<Requirement> = []
    const batchMod: Array<Mod> = []

    /**
     * Start parsing stashes
     */
    for (const stash of stashes) {
        const { accountName: account_name, id: stash_id, items }: { accountName: string, id: string, items: any } = stash
        delete stash['items']

        /**
         * Check if account name is null and skip it.
         */
        if (stash.accountName !== null) {
            replaceDuplicateAccount(account_name, stash, batchAccount)

            batchStash.push(transformStash(stash))

            if (items.length > 0) {
                for (const item of items) {
                    const { id: item_id, properties, requirements, sockets, explicitMods, implicitMods, enchantMods, craftedMods } = item

                    delete item['properties']
                    delete item['requirements']
                    delete item['explicitMods']
                    delete item['implicitMods']
                    batchItem.push(transformItem(item, account_name, stash_id))

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

    stats.total = batchAccount.length + batchStash.length + batchItem.length + batchSocket.length + batchProperty.length + batchRequirement.length + batchMod.length
    stats.saved = resultAccount.rowCount + resultStash.rowCount + resultItem.rowCount + resultSocket.rowCount + resultProperty.rowCount + resultRequirement.rowCount + resultMod.rowCount
    return stats
}


const poll = (LATEST_ID: string): void => {
    console.log(" ")

    const fetchData = async (): Promise<void> => {
        console.log(`Downloading data with ID [${LATEST_ID}]`)
        console.time("Downloading took")

        try {
            const { data: { next_change_id, stashes } }: { data: { next_change_id: string, stashes: any } } = await axios.get(`${process.env.POE_ENDPOINT}?id=${LATEST_ID}`, config)
            console.timeEnd("Downloading took")
            //console.log(`Downloaded ${stashes.length} stashes`)
            console.time("Saving data took")
            const { total, saved } = await saveData(stashes)
            console.log(`Total downloaded: ${total}, saved: ${saved}, failed: ${total - saved}`)
            console.timeEnd("Saving data took")
            await query.upsertCurrentNextChangeId(LATEST_ID, 1)
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
            await query.upsertCurrentNextChangeId(LATEST_ID, 0)
            poll(LATEST_ID)
        }
    }

    setTimeout(fetchData, POLL_CYCLE)
}

/**
 * Main starting point of this application.
 *
 * Fetches newest latest_id from database that is not processed,
 * and begins to poll server.
 */
(async () => {
    const LATEST_ID = await query.getLatestNextChangeId()
    poll(LATEST_ID)
})().catch(error => {
    console.error(error)
})
