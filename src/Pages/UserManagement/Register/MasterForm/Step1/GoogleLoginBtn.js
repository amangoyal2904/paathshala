import React, { useContext } from 'react'
import { GoogleLogin } from 'react-google-login'
import { FcGoogle } from 'react-icons/fc'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Controls from '../../../../../Components/Controls/Controls'
import { AuthContext } from '../../../../../Context/AuthContext'

const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID

const GoogleRegisterBtn = () => {
  const classes = useStyles()
  const { DirectGoogleLogin } = useContext(AuthContext)

  const onSuccess = (res) => {
    const payload = {
      idm_token: res.tokenId,
    }
    DirectGoogleLogin(payload)
  }

  const onFailure = () => {
    // console.log('Login Failed:', res)
  }

  return (
    <>
      <GoogleLogin
        clientId={client_id}
        onSuccess={onSuccess}
        onFailure={onFailure}
        cookiePolicy="single_host_origin"
        render={(renderProps) => (
          <Controls.Button
            className={classes.google_login}
            onClick={renderProps.onClick}
            startIcon={<FcGoogle />}
          >
            Sign In With Google
          </Controls.Button>
        )}
        // isSignedIn={true}
      />
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    google_login: {
      marginTop: 30,
      backgroundColor: '#fff',
      backgroundImage: 'unset',
      border: 'solid 0.5px #818181',
      color: '#000',
      '&:hover': {
        backgroundColor: '#fff',
        backgroundImage: 'unset',
        border: 'solid 0.5px #818181',
      },
      '&.Mui-disabled': {
        backgroundColor: '#fff',
      },
    },
  }),
)

export default GoogleRegisterBtn
