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

import { MODIFIERS } from '../../constants'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit,
  },

  marginTop: {
    marginTop: theme.spacing.unit * 2,
  },
  formControl: {},

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

  setRarityList = () => {
    const { networkStatus, allFrameTypes } = this.props.data

    if (networkStatus !== 7) return []

    return allFrameTypes.nodes.map(({ frame_type_value }, index) => (
      <MenuItem value={index}>{frame_type_value}</MenuItem>
    ))
  }

  setCategoryList = () => {
    const { networkStatus, allItemCategories } = this.props.data

    if (networkStatus !== 7) return []

    return allItemCategories.map(({ category }) => (
      <MenuItem value={category}>{category}</MenuItem>
    ))
  }

  menuItems(values) {
    return MODIFIERS.map(modifier => (
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
            <Grid item xs={12}>
              <Grid container spacing={24}>
                <Grid item xs={8}>
                  <FormControl fullWidth className={classes.marginTop}>
                    <InputLabel htmlFor="searchSelect" />
                    <AutoComplete
                      className={classes.formControl}
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
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="leagueSelect">League</InputLabel>
                    <Select
                      defaultValue={'Standard'}
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
                </Grid>
                <Grid item xs={2}>
                  <FormControl fullWidth>
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
            </Grid>

            <Grid item xs={12}>
              <Grid container spacing={24}>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="categorySelect">Category</InputLabel>
                    <Select
                      fullWidth
                      value={this.props.category}
                      onChange={this.props.onChange('category', 'category')}
                      inputProps={{
                        name: 'category',
                        id: 'categorySelect',
                      }}
                    >
                      {this.setCategoryList()}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
                    <InputLabel htmlFor="raritySelect">Rarity</InputLabel>
                    <Select
                      fullWidth
                      value={this.props.rarity}
                      onChange={this.props.onChange('rarity', 'frame_type')}
                      inputProps={{
                        name: 'rarity',
                        id: 'raritySelect',
                      }}
                    >
                      {this.setRarityList()}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
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
                </Grid>
                <Grid item xs={3}>
                  <FormControl fullWidth>
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
              </Grid>
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
