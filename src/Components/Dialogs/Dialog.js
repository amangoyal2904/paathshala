import React from 'react'
import { Dialog as MuiDialog, makeStyles } from '@material-ui/core'

export default function Dialog({ children, ...other }) {
  const classes = useStyles()
  return (
    <MuiDialog
      fullWidth
      maxWidth="sm"
      {...other}
      classes={{ root: classes.root }}
    >
      {children}
    </MuiDialog>
  )
}

const useStyles = makeStyles({
  root: {
    '& .MuiPaper-root': {
      padding: 0,
      borderRadius: 18,
      backgroundColor: '#ffffff',
    },
  },
})
