const findFilter = (filterArray, filterItem) => {
  const filterIndex = Object.values(filterArray).findIndex(
    ({ name }) => name === filterItem.name
  )

  const oldFilterItem = filterIndex !== -1 ? filterArray[filterIndex] : null

  return {
    filterIndex,
    oldFilterItem,
  }
}

const filters = {
  BooleanFilter: (name, value) => ({
    name: name.toLocaleLowerCase(),
    value: value !== null ? value : null,
  }),

  TextFilter: (name, value) => ({
    name: name.toLocaleLowerCase(),
    value: value ? value : null,
  }),

  NumericFilter: (name, filterName, value) => {
    filterName = filterName.toLocaleLowerCase()
    const numericFilter = {
      name: name,
      min: filterName.includes('min') ? Number(value) : null,
      max: filterName.includes('max') ? Number(value) : null,
    }

    return numericFilter
  },
  setFilter: (filterArray, filterItem) => {
    console.log(filterItem.hasOwnProperty('min'))
    if (filterItem.hasOwnProperty('min') || filterItem.hasOwnProperty('max'))
      return filters.setNumericFilter(filterArray, filterItem)
    const { filterIndex, oldFilterItem } = findFilter(filterArray, filterItem)

    // NEW filter
    if (!oldFilterItem && filterItem.value !== null) {
      filterArray.push(filterItem)
      return filterArray
    }

    if (oldFilterItem) {
      // Remove
      if (filterItem.value == null) {
        filterArray.splice(filterIndex, 1)
        return filterArray
      }

      // MODIFY old filter
      filterArray[filterIndex] = filterItem
    }

    return filterArray
  },
  setNumericFilter: (filterArray, filterItem) => {
    if (filterItem.hasOwnProperty('value'))
      return this.setFilter(filterArray, filterItem)
    const { filterIndex, oldFilterItem } = findFilter(filterArray, filterItem)

    // NEW filter
    if (!oldFilterItem && (filterItem.min || filterItem.max)) {
      filterArray.push(filterItem)
      return filterArray
    }

    // MODIFY old filter
    if (filterItem.min === 0) {
      filterItem.min = null
    } else if (filterItem.min) {
      // Do nothing
    } else {
      filterItem.min = oldFilterItem.min
    }
    if (filterItem.max === 0) {
      filterItem.max = null
    } else if (filterItem.max) {
      // Do nothing
    } else {
      filterItem.max = oldFilterItem.max
    }
    filterArray[filterIndex] = filterItem

    // Remove
    if (!filterItem.min && !filterItem.max) filterArray.splice(filterIndex, 1)

    return filterArray
  },
}

export default filters
