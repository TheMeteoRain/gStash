import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'

import { MainPage } from './containers'

const styles = theme => ({
  root: {
    marginTop: theme.spacing.unit * 10,
  },
})

class App extends Component {
  render() {
    const { classes } = this.props

    return (
      <main className={classes.root}>
        <MainPage />
      </main>
    )
  }
}

export default withStyles(styles)(App)
