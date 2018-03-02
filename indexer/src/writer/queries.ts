const queries = {
  updateCurrentNextChangeId: (db, next_change_id: string, uploaded: boolean = false): string =>
    db.one(`
    UPDATE change_id
    SET uploaded = $<uploaded>
    WHERE next_change_id = $<next_change_id> AND downloaded IS TRUE`, { next_change_id, uploaded }),
  getLatestNextchangeId: (db): Promise<string> =>
    db.one(`
    SELECT next_change_id
    FROM change_id
    WHERE downloaded IS TRUE AND uploaded IS FALSE
    ORDER BY id
    LIMIT 1`)
      .then((data: any): Promise<string> => data.next_change_id),
}

export default queries
