import React, { useContext, useState } from 'react'
import { GoogleLogin } from 'react-google-login'
import { FcGoogle } from 'react-icons/fc'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Controls from '../../../../../Components/Controls/Controls'
import { AuthContext } from '../../../../../Context/AuthContext'
import RegistrationSuccessDialog from '../../../../../Components/Dialogs/RegistrationSuccessDialog'

// pass this from env
const client_id = process.env.REACT_APP_GOOGLE_CLIENT_ID

const GoogleRegisterBtn = ({ role }) => {
  const classes = useStyles()
  const { DirectGoogleRegister } = useContext(AuthContext)
  const [registrationSuccess, setRegistrationSuccess] = useState(false)
  const [token, setToken] = useState(undefined)

  const onSuccess = async (res) => {
    const payload = {
      role,
      id_token: res.tokenId,
    }
    setToken(res.tokenId)
    const status = await DirectGoogleRegister(payload)
    if (status === 201) {
      setRegistrationSuccess(true)
    }
  }

  const onFailure = () => {
    // console.log('Login Failed:', res)
  }

  return (
    <>
      <RegistrationSuccessDialog
        open={registrationSuccess}
        setOpen={setRegistrationSuccess}
        mode="google"
        token={token}
      />
      {role === '' ? (
        <GoogleLogin
          clientId={client_id}
          onSuccess={onSuccess}
          onFailure={onFailure}
          disabled
          cookiePolicy="single_host_origin"
          render={(renderProps) => (
            <Controls.Button
              className={classes.google_login}
              onClick={renderProps.onClick}
              startIcon={<FcGoogle />}
              disabled={renderProps.disabled}
            >
              Sign Up With Google
            </Controls.Button>
          )}
        />
      ) : (
        <GoogleLogin
          clientId={client_id}
          onSuccess={onSuccess}
          onFailure={onFailure}
          cookiePolicy="single_host_origin"
          render={(renderProps) => (
            <Controls.Button
              className={classes.google_login}
              onClick={renderProps.onClick}
              disabled={renderProps.disabled}
              startIcon={<FcGoogle />}
            >
              Sign Up With Google
            </Controls.Button>
          )}
        />
      )}
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    google_login: {
      marginTop: 20,
      backgroundColor: '#fff',
      color: '#000',
      border: 'solid 0.5px #818181',
      backgroundImage: 'unset',
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
