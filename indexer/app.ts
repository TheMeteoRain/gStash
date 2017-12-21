import 'dotenv/config'

import { db, pgp } from './db'
import queries, { tables } from './queries'
import requests from './requests'

import { Account, aItem, Batch } from './class'
import { ModType } from './enum'
import { Item, Mod, Property, Requirement, Socket, Stash } from './interface'
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
const replaceDuplicateAccount = (accountName: string, stash: any, accountArray: any[]): void => {
  const accountIndex = accountArray.findIndex((account: any) => {
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

  const batch = new Batch()
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
  stashes.forEach((stash: any) => {
    const { accountName: account_name, lastCharacterName, id: stashId, items }: { accountName: string, id: string, lastCharacterName: string, items: any } = stash
    delete stash.items

    /* const account = new Account(account_name, lastCharacterName)
    batch.push(account) */

    /**
     * Account name has to be present. Otherwise skip entry.
     */
    if (stash.accountName !== null) {
      replaceDuplicateAccount(account_name, stash, batchAccount)

      // batch.addAccount(account_name, stash)
      // batch.addStash(stash)

      batchStash.push(transformStash(stash))

      items.forEach((item: any) => {
        const { id: itemId } = item
        // batch.setItemId(itemId)
        /* const aitem = new aItem(item, stash, account_name)
        batch.push(aitem) */
        // batch.addItem(item, account_name, stash)
        batchItem.push(transformItem(item, account_name, stash))

        if (item.sockets) {
          for (const socket of item.sockets) {
            batchSocket.push(transformSocket(socket, itemId))
          }
        }

        if (item.properties) {
          item.properties.forEach((property: any) => {
            if (property.values.length > 1 && property.displayMode !== 3) {
              // Multiple values
              for (let i = 0; i < property.values.length; i++) {
                batchProperty.push(transformProperty(property, itemId, i))
              }
            } else {
              // Single value
              batchProperty.push(transformProperty(property, itemId))
            }
          })
        }

        if (item.additionalProperties) {
          item.additionalProperties.forEach((additionalProperty: any) => {
            for (let i = 0; i < additionalProperty.values.length; i++) {
              batchProperty.push(transformProperty(additionalProperty, itemId, i))
            }
          })
        }

        if (item.requirements) {
          item.requirements.forEach((requirement: any) => {
            batchRequirement.push(transformRequirement(requirement, itemId))
          })
        }

        if (item.explicitMods) {
          item.explicitMods.forEach((mod: any) => {
            batchMod.push(transformMod(mod, item.id, ModType[ModType.EXPLICIT]))
          })
        }
        if (item.implicitMods) {
          item.implicitMods.forEach((mod: any) => {
            batchMod.push(transformMod(mod, item.id, ModType[ModType.IMPLICIT]))
          })
        }
        if (item.enchantMods) {
          item.enchantMods.forEach((mod: any) => {
            batchMod.push(transformMod(mod, item.id, ModType[ModType.ENCHANTED]))
          })
        }
        if (item.craftedMods) {
          item.craftedMods.forEach((mod: any) => {
            batchMod.push(transformMod(mod, item.id, ModType[ModType.CRAFTED]))
          })
        }
        if (item.utilityMods) {
          item.utilityMods.forEach((mod: any) => {
            batchMod.push(transformMod(mod, item.id, ModType[ModType.CRAFTED]))
          })
        }
      })
    } else {
      // delete all data from this stash id
      /* queries.deleteStashById(stashId).then((result: any) => {
        if (result.rowCount >= 1) {
          console.log(`Stash and items deleted by stash id: ${stashId}`)

          console.log(`this ${result.rowCount}`)
        }
      }).catch((e: any) => {
        console.error(e)
      }) */
    }
  })

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
