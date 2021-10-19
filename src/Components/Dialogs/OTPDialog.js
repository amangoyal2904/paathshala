import React, { useState, useEffect, useContext } from 'react'
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { IoCloseSharp } from 'react-icons/io5'
import { FaRegEdit } from 'react-icons/fa'
import { useSnackbar } from 'notistack'
import Controls from '../Controls/Controls'
import OtpField from '../OtpField/OtpField'
import Dialog from './Dialog'
import { AuthContext } from '../../Context/AuthContext'
import showSuccessSnackbar from '../Snackbar/successSnackbar'

const CounterDisplay = ({ counter, setCounter }) => {
  useEffect(() => {
    if (counter > 0) {
      setTimeout(() => setCounter(counter - 1), 1000)
    }
  }, [counter])
  return counter
}

const OTPDialog = ({ open, close, phone_number }) => {
  const classes = useStyles()
  const [otp, setOtp] = useState(new Array(6).fill(''))
  const [counter, setCounter] = useState(29)
  const [showCounter, setShowCounter] = useState(false)

  const handleDialogClose = () => {
    setTimeout(() => setOtp(new Array(6).fill('')), 500)
    setTimeout(() => setShowCounter(false), 500)
    setTimeout(() => setCounter(30), 500)
    close()
  }

  const { VerifyPhoneOTP, UpdateProfile, GetProfile } = useContext(AuthContext)

  const handleChange = (element, index) => {
    if (Number.isNaN(element.value)) return false

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))])

    // Focus next input
    if (element.nextSibling) {
      element.nextSibling.focus()
    }
  }

  const { enqueueSnackbar } = useSnackbar()

  const showNotification = () => {
    showSuccessSnackbar(enqueueSnackbar, 'OTP send')
  }

  const resendOtp = () => {
    const data = {
      phone_number,
    }
    UpdateProfile(data).then(() => {
      showNotification()
      GetProfile()
    })
  }

  const handleVerify = () => {
    const data = otp.join('')
    VerifyPhoneOTP(data).then((res) => {
      if (res.success) {
        handleDialogClose()
        showSuccessSnackbar(enqueueSnackbar, 'Profile Updated Successfully')
        window.location.reload()
      }
    })
  }

  return (
    <Dialog open={open} fullWidth={false}>
      <DialogTitle>
        <div className={classes.header}>
          <p className="sub-text bold text-align-center">
            Mobile Number Verification
          </p>
          <IconButton onClick={handleDialogClose} className={classes.close}>
            <IoCloseSharp size={20} />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div className={classes.content}>
          <p className={classes.text}>
            Please Enter one time password sent to your
          </p>
          <p className={classes.text}>
            mobile no <span className={classes.bold}>+91 {phone_number}</span>{' '}
            <FaRegEdit onClick={handleDialogClose} className="cursor-pointer" />
          </p>
          <div className={classes.otp}>
            <p className={classes.text}>Enter OTP</p>
            <OtpField otp={otp} setOtp={setOtp} handleChange={handleChange} />
          </div>
          {showCounter ? (
            <p>
              Resend OTP in{' '}
              <CounterDisplay
                counter={counter}
                setCounter={setCounter}
                setShowCounter={setShowCounter}
              />
            </p>
          ) : (
            <p
              className={classes.link}
              onClick={() => {
                setShowCounter(true)
                setTimeout(() => setShowCounter(false), 60000)
                setCounter(60)
                resendOtp()
              }}
              onKeyDown={() => {
                setShowCounter(true)
                setTimeout(() => setShowCounter(false), 60000)
                setCounter(60)
                resendOtp()
              }}
            >
              Resend OTP
            </p>
          )}
        </div>
      </DialogContent>
      <Divider />
      <DialogActions>
        <Controls.Button onClick={handleVerify} style={{ margin: '0.5rem' }}>
          Verify
        </Controls.Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: 20,
      justifyContent: 'center',
      alignItems: 'center',
      marginInline: 40,
    },
    close: {
      position: 'absolute',
      right: 10,
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    text: {
      fontSize: '1rem',
      marginBlock: 5,
    },
    bold: {
      fontWeight: 'bold',
    },
    otp: {
      paddingBlock: 20,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    link: {
      textDecorationLine: 'underline',
      color: '#5687e1',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
)

export default OTPDialog
