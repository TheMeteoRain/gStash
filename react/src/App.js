import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'

import { MainPage } from './containers'

const styles = theme => ({
  root: {
    width: '80%',
    margin: `0 auto`,
    marginTop: theme.spacing.unit * 5,
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
