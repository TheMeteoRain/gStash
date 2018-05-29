import React from 'react'

import { colorFormat } from './utils'

const REQUIREMENT_ORDER = ['Level', 'Str', 'Dex', 'Int']

const formatRequirements = (
  {
    requirement_name,
    requirement_value,
    requirement_value_type,
    requirement_display_mode,
  },
  index,
  array
) => {
  const last = array.length - 1 > index ? false : true
  const value = colorFormat(requirement_value, requirement_value_type)

  if (requirement_display_mode === 0) {
    if (last)
      return (
        <span key={index}>
          {requirement_name} {value}
        </span>
      )

    return (
      <span key={index}>
        {requirement_name} {value},{' '}
      </span>
    )
  }

  if (requirement_display_mode === 1) {
    if (last)
      return (
        <span key={index}>
          {value} {requirement_name}
        </span>
      )

    return (
      <span key={index}>
        {value} {requirement_name},{' '}
      </span>
    )
  }

  return (
    <div key={index}>
      <span>{requirement_name}</span>
    </div>
  )

  // there is no displayMode 2 or 3 in requirements
}

const Requirement = requirements => {
  if (typeof requirements === 'undefined' || requirements.length === 0) return

  // APOLLO IS IMMUTABLE, DO - ARRAY OF
  const sortedList = Array.of(...requirements).sort(
    (a, b) =>
      REQUIREMENT_ORDER.indexOf(a.requirement_name) -
      REQUIREMENT_ORDER.indexOf(b.requirement_name)
  )

  return sortedList.map(formatRequirements)
}

export default Requirement
