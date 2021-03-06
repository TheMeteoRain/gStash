import React from 'react'

import { colorFormat } from './utils'

const BAN_WORDS = ['Experience']

const formatProperties = (
  { property_name, property_values, property_display_mode, property_progress },
  index
) => {
  if (BAN_WORDS.find(word => word === property_name)) return

  let property = <span>{property_name}</span>

  // name: value or name: value-value
  if (property_display_mode === 0 && property_values.length > 0) {
    const values = property_values.map(
      ({ value1 = null, value2 = null, valueType = null }, index) => {
        if (value1 && value2) {
          // last
          if (index === property_values.length - 1)
            return <span>{colorFormat(`${value1}-${value2}`, valueType)}</span>

          // not last
          return <span>{colorFormat(`${value1}-${value2}, `, valueType)}</span>
        }

        if (value1 && !value2)
          return <span>{colorFormat(value1, valueType)}</span>

        return
      }
    )

    property = (
      <span>
        {property_name}: {values}
      </span>
    )
  }

  /**
   * property does not have displayMode 1
   * property has displayMode 2 but it is not used here
   */

  // name %0 something %1
  if (property_display_mode === 3) {
    const { value1, value2 = null, valueType } = property_values[0]
    let i = 0

    const name = property_name.replace(/#/g, () => {
      i++
      if (i === 1) return colorFormat(value1, valueType)
      if (i === 2) return colorFormat(value2, valueType)
    })

    property = <span>{name}</span>
  }

  return (
    <div key={index} name="property">
      {property}
    </div>
  )
}

const Property = properties => {
  if (typeof property === 'undefined' || properties.length === 0) return
  console.log(properties)
  return properties.map(formatProperties)
}

export default Property
