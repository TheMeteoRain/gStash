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

  public createSqlQueryFile(LATEST_ID: string): boolean {
    const sqlQueriesArray: string[] = []
    sqlQueriesArray.push(this.accounts.length > 0 ? queries.insertAccounts(this.accounts) : '')
    sqlQueriesArray.push(this.stashes.length > 0 ? queries.insertStashes(this.stashes) : '')
    sqlQueriesArray.push(this.items.length > 0 ? queries.insertItems(this.items) : '')
    sqlQueriesArray.push(this.sockets.length > 0 ? queries.insertSockets(this.sockets) : '')
    sqlQueriesArray.push(this.properties.length > 0 ? queries.insertProperties(this.properties) : '')
    sqlQueriesArray.push(this.requirements.length > 0 ? queries.insertRequirements(this.requirements) : '')
    sqlQueriesArray.push(this.mods.length > 0 ? queries.insertMods(this.mods) : '')
    sqlQueriesArray.push(this.stashesToRemove.length > 0 ? queries.removeStashes(this.stashesToRemove) : '')

    const sqlQueryString: string = queries.concat(sqlQueriesArray)

    const directory = 'sql'
    const fileName = `data_${LATEST_ID}.sql`
    const filePath = directory + '/' + fileName

    if (sqlQueryString) {
      const sqlQueryStringModified =
        sqlQueryString
          .replace(/INSERT INTO/g, '\nINSERT INTO')
          .replace('DELETE FROM', '\nDELETE FROM')
          .replace('\n', '')
      fs.writeFileSync(filePath, sqlQueryStringModified)
      console.log(`File: ${fileName} has been saved`)

      return true
    }

    return false
  }
}
