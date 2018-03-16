const queries = {
  updateCurrentNextChangeId: (client, nextChangeId: string, uploaded: boolean = false) =>
    client.query({
      name: 'update-change-id',
      text: 'UPDATE change_id SET uploaded = $1 WHERE next_change_id = $2 AND downloaded IS TRUE',
      values: [uploaded, nextChangeId],
    }),
  getLatestNextchangeId: (client) =>
    client.query({
      name: 'get-change-id',
      text: 'SELECT next_change_id FROM change_id WHERE downloaded IS TRUE AND uploaded IS FALSE ORDER BY id LIMIT 1',
    }),
}

export default queries
