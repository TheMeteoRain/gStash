import React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'

import { colorFormat } from './utils'

const Unmet = (identified, corrupted) => {
  if (!identified) return <div>{colorFormat('Unidentified', 2)}</div>
  if (corrupted) return <div>{colorFormat('Corrupted', 2)}</div>
}

export default Unmet
