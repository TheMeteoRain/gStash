import React from 'react'

import { withStyles } from '@material-ui/core/styles'

import { colorFormat, modColorFormat } from './utils'

const MOD_ORDER = ['ENCHANTED', 'IMPLICIT', 'EXPLICIT', 'CRAFTED']
const styles = theme => ({
  EXPLICIT: { color: '#8888FF' },
  IMPLICIT: { color: '#8888FF' },
  CRAFTED: { color: '#B4B4FF' },
  ENCHANTED: { color: '#B4B4FF' },
})

class Mods extends React.Component {
  formatMods = (
    { mod_name, mod_type, mod_value1, mod_value2, mod_value3, mod_value4 },
    index
  ) => {
    const { classes } = this.props

    let i = 0
    const mod = mod_name.replace(/#/g, () => {
      i++
      if (i === 1) return mod_value1
      if (i === 2) return mod_value2
      if (i === 3) return mod_value3
      if (i === 4) return mod_value4
    })

    return (
      <div key={index} name={mod_type} className={classes[mod_type]}>
        {mod}
      </div>
    )
  }

  render() {
    const { mods } = this.props

    if (typeof mods === 'undefined' || mods.length === 0) return null

    // APOLLO IS IMMUTABLE, DO - ARRAY OF
    const sortedList = Array.of(...mods).sort(
      (a, b) => MOD_ORDER.indexOf(a.mod_type) - MOD_ORDER.indexOf(b.mod_type)
    )

    return sortedList.map(this.formatMods)
  }
}

export default withStyles(styles)(Mods)
