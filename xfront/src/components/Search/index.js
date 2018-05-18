import React, { Component } from 'react'

import { graphql } from 'react-apollo'
import { getFilters } from '../../queries'

import { Button, Form, FormGroup, Label, FormText } from 'reactstrap'
import { Row, Col } from 'react-flexa'
import { Input } from '../../css'
import { Select, AsyncSelect } from '../Form'
import Divider from 'material-ui/Divider'
import TextField from 'material-ui/TextField'
import AutoComplete from 'material-ui/AutoComplete'
import RaisedButton from 'material-ui/RaisedButton'
import SelectField from 'material-ui/SelectField'
import MenuItem from 'material-ui/MenuItem'
import {
  Card,
  CardActions,
  CardHeader,
  CardMedia,
  CardTitle,
  CardText,
} from 'material-ui/Card'

const names = [
  'Alternate Art',
  'Corrupted',
  'Crafted',
  'Elder Item',
  'Enchanted',
  'Identified',
  'Shaper Item',
]

class Search extends Component {
  constructor(props) {
    super(props)
  }

  setSearchList = () => {
    const { networkStatus, allItemsData } = this.props.data

    if (networkStatus !== 7) return []

    return allItemsData.nodes.map(data => data.text)
  }

  setLeagueList = () => {
    const { networkStatus, allLeagues } = this.props.data

    if (networkStatus !== 7) return []

    return allLeagues.nodes.map(({ leagueName }) => (
      <MenuItem value={leagueName} primaryText={leagueName} />
    ))
  }

  menuItems(values) {
    return names.map(name => (
      <MenuItem
        key={name}
        insetChildren={true}
        checked={values && values.indexOf(name) > -1}
        value={name}
        primaryText={name}
      />
    ))
  }

  render() {
    const {
      networkStatus,
      allFrameTypes,
      allLeagues,
      allItemsData,
    } = this.props.data
    console.log(this.props)
    /**
     *           <SelectField value={null}>
            <MenuItem value={null} primaryText={'Any'} />
            <MenuItem value={true} primaryText={'Yes'} />
            <MenuItem value={false} primaryText={'No'} />
          </SelectField>
     */
    return (
      <Form onSubmit={this.props.onSearch}>
        <CardActions style={{ display: 'flex' }}>
          <AutoComplete
            hintText="Type 'Helmet' to search helmets"
            searchText={this.props.search}
            onUpdateInput={this.props.onChange('search')}
            dataSource={this.setSearchList()}
            openOnFocus={false}
            filter={AutoComplete.fuzzyFilter}
            maxSearchResults={5}
            style={{ width: '100%' }}
            textFieldStyle={{ width: '100%' }}
          />
          <SelectField
            value={this.props.leagueName}
            onChange={this.props.onChange('leagueName')}
            style={{ width: '20%' }}
          >
            {this.setLeagueList()}
          </SelectField>
          <SelectField value={true} style={{ width: '20%' }}>
            <MenuItem value={true} primaryText={'Online Only'} />
            <MenuItem value={null} primaryText={'Any'} />
          </SelectField>
        </CardActions>
        <Divider />
        <CardActions style={{ display: 'flex' }}>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Wanted Modifiers
          </div>
          <SelectField
            multiple={true}
            hintText="Select wanted modifier"
            value={this.props.positiveValues}
            onChange={this.props.onPositiveMultiValue}
            style={{ margin: '0 .5rem' }}
          >
            {this.menuItems(this.props.positiveValues)}
          </SelectField>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            Not Wanted Modifiers
          </div>

          <SelectField
            multiple={true}
            hintText="Select not wanted modifier"
            value={this.props.negativeValues}
            onChange={this.props.onNegativeMultivalue}
            style={{ margin: '0 .5rem' }}
          >
            {this.menuItems(this.props.negativeValues)}
          </SelectField>
        </CardActions>

        <br />
        <span>Item Level</span>
        <TextField
          hintText="#"
          floatingLabelText="Min"
          onChange={this.props.onChange('itemLvlMin')}
          style={{ width: '10%', margin: '0 .5rem', alignSelf: 'center' }}
          type="number"
        />
        <TextField
          hintText="#"
          floatingLabelText="Max"
          onChange={this.props.onChange('itemLvlMax')}
          style={{ width: '10%', margin: '0 .5rem' }}
          type="number"
        />
        <br />

        <span>Sockets</span>
        <TextField
          hintText="#"
          floatingLabelText="Min"
          onChange={this.props.onChange('socketAmountMin')}
          style={{ width: '10%', margin: '0 .5rem' }}
        />
        <TextField
          hintText="#"
          floatingLabelText="Max"
          onChange={this.props.onChange('socketAmountMax')}
          style={{ width: '10%', margin: '0 .5rem' }}
        />
        <br />
        <span>Links</span>
        <TextField
          hintText="#"
          floatingLabelText="Min"
          onChange={this.props.onChange('linkAmountMin')}
          style={{ width: '10%', margin: '0 .5rem' }}
        />
        <TextField
          hintText="#"
          floatingLabelText="Max"
          onChange={this.props.onChange('linkAmountMax')}
          style={{ width: '10%', margin: '0 .5rem' }}
        />
        <RaisedButton
          label="Search"
          type="submit"
          fullWidth={true}
          primary={true}
        />
      </Form>
    )
  }
}

export default graphql(getFilters)(Search)
