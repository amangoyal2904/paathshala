import { createStyles, makeStyles } from '@material-ui/core'
import React from 'react'
import Spinner from '../Progress/Spinner'

const Reconnecting = () => {
  const classes = useStyles()
  return (
    <>
      <div className={classes.reconnectingParent} />
      <div className={classes.content}>
        <p className={classes.heading}>Poor Connection</p>
        <div>
          <Spinner className={classes.spinner} />
          <p className={classes.sub}>
            The video will resume automatically when the connection improves
          </p>
        </div>
      </div>
    </>
  )
}

export default Reconnecting

const useStyles = makeStyles(() =>
  createStyles({
    reconnectingParent: {
      height: '100%',
      width: '100%',
      filter: 'blur(23px)',
      position: 'relative',
      backgroundColor: '#424242',
    },
    content: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%,-50%)',
      width: '30%',
      zIndex: 9999,
    },
    heading: {
      fontSize: '1.75rem',
      fontWeight: 600,
      color: '#fff',
      textAlign: 'center',
      width: '100%',
    },
    sub: {
      fontSize: '1.25rem',
      color: '#fff',
      textAlign: 'center',
      width: '100%',
    },
    spinner: {
      margin: '0 0 1.5rem',
    },
  }),
)
