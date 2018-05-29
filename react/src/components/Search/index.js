import React, { Component } from 'react'

import { Query, graphql } from 'react-apollo'
import { getFilters, test } from '../../queries'

import { AsyncSelect, RequirementField, SocketField } from '../Form'
import { withStyles } from '@material-ui/core/styles'

import Divider from '@material-ui/core/Divider'
import TextField from '@material-ui/core/TextField'
import AutoComplete from '../Form/AutoComplete'
import Button from '@material-ui/core/Button'
import Select from '@material-ui/core/Select'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemText from '@material-ui/core/ListItemText'
import Checkbox from '@material-ui/core/Checkbox'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'

import Input from '@material-ui/core/Input'
import InputLabel from '@material-ui/core/InputLabel'
import FormLabel from '@material-ui/core/FormLabel'
import FormControl from '@material-ui/core/FormControl'
import FormGroup from '@material-ui/core/FormGroup'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormHelperText from '@material-ui/core/FormHelperText'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
} from '@material-ui/core/Card'

import { modifiers } from '../../utils'

const styles = theme => ({
  root: {
    flexGrow: 1,
  },
  formControlParent: {
    margin: theme.spacing.unit, // keeps search bar within parent
    display: 'flex',
    alignItems: 'flex-end',
    width: '100%',
  },
  formControl: {
    margin: theme.spacing.unit,

    flex: '1 1 auto',
  },
  formControlBig: {
    margin: theme.spacing.unit,
    flex: '3 1 auto',
  },

  fullWidth: {
    margin: theme.spacing.unit,
    width: '100%',
  },

  formControlMultiValueParent: {
    display: 'flex',
    justifyContent: 'space-around',
  },
  formControlMultiValue: {
    margin: theme.spacing.unit,
    flex: 1,
  },

  selectEmpty: {
    marginTop: theme.spacing.unit * 2,
  },
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    maxWidth: 50,
  },

  reserveSpace: {
    margin: theme.spacing.unit,
    minWidth: '10%',
    maxWidth: '10%',
  },
  margin: {
    margin: theme.spacing.unit,
  },
})

class Search extends Component {
  constructor(props) {
    super(props)
  }

  setSearchList = () => {
    const { networkStatus, allItemsData } = this.props.data

    if (networkStatus !== 7) return []

    return allItemsData.nodes.map(data => ({ label: data.text }))
  }

  setLeagueList = () => {
    const { networkStatus, allLeagues } = this.props.data

    if (networkStatus !== 7) return []

    return allLeagues.nodes.map(({ league_name }) => (
      <MenuItem value={league_name}>{league_name}</MenuItem>
    ))
  }

  menuItems(values) {
    return modifiers.map(modifier => (
      <MenuItem key={modifier} value={modifier}>
        <Checkbox checked={values.indexOf(modifier) > -1} />
        <ListItemText primary={modifier} />
      </MenuItem>
    ))
  }

