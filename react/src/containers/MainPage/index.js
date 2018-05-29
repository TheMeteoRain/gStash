import React, { Component } from 'react'

import { Mutation, Query } from 'react-apollo'

import { Search, ResultSet } from '../../components'
import { MODIFIERS } from '../../constants'
import filters from './filters'

class MainPage extends Component {
  constructor(props) {
    super(props)

    this.state = {
      first: 50,
      hasSearched: false,
      leagueName: 'Standard',
      frameType: null,
      reqLevelMin: '',
      reqLevelMax: '',
      reqStrMin: '',
      reqStrMax: '',
      reqDexMin: '',
      reqDexMax: '',
      reqIntMin: '',
      reqIntMax: '',
      proArmourMin: '',
      proArmourMax: '',
      proEvasionMin: '',
      proEvasionMax: '',
      proEnergyShieldMin: '',
      proEnergyShieldMax: '',
      proBlockMin: '',
      proBlockMax: '',
      search: '',
      socketAmountMin: '',
      socketAmountMax: '',
      linkAmountMin: '',
      linkAmountMax: '',
      itemLvlMin: '',
      itemLvlMax: '',
      isEnchanted: null,
      isVerified: null,
      isCrafted: null,
      isIdentified: null,
      isCorrupted: null,
      requirements: 'asd',
      itemFilter: [{ name: 'league', value: 'Standard' }],
      reqFilter: [],
      proFilter: [],
      filter: {},
      wantedModifiers: [],
      unWantedModifiers: [],
    }
  }

  setFilter = (filter, filterItem) => {
    const addOrModifyFilters = () => {
      let filterArray = []

      if (typeof filter === 'string') {
        filterArray = this.state[filter]
      } else {
        filterArray = filter
      }

      const filterIndex = Object.values(filterArray).findIndex(
        ({ name }) => name === filterItem.name
      )

      const oldFilterItem = filterIndex !== -1 ? filterArray[filterIndex] : null

      // NEW filter
      if (
        !oldFilterItem &&
        (filterItem.value != null || filterItem.min || filterItem.max)
      ) {
        filterArray.push(filterItem)
        return filterArray
      }
      // MODIFY old filter
      if (oldFilterItem) {
        if (filterItem.hasOwnProperty('value')) {
          // boolean/textFilter
          if (filterItem.value) filterArray[filterIndex] = filterItem

          // Remove
          if (!filterItem.value) filterArray.splice(filterIndex, 1)
        } else {
          // numericFilter
          if (filterItem.min === 0) {
            filterItem.min = null
          } else if (filterItem.min) {
          } else {
            filterItem.min = oldFilterItem.min
          }
          if (filterItem.max === 0) {
            filterItem.max = null
          } else if (filterItem.max) {
          } else {
            filterItem.max = oldFilterItem.max
          }
          filterArray[filterIndex] = filterItem

          // Remove
          if (!filterItem.min && !filterItem.max)
            filterArray.splice(filterIndex, 1)
        }
        return filterArray
      }

      return filterArray
    }

    if (typeof filter === 'string') {
      return this.setState(
        {
          itemFilter: addOrModifyFilters(),
        },
        () => true
      )

      return false
    } else {
      console.log('return')
      return addOrModifyFilters()
    }
  }

  handleChange = (propertyName, filterName, filterCategory) => (
    event,
    autoComplete
  ) => {
    const state = this.state

    if (filterCategory === 'pro') {
      const value = event.target.value ? Number(event.target.value) : ''
      state[propertyName] = value
      state.proFilter = filters.setFilter(
        state.proFilter,
        filters.NumericFilter(filterName, propertyName, value)
      )
      return this.setState(state)
    }

    if (filterCategory === 'req') {
      const value = event.target.value ? Number(event.target.value) : ''
      state[propertyName] = value
      state.reqFilter = filters.setFilter(
        state.reqFilter,
        filters.NumericFilter(filterName, propertyName, value)
      )
      return this.setState(state)
    }

    if (propertyName === 'search') {
      state[propertyName] = autoComplete.newValue
      state.itemFilter = filters.setFilter(
        state.itemFilter,
        filters.TextFilter(filterName, autoComplete.newValue)
      )
    } else if (propertyName === 'leagueName') {
      const value = event.target.value
      state[propertyName] = value
      state.itemFilter = filters.setFilter(
        state.itemFilter,
        filters.TextFilter(filterName, value)
      )
    } else {
      const value = event.target.value ? Number(event.target.value) : ''
      state.itemFilter = filters.setFilter(
        state.itemFilter,
        filters.NumericFilter(filterName, propertyName, value)
      )
      state[propertyName] = value
    }

    this.setState(state)
  }

  multiValueCheck = state => {
    const { wantedModifiers, unWantedModifiers } = state

    MODIFIERS.forEach(modifier => {
      if (
        !wantedModifiers.includes(modifier) &&
        !unWantedModifiers.includes(modifier)
      ) {
        state[`is${modifier}`] = null
        state.itemFilter = filters.setFilter(
          state.itemFilter,
          filters.BooleanFilter(modifier, null)
        )
      } else if (wantedModifiers.includes(modifier)) {
        state[`is${modifier}`] = true
        state.itemFilter = filters.setFilter(
          state.itemFilter,
          filters.BooleanFilter(modifier, true)
        )
      } else if (unWantedModifiers.includes(modifier)) {
        state[`is${modifier}`] = false
        state.itemFilter = filters.setFilter(
          state.itemFilter,
          filters.BooleanFilter(modifier, false)
        )
      }
    })

    this.setState(state)
  }

  handleWantedModifiers = event => {
    const value = event.target.value
    const state = this.state

    state.unWantedModifiers = state.unWantedModifiers.filter(
      modifier => !value.includes(modifier)
    )
    state.wantedModifiers = value
    //state.isVerified = state.find(property => property === 'Corrupted') ? true : null
    this.multiValueCheck(state)
  }

  handleUnWantedModifiers = event => {
    const value = event.target.value
    const state = this.state

    state.wantedModifiers = state.wantedModifiers.filter(
      modifier => !value.includes(modifier)
    )
    state.unWantedModifiers = value
    //state.isVerified = state.find(property => property === 'Corrupted') ? true : null
    this.multiValueCheck(state)
  }

  handleSubmit = e => {
    e.preventDefault()

    const { itemFilter, reqFilter } = this.state
    const filter = {
      item: itemFilter,
      req: reqFilter.length > 0 ? reqFilter : null,
    }

    this.setState({
      hasSearched: true,
      filter,
    })
  }

  render() {
    const { hasSearched, first, filter } = this.state

    return (
      <section>
        <article>
          <Search
            onSubmit={this.handleSubmit}
            onChange={this.handleChange}
            onWantedModifiers={this.handleWantedModifiers}
            onUnWantedModifiers={this.handleUnWantedModifiers}
            {...this.state}
          />
        </article>

        {hasSearched && (
          <article>
            <ResultSet first={first} filter={filter} />
          </article>
        )}
      </section>
    )
  }
}

export default MainPage
