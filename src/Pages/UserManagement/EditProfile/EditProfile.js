import React, { useContext, useState, useEffect } from 'react'
import { IconButton, InputAdornment, useMediaQuery } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { IoIosArrowBack } from 'react-icons/io'
import { FiPhone } from 'react-icons/fi'
import { useHistory } from 'react-router-dom'
import {
  IoPersonCircle,
  IoPersonCircleOutline,
  IoCheckmarkCircleSharp,
  IoLockClosed,
  IoWarning,
} from 'react-icons/io5'
import { HiOutlineMail } from 'react-icons/hi'
import { MdError } from 'react-icons/md'
import { useSnackbar } from 'notistack'
import { AuthContext } from '../../../Context/AuthContext'
import { BatchContext } from '../../../Context/BatchContext'
import Form from '../../../Components/Form/Form'
import useForm from '../../../Hooks/useForm'
import Controls from '../../../Components/Controls/Controls'
import OTPDialog from '../../../Components/Dialogs/OTPDialog'
import Card from '../../../Components/Cards/Card'
import Spinner from '../../../Components/Progress/Spinner'
import VerifyEmailDialog from '../../../Components/Dialogs/VerifyEmailDialog'
import showErrorSnackbar from '../../../Components/Snackbar/errorSnackbar'
// import handleError from '../../../Global/HandleError/handleError'

