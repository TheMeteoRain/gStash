import { Account, Item, Stash, Socket, Property, Requirement, Mod } from './index'
import queries from '../queries'

export default class Batch {
  private static itemId: string

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
    ]
  }

  /*  public addProperty() {
     this.properties
   } */
}
