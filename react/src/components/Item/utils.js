import React from 'react'

import Colors from '../../Colors'

export const colorFormat = (value, valueType) => (
  <span style={{ color: Colors.ValueTypes[valueType] }}>{value}</span>
)
