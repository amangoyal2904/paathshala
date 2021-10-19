import React, { useContext, useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Grid, Hidden, useMediaQuery } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import SwitchAuth from '../../Components/SwitchAuth/SwitchAuth'
import EmailLogin from './EmailLogin/EmailLogin'
import MasterForm from './Register/MasterForm/MasterForm'
import SendLink from './PasswordRecovery/SendLink'
import SetNewPassword from './PasswordRecovery/SetNewPassword'
import { AuthContext } from '../../Context/AuthContext'
import Spinner from '../../Components/Progress/Spinner'
import Logo from '../../Assets/Images/edvi-logo-blue.png'
import feature from '../../Assets/Images/feature.svg'
import passwordFeature from '../../Assets/Images/passwordFeature.svg'
import ValidateEmail from './ValidateEmail/ValidateEmail'

const Auth = () => {
  const classes = useStyles()
  const history = useHistory()
  const { loading, features, SetFeatures } = useContext(AuthContext)
  const matches = useMediaQuery('(min-width:600px)')
  const { action, subaction } = useParams()
  let alternateAction
  if (action === 'register') {
    alternateAction = 'login'
  } else {
    alternateAction = 'register'
  }

  useEffect(() => {
    SetFeatures(
      'signIn',
      'The Next Generation Online Teaching & Learning Platforms',
    )
    if (
      action === undefined ||
      (action !== 'recovery' &&
        action !== 'register' &&
        action !== 'login' &&
        action !== 'verify')
    ) {
      history.push('/auth/login')
    }
    if (action === 'recovery' && subaction === undefined) {
      history.push('/auth/recovery/sendlink')
    }
  }, [action, subaction, history])

  const setImage = () => {
    switch (features.img) {
      case 'signIn':
        return feature
      case 'create_password':
        return passwordFeature
      case 'register':
        return feature
      default:
        break
    }
  }

  const image = setImage()

  const setContent = () => {
    if (loading) {
      return <Spinner />
    }
    switch (action) {
      case 'login':
        return <EmailLogin />
      case 'register':
        return <MasterForm />
      case 'verify':
        return <ValidateEmail />
      case 'recovery':
        switch (subaction) {
          case 'sendlink':
            return <SendLink />
          case 'setnewpassword':
            return <SetNewPassword />
          default:
            return <h1>params are not correct</h1>
        }
      default:
        break
    }
  }
  const content = setContent()

  return (
    <>
      <div className={classes.container}>
        <Grid
          container
          direction={matches === true ? 'row' : 'column-reverse'}
          className="height-100"
        >
          <Hidden xsDown>
            <Grid item xs={12} sm={5} className={classes.left_grid}>
              <Grid container>
                <Grid item sm={12}>
                  <div
                    role="button"
                    tabIndex="0"
                    className={classes.edvi_logo}
                    onClick={() => history.push('/')}
                    onKeyDown={() => history.push('/')}
                  >
                    <img src={Logo} alt="edvi logo" height={40} width={90} />
                  </div>
                  <div className={classes.feature_image}>
                    <img src={image} alt="teacher sitting with laptop" />
                  </div>
                  <div className={classes.text}>
                    <p className="fine-text bold text-align-center">
                      {features.msg}
                    </p>
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Hidden>
          <Grid
            item
            xs={12}
            sm={7}
            className={
              matches ? classes.right_grid : classes.right_grid_responsive
            }
          >
            <div className={classes.rightBar}></div>
            <div>{content}</div>
            <SwitchAuth authType={alternateAction} />
          </Grid>
        </Grid>
      </div>
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      margin: '0 auto',
      backgroundColor: '#fff',
      height: '100%',
    },
    left_grid: {
      backgroundColor: '#eff3fd',
      borderTopRightRadius: 100,
      borderBottomRightRadius: 100,
    },
    right_grid: {
      alignSelf: 'center',
      padding: '0 2.5rem',
    },
    right_grid_responsive: {
      alignSelf: 'center',
    },
    edvi_logo: {
      padding: '30px 40px',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    feature_image: {
      display: 'flex',
      justifyContent: 'center',
      marginTop: 80,
    },
    text: {
      display: 'flex',
      justifyContent: 'center',
      margin: '20px 10px',
    },
    rightBar: {
      width: 10,
      borderTopLeftRadius: 56,
      borderBottomLeftRadius: 56,
      backgroundImage: 'linear-gradient(176deg, #638ee4 38%, #6480e4 57%)',
      height: '80vh',
      position: 'absolute',
      right: 0,
      top: '50%',
      transform: 'translateY(-50%)',
    },
  }),
)

export default Auth
