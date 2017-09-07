import { db, pgp } from './db'
import { Account, Item, Mod, Property, Requirement, Socket, Stash } from './interface'

const COLUMN_SET_ACCOUNTS = new pgp.helpers.ColumnSet(['?account_name', 'last_character_name', 'last_seen'], { table: 'accounts' })
const COLUMN_SET_STASHES = new pgp.helpers.ColumnSet(['stash_id', 'stash_name', 'stash_type', 'stash_public'], { table: 'stashes' })
const COLUMN_SET_ITEMS = new pgp.helpers.ColumnSet(['w', 'h', 'ilvl', 'icon', 'league', 'item_id', 'name', 'type_line', 'identified', 'verified', 'corrupted', 'locked_to_character', 'frame_type', 'x', 'y', 'inventory_id', 'account_name', 'stash_id', 'socket_amount', 'link_amount', 'available', 'added_ts', 'updated_ts', 'flavour_text', 'price', 'crafted'], { table: 'items' })
const COLUMN_SET_SOCKETS = new pgp.helpers.ColumnSet(['item_id', 'socket_group', 'socket_attr'], { table: 'sockets' })
const COLUMN_SET_PROPERTIES = new pgp.helpers.ColumnSet(['item_id', 'property_name', 'property_value1', 'property_value2'], { table: 'properties' })
const COLUMN_SET_REQUIREMENTS = new pgp.helpers.ColumnSet(['item_id', 'requirement_name', 'requirement_value'], { table: 'requirements' })
const COLUMN_SET_MODS = new pgp.helpers.ColumnSet(['item_id', 'mod_name', 'mod_value1', 'mod_value2', 'mod_value3', 'mod_value4', 'mod_type'], { table: 'mods' })

export const tables = {
  accounts: (accounts: Account[]) => pgp.helpers.insert(accounts, COLUMN_SET_ACCOUNTS) + 'ON CONFLICT (account_name) DO UPDATE SET last_seen = EXCLUDED.last_seen, last_character_name = EXCLUDED.last_character_name',

  stashes: (stashes: Stash[]) => pgp.helpers.insert(stashes, COLUMN_SET_STASHES) + 'ON CONFLICT (stash_id) DO UPDATE SET stash_name = EXCLUDED.stash_name, stash_type = EXCLUDED.stash_type, stash_public = EXCLUDED.stash_public',

  items: (items: Item[]) => pgp.helpers.insert(items, COLUMN_SET_ITEMS) + 'ON CONFLICT (item_id) DO UPDATE SET w = EXCLUDED.w, h = EXCLUDED.h, league = EXCLUDED.league, identified = EXCLUDED.identified, verified = EXCLUDED.verified, corrupted = EXCLUDED.corrupted, x = EXCLUDED.x, y = EXCLUDED.y, inventory_id = EXCLUDED.inventory_id, account_name = EXCLUDED.account_name, stash_id = EXCLUDED.stash_id, socket_amount = EXCLUDED.socket_amount, link_amount = EXCLUDED.link_amount, available = EXCLUDED.available, updated_ts = EXCLUDED.added_ts, price = EXCLUDED.price',

  sockets: (sockets: Socket[]) => pgp.helpers.insert(sockets, COLUMN_SET_SOCKETS),

  properties: (properties: Property[]) => pgp.helpers.insert(properties, COLUMN_SET_PROPERTIES),

  requirements: (requirements: Requirement[]) => pgp.helpers.insert(requirements, COLUMN_SET_REQUIREMENTS),
  mods: (mods: Mod[]) => pgp.helpers.insert(mods, COLUMN_SET_MODS),
}

const queries = {
  insert: (data: any[], table: any, t: any) => t.result(table(data)),

  upsertCurrentNextChangeId: (next_change_id: string, processed: boolean = false): Promise<any> =>
    db.result('INSERT INTO changeid(nextChangeId, processed) VALUES($<next_change_id>, $<processed>) ON CONFLICT (nextChangeId) DO UPDATE SET (processed) = (EXCLUDED.processed)', { next_change_id, processed: true }),

  getLatestNextChangeId: (): Promise<string> =>
    db.one('SELECT nextChangeId FROM changeId WHERE processed = false OR processed = true ORDER BY id DESC LIMIT 1').then((data: any): Promise<string> => data.nextchangeid),
}

export default queries
