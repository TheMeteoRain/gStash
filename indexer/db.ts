/*const bluebird = require('bluebird')
const options = {
  promiseLib: bluebird,
}*/
const options = {
  capSQL: true
}

export const pgp = require('pg-promise')(options)
export const db = pgp(process.env.DATABASE)