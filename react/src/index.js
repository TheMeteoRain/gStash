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
  createHttpLink({ uri: process.env.API_URL })
)

const client = new ApolloClient({
  cache: new InMemoryCache(),
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
