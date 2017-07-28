import { Account } from '../interface'

const transformAccount = (data: any): Account => {
  const account: Account = {
    accountName: data.accountName,
    lastCharacterName: data.lastCharacterName,
    lastSeen: Date.now()
  }

  return account
}

export default transformAccount