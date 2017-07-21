import db from './db'
import { Account } from './class/Account'

const queries = {
  updateCurrentNextChangeId: (next_change_id: string, processed: number = 0): Promise<any> =>
    db.result('INSERT INTO changeid(nextChangeId, processed) VALUES($<next_change_id>, $<processed>) ON CONFLICT (nextChangeId) DO UPDATE SET (processed) = (EXCLUDED.processed)', { next_change_id, processed: 1 }),
  getLatestNextChangeId: (): Promise<string> =>
    db.one('SELECT nextChangeId FROM changeId WHERE processed = 0 OR processed = 1 ORDER BY id DESC LIMIT 1').then((data: any): Promise<string> => data.nextchangeid),

  setAccount: (t: any, account: Account): any =>
    account.accountName ? t.result('INSERT INTO accounts(accountName, lastCharacterName, lastSeen) VALUES ($<accountName>, $<lastCharacterName>, $<lastSeen>) ON CONFLICT (accountName) DO UPDATE SET lastSeen = EXCLUDED.lastSeen', account) : ''


}

export default queries