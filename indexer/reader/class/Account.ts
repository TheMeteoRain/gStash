import { IAccount } from '../interface'

export default class Account implements IAccount {
  /**
   * Check for account duplicate in an array and replace it.
   *
   * If there is an duplicate, replace it with the new one.
   * If there is not, do nothing.
   */
  public static replaceDuplicateAccount = (newAccount: Account, accountArray: Account[]): void => {
    const accountIndex = accountArray.findIndex((findAccount: any) =>
      findAccount.account_name === newAccount.account_name
    )

    if (accountIndex > -1) {
      accountArray.splice(accountIndex, 1, newAccount)
    } else {
      accountArray.push(newAccount)
    }
  }

  public account_name: string
  public last_character_name: string
  public last_seen: number

  constructor(account_name: string, last_character_name: string) {
    this.account_name = account_name
    this.last_character_name = last_character_name
    this.last_seen = Date.now()
  }
}
