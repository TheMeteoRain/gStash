import { db, pgp } from './db'
import { Account, Item, Stash, Socket, Property, Requirement, Mod } from './class'

const COLUMN_SET_ACCOUNTS = new pgp.helpers.ColumnSet(['account_name', 'last_character_name', 'last_seen'], { table: 'accounts' })
const COLUMN_SET_STASHES = new pgp.helpers.ColumnSet(['stash_id', 'stash_name', 'stash_type', 'stash_public'], { table: 'stashes' })
const COLUMN_SET_ITEMS = new pgp.helpers.ColumnSet(['account_name', 'added_ts', 'art_filename', 'available', 'corrupted', 'crafted', 'descr_text', 'duplicated', 'enchanted', 'flavour_text', 'frame_type', 'h', 'icon', 'identified', 'ilvl', 'inventory_id', 'is_relic', 'item_id', 'league', 'link_amount', 'max_stack_size', 'name', 'note', 'prophecy_diff_text', 'prophecy_text', 'sec_decription_text', 'socket_amount', 'stack_size', 'stash_id', 'support', 'talisman_tier', 'type_line', 'updated_ts', 'verified', 'w', 'x', 'y'], { table: 'items' })
const COLUMN_SET_SOCKETS = new pgp.helpers.ColumnSet(['item_id', 'socket_group', 'socket_attr'], { table: 'sockets' })
const COLUMN_SET_PROPERTIES = new pgp.helpers.ColumnSet(['item_id', 'property_name', 'property_value1', 'property_value2', 'property_value_type', 'property_display_mode', 'property_progress'], { table: 'properties' })
const COLUMN_SET_REQUIREMENTS = new pgp.helpers.ColumnSet(['item_id', 'requirement_name', 'requirement_value', 'requirement_value_type', 'requirement_display_mode'], { table: 'requirements' })
const COLUMN_SET_MODS = new pgp.helpers.ColumnSet(['item_id', 'mod_name', 'mod_value1', 'mod_value2', 'mod_value3', 'mod_value4', 'mod_type'], { table: 'mods' })
const REMOVE_STASH_BY_ID = (stashId: string) => ({ query: 'DELETE FROM stashes WHERE stash_id = $1', values: [stashId] })

const queries = {
  insertAccounts2: (data: Account[]) => pgp.helpers.insert(data, COLUMN_SET_ACCOUNTS),
  insertStashes2: (data: Stash[]) => pgp.helpers.insert(data, COLUMN_SET_STASHES),
  insertItems2: (data: Item[]) => pgp.helpers.insert(data, COLUMN_SET_ITEMS),
  insertSockets2: (data: Socket[]) => pgp.helpers.insert(data, COLUMN_SET_SOCKETS),
  insertProperties2: (data: Property[]) => pgp.helpers.insert(data, COLUMN_SET_PROPERTIES),
  insertRequirements2: (data: Requirement[]) => pgp.helpers.insert(data, COLUMN_SET_REQUIREMENTS),
  insertMods2: (data: Mod[]) => pgp.helpers.insert(data, COLUMN_SET_MODS),

  concat: (query1: string, query2: string, query3: string, query4: string, query5: string) => pgp.helpers.concat([query1, query2, query3, query4, query5]),


  insertAccounts: (data: Account[], t: any) => t.result(pgp.helpers.insert(data, COLUMN_SET_ACCOUNTS) + ' ON CONFLICT (account_name) DO UPDATE SET last_seen = EXCLUDED.last_seen, last_character_name = EXCLUDED.last_character_name'),
  insertStashes: (data: Stash[], t: any) => t.result(pgp.helpers.insert(data, COLUMN_SET_STASHES) + ' ON CONFLICT (stash_id) DO UPDATE SET stash_name = EXCLUDED.stash_name, stash_type = EXCLUDED.stash_type, stash_public = EXCLUDED.stash_public'),
  insertItems: (data: Item[], t: any) => t.result(pgp.helpers.insert(data, COLUMN_SET_ITEMS) + ' ON CONFLICT (item_id) DO UPDATE SET account_name = EXCLUDED.account_name, art_filename = EXCLUDED.art_filename, corrupted = EXCLUDED.corrupted, crafted = EXCLUDED.crafted, descr_text = EXCLUDED.descr_text, enchanted = EXCLUDED.enchanted, flavour_text = EXCLUDED.flavour_text, h = EXCLUDED.h, icon = EXCLUDED.icon, identified = EXCLUDED.identified, ilvl = EXCLUDED.ilvl, inventory_id = EXCLUDED.inventory_id, league = EXCLUDED.league, link_amount = EXCLUDED.link_amount, note = EXCLUDED.note, sec_decription_text = EXCLUDED.sec_decription_text, socket_amount = EXCLUDED.socket_amount, stack_size = EXCLUDED.stack_size, stash_id = EXCLUDED.stash_id, updated_ts = EXCLUDED.added_ts, w = EXCLUDED.w, x = EXCLUDED.x, y = EXCLUDED.y'),
  insertSockets: (data: Socket[], t: any) => t.result(pgp.helpers.insert(data, COLUMN_SET_SOCKETS)),
  insertProperties: (data: Property[], t: any) => t.result(pgp.helpers.insert(data, COLUMN_SET_PROPERTIES)),
  insertRequirements: (data: Requirement[], t: any) => t.result(pgp.helpers.insert(data, COLUMN_SET_REQUIREMENTS) + ' ON CONFLICT (item_id, requirement_name) DO UPDATE SET requirement_value = EXCLUDED.requirement_value'),
  insertMods: (data: Mod[], t: any) => t.result(pgp.helpers.insert(data, COLUMN_SET_MODS)),
  removeStashes: (data: Stash[], t: any) => t.result(pgp.helpers.concat(data.map(stash => REMOVE_STASH_BY_ID(stash.stash_id)))),

  upsertCurrentNextChangeId: (next_change_id: string, processed: boolean = false): Promise<any> =>
    db.result('INSERT INTO changeid(next_change_id, processed) VALUES($<next_change_id>, $<processed>) ON CONFLICT (next_change_id) DO UPDATE SET processed = EXCLUDED.processed', { next_change_id, processed: false }),

  getLatestNextChangeId: (): Promise<string> =>
    db.one('SELECT next_change_id FROM changeId WHERE processed = false OR processed = true ORDER BY id DESC LIMIT 1').then((data: any): Promise<string> => data.next_change_id),

  deleteStashById: (stashId: string): Promise<any> =>
    db.result('DELETE FROM stashes WHERE stash_id = $<stashId>', { stashId }),

}

export default queries
