import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import registerServiceWorker from './registerServiceWorker'
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles'

import { ApolloProvider } from 'react-apollo'
import { createPersistedQueryLink } from 'apollo-link-persisted-queries'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const link = createPersistedQueryLink().concat(
  createHttpLink({ uri: 'http://localhost:4000/graphql' })
)

const client = new ApolloClient({
  // By default, this client will send queries to the
  //  `/graphql` endpoint on the same host
  // Pass the configuration option { uri: YOUR_GRAPHQL_API_URL } to the `HttpLink` to connect
  // to a different host
  cache: new InMemoryCache(),
  // link: new HttpLink({
  //   uri: 'http://localhost:4000/graphql',
  // }),
  link,
  connectToDevTools: true,
})

const theme = new createMuiTheme({
  // material-ui theme
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <MuiThemeProvider theme={theme}>
      <App />
    </MuiThemeProvider>
  </ApolloProvider>,
  document.getElementById('root')
)
registerServiceWorker()
