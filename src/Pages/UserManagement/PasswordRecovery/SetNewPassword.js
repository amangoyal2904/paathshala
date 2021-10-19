import React, { useEffect, useRef, useContext } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import { IoIosArrowBack } from 'react-icons/io'
import Controls from '../../../Components/Controls/Controls'
import Form from '../../../Components/Form/Form'
import useForm from '../../../Hooks/useForm'
import { AuthContext } from '../../../Context/AuthContext'

const SetNewPassword = () => {
  const classes = useStyles()
  const token = useRef()
  const location = useLocation()
  const history = useHistory()

  useEffect(() => {
    // eslint-disable-next-line prefer-destructuring
    token.current = location.search.split('=')[1]
  }, [])

  const setNewPasswordFormData = {
    setNewPassword: '',
    repeatNewPassword: '',
  }
  const { ResetPassword } = useContext(AuthContext)

  const validate = (fieldValues = values) => {
    const temp = { ...errors }
    if ('setNewPassword' in fieldValues) {
      temp.setNewPassword = fieldValues.setNewPassword
        ? ''
        : 'This field is required.'
      if (values.repeatNewPassword) {
        if (fieldValues.setNewPassword === values.repeatNewPassword)
          temp.repeatNewPassword = ''
        else temp.repeatNewPassword = 'Passwords do not match.'
      }
    }

    if ('repeatNewPassword' in fieldValues) {
      if (values.setNewPassword === fieldValues.repeatNewPassword)
        temp.repeatNewPassword = ''
      else temp.repeatNewPassword = 'Passwords do not match.'
    }
    setErrors({
      ...temp,
    })

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '')
  }

  const { values, errors, setErrors, handleInputChange } = useForm(
    setNewPasswordFormData,
    true,
    validate,
  )

  async function handleSubmit(e) {
    e.preventDefault()
    if (validate()) {
      const currentStatus = await ResetPassword(
        { ...values, setNewPassword: values.setNewPassword },
        token.current,
      )
      if (currentStatus) {
        setTimeout(() => {
          history.push('/auth/login')
        }, 3000)
      }
    }
  }

  return (
    <div className="container">
      <IconButton
        onClick={() => {
          history.push('/auth/recovery/sendlink')
        }}
      >
        <IoIosArrowBack />
      </IconButton>
      <div className="flex-column">
        <div className="flex-column">
          <div>
            <p className={classes.headText}>
              <span className={classes.span}>Forgot Password</span>
            </p>
          </div>
          <div>
            <p className={classes.text}>
              Let&apos;s set a new password to secure your account
            </p>
          </div>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="form-control width-100">
            <div className="form-control-label bold">Set New Password</div>
            <Controls.Input
              type="password"
              value={values.setNewPassword}
              onChange={handleInputChange}
              autoFocus
              placeholder="New Password"
              name="setNewPassword"
              error={errors.setNewPassword}
            />
          </div>
          <div className="form-control width-100">
            <div className="form-control-label bold">Repeat New Password</div>
            <Controls.Input
              type="password"
              value={values.repeatNewPassword}
              onChange={handleInputChange}
              placeholder="New Password"
              name="repeatNewPassword"
              error={errors.repeatNewPassword}
            />
          </div>
          <Controls.Button type="submit" text="Reset Password" />
        </Form>
      </div>
    </div>
  )
}

export default SetNewPassword

const useStyles = makeStyles(() =>
  createStyles({
    span: {
      color: '#6480e4',
      fontWeight: 600,
      position: 'relative',
      '&::after': {
        content: '""',
        width: '78px',
        height: '4px',
        backgroundColor: '#6480e4',
        borderRadius: 2,
        position: 'absolute',
        top: 45,
        left: 0,
      },
    },
    headText: {
      fontSize: '1.75rem',
    },
    text: {
      fontSize: '0.9rem',
      marginTop: '1rem',
      color: '#666',
      marginBottom: '2rem',
    },
  }),
)
