import React from 'react'

import { colorFormat } from './utils'

const REQUIREMENT_ORDER = ['Level', 'Str', 'Dex', 'Int']

const formatRequirements = (
  {
    nodeId,
    requirementName,
    requirementValue,
    requirementValueType,
    requirementDisplayMode,
  },
  index,
  array
) => {
  const last = array.length - 1 > index ? false : true
  const value = colorFormat(requirementValue, requirementValueType)

  if (requirementDisplayMode === 0) {
    if (last)
      return (
        <span key={nodeId}>
          {requirementName} {value}
        </span>
      )

    return (
      <span key={nodeId}>
        {requirementName} {value},{' '}
      </span>
    )
  }

  if (requirementDisplayMode === 1) {
    if (last)
      return (
        <span key={nodeId}>
          {value} {requirementName}
        </span>
      )

    return (
      <span key={nodeId}>
        {value} {requirementName},{' '}
      </span>
    )
  }

  return (
    <div key={nodeId}>
      <span>{requirementName}</span>
    </div>
  )

  // there is no displayMode 2 or 3 in requirements
}

const Requirement = requirements => {
  if (requirements.length === 0) return

  // APOLLO IS IMMUTABLE, DO - ARRAY OF
  const sortedList = Array.of(...requirements).sort(
    (a, b) =>
      REQUIREMENT_ORDER.indexOf(a.requirementName) -
      REQUIREMENT_ORDER.indexOf(b.requirementName)
  )

  return sortedList.map(formatRequirements)
}

export default Requirement
