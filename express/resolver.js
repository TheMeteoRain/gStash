const db = require('./db') // our adapter from psqlAdapter.js

// should match type Query in schema.js
// one function per endpoint
exports.resolver = {
  Query: {
    users(_, args, ctx) {
      const usersQuery =
        'select requirement_name, requirement_value from requirements'
      return db.manyOrNone(usersQuery)
    },
  },
}
