import { db } from '../../db'
import { sqlFile } from '../create'
import downloadAndParse from '../downloadAndParse'

import queries from './queries'
import { StatData, ItemData, LeagueData } from './class'

const POLL_SERVER_REPEAT_CYCLE = 86400000 // a day in ms

export const parseStatData = ({ data: { result } }: { data: any, result: any[] }): StatData[] => {
  const statsData: StatData[] = []

  result.forEach(({ label, entries }: { label: string, entries: any[] }) => {
    entries.forEach(({ id, text, type }: { id: string, text: string, type: string }) => {
      const statData = new StatData()
      statData.id = id
      statData.text = encodeURI(text)
      statData.type = type
      statsData.push(statData)
    })
  })

  return statsData
}

export const parseItemData = ({ data: { result } }: { data: any, result: any[] }): ItemData[] => {
  const itemsData: ItemData[] = []

  result.forEach(({ label, entries }: { label: string, entries: any[] }) => {
    entries.forEach(({ name, type, text, disc, flags }: { name: string, type: string, text: string, disc: string, flags: any[] }) => {
      const itemData = new ItemData()
      itemData.name = name
      itemData.type = type
      itemData.text = text
      itemData.disc = disc
      itemData.flags = flags
      itemsData.push(itemData)
    })
  })

  return itemsData
}

export const parseLeagueData = ({ data: [...leagues] }: { data: any[], leagues: any }): LeagueData[] => {
  const leaguesData: LeagueData[] = []

  const checkIfLeagueIsActive = (start: Date, end: Date | null): boolean => {
    if (end instanceof Date && start.getTime() < end.getTime())
      return false

    return true
  }

  leagues.forEach(({ id, startAt, endAt }: { id: string, startAt: Date, endAt: Date | null }) => {
    const leagueData = new LeagueData()
    leagueData.league_name = id
    leagueData.active = checkIfLeagueIsActive(startAt, endAt)
    leaguesData.push(leagueData)
  })

  return leaguesData
}



export const pollServer = async () => {
  try {

    const statsData: StatData[] = await downloadAndParse({
      url: 'https://www.pathofexile.com/api/trade/data/stats',
      parser: parseStatData,
    })
    const itemsData: ItemData[] = await downloadAndParse({
      url: 'https://www.pathofexile.com/api/trade/data/items',
      parser: parseItemData,
    })
    const leagueData: LeagueData[] = await downloadAndParse({
      url: 'http://api.pathofexile.com/leagues?type=main',
      parser: parseLeagueData,
    })

    console.time('Sql file creation took')
    const sql = sqlFile({
      title: 'data',
      directory: 'sql',
    })
    sql.addQuery(statsData, queries.insertStatsData)
    sql.addQuery(itemsData, queries.insertItemsData)
    sql.addQuery(leagueData, queries.insertLeaguesData)
    const creationSuccessful = sql.createFile()

    if (creationSuccessful) {
      console.timeEnd('Sql file creation took')
    }

    setTimeout(pollServer, POLL_SERVER_REPEAT_CYCLE)
  } catch (error) {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.headers)
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request)
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error', error)
    }
    console.log(error.config)

    setTimeout(pollServer, 5000)
  }
}

pollServer()
