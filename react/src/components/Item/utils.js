import React from 'react'

import { COLORS } from '../../constants'

export const colorFormat = (value, valueType) => (
  <span style={{ color: COLORS.ValueTypes[valueType] }}>{value}</span>
)
