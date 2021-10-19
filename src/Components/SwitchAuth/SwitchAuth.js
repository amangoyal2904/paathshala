import React from 'react'
import { Link } from 'react-router-dom'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const SwitchAuth = ({ authType }) => {
  const classes = useStyles()
  let content
  if (authType === 'register') {
    content = (
      <div className={classes.container}>
        <div>
          <p className="fine-text bold" style={{ color: '#666' }}>
            Don&apos;t have an Account?{' '}
            <Link to="/auth/register">
              <span className={classes.span}>Register Now</span>
            </Link>
          </p>
        </div>
      </div>
    )
  }
  if (authType === 'login') {
    content = (
      <div className={classes.container}>
        <div>
          <p className={`${classes.text} fine-text bold`}>
            Already have an Account?{' '}
            <Link to="/auth/login">
              <span className={classes.span}>Sign In</span>
            </Link>
          </p>
        </div>
      </div>
    )
  }

  return <>{content}</>
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      margin: '0 auto',
      backgroundColor: '#fff',
      padding: '0 2rem',
    },
    text: {
      color: '#666',
    },
    span: {
      color: '#5685e0',
      textDecorationLine: 'underline',
      fontWeight: 'bold',
    },
  }),
)

export default SwitchAuth
