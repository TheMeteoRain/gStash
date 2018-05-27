import React, { Component } from 'react'

import { Search, ResultSet } from '../../components'

const setBooleanFilter = (name, value) => ({
  name: name.toLocaleLowerCase(),
  value: value != null ? value : null,
})

const setTextFilter = (name, value) => ({
  name: name.toLocaleLowerCase(),
  value: value ? value : null,
})

const setNumericFilter = (name, filterName, value) => {
  filterName = filterName.toLocaleLowerCase()
  const numericFilter = {
    name: name.toLocaleLowerCase(),
    min: filterName.includes('min') ? Number(value) : null,
    max: filterName.includes('max') ? Number(value) : null,
  }

  return numericFilter
}

const names = [
  'Alternate Art',
  'Corrupted',
  'Crafted',
  'Elder Item',
  'Enchanted',
  'Identified',
  'Shaper Item',
]

const setReqFilter = (filterArray, newFilterItem) => {
  const filterIndex = Object.values(filterArray).findIndex(
    ({ name }) => name === newFilterItem.name
  )

  const oldFilterItem = filterIndex !== -1 ? filterArray[filterIndex] : null

  // NEW filter
  if (
    !oldFilterItem &&
    (newFilterItem.value != null || newFilterItem.min || newFilterItem.max)
  ) {
    filterArray.push(newFilterItem)
    return filterArray
  }

  // MODIFY old filter
  if (newFilterItem.min === 0) {
    newFilterItem.min = null
  } else if (newFilterItem.min) {
  } else {
    newFilterItem.min = oldFilterItem.min
  }
  if (newFilterItem.max === 0) {
    newFilterItem.max = null
  } else if (newFilterItem.max) {
  } else {
    newFilterItem.max = oldFilterItem.max
  }
  filterArray[filterIndex] = newFilterItem

  // Remove
  if (!newFilterItem.min && !newFilterItem.max)
    filterArray.splice(filterIndex, 1)

  return filterArray
}

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
      filter: {},
      positiveValues: [],
      negativeValues: [],
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

    if (filterCategory === 'req') {
      const value = event.target.value ? Number(event.target.value) : ''
      state[propertyName] = value
      state.reqFilter = setReqFilter(
        this.state.reqFilter,
        setNumericFilter(filterName, propertyName, value)
      )
      return this.setState(state)
    }

    if (propertyName === 'search') {
      state[propertyName] = autoComplete.newValue
      state.itemFilter = this.setFilter(
        state.itemFilter,
        setTextFilter(filterName, autoComplete.newValue)
      )
    } else if (propertyName === 'leagueName') {
      const value = event.target.value
      state[propertyName] = value
      state.itemFilter = this.setFilter(
        state.itemFilter,
        setTextFilter(filterName, value)
      )
    } else {
      const value = event.target.value ? Number(event.target.value) : ''
      state.itemFilter = this.setFilter(
        state.itemFilter,
        setNumericFilter(filterName, propertyName, value)
      )
      state[propertyName] = value
    }

    this.setState(state)
  }

  multiValueCheck = state => {
    const { positiveValues, negativeValues, itemFilter } = state
    let newItemFilter = []

    names.forEach(name => {
      if (!positiveValues.includes(name) && !negativeValues.includes(name)) {
        state[`is${name}`] = null
        newItemFilter = this.setFilter(itemFilter, setBooleanFilter(name, null))
      }

      if (positiveValues.includes(name)) {
        state[`is${name}`] = true
        newItemFilter = this.setFilter(itemFilter, setBooleanFilter(name, true))
      }
      if (negativeValues.includes(name)) {
        state[`is${name}`] = false
        newItemFilter = this.setFilter(
          itemFilter,
          setBooleanFilter(name, false)
        )
      }
    })

    state.itemFilter = newItemFilter

    this.setState(state)
  }

  handlePositiveMultiValue = event => {
    const value = event.target.value
    const state = this.state

    state.negativeValues = state.negativeValues.filter(
      modifier => !value.includes(modifier)
    )
    state.positiveValues = value
    //state.isVerified = state.find(property => property === 'Corrupted') ? true : null
    this.multiValueCheck(state)
  }

  handleNegativeMultiValue = event => {
    const value = event.target.value
    const state = this.state

    state.positiveValues = state.positiveValues.filter(
      modifier => !value.includes(modifier)
    )
    state.negativeValues = value
    //state.isVerified = state.find(property => property === 'Corrupted') ? true : null
    this.multiValueCheck(state)
  }

  handleSearch = e => {
    e.preventDefault()

    const { itemFilter } = this.state
    const filter = { item: itemFilter }

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
            onSearch={this.handleSearch}
            onChange={this.handleChange}
            onPositiveMultiValue={this.handlePositiveMultiValue}
            onNegativeMultiValue={this.handleNegativeMultiValue}
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
