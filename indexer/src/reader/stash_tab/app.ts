import { db } from '../../db'

import downloadAndParse from '../downloadAndParse'
import { sqlFile } from '../create'

import queries from './queries'
import { ModType } from './enum'
import { Account, Item, Stash, Socket, Property, Requirement, Mod, StashTabData } from './class'

/**
 * The amount of milliseconds when a new request is sent to the poe api.
 * New poll cycle will being only after the previous has finished.
 */
const POLL_SERVER_REPEAT_CYCLE: number = 1000

/**
 *
 * @param stashes
 */
export const parseData = async ({ data: { next_change_id, stashes } }: { data: any, next_change_id: string, stashes: any[] }): Promise<StashTabData> => {
  const stashTabData: StashTabData = new StashTabData()
  stashTabData.next_change_id = next_change_id

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
      Account.replaceDuplicateAccount(new Account(accountName, lastCharacterName), stashTabData.accounts)
      stashTabData.stashes.push(new Stash(stashId, stashName, stashType, stashPublic))

      items.forEach((item: any) => {
        const { id: itemId } = item

        stashTabData.items.push(new Item(item, stashId, stashName, accountName))

        if (item.sockets)
          item.sockets.forEach((socket: any) => stashTabData.sockets.push(new Socket(itemId, socket)))

        if (item.properties)
          item.properties.forEach((property: any) => stashTabData.properties.push(new Property(itemId, property)))

        if (item.additionalProperties)
          item.additionalProperties.forEach((property: any) => stashTabData.properties.push(new Property(itemId, property)))

        if (item.requirements)
          item.requirements.forEach((requirement: any) => stashTabData.requirements.push(new Requirement(itemId, requirement)))

        if (item.explicitMods)
          item.explicitMods.forEach((mod: any) => stashTabData.mods.push(new Mod(itemId, mod, ModType.EXPLICIT)))

        if (item.implicitMods)
          item.implicitMods.forEach((mod: any) => stashTabData.mods.push(new Mod(itemId, mod, ModType.IMPLICIT)))

        if (item.enchantMods)
          item.enchantMods.forEach((mod: any) => stashTabData.mods.push(new Mod(itemId, mod, ModType.ENCHANTED)))

        if (item.craftedMods)
          item.craftedMods.forEach((mod: any) => stashTabData.mods.push(new Mod(itemId, mod, ModType.CRAFTED)))

        if (item.utilityMods)
          item.utilityMods.forEach((mod: any) => stashTabData.mods.push(new Mod(itemId, mod, ModType.UTILITY)))

      })
    } else {
      stashTabData.stashesToRemove.push(new Stash(stashId, stashName, stashType, stashPublic))
    }
  })

  return stashTabData
}

export const pollServer = async () => {
  let LATEST_ID: string = '0'
  try {
    console.log('Fetching latest change id')
    LATEST_ID = await queries.getLatestNextchangeId()
    console.log('Fetching done')
  } catch (error) {
    console.error('Could not get change id from database')
    console.error(error)
  }

  const loop = async () => {
    try {
      const stashTabData: StashTabData = await downloadAndParse({
        url: `http://api.pathofexile.com/public-stash-tabs?id=${LATEST_ID}`,
        parser: parseData,
      })

      console.time('Sql file creation took')
      const sql = sqlFile({
        title: LATEST_ID,
        directory: 'sql',
      })
      sql.addQuery(stashTabData.accounts, queries.insertAccounts)
      sql.addQuery(stashTabData.stashes, queries.insertStashes)
      sql.addQuery(stashTabData.items, queries.insertItems)
      sql.addQuery(stashTabData.sockets, queries.insertSockets)
      sql.addQuery(stashTabData.properties, queries.insertProperties)
      sql.addQuery(stashTabData.requirements, queries.insertRequirements)
      sql.addQuery(stashTabData.mods, queries.insertMods)
      sql.addQuery(stashTabData.stashesToRemove, queries.removeStashes)
      const creationSuccessful: boolean = sql.createFile()

      if (creationSuccessful) {
        console.timeEnd('Sql file creation took')
        await queries.upsertCurrentNextchange_id(LATEST_ID, true)
        LATEST_ID = stashTabData.next_change_id
      } else {
        await queries.upsertCurrentNextchange_id(LATEST_ID, false)
      }

      setTimeout(loop, POLL_SERVER_REPEAT_CYCLE)
    } catch (error) {
      await queries.upsertCurrentNextchange_id(LATEST_ID, false)

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

      setTimeout(loop, 5000)
    }
  }

  return loop()
}

pollServer()
