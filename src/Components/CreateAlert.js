import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Alert, AlertTitle } from '@material-ui/lab'

const CreateAlert = (props) => {
  const classes = useStyles()

  return (
    <div className={classes.alert}>
      <Alert severity={props.severity} onClose={props.onClose}>
        <AlertTitle>{props.title}</AlertTitle>
        {props.msg}
      </Alert>
    </div>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    alert: {
      position: 'absolute',
      top: 0,
      width: '100%',
    },
  }),
)

export default CreateAlert
