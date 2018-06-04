import React from 'react'

import { COLORS } from '../../constants'

export const colorFormat = (value, valueType) => (
  <span style={{ color: COLORS.VALUE_TYPE[valueType] }}>{value}</span>
)

export const modColorFormat = (value, modType) => (
  <span style={{ color: COLORS.MODS[modType] }}>{value}</span>
)
