import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  makeStyles,
} from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { IoIosClose } from 'react-icons/io'
import { HiOutlineLockClosed } from 'react-icons/hi'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { useSnackbar } from 'notistack'
import Controls from '../Controls/Controls'
import useForm from '../../Hooks/useForm'
import { AuthContext } from '../../Context/AuthContext'
import Form from '../Form/Form'
import showSuccessSnackbar from '../Snackbar/successSnackbar'
import handleError from '../../Global/HandleError/handleError'
import Dialog from './Dialog'

const ChangePasswordDialog = ({ open, setOpen }) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const handleClose = () => {
    setOpen(false)
    resetForm()
  }
  const { ChangePassword } = useContext(AuthContext)

  const [showPassword, setShowPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [repeatNewPassword, setRepeatNewPassword] = useState(false)

  const setNewPasswordFormData = {
    password: '',
    new_password: '',
    repeatNewPassword: '',
  }

  function changePassword() {
    ChangePassword(values.password, values.new_password)
      .then(() => {
        showSuccessSnackbar(
          enqueueSnackbar,
          'Password has been changed successfully',
        )
        handleClose()
      })
      .catch((err) => {
        handleError(enqueueSnackbar, err)
      })
  }

  const validate = (fieldValues = values) => {
    const temp = { ...errors }
    if ('password' in fieldValues) {
      temp.password = fieldValues.password ? '' : 'This field is required'
    }
    if ('new_password' in fieldValues) {
      temp.new_password = fieldValues.new_password
        ? ''
        : 'This field is required'
      if (values.repeatNewPassword) {
        if (fieldValues.new_password === values.repeatNewPassword)
          temp.repeatNewPassword = ''
        else temp.repeatNewPassword = 'Passwords do not match.'
      }
    }

    if ('repeatNewPassword' in fieldValues) {
      if (values.new_password === fieldValues.repeatNewPassword)
        temp.repeatNewPassword = ''
      else temp.repeatNewPassword = 'Passwords do not match.'
    }
    setErrors({
      ...temp,
    })

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '')
  }

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    setNewPasswordFormData,
    true,
    validate,
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      changePassword()
      resetForm()
    }
  }
  return (
    <>
      <Dialog open={open} onClose={handleClose} className={classes.root}>
        <IconButton className={classes.closeBtn} onClick={handleClose}>
          <IoIosClose />
        </IconButton>
        <DialogTitle>Change Password</DialogTitle>
        <Divider />
        <DialogContent>
          <Form>
            <div className="form-control width-100">
              <div className="form-control-label text-align-left">Password</div>
              <Controls.Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={values.password}
                onChange={handleInputChange}
                placeholder="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setShowPassword((prev) => !prev)
                        }}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <HiOutlineLockClosed />
                    </InputAdornment>
                  ),
                }}
                error={errors.password}
              />
            </div>
            <div className="form-control width-100">
              <div className="form-control-label text-align-left">
                Set New Password
              </div>
              <Controls.Input
                type={showNewPassword ? 'text' : 'password'}
                name="new_password"
                value={values.new_password}
                onChange={handleInputChange}
                placeholder="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setShowNewPassword((prev) => !prev)
                        }}
                      >
                        {showNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <HiOutlineLockClosed />
                    </InputAdornment>
                  ),
                }}
                error={errors.new_password}
              />
            </div>
            <div className="form-control width-100">
              <div className="form-control-label text-align-left">
                Repeat New Password
              </div>
              <Controls.Input
                type={repeatNewPassword ? 'text' : 'password'}
                name="repeatNewPassword"
                value={values.repeatNewPassword}
                onChange={handleInputChange}
                placeholder="Password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => {
                          setRepeatNewPassword((prev) => !prev)
                        }}
                      >
                        {repeatNewPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                  startAdornment: (
                    <InputAdornment position="start">
                      <HiOutlineLockClosed />
                    </InputAdornment>
                  ),
                }}
                error={errors.repeatNewPassword}
              />
            </div>
          </Form>
        </DialogContent>
        <DialogActions>
          <Controls.Button
            size="large"
            onClick={(e) => {
              handleSubmit(e)
            }}
            className={classes.btn}
            text="Done"
            disabled={
              !values.password ||
              !values.new_password ||
              !values.repeatNewPassword
            }
          />
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ChangePasswordDialog

const useStyles = makeStyles({
  root: {
    '& .MuiTypography-h6': {
      fontSize: '1.5rem',
      fontWeight: 600,
      textAlign: 'center',
    },
    '& .MuiDialogContent-root': {
      color: '#333',
      fontSize: '1.125rem',
      textAlign: 'center',
    },
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  btn: {
    width: 'unset',
    margin: '0 auto 0.5rem',
  },
})
