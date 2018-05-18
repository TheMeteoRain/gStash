import React, { Component } from 'react'

import { Row, Col } from 'react-flexa'

import { Search, ResultSet } from '../../components'
import RaisedButton from 'material-ui/RaisedButton'
import Paper from 'material-ui/Paper'

class MainPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      first: 50,
      hasSearched: false,
      leagueName: 'Standard',
      frameType: null,
      search: '',
      socketAmountMin: 0,
      socketAmountMax: 6,
      linkAmountMin: 0,
      linkAmountMax: 6,
      itemLvlMin: 0,
      itemLvlMax: 100,
      isEnchanted: null,
      isVerified: null,
      isCrafted: null,
      isIdentified: null,
      isCorrupted: null,
      positiveValues: [],
      negativeValues: [],
    }
  }

  handleChange = propertyName => event => {
    const state = this.state
    console.log(propertyName, event, event.target)
    if (propertyName === 'search') {
      state[propertyName] = event ? event : ''
    } else if (propertyName === 'leagueName') {
      state[propertyName] = event.target.textContent
    } else {
      const value = event.target.value
      const castStringNumberToNumber =
        typeof Number(value) === 'number' ? Number(value) : ''
      state[propertyName] = castStringNumberToNumber
    }

    this.setState(state)
  }

  multiValueCheck = state => {
    const { positiveValues, negativeValues } = state

    if (positiveValues.includes('Corrupted')) state.isCorrupted = true
    if (positiveValues.includes('Crafted')) state.isCrafted = true
    if (positiveValues.includes('Enchanted')) state.isEnchanted = true
    if (positiveValues.includes('Identified')) state.isIdentified = true

    if (negativeValues.includes('Corrupted')) state.isCorrupted = false
    if (negativeValues.includes('Crafted')) state.isCrafted = false
    if (negativeValues.includes('Enchanted')) state.isEnchanted = false
    if (negativeValues.includes('Identified')) state.isIdentified = false

    if (
      !positiveValues.includes('Corrupted') &&
      !negativeValues.includes('Corrupted')
    )
      state.isCorrupted = null
    if (
      !positiveValues.includes('Crafted') &&
      !negativeValues.includes('Crafted')
    )
      state.isCrafted = null
    if (
      !positiveValues.includes('Enchanted') &&
      !negativeValues.includes('Enchanted')
    )
      state.isEnchanted = null
    if (
      !positiveValues.includes('Identified') &&
      !negativeValues.includes('Identified')
    )
      state.isIdentified = null

    this.setState(state)
  }

  handlePositiveMultiValue = (event, index, values) => {
    const state = this.state

    state.negativeValues = state.negativeValues.filter(
      modifier => !values.includes(modifier)
    )
    state.positiveValues = values
    //state.isVerified = state.find(property => property === 'Corrupted') ? true : null
    this.multiValueCheck(state)
  }

  handleNegativeMultiValue = (event, index, values) => {
    const state = this.state

    state.positiveValues = state.positiveValues.filter(
      modifier => !values.includes(modifier)
    )
    state.negativeValues = values
    //state.isVerified = state.find(property => property === 'Corrupted') ? true : null
    this.multiValueCheck(state)
  }

  test = () => {
    console.log('asd')
  }

  handleSearch = e => {
    e.preventDefault()
    this.setState({
      hasSearched: true,
    })
  }

  render() {
    const { hasSearched } = this.state

    return (
      <div style={{ paddingTop: '3rem' }}>
        <section>
          <Paper>
            <Search
              onSearch={this.handleSearch}
              onChange={this.handleChange}
              onPositiveMultiValue={this.handlePositiveMultiValue}
              onNegativeMultivalue={this.handleNegativeMultiValue}
              {...this.state}
            />
          </Paper>
        </section>

        {hasSearched && (
          <Paper>
            <ResultSet {...this.state} />
          </Paper>
        )}
      </div>
    )
  }
}

export default MainPage