  render() {
    const {
      classes,
      data: { networkStatus, allFrameTypes, allLeagues, allItemsData },
    } = this.props
    console.log(this.props)

    return (
      <Paper className={classes.root}>
        <form onSubmit={this.props.onSubmit}>
          <Grid container spacing={24}>
            <Grid container>
              <Grid item xs={12} className={classes.formControlParent}>
                <FormControl className={classes.formControlBig}>
                  <InputLabel htmlFor="searchSelect" />
                  <AutoComplete
                    value={this.props.search}
                    suggestions={this.setSearchList()}
                    onChange={this.props.onChange('search', 'search')}
                    placeholder={`Type 'Helmet' to search helmets`}
                    inputProps={{
                      name: 'search',
                      id: 'searchSelect',
                    }}
                  />
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="leagueSelect">League</InputLabel>
                  <Select
                    value={this.props.leagueName}
                    onChange={this.props.onChange('leagueName', 'league')}
                    inputProps={{
                      name: 'league',
                      id: 'leagueSelect',
                    }}
                  >
                    {this.setLeagueList()}
                  </Select>
                </FormControl>
                <FormControl className={classes.formControl}>
                  <InputLabel htmlFor="statusSelect">Status</InputLabel>
                  <Select
                    value={true}
                    inputProps={{ name: 'status', id: 'statusSelect' }}
                  >
                    <MenuItem value={true}>Online Only</MenuItem>
                    <MenuItem value={null}>Any</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>

            <Grid item xs={12} className={classes.formControlMultiValueParent}>
              <FormControl className={classes.formControlMultiValue}>
                <InputLabel htmlFor="wantedModifierSelect">
                  Wanted Modifiers
                </InputLabel>
                <Select
                  multiple
                  value={this.props.wantedModifiers}
                  onChange={this.props.onWantedModifiers}
                  renderValue={selected => selected.join(', ')}
                  inputProps={{
                    name: 'wantedModifier',
                    id: 'wantedModifierSelect',
                  }}
                >
                  {this.menuItems(this.props.wantedModifiers)}
                </Select>
              </FormControl>
              <FormControl className={classes.formControlMultiValue}>
                <InputLabel htmlFor="unwantedModifierSelect">
                  Unwanted Modifiers
                </InputLabel>
                <Select
                  multiple
                  value={this.props.unWantedModifiers}
                  onChange={this.props.onUnWantedModifiers}
                  renderValue={selected => selected.join(', ')}
                  inputProps={{
                    name: 'unwantedModifier',
                    id: 'unwantedModifierSelect',
                  }}
                >
                  {this.menuItems(this.props.unWantedModifiers)}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <Grid container className={classes.margin}>
                <Grid item xs={6}>
                  <RequirementField
                    name={'Level'}
                    propertyName={'reqLevel'}
                    filterName={'Level'}
                    filterCategory={'req'}
                    value1={this.props.reqLevelMin}
                    value2={this.props.reqLevelMax}
                    onChange={this.props.onChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RequirementField
                    name={'Strength'}
                    propertyName={'reqStr'}
                    filterName={'Str'}
                    filterCategory={'req'}
                    value1={this.props.reqStrMin}
                    value2={this.props.reqStrMax}
                    onChange={this.props.onChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <RequirementField
                    name={'Dexterity'}
                    propertyName={'reqDex'}
                    filterName={'Dex'}
                    filterCategory={'req'}
                    value1={this.props.reqDexMin}
                    value2={this.props.reqDexMax}
                    onChange={this.props.onChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RequirementField
                    name={'Intelligence'}
                    propertyName={'reqInt'}
                    filterName={'Int'}
                    filterCategory={'req'}
                    value1={this.props.reqIntMin}
                    value2={this.props.reqIntMax}
                    onChange={this.props.onChange}
                  />
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={6}>
              shello
            </Grid>

            <Grid item xs={6}>
              <Grid container className={classes.margin}>
                <Grid item xs={12}>
                  <SocketField
                    name={'Sockets'}
                    propertyName={'socketAmount'}
                    filterName={'socket_amount'}
                    filterCategory={'item'}
                    value1={this.props.socketAmountMin}
                    value2={this.props.socketAmountMax}
                    onChange={this.props.onChange}
                  />
                </Grid>

                <Grid item xs={12}>
                  <SocketField
                    name={'Links'}
                    propertyName={'linkAmount'}
                    filterName={'link_amount'}
                    filterCategory={'item'}
                    value1={this.props.linkAmountMin}
                    value2={this.props.linkAmountMax}
                    onChange={this.props.onChange}
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={6}>
              shello
            </Grid>
            <Grid item xs={6}>
              <Grid container className={classes.margin}>
                <Grid item xs={6}>
                  <RequirementField
                    name={'Armour'}
                    propertyName={'proArmour'}
                    filterName={'Armour'}
                    filterCategory={'pro'}
                    value1={this.props.proArmourMin}
                    value2={this.props.proArmourMax}
                    onChange={this.props.onChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RequirementField
                    name={'Evasion'}
                    propertyName={'proEvasion'}
                    filterName={'Evasion'}
                    filterCategory={'pro'}
                    value1={this.props.proEvasionMin}
                    value2={this.props.proEvasionMax}
                    onChange={this.props.onChange}
                  />
                </Grid>

                <Grid item xs={6}>
                  <RequirementField
                    name={'Energy Shield'}
                    propertyName={'proEnergyShield'}
                    filterName={'Energy Shield'}
                    filterCategory={'pro'}
                    value1={this.props.proEnergyShieldMin}
                    value2={this.props.proEnergyShieldMax}
                    onChange={this.props.onChange}
                  />
                </Grid>
                <Grid item xs={6}>
                  <RequirementField
                    name={'Block'}
                    propertyName={'proBlock'}
                    filterName={'Block'}
                    filterCategory={'pro'}
                    value1={this.props.proBlockMin}
                    value2={this.props.proBlockMax}
                    onChange={this.props.onChange}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="raised" color={'primary'}>
            Search
          </Button>
        </form>
      </Paper>
    )
  }
}

export default graphql(getFilters)(withStyles(styles)(Search))
