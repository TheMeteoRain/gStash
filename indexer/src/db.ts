import * as pgMonitor from 'pg-monitor'
import * as pgPromise from 'pg-promise'

const options = {
  capSQL: true,
}
pgMonitor.attach(options, ['task', 'error', 'disconnect', 'connect'])

export const pgp = pgPromise(options)
export const db = pgp(process.env.DATABASE)
