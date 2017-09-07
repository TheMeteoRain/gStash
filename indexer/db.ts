/*const bluebird = require('bluebird')
const options = {
  promiseLib: bluebird,
}*/
const monitor = require('pg-monitor');

const options = {
  capSQL: true,
}
monitor.attach(options, ['task', 'error', 'disconnect', 'connect']);

export const pgp = require('pg-promise')(options)
export const db = pgp(process.env.DATABASE)
