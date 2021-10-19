import { useHistory, useLocation } from 'react-router-dom'
import React, { useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import code200 from '../../../Assets/Images/code200.svg'
import Controls from '../../../Components/Controls/Controls'

const useStyles = makeStyles({
  imageGrid: {
    width: 400,
    margin: '4rem auto',
  },
  title: {
    color: '#666666',
    marginTop: '1rem',
    fontSize: '2rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  content: {
    marginTop: '1rem',
    color: '#666666',
    textAlign: 'center',
  },
})

const ValidationSuccessful = () => {
  const classes = useStyles()
  const history = useHistory()
  const location = useLocation()

  useEffect(() => {
    if (location.state === undefined || !location.state.verified) {
      history.push('/')
    }
  }, [location])

  return (
    <Grid container justify="center" className={classes.imageGrid}>
      <Grid item xs={12}>
        <img src={code200} height="400" width="400" alt="verified email" />
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.title}>
          Verification Successful
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.content}>
          Thank you, Your email id has been verified successfully. You can now
          enjoy using edvi.
        </Typography>
      </Grid>
      <Grid item xs={12}>
        <Controls.Button
          text="Go to Edvi"
          onClick={() => {
            history.push('/')
          }}
          className="width-100 margin-top-small"
        />
      </Grid>
    </Grid>
  )
}

export default ValidationSuccessful
