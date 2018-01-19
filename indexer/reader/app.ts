import 'dotenv/config'

import { db, pgp } from './db'
import queries from './queries'
import requests from './requests'
import statistics from './statistics'

import { Account, Item, Batch, Stash, Socket, Property, Requirement, Mod } from './class'
import { ModType } from './enum'

/**
 * The amount of milliseconds when a new request is sent to the poe api.
 * New poll cycle will being only after the previous has finished.
 */
const POLL_CYCLE: number = 1000
let LATEST_ID: string = ''

/**
 *
 * @param stashes
 */
const parseData = async (stashes: any): Promise<any> => {
  console.time('Parsing data')

  const batch = new Batch()

  /**
   * Start parsing stashes
   */
  stashes.forEach((stash: any) => {
    const { accountName, lastCharacterName, id: stashId, public: stashPublic, stash: stashName, stashType, items }: { accountName: string, id: string, public: boolean, stash: string, stashType: string, lastCharacterName: string, items: any } = stash
    /**
     * Account name has to be present. Otherwise skip entry.
     */
    if (accountName !== null) {
      delete stash.items
      batch.push(new Account(accountName, lastCharacterName))
      batch.push(new Stash(stashId, stashName, stashType, stashPublic))

      items.forEach((item: any) => {
        const { id: itemId } = item

        batch.push(new Item(item, stashId, stashName, accountName))

        if (item.sockets) {
          item.sockets.forEach((socket: any) => batch.push(new Socket(itemId, socket)))
        }

        if (item.properties) {
          item.properties.forEach((property: any) => batch.push(new Property(itemId, property)))
        }

        if (item.additionalProperties) {
          item.additionalProperties.forEach((property: any) => batch.push(new Property(itemId, property)))
        }

        if (item.requirements) {
          item.requirements.forEach((requirement: any) => batch.push(new Requirement(itemId, requirement)))
        }

        if (item.explicitMods) {
          item.explicitMods.forEach((mod: any) => batch.push(new Mod(itemId, mod, ModType.EXPLICIT)))
        }

        if (item.implicitMods) {
          item.implicitMods.forEach((mod: any) => batch.push(new Mod(itemId, mod, ModType.IMPLICIT)))
        }

        if (item.enchantMods) {
          item.enchantMods.forEach((mod: any) => batch.push(new Mod(itemId, mod, ModType.ENCHANTED)))
        }

        if (item.craftedMods) {
          item.craftedMods.forEach((mod: any) => batch.push(new Mod(itemId, mod, ModType.CRAFTED)))
        }

        if (item.utilityMods) {
          item.utilityMods.forEach((mod: any) => batch.push(new Mod(itemId, mod, ModType.UTILITY)))
        }
      })
    } else {
      batch.stashesToRemove.push(new Stash(stashId, stashName, stashType, stashPublic))
    }
  })
  console.timeEnd('Parsing data')

  /*   console.time('Saving data')
    await db.task('SavingData', async (t: any) => t.batch(await batch.query(t)))
      .then(statistics)
      .then((stats: any) => {
        console.timeEnd('Saving data')
        console.log(' ')
      }).catch((error: any) => {
        console.error(error)
      }) */
  console.time('Create sql file')
  await batch.createSqlQueryFile(LATEST_ID)
  console.timeEnd('Create sql file')
}

const poll = (): void => {
  console.log(' ')

  const fetchData = async (): Promise<void> => {
    try {
      console.log(`Downloading data with ID http://api.pathofexile.com/public-stash-tabs?id=${LATEST_ID}`)
      console.time('Downloading')

      const { next_change_id, stashes }: { next_change_id: string, stashes: any } = await requests.getStashes(LATEST_ID)

      console.timeEnd('Downloading')
      // console.log(`Downloaded ${stashes.length} stashes`)
      await parseData(stashes)
      await queries.upsertCurrentNextChangeId(LATEST_ID, true)

      LATEST_ID = next_change_id
      poll()
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
        console.error('Error', error)
      }
      console.log(error.config)

      poll()
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
  const args = process.argv.slice(2)

  if (args.length > 0) {
    const id = args.find((element: string) => element.toLocaleLowerCase().startsWith('id='))
    LATEST_ID = id !== undefined ? id.slice(3) : ''

    if (LATEST_ID !== '') {
      return poll()
    }
  }

  console.log('Fetching latest change id')
  LATEST_ID = await queries.getLatestNextChangeId()
  console.log('Fetching done.')
  poll()
})().catch((error) => {
  console.error(error)
})
