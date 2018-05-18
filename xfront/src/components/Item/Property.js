import React from 'react'

import { colorFormat } from './utils'

const BAN_WORDS = ['Experience']

const formatProperties = ({
  nodeId,
  propertyName,
  propertyValues,
  propertyDisplayMode,
  propertyProgress,
}) => {
  if (BAN_WORDS.find(word => word === propertyName)) return

  let property = <span>{propertyName}</span>

  // name: value or name: value-value
  if (propertyDisplayMode === 0 && propertyValues.length > 0) {
    const values = propertyValues.map(
      ({ value1 = null, value2 = null, valueType = null }, index) => {
        if (value1 && value2) {
          // last
          if (index === propertyValues.length - 1)
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
        {propertyName}: {values}
      </span>
    )
  }

  /**
   * property does not have displayMode 1
   * property has displayMode 2 but it is not used here
   */

  // name %0 something %1
  if (propertyDisplayMode === 3) {
    const { value1, value2 = null, valueType } = propertyValues[0]
    let i = 0

    const name = propertyName.replace(/#/g, () => {
      i++
      if (i === 1) return colorFormat(value1, valueType)
      if (i === 2) return colorFormat(value2, valueType)
    })

    property = <span>{name}</span>
  }

  return (
    <div key={nodeId} name="property">
      {property}
    </div>
  )
}

const Property = properties => {
  if (properties.length === 0) return

  return properties.map(formatProperties)
}

export default Property
