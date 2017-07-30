import { Account } from '../interface'

const transformAccount = (data: any): Account => {
  const account: Account = {
    account_name: data.accountName,
    last_character_name: data.lastCharacterName,
    last_seen: Date.now()
  }

  return account
}

export default transformAccount