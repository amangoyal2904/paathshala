import { CircularProgress, makeStyles } from '@material-ui/core'
import React from 'react'

const Spinner = ({ color, size = 40, ...other }) => {
  const useStyles = makeStyles(() => ({
    root: {
      position: 'relative',
      marginLeft: '50%',
      left: `-${size / 2}px`,
      top: '1rem',
    },
  }))
  const classes = useStyles()
  return (
    <CircularProgress
      color={color || 'primary'}
      size={size}
      {...other}
      classes={{ root: classes.root }}
    />
  )
}

export default Spinner
