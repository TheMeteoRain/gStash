const express = require('express')

// Body parser
const bodyParser = require('body-parser')
const cors = require('cors')

// GraphQL
const graphqlHTTP = require('express-graphql')
const { graphiqlExpress, graphqlExpress } = require('apollo-server-express')
const { ApolloEngine } = require('apollo-engine')

// GraphQL Schema
const schema = require('./schema')

const app = express()

// The GraphQL endpoint
app.use(
  '/graphql',
  cors(),
  bodyParser.json(),
  graphqlExpress((req, res) => {
    console.log(req)
    return {
      schema,
      tracing: true,
      cacheControl: {
        defaultMaxAge: 120,
      },
    }
  })
)

// GraphiQL, a visual editor for queries
app.use('/graphiql', graphiqlExpress({ endpointURL: '/graphql' }))

// Initialize engine with  API key
const engine = new ApolloEngine({
  apiKey: 'service:MeteoRain:YqY-wiu0JQMHWXLJqCFAAQ',
  frontends: [
    {
      overrideGraphqlResponseHeaders: {
        'Access-Control-Allow-Origin': '*',
      },
    },
  ],
  stores: [
    {
      name: 'publicResponseMemcache',
      inMemory: {
        cacheSize: '1000000000',
      },
    },
  ],
  queryCache: {
    publicFullQueryStore: 'publicResponseMemcache',
    // By not mentioning publicFullQueryStore||privateFullQueryStore, we keep it enabled with
    // the default empty-string-named in-memory store.
  },
  logging: {
    level: 'INFO', // Engine Proxy logging level. DEBUG, INFO (default), WARN or ERROR.
  },
  origins: [
    {
      supportsBatch: true,
    },
  ],
})

// Call engine.listen instead of app.listen(port)
engine.listen(
  {
    port: 4000,
    expressApp: app,
    launcherOptions: {},
  },
  () => console.log('Now browse to localhost:4000/graphql')
)
