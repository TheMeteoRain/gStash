import { db, pgp } from '../../db'
import { StatData, ItemData, LeagueData } from './class'

const COLUMN_SET_STATS_DATA = new pgp.helpers.ColumnSet(['id', 'text', 'type'], { table: 'stats_data' })
const COLUMN_SET_ITEMS_DATA = new pgp.helpers.ColumnSet(['name', 'type', 'disc', 'text'], { table: 'items_data' })
const COLUMN_SET_LEAGUES_DATA = new pgp.helpers.ColumnSet(['league_name', 'active'], { table: 'leagues' })

const queries = {
  insertStatsData: (data: StatData[]) => pgp.helpers.insert(data, COLUMN_SET_STATS_DATA) +
    ' ON CONFLICT (id) DO NOTHING',
  insertItemsData: (data: ItemData[]) => pgp.helpers.insert(data, COLUMN_SET_ITEMS_DATA) +
    ' ON CONFLICT (text) DO NOTHING',
  insertLeaguesData: (data: LeagueData[]) => pgp.helpers.insert(data, COLUMN_SET_LEAGUES_DATA) +
    ' ON CONFLICT (league_name) DO UPDATE SET active = EXCLUDED.active',
}

export default queries
