import { Item } from './Item'

export interface Stash {
  stashId: string
  stashName: string
  stashType: string
  stashPublic: boolean
}

const transformStash = (data: any): Stash => {
  const stash: Stash = {
    stashId: data.id,
    stashName: data.stash,
    stashType: data.stashType,
    stashPublic: data.public,
  }

  return stash
}

export default transformStash