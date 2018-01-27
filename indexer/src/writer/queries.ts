const queries = {
  updateCurrentNextChangeId: (t: any, next_change_id: string, uploaded: boolean = false): Promise<string> =>
    t.one(`
    UPDATE changeid
    SET uploaded = $<uploaded>
    WHERE next_change_id = $<next_change_id> AND downloaded = TRUE
    RETURNING next_change_id`, { next_change_id, uploaded }).catch((error: any) => {
        console.error(`ERROR: next_change_id: ${next_change_id} download was not confirmed in database`)
        throw error
      }),
}

export default queries
