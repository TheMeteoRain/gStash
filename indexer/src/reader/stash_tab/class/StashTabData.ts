import { Account, Item, Stash, Socket, Property, Requirement, Mod } from './'

export default class StashTabData {
  public accounts: Account[] = []
  public items: Item[] = []
  public stashes: Stash[] = []
  public sockets: Socket[] = []
  public properties: Property[] = []
  public requirements: Requirement[] = []
  public mods: Mod[] = []
  public stashesToRemove: Stash[] = []
  public next_change_id: string
}
