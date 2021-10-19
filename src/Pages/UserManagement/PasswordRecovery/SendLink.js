import React, { useContext, useEffect } from 'react'
import { useHistory } from 'react-router-dom'
import { createStyles, IconButton, makeStyles } from '@material-ui/core'
import { IoIosArrowBack } from 'react-icons/io'
import Form from '../../../Components/Form/Form'
import Controls from '../../../Components/Controls/Controls'
import useForm from '../../../Hooks/useForm'
import { AuthContext } from '../../../Context/AuthContext'

const SendLink = () => {
  const classes = useStyles()
  const sendLinkFormData = {
    email: '',
  }
  const { RequestResetPassword, isLoggedIn } = useContext(AuthContext)
  const history = useHistory()
  useEffect(() => {
    if (isLoggedIn) {
      history.push({
        pathname: '/',
      })
    }
  }, [isLoggedIn, history])

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
    sendLinkFormData,
    true,
    validate,
  )

  const handleSubmit = (e) => {
    e.preventDefault()
    if (validate()) {
      RequestResetPassword({ ...values, email: values.email.toLowerCase() })
    }
  }

  return (
    <div className="container">
      <IconButton
        onClick={() => {
          history.push('/auth/login')
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
          <div className="pd-top-30 pd-bottom-30">
            <p className="fine-text">
              Enter your registered email below to recieve the password reset
              link
            </p>
          </div>
        </div>
        <Form onSubmit={handleSubmit}>
          <div className="form-control width-100">
            <div className="form-control-label bold">Email ID</div>
            <Controls.Input
              value={values.email}
              onChange={handleInputChange}
              name="email"
              autoFocus
              placeholder="Email"
              error={errors.email}
            />
          </div>
          <Controls.Button type="submit" text="SEND LINK" />
        </Form>
      </div>
    </div>
  )
}

export default SendLink

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
  }),
)
