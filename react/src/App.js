import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'

import { MainPage, Header } from './containers'

const styles = theme => ({
  root: {
    marginBottom: theme.spacing.unit * 10,
  },
  header: {
    marginBottom: theme.spacing.unit * 10,
  },
})

class App extends Component {
  render() {
    const { classes } = this.props

    return (
      <React.Fragment>
        <Header className={classes.root} />
        <main className={classes.root}>
          <MainPage />
        </main>
      </React.Fragment>
    )
  }
}

export default withStyles(styles)(App)
