import { IAccount } from '../interface'

export default class Account implements IAccount {
  /**
   * Check for account duplicate in an array and replace it.
   *
   * If there is an duplicate, replace it with the new one.
   * If there is not, do nothing.
   */
  public static replaceDuplicateAccount = (newAccount: Account, accountArray: Account[]): void => {
    const accountIndex = accountArray.findIndex((findAccount: any) => {
      return findAccount.accountName === newAccount.accountName
    })

    if (accountIndex > -1) {
      accountArray.splice(accountIndex, 1, newAccount)
    } else {
      accountArray.push(newAccount)
    }
  }

  public accountName: string
  public lastCharacterName: string
  public lastSeen: number

  constructor(accountName: string, lastCharacterName: string) {
    this.accountName = accountName
    this.lastCharacterName = lastCharacterName
    this.lastSeen = Date.now()
  }

  public toString() {
    return {
      account_name: this.accountName,
      last_character_name: this.lastCharacterName,
      last_seen: this.lastSeen,
    }
  }
}
