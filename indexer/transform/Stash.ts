import { Stash } from '../interface'

const transformStash = (data: any): Stash => {
  const stash: Stash = {
    stash_id: data.id,
    stash_name: data.stash,
    stash_public: data.public,
    stash_type: data.stashType,
  }

  return stash
}

export default transformStash
