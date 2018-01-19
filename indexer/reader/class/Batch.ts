import * as fs from 'fs'
import queries from '../queries'
import { Account, Item, Mod, Property, Requirement, Socket, Stash } from './index'

export default class Batch {
  private static itemId: string

  public stashesToRemove: Stash[] = []

  private accounts: Account[] = []
  private items: Item[] = []
  private stashes: Stash[] = []
  private sockets: Socket[] = []
  private properties: Property[] = []
  private requirements: Requirement[] = []
  private mods: Mod[] = []

  public push(object: Account | Item | Stash | Socket | Property | Requirement | Mod) {
    if (object instanceof Account) {
      Account.replaceDuplicateAccount(object, this.accounts)
    }

    if (object instanceof Stash) {
      this.stashes.push(object)
    }

    if (object instanceof Item) {
      this.items.push(object)
    }

    if (object instanceof Socket) {
      this.sockets.push(object)
    }

    if (object instanceof Property) {
      this.properties.push(object)
    }

    if (object instanceof Requirement) {
      this.requirements.push(object)
    }

    if (object instanceof Mod) {
      this.mods.push(object)
    }
  }

  public async query(t: any) {
    return [
      this.accounts.length > 0 ? await queries.insertAccounts(this.accounts, t) : undefined,
      this.stashes.length > 0 ? await queries.insertStashes(this.stashes, t) : undefined,
      this.items.length > 0 ? await queries.insertItems(this.items, t) : undefined,
      this.sockets.length > 0 ? await queries.insertSockets(this.sockets, t) : undefined,
      this.properties.length > 0 ? await queries.insertProperties(this.properties, t) : undefined,
      this.requirements.length > 0 ? await queries.insertRequirements(this.requirements, t) : undefined,
      this.mods.length > 0 ? await queries.insertMods(this.mods, t) : undefined,
      this.stashesToRemove.length > 0 ? await queries.removeStashes(this.stashesToRemove, t) : undefined,
    ]
  }

  public async createSqlQueryFile(LATEST_ID: string) {
    const accounts = this.accounts.length > 0 ? queries.insertAccounts2(this.accounts) : ''
    const stashes = this.stashes.length > 0 ? queries.insertStashes2(this.stashes) : ''
    const items = this.items.length > 0 ? queries.insertItems2(this.items) : ''
    const sockets = this.sockets.length > 0 ? queries.insertSockets2(this.sockets) : ''
    const properties = this.properties.length > 0 ? queries.insertProperties2(this.properties) : ''
    const query = queries.concat(accounts, stashes, items, sockets, properties)

    const directory = 'sql'
    const fileName = `data_${LATEST_ID.replace('-', '_')}.sql`
    const filePath = directory + '/' + fileName

    if (query) {
      await fs.writeFile(filePath, query, (err) => {
        if (err) { throw err }
        console.log('The file has been saved!')
      })
    }

  }
}
