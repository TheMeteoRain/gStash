import { Stash } from '../interface'

const transformStash = (data: any): Stash => {
  const stash: Stash = {
    stash_id: data.id,
    stash_name: data.stash,
    stash_type: data.stashType,
    stash_public: data.public,
  }

  return stash
}

export default transformStash