const EditProfile = () => {
  const classes = useStyles()
  const matches = useMediaQuery('(max-width:900px)')
  const { authState, UpdateProfile } = useContext(AuthContext)
  const { loading, ResendEmailVerify } = useContext(BatchContext)

  const { email, is_email_verified, is_phone_verified, name, phone_number } =
    authState

  const { enqueueSnackbar } = useSnackbar()

  const initialState = {
    name,
    email,
    phone_number: phone_number || '',
  }
  const [openOtpDialog, setOpenOtpDialog] = useState(false)
  const [mobileError, setMobileError] = useState(false)
  const [showOtp, setShowOtp] = useState(false)
  const [openVerifyEmailDialog, setOpenVerifyEmailDialog] = useState(false)
  const [isEmailChanged, setIsEmailChanged] = useState(false)
  const [btnLoading, setBtnLoading] = useState(false)

  const handleOpenVerifyEmailDialog = () => {
    setOpenVerifyEmailDialog(true)
  }

  const handleCloseVerifyEmailDialog = () => {
    setOpenVerifyEmailDialog(false)
  }

  const handleOpenOtpDialog = () => {
    if (values.phone_number) {
      const data = {
        phone_number: values.phone_number,
      }
      UpdateProfile(data)
        .then((res) => {
          if (res.success) {
            setOpenOtpDialog(true)
          }
        })
        .catch(() => {
          // console.log(err)
        })
    } else {
      setMobileError(true)
      setTimeout(() => setMobileError(false), 4000)
    }
  }

  const handleCloseOtpDialog = () => {
    setOpenOtpDialog(false)
  }

  const history = useHistory()

  const validate = (fieldValues = values) => {
    const temp = { ...errors }
    if ('email' in fieldValues)
      temp.email = fieldValues.email ? '' : 'This field is required.'
    setErrors({
      ...temp,
    })

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '')
  }

  const { values, errors, setErrors, handleInputChange } = useForm(
    initialState,
    true,
    validate,
  )

  useEffect(() => {
    if (values.email !== email) {
      setIsEmailChanged(true)
    } else {
      setIsEmailChanged(false)
    }
  }, [values.email])

  const validateMobile = (fieldValues) => {
    if (fieldValues.target.value === authState.phone_number) {
      setShowOtp(false)
    } else {
      setShowOtp(true)
    }
  }

  const handleMobileChange = async (e) => {
    await handleInputChange(e)
    await validateMobile(e)
  }

  const handleSubmit = async () => {
    history.push('/dashboard')
  }

  const handleResendOtpBtn = async () => {
    if (validate()) {
      setBtnLoading(true)
      const data = {
        email: values.email,
      }
      const res = await ResendEmailVerify(data)
      setBtnLoading(false)

      if (res) {
        if (
          res.status === 400 &&
          res.data.errors === 'User with this email already exists.'
        ) {
          showErrorSnackbar(enqueueSnackbar, res.data.errors)
        } else {
          handleOpenVerifyEmailDialog()
        }
      }
    }
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className={classes.container}>
          <div className={classes.header}>
            <IconButton onClick={() => history.goBack()}>
              <IoIosArrowBack size={25} />
            </IconButton>
            <p className={classes.info_text}>Edit My Profile</p>
          </div>
          <Card className={classes.card}>
            <div>
              <IoPersonCircle color="#ffa92b" size={matches ? 100 : 200} />
            </div>
            <div className={classes.form}>
              <Form>
                <div className="form-control width-100">
                  <div>
                    <p className="bold">Name</p>
                    <div className={classes.input_div}>
                      <Controls.Input
                        placeholder="Name"
                        type="text"
                        value={values.name}
                        name="name"
                        className="width-50"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <IoPersonCircleOutline />
                            </InputAdornment>
                          ),
                        }}
                        disabled
                      />
                      <IoLockClosed
                        color="#ff471b"
                        size={23}
                        className="mg-left-10"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="bold">Email</p>
                    <div className={classes.input_div}>
                      <Controls.Input
                        type="text"
                        name="email"
                        value={values.email}
                        onChange={handleInputChange}
                        autoFocus
                        className="width-50"
                        placeholder="Email"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <HiOutlineMail />
                            </InputAdornment>
                          ),
                        }}
                        error={errors.email}
                      />
                      {is_email_verified ? (
                        <>
                          {isEmailChanged ? (
                            <IoWarning
                              color="#ffa92b"
                              size={25}
                              className="mg-left-10"
                            />
                          ) : (
                            <IoCheckmarkCircleSharp
                              color="#00bea7"
                              size={25}
                              className="mg-left-10"
                            />
                          )}
                        </>
                      ) : (
                        <>
                          {isEmailChanged ? (
                            <IoWarning
                              color="#ffa92b"
                              size={25}
                              className="mg-left-10"
                            />
                          ) : (
                            <MdError
                              color="#ff471b"
                              size={25}
                              className="mg-left-10"
                            />
                          )}
                        </>
                      )}
                      {!is_email_verified ? (
                        <Controls.Button
                          className="width-20 mg-left-30"
                          onClick={handleResendOtpBtn}
                          startIcon={
                            btnLoading && (
                              <Spinner
                                size={20}
                                className="margin-left-unset position-unset"
                                color="inherit"
                              />
                            )
                          }
                          disabled={btnLoading}
                        >
                          Resend OTP
                        </Controls.Button>
                      ) : (
                        <>
                          {isEmailChanged && (
                            <Controls.Button
                              className="width-20 mg-left-30"
                              onClick={handleResendOtpBtn}
                              startIcon={
                                btnLoading && (
                                  <Spinner
                                    size={20}
                                    className="margin-left-unset position-unset"
                                    color="inherit"
                                  />
                                )
                              }
                              disabled={btnLoading}
                            >
                              Resend OTP
                            </Controls.Button>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="bold">Mobile Number</p>
                    <div className={classes.input_div}>
                      <Controls.Input
                        type="number"
                        name="phone_number"
                        value={values.phone_number}
                        onChange={handleMobileChange}
                        maxLength={10}
                        className="width-50"
                        placeholder="Enter Mobile Number"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <FiPhone />
                            </InputAdornment>
                          ),
                        }}
                      />
                      {is_phone_verified && !showOtp ? (
                        <IoCheckmarkCircleSharp
                          color="#00bea7"
                          size={25}
                          className="mg-left-10"
                        />
                      ) : (
                        <MdError
                          color="#ff471b"
                          size={25}
                          className="mg-left-10"
                        />
                      )}
                      {is_phone_verified && !showOtp ? null : (
                        <Controls.Button
                          className={
                            matches
                              ? `width-30 mg-left-30`
                              : `width-20 mg-left-30`
                          }
                          onClick={handleOpenOtpDialog}
                        >
                          Send OTP
                        </Controls.Button>
                      )}
                    </div>
                    {mobileError && (
                      <p className={classes.mobile_error}>
                        Please Enter a Mobile Number
                      </p>
                    )}
                  </div>
                  <Controls.Button
                    className={matches ? `width-30` : classes.submit}
                    text="Save Changes"
                    onClick={handleSubmit}
                    disabled={showOtp}
                  />
                </div>
              </Form>
            </div>
          </Card>
          <OTPDialog
            open={openOtpDialog}
            close={handleCloseOtpDialog}
            phone_number={values.phone_number}
          />
          {openVerifyEmailDialog && (
            <VerifyEmailDialog
              open={openVerifyEmailDialog}
              close={handleCloseVerifyEmailDialog}
              email={values.email}
              sendOTP={false}
            />
          )}
        </div>
      )}
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      margin: '20px 40px 0px',
    },
    card: {
      marginTop: '10px 0 0 0',
      padding: '20px 15px',
      display: 'flex',
    },
    info_text: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      marginLeft: '0 0 0 20px',
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    camera_icon: {
      backgroundColor: '#548de1',
      borderRadius: '50%',
      padding: 4,
      position: 'absolute',
      right: 10,
    },
    form: {
      padding: '0px 20px',
      width: '100%',
    },
    input_div: {
      display: 'flex',
      alignItems: 'center',
    },
    submit: {
      width: '25%',
      margin: '30px 0 0 0',
    },
    mobile_error: {
      color: '#ff471b',
    },
  }),
)

export default EditProfile
