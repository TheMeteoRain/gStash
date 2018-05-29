const pgPromise = require('pg-promise')

const pgp = pgPromise({}) // empty pgPromise instance
const psql = pgp(process.env.DATABASE) // get connection to your db instance

module.exports = psql
