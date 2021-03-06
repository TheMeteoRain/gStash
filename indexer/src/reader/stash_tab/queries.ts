import { db, pgp } from '../../db'
import { Account, Item, Stash, Socket, Property, Requirement, Mod } from './class'

const COLUMN_SET_ACCOUNTS =
  new pgp.helpers.ColumnSet(['account_name', 'last_character_name', 'last_seen'], { table: 'accounts' })

const COLUMN_SET_STASHES =
  new pgp.helpers.ColumnSet(['stash_id', 'stash_name', 'stash_type', 'stash_public'], { table: 'stashes' })

const COLUMN_SET_ITEMS =
  new pgp.helpers.ColumnSet([
    'account_name', 'added_ts', 'art_filename', 'available', 'corrupted', 'crafted',
    'descr_text', 'duplicated', 'enchanted', 'flavour_text', 'frame_type', 'h', 'icon', 'identified',
    'ilvl', 'inventory_id', 'is_relic', 'item_id', 'league', 'link_amount', 'max_stack_size', 'name', 'note',
    'prophecy_diff_text', 'prophecy_text', 'sec_decription_text', 'socket_amount', 'stack_size', 'stash_id',
    'support', 'talisman_tier', 'type_line', 'updated_ts', 'verified', 'w', 'x', 'y',
  ], { table: 'items' })

const COLUMN_SET_SOCKETS =
  new pgp.helpers.ColumnSet(['item_id', 'socket_group', 'socket_attr'], { table: 'sockets' })

const COLUMN_SET_PROPERTIES =
  new pgp.helpers.ColumnSet([
    'item_id', 'property_name', 'property_value1', 'property_value2',
    'property_value_type', 'property_display_mode', 'property_progress',
  ], { table: 'properties' })

const COLUMN_SET_REQUIREMENTS =
  new pgp.helpers.ColumnSet([
    'item_id', 'requirement_name', 'requirement_value', 'requirement_value_type', 'requirement_display_mode',
  ], { table: 'requirements' })

const COLUMN_SET_MODS =
  new pgp.helpers.ColumnSet([
    'item_id', 'mod_name', 'mod_type', 'mod_value1', 'mod_value2', 'mod_value3', 'mod_value4',
  ], { table: 'mods' })
const COLUMN_SET_REMOVE_STASHES = new pgp.helpers.ColumnSet(['stash_id'], { table: 'stashes' })

const REMOVE_STASH_BY_ID = (stash: Stash) =>
  ({ query: 'DELETE FROM stashes WHERE stash_id = $<stash_id>', values: stash })

const queries = {
  insertAccounts: (data: Account[]) => pgp.helpers.insert(data, COLUMN_SET_ACCOUNTS) + ' ON CONFLICT (account_name) DO UPDATE SET ' + COLUMN_SET_ACCOUNTS.assignColumns({from: 'EXCLUDED', skip: 'account_name'}),
  insertStashes: (data: Stash[]) => pgp.helpers.insert(data, COLUMN_SET_STASHES) + ' ON CONFLICT (stash_id) DO UPDATE SET ' + COLUMN_SET_STASHES.assignColumns({from: 'EXCLUDED', skip: 'stash_id'}),
  insertItems: (data: Item[]) => pgp.helpers.insert(data, COLUMN_SET_ITEMS) + ' ON CONFLICT (item_id) DO UPDATE SET ' + COLUMN_SET_ITEMS.assignColumns({from: 'EXCLUDED', skip: 'item_id'}),
  insertSockets: (data: Socket[]) => pgp.helpers.insert(data, COLUMN_SET_SOCKETS),
  insertProperties: (data: Property[]) => pgp.helpers.insert(data, COLUMN_SET_PROPERTIES) + 'ON CONFLICT (item_id, property_name) DO UPDATE SET ' + COLUMN_SET_PROPERTIES.assignColumns({from: 'EXCLUDED', skip: ['item_id', 'property_name', 'property_value_type', 'property_display_mode']}),
  insertRequirements: (data: Requirement[]) => pgp.helpers.insert(data, COLUMN_SET_REQUIREMENTS) + ' ON CONFLICT (item_id, requirement_name) DO UPDATE SET requirement_value = EXCLUDED.requirement_value',
  insertMods: (data: Mod[]) => pgp.helpers.insert(data, COLUMN_SET_MODS),
  removeStashes: (data: Stash[]) => 'DELETE FROM stashes WHERE stash_id in (' + pgp.helpers.values(data, COLUMN_SET_REMOVE_STASHES).replace(/[\(\)]/g, '') + ');',

  upsertCurrentNextChangeId: (next_change_id: string, downloaded: boolean = false): Promise<string> =>
    db.one(`
    INSERT INTO change_id(next_change_id, downloaded) VALUES($<next_change_id>, $<downloaded>)
    ON CONFLICT (next_change_id)
    DO UPDATE SET downloaded = EXCLUDED.downloaded
    RETURNING next_change_id`, { next_change_id, downloaded }),

  getLatestNextChangeId: (): Promise<string> =>
    db.one(`
    SELECT next_change_id
    FROM change_id
    WHERE downloaded = false OR downloaded = true
    ORDER BY id DESC
    LIMIT 1`)
      .then((data: any): Promise<string> => data.next_change_id),
}

export default queries
