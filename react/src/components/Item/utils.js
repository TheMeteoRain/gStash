import React from 'react'

import { COLORS } from '../../constants'

export const colorFormat = (value, valueType) => (
  <span style={{ color: COLORS.ValueTypes[valueType] }}>{value}</span>
)

export const modColorFormat = (value, modType) => (
  <span style={{ color: COLORS.MODS[modType] }}>{value}</span>
)
