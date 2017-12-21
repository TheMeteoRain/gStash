import { Account, IAccount, Item, Mod, Property, Requirement, Socket, Stash } from '../interface'
import queries, { tables } from '../queries'
import { transformAccount, transformItem, transformMod, transformProperty, transformRequirement, transformSocket, transformStash } from '../transform'

export default class Batch {
  private static itemId: string

  private accounts: Account[] = []
  private stashes: Stash[] = []
  private items: Item[] = []
  private properties: Property[] = []

  public setItemId(itemId: string) {
    Batch.itemId = itemId
  }

  public getItemId(): string {
    return Batch.itemId
  }

  public addAccount(accountName: string, stash: any): void {
    const accountIndex = this.accounts.findIndex((account: any) => {
      return account.account_name === accountName
    })

    if (accountIndex > -1) {
      this.accounts.splice(accountIndex, 1, transformAccount(stash))
    } else {
      this.accounts.push(transformAccount(stash))
    }
  }

  public addStash(stash: any): void {
    this.stashes.push(transformStash(stash))
  }

  public addItem(item: any, accountName: string, stash: any): void {
    this.items.push(transformItem(item, accountName, stash))
  }

  /*  public addProperty() {
     this.properties
   } */
}
