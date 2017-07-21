import  {Item} from './Item'

export interface Stash {
  accountName: string
  lastCharacterName: string
  id: string
  stash: string
  stashType: string
  items: Item[]
  public: boolean
}

const transformStash = (stash: any): Stash => {
  return {
      accountName: stash.accountName,
      lastCharacterName: stash.lastCharacterName,
      id: stash.id,
      stash: stash.stash,
      stashType: stash.stashType,
      items: stash.items ? stash.items.map((item: Item) => item) : [],
      public: stash.public
  }
}

export default transformStash