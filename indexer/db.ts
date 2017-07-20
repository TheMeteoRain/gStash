/*const bluebird = require('bluebird')
const options = {
  promiseLib: bluebird,
}*/
const pgp = require('pg-promise')()
const db = pgp(process.env.DATABASE)

export default db