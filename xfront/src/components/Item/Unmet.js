import React from 'react'

import LinearProgress from 'material-ui/LinearProgress'

import { colorFormat } from './utils'

const Unmet = (identified, corrupted, experience) => {
  if (experience)
    return (
      <LinearProgress
        mode="determinate"
        value={experience}
        max={1}
        style={{ height: '.5rem' }}
      />
    )
  if (!identified) return <div>{colorFormat('Unidentified', 2)}</div>
  if (corrupted) return <div>{colorFormat('Corrupted', 2)}</div>
}

export default Unmet
