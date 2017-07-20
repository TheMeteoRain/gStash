import db from './db'

const queries = {
  updateCurrentNextChangeId: (next_change_id: string, processed: number): Promise<any> =>
    db.result('INSERT INTO changeid(nextChangeId, processed) VALUES($<next_change_id>, $<processed>) ON CONFLICT (nextChangeId) DO UPDATE SET (processed) = (EXCLUDED.processed)', {next_change_id, processed: 1})

}

export default queries