import { Stash } from '../interface'

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