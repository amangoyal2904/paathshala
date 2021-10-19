import { LinearProgress } from '@material-ui/core'
import React from 'react'

const Loader = ({ variant, color, size = 40, ...other }) => (
  <LinearProgress
    variant={variant || 'determinate'}
    color={color || 'primary'}
    size={size}
    {...other}
  />
)

export default Loader
