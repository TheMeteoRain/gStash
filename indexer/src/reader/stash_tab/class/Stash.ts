export default class Stash {

  public stash_id: string
  public stash_name: string | null | undefined
  public stash_type: string
  public stash_public: boolean

  constructor(stashId: string, stashName: string | null | undefined, stashType: string, stashPublic: boolean) {
    this.stash_id = stashId
    this.stash_name = stashName
    this.stash_type = stashType
    this.stash_public = stashPublic
  }
}
