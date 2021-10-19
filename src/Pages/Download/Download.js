import React from 'react'
import { makeStyles } from '@material-ui/core'
import Grid from '@material-ui/core/Grid'
import Controls from '../../Components/Controls/Controls'
import logo from '../../Assets/Images/logo.png'
import GooglePlay from '../../Assets/Images/android.png'
import AppStore from '../../Assets/Images/appstore.png'
import Group from '../../Assets/Images/group-9.png'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  logo: {
    filter: 'invert(100%)',
  },
  divWrapper: {
    overflow: 'hidden',
    width: '100%',
  },
}))

const Download = () => {
  const classes = useStyles()

  return (
    <div className={classes.divWrapper}>
      <Grid container className="header">
        <Grid item xs={12} className="text-align-center">
          <img src={logo} alt="EDVI" className={classes.logo} />
        </Grid>
      </Grid>
      <Grid container className="download">
        <Grid item xs={12} className="text-align-center margin-top-small">
          <h2 className="download__heading">
            “Unmatched AI powered digital classroom experience”
          </h2>
          <p className="margin-top-small">
            We are making online education accessible for all. Edvi is a
            one-stop-platform for all your online education needs
          </p>
        </Grid>
        <Grid item xs={6}>
          <a href="https://play.google.com/store/apps/details?id=app.edvi">
            <img
              src={GooglePlay}
              alt="GooglePlay"
              className="margin-top-small"
            />
          </a>
        </Grid>
        <Grid item xs={6}>
          <img src={AppStore} alt="AppStore" className="margin-top-small" />
        </Grid>
        <Grid item xs={12} className="text-align-center margin-top-small">
          <p>or visit</p>
        </Grid>
        <Grid item xs={12} className="text-align-center margin-top-small">
          <a href="https://edvi.app/" className="clean-link">
            <Controls.Button text="edvi.app" size="large" />
          </a>
        </Grid>
        <Grid item xs={12} className="text-align-center margin-top-small">
          <p>on your laptop/desktop</p>
        </Grid>
        <Grid item xs={12} className="margin-top-medium">
          <img src={Group} alt="Group" className="download__group-img" />
        </Grid>
      </Grid>
      <Grid container className="footer">
        <Grid item xs={12} className="text-align-center">
          <h3 className="footer__text">
            Edvi : Teach. Share. Track - Hassle-free!
          </h3>
        </Grid>
      </Grid>
    </div>
  )
}

export default Download
