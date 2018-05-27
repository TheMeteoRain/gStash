import React from 'react'

import LinearProgress from '@material-ui/core/LinearProgress'

const Experience = properties => {
  if (typeof properties === 'undefined' || properties.length === 0) return

  let experience = 0
  const property = properties.find(pro => pro.property_name === 'Experience')
  if (typeof property === 'undefined') return

  experience = property.property_progress

  return (
    <LinearProgress
      color={'primary'}
      variant="determinate"
      value={experience * 100}
    />
  )
}

export default Experience
