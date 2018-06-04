import React, { Component } from 'react'

import { withStyles } from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField'
import Grid from '@material-ui/core/Grid'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  textField: {
    maxWidth: '80%',
  },
})

const SocketField = props => {
  const {
    classes,
    name,
    propertyName,
    filterName,
    filterCategory,
    value1,
    value2,
  } = props

  return (
    <Grid container alignItems={'baseline'}>
      <Grid item xs={6}>
        {name}
      </Grid>
      <Grid item xs={3}>
        <TextField
          id={`${propertyName}Min`}
          label="Min"
          value={value1}
          onChange={props.onChange(
            `${propertyName}Min`,
            filterName,
            filterCategory
          )}
          type="number"
          className={classes.textField}
        />
      </Grid>
      <Grid item xs={3}>
        <TextField
          id={`${propertyName}Max`}
          label="Max"
          value={value2}
          onChange={props.onChange(
            `${propertyName}Max`,
            filterName,
            filterCategory
          )}
          type="number"
          className={classes.textField}
        />
      </Grid>
    </Grid>
  )
}

export default withStyles(styles)(SocketField)
