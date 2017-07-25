export interface Account {
  accountName: string
  lastCharacterName: string
  lastSeen: number
}

export interface Data {
  next_change_id: string
  stashes: Array<any>
}

const transformAccount = (data: any): Account => {
  const account: Account = {
    accountName: data.accountName,
    lastCharacterName: data.lastCharacterName,
    lastSeen: Date.now()
  }

  return account
}

export default transformAccount