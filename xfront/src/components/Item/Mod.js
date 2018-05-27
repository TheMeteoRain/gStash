import React from 'react'

import { colorFormat } from './utils'

const formatMods = (
  { mod_name, mod_value1, mod_value2, mod_value3, mod_value4 },
  index
) => {
  let i = 0
  const mod = mod_name.replace(/#/g, () => {
    i++
    if (i === 1) return mod_value1
    if (i === 2) return mod_value2
    if (i === 3) return mod_value3
    if (i === 4) return mod_value4
  })

  return (
    <div key={index} style={{ alignSelf: 'center' }}>
      {colorFormat(mod, 1)}
    </div>
  )
}

const Mod = mods => {
  if (typeof mods === 'undefined' || mods.length === 0) return

  return mods.map(formatMods)
}

export default Mod
