import axios from 'axios'
import 'dotenv/config'

import { db, pgp } from './db'
import query, { tables } from './query'

import { ModType } from './enum'
import { Account, Item, Mod, Property, Requirement, Socket, Stash } from './interface'
import { transformAccount, transformItem, transformMod, transformProperty, transformRequirement, transformSocket, transformStash } from './transform'

/**
 * The amount of milliseconds when a new request is sent to the poe api.
 * New poll cycle will being only after the previous has finished.
 */
const POLL_CYCLE: number = 5000

const config = {
  headers: {
    'Accept-Encoding': 'gzip',
  },
  responseType: 'json',
}

/**
 * Check for account duplicates in an array and replace them.
 *
 * If there is an duplicate, replace it with the new one.
 */
const replaceDuplicateAccount = (account_name: string, stash: any, accountArray: Account[]): void => {
  const accountIndex = accountArray.findIndex((account: Account) => {
    return account.account_name === account_name
  })

  if (accountIndex > -1) {
    accountArray.splice(accountIndex, 1, transformAccount(stash))
  } else {
    accountArray.push(transformAccount(stash))
  }
}

/**
 *
 * @param stashes
 */
const saveData = async (stashes: any): Promise<any> => {
  console.time('Saving data took')

  const batchAccount: Account[] = []
  const batchStash: Stash[] = []
  const batchItem: Item[] = []
  const batchSocket: Socket[] = []
  const batchProperty: Property[] = []
  const batchRequirement: Requirement[] = []
  const batchMod: Mod[] = []

  /**
   * Start parsing stashes
   */
  for (const stash of stashes) {
    const { accountName: account_name, id: stash_id, items }: { accountName: string, id: string, items: any } = stash
    delete stash.items

    /**
     * Check if account name is not null, if it is skip it.
     */
    if (stash.accountName !== null) {
      replaceDuplicateAccount(account_name, stash, batchAccount)

      batchStash.push(transformStash(stash))

      if (items.length > 0) {
        for (const item of items) {
          const {
            id: item_id,
            properties,
            requirements,
            sockets,
            explicitMods,
            implicitMods,
            enchantMods,
            craftedMods,
          } = item

          delete item.properties
          delete item.requirements
          delete item.explicitMods
          delete item.implicitMods
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

  db.task('SavingData', async (t: any) => {
    const queries = [
      await query.insert(batchAccount, tables.accounts, t),
      await query.insert(batchStash, tables.stashes, t),
      batchItem.length > 0 ? await query.insert(batchItem, tables.items, t) : undefined,
      batchSocket.length > 0 ? await query.insert(batchSocket, tables.sockets, t) : undefined,
      batchProperty.length > 0 ? await query.insert(batchProperty, tables.properties, t) : undefined,
      batchRequirement.length > 0 ? await query.insert(batchRequirement, tables.requirements, t) : undefined,
      batchMod.length > 0 ? await query.insert(batchMod, tables.mods, t) : undefined,
    ]

    return t.batch(queries)
  }).then(calculateStatistics)
    .then((stats: any) => {
      console.log(
        `Total downloaded: ${0}, saved: ${stats.saved}, failed: ${0 - 0}\n`,
        `Accounts: saved: ${stats.accounts}, failed: ${batchAccount.length - stats.accounts}\n`,
        `Stashes: saved: ${stats.stashes}, failed: ${batchStash.length - stats.stashes}\n`,
        `Items: saved: ${stats.items}, failed: ${batchItem.length - stats.items}\n`,
        `Properties: saved: ${stats.properties}, failed: ${batchProperty.length - stats.properties}\n`,
        `Requirements: saved: ${stats.requirements}, failed: ${batchRequirement.length - stats.requirements}\n`,
        `Mods: saved: ${stats.mods}, failed: ${batchMod.length - stats.mods}\n`,
      )
      console.timeEnd('Saving data took')
      console.log(' ')
    })
}

const calculateStatistics = (events: any) => {
  const calculateTotal = (property: any) => {
    let total = 0
    for (const event of events) {
      total = total + event[property]
    }

    return total
  }

  const statistics = {
    accounts: events[0].rowCount,
    duration: calculateTotal('duration'),
    failed: 0,
    items: events[2].rowCount,
    mods: events[6].rowCount,
    properties: events[4].rowCount,
    requirements: events[5].rowCount,
    saved: calculateTotal('rowCount'),
    sockets: events[3].rowCount,
    stashes: events[1].rowCount,
  }

  return statistics
}

const poll = (LATEST_ID: string): void => {
  console.log(' ')

  const fetchData = async (): Promise<void> => {

    console.log(`Downloading data with ID [${LATEST_ID}]`)
    console.time('Downloading took')

    try {
      const { data: { next_change_id, stashes } }: { data: { next_change_id: string, stashes: any } } = await axios.get(`${process.env.POE_ENDPOINT}?id=${LATEST_ID}`, config)
      console.timeEnd('Downloading took')
      // console.log(`Downloaded ${stashes.length} stashes`)
      await saveData(stashes)
      await query.upsertCurrentNextChangeId(LATEST_ID, true)

      poll(next_change_id)
    } catch (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data)
        console.log(error.response.status)
        console.log(error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message)
      }
      console.log(error.config)
      await query.upsertCurrentNextChangeId(LATEST_ID, false)
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
  const LATEST_ID: string = await query.getLatestNextChangeId()
  poll(LATEST_ID)
})().catch((error) => {
  console.error(error)
})
