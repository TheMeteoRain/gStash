import React from 'react'

import { colorFormat } from './utils'

const formatMods = ({
  nodeId,
  modName,
  modValue1,
  modValue2,
  modValue3,
  modValue4,
}) => {
  let i = 0
  const mod = modName.replace(/#/g, () => {
    i++
    if (i === 1) return modValue1
    if (i === 2) return modValue2
    if (i === 3) return modValue3
    if (i === 4) return modValue4
  })

  return <div key={nodeId}>{colorFormat(mod, 1)}</div>
}

const Mod = mods => {
  if (mods.length === 0) return

  return mods.map(formatMods)
}

export default Mod
