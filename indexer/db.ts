/*const bluebird = require('bluebird')
const options = {
  promiseLib: bluebird,
}*/
export const pgp = require('pg-promise')({
  capSQL: true
})
export const db = pgp(process.env.DATABASE)