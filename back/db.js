const pgPromise = require('pg-promise')

const connStr = 'postgres://akash.singh@localhost:5432/poe' // add your psql details

const pgp = pgPromise({}) // empty pgPromise instance
const psql = pgp(connStr) // get connection to your db instance

module.exports = psql
