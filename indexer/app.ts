import 'dotenv/config'

import { db, pgp } from './db'
import queries, { tables } from './queries'
import requests from './requests'

import { ModType } from './enum'
import { Account, Item, Mod, Property, Requirement, Socket, Stash } from './interface'
import { transformAccount, transformItem, transformMod, transformProperty, transformRequirement, transformSocket, transformStash } from './transform'

/**
 * The amount of milliseconds when a new request is sent to the poe api.
 * New poll cycle will being only after the previous has finished.
 */
const POLL_CYCLE: number = 10000

/**
 * Check for account duplicate in an array and replace it.
 *
 * If there is an duplicate, replace it with the new one.
 * If there is not, do nothing.
 */
const replaceDuplicateAccount = (accountName: string, stash: any, accountArray: Account[]): void => {
  const accountIndex = accountArray.findIndex((account: Account) => {
    return account.account_name === accountName
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
const parseData = async (stashes: any): Promise<any> => {
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
     * Account name has to be present. Otherwise skip entry.
     */
    if (stash.accountName !== null) {
      replaceDuplicateAccount(account_name, stash, batchAccount)

      batchStash.push(transformStash(stash))

      if (items.length > 0) {
        for (const item of items) {
          const { id: itemId } = item

          batchItem.push(transformItem(item, account_name, stash))

          if (item.sockets) {
            for (const socket of item.sockets) {
              batchSocket.push(transformSocket(socket, itemId))
            }
          }

          if (item.properties) {
            for (const property of item.properties) {
              batchProperty.push(transformProperty(property, itemId))
            }
          }

          if (item.additionalProperties) {
            for (const additionalProperty of item.additionalProperties) {
              batchProperty.push(transformProperty(additionalProperty, itemId))
            }
          }

          if (item.requirements) {
            for (const requirement of item.requirements) {
              batchRequirement.push(transformRequirement(requirement, itemId))
            }
          }

          if (item.explicitMods) {
            for (const mod of item.explicitMods) {
              batchMod.push(transformMod(mod, item.id, ModType[ModType.EXPLICIT]))
            }
          }
          if (item.implicitMods) {
            for (const mod of item.implicitMods) {
              batchMod.push(transformMod(mod, item.id, ModType[ModType.IMPLICIT]))
            }
          }
          if (item.enchantMods) {
            for (const mod of item.enchantMods) {
              batchMod.push(transformMod(mod, item.id, ModType[ModType.ENCHANTED]))
            }
          }
          if (item.craftedMods) {
            for (const mod of item.craftedMods) {
              batchMod.push(transformMod(mod, item.id, ModType[ModType.CRAFTED]))
            }
          }
          if (item.utilityMods) {
            for (const mod of item.utilityMods) {
              batchMod.push(transformMod(mod, item.id, ModType[ModType.CRAFTED]))
            }
          }
        }
      }
    }
  }

  db.task('SavingData', async (t: any) => {
    const queryBatch = [
      batchAccount.length > 0 ? await queries.insert(batchAccount, tables.accounts, t) : undefined,
      batchStash.length > 0 ? await queries.insert(batchStash, tables.stashes, t) : undefined,
      batchItem.length > 0 ? await queries.insert(batchItem, tables.items, t) : undefined,
      batchSocket.length > 0 ? await queries.insert(batchSocket, tables.sockets, t) : undefined,
      batchProperty.length > 0 ? await queries.insert(batchProperty, tables.properties, t) : undefined,
      batchRequirement.length > 0 ? await queries.insert(batchRequirement, tables.requirements, t) : undefined,
      batchMod.length > 0 ? await queries.insert(batchMod, tables.mods, t) : undefined,
    ]

    return t.batch(queryBatch)
  }).then(calculateStatistics)
    .then((stats: any) => {
      console.log(
        `Total downloaded: ${0}, saved: ${stats.saved} \n`,
        `Accounts: saved: ${stats.accounts} \n`,
        `Stashes: saved: ${stats.stashes} \n`,
        `Items: saved: ${stats.items} \n`,
        `Properties: saved: ${stats.properties} \n`,
        `Requirements: saved: ${stats.requirements} \n`,
        `Mods: saved: ${stats.mods} \n`,
      )
      console.timeEnd('Saving data took')
      console.log(' ')
    }).catch((error: any) => {
      console.log(error)
    })
}

const calculateStatistics = (events: any) => {
  const calculateTotal = (property: any) => {
    let total = 0
    for (const event of events) {
      total = total + event ? event[property] : 0
    }

    return total
  }

  const getRow = (event: any) => {
    return event ? event.rowCount : 0
  }

  const statistics = {
    accounts: getRow(events[0]),
    duration: calculateTotal('duration'),
    failed: 0,
    items: getRow(events[2]),
    mods: getRow(events[6]),
    properties: getRow(events[4]),
    requirements: getRow(events[5]),
    saved: calculateTotal('rowCount'),
    sockets: getRow(events[3]),
    stashes: getRow(events[1]),
  }

  return statistics
}

const poll = (LATEST_ID: string): void => {
  console.log(' ')

  const fetchData = async (): Promise<void> => {
    try {
      console.log(`Downloading data with ID [${LATEST_ID}]`)
      console.time('Downloading took')

      const { next_change_id, stashes }: { next_change_id: string, stashes: any } = await requests.getStashes(LATEST_ID)

      console.timeEnd('Downloading took')
      // console.log(`Downloaded ${stashes.length} stashes`)
      await parseData(stashes)
      await queries.upsertCurrentNextChangeId(LATEST_ID, true)

      poll(next_change_id)
    } catch (error) {
      await queries.upsertCurrentNextChangeId(LATEST_ID, false)

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
  console.log('Fetching latest change id')
  const LATEST_ID: string = await queries.getLatestNextChangeId()
  console.log('Fetching done.')
  poll(LATEST_ID)
})().catch((error) => {
  console.error(error)
})
