import React, { useEffect, useContext } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Divider, InputAdornment } from '@material-ui/core'
import { HiOutlineMail } from 'react-icons/hi'
import { IoPersonCircleOutline } from 'react-icons/io5'
import { CgArrowLongRight } from 'react-icons/cg'
import { AuthContext } from '../../../../../Context/AuthContext'
import GoogleRegisterBtn from './GoogleRegisterBtn'
import Controls from '../../../../../Components/Controls/Controls'
import Form from '../../../../../Components/Form/Form'

const Step1 = ({
  values,
  handleInputChange,
  errors,
  goToNextStep,
  role,
  setRole,
}) => {
  const classes = useStyles()
  const { SetFeatures } = useContext(AuthContext)
  useEffect(() => {
    SetFeatures(
      'register',
      'The Next Generation Online Teaching & Learning Platforms',
    )
  }, [])

  return (
    <>
      <Form>
        <div className="form-control-label">I am a</div>
        <div className={classes.role_Select}>
          <div
            role="button"
            tabIndex="0"
            className={role === 'T' ? classes.selected_div : classes.select_div}
            onClick={() => {
              setRole('T')
            }}
            onKeyDown={() => {
              setRole('T')
            }}
          >
            Teacher
          </div>
          <div
            role="button"
            tabIndex="0"
            className={role === 'S' ? classes.selected_div : classes.select_div}
            onClick={() => {
              setRole('S')
            }}
            onKeyDown={() => {
              setRole('S')
            }}
          >
            Student
          </div>
        </div>
        {role === '' && (
          <div>
            <p className="fine-text red">Please Select a Role</p>
          </div>
        )}
        <GoogleRegisterBtn role={role} />
        <div className="margin-bottom-30 margin-top-30">
          <Divider variant="fullWidth" />
        </div>
        <div className="form-control width-100">
          <div className="form-control-label">What&apos;s your full name?</div>
          <Controls.Input
            placeholder="Name"
            type="text"
            value={values.name}
            onChange={handleInputChange}
            name="name"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoPersonCircleOutline />
                </InputAdornment>
              ),
            }}
            error={errors.name}
          />
        </div>

        <div className="form-control width-100">
          <div className="form-control-label">What&apos;s your email?</div>
          <Controls.Input
            placeholder="Email"
            type="text"
            value={values.email}
            onChange={handleInputChange}
            name="email"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <HiOutlineMail />
                </InputAdornment>
              ),
            }}
            error={errors.email}
          />
        </div>
        <div className="form-control width-100">
          {role === '' ? (
            <Controls.Button
              type="button"
              text="Register"
              endIcon={<CgArrowLongRight />}
              onClick={goToNextStep}
              disabled
            />
          ) : (
            <Controls.Button
              type="button"
              text="Register"
              endIcon={<CgArrowLongRight />}
              onClick={goToNextStep}
              disabled={
                !(
                  !errors.name &&
                  !errors.email &&
                  !errors.role &&
                  values.name &&
                  values.email &&
                  values.role
                )
              }
            />
          )}
        </div>
      </Form>
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    role_Select: {
      display: 'flex',
      margin: '10px 0px',
    },
    select_div: {
      width: '100%',
      textAlign: 'center',
      margin: '0 10px',
      borderRadius: 3.8,
      paddingBlock: 10,
      '&:hover': {
        cursor: 'pointer',
      },
      border: 'solid 0.5px #818181',
      color: '#818181',
    },
    selected_div: {
      width: '100%',
      color: '#fff',
      textAlign: 'center',
      fontWeight: 500,
      margin: '0 10px',
      borderRadius: 3.8,
      padding: '10px 0px',
      boxShadow: '0 3px 7px 2px rgba(255, 176, 49, 0.45)',
      backgroundColor: '#ffb031',
      '&:hover': {
        cursor: 'pointer',
        boxShadow: '0 3px 7px 2px rgba(255, 176, 49, 0.45)',
      },
    },
  }),
)

export default Step1
