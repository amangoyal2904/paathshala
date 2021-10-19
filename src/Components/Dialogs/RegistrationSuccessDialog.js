import {
  DialogActions,
  DialogContent,
  Divider,
  makeStyles,
} from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { CgArrowLongRight } from 'react-icons/cg'
import { useHistory } from 'react-router-dom'
import SuccessSVG from '../../Assets/Images/success-3.svg'
import Controls from '../Controls/Controls'
import { AuthContext } from '../../Context/AuthContext'
import Spinner from '../Progress/Spinner'
import Dialog from './Dialog'

const useStyles = makeStyles(() => ({
  successDiv: {
    width: '100%',
  },
  imgDiv: {
    width: 'max-content',
    margin: '0 auto',
  },
  img: {
    width: 'auto',
    height: '100%',
  },
  heading: {
    fontSize: '1.75rem',
    color: '#333',
  },
  message: {
    fontSize: '1rem',
    color: '#666',
    marginTop: '3px 0 23px 0',
  },
  actions: {
    padding: '0 0 5px 0',
  },
  btn: {
    width: 287,
    margin: '0.5rem auto',
  },
}))

const RegistrationSuccessDialog = ({
  open,
  setOpen,
  mode,
  email,
  password,
  token,
}) => {
  const classes = useStyles()

  const { LogIn, DirectGoogleLogin } = useContext(AuthContext)
  const [isLoggingIn, setIsLoggingIn] = useState(false)
  const history = useHistory()
  const handleGetStarted = async () => {
    if (mode === 'google') {
      const loginPayload = {
        idm_token: token,
      }
      await DirectGoogleLogin(loginPayload)
      setOpen(false)
    } else {
      setIsLoggingIn(true)
      const payload = {
        email,
        password,
      }
      LogIn(payload)
        .then(() => {
          setOpen(false)
        })
        .catch(() => {
          history.push('/auth/login')
        })
    }
  }
  return (
    <Dialog open={open}>
      <DialogContent>
        <div className={classes.successDiv}>
          <div className={classes.imgDiv}>
            <img
              src={SuccessSVG}
              alt="Signed Up Successfully"
              className={classes.img}
            />
          </div>
        </div>
        <p className={`${classes.heading} bolder text-align-center`}>
          Congratulations!
        </p>
        <p className={`${classes.message} text-align-center`}>
          You have successfully created your account.
        </p>
      </DialogContent>
      <Divider />
      <DialogActions className={classes.actions}>
        <Controls.Button
          text="Let's Get Started"
          startIcon={
            isLoggingIn && (
              <Spinner
                size={20}
                style={{ marginLeft: 'unset', position: 'unset' }}
                color="inherit"
              />
            )
          }
          endIcon={<CgArrowLongRight />}
          className={classes.btn}
          onClick={handleGetStarted}
          disabled={isLoggingIn}
        />
      </DialogActions>
    </Dialog>
  )
}

export default RegistrationSuccessDialog
