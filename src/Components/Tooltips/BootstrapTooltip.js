import { makeStyles, Tooltip } from '@material-ui/core'
import React from 'react'

const BootstrapTooltip = (props) => {
  const classes = useStylesBootstrap()

  return <Tooltip arrow classes={classes} {...props} />
}

export default BootstrapTooltip

const useStylesBootstrap = makeStyles((theme) => ({
  arrow: {
    color: theme.palette.common.white,
  },
  tooltip: {
    backgroundColor: theme.palette.common.white,
    color: theme.palette.common.black,
    fontSize: 14,
    borderRadius: 4,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.1)',
    border: 'solid 1px #f1f1f1',
  },
}))
