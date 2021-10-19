import React, { useState, useEffect, useContext } from 'react'
import { IconButton, InputAdornment } from '@material-ui/core'
import { Visibility, VisibilityOff } from '@material-ui/icons'
import { HiOutlineLockClosed } from 'react-icons/hi'
import { CgArrowLongRight } from 'react-icons/cg'
import Controls from '../../../../../Components/Controls/Controls'
import Form from '../../../../../Components/Form/Form'
import { AuthContext } from '../../../../../Context/AuthContext'
import Spinner from '../../../../../Components/Progress/Spinner'

const Step2 = ({
  values,
  handleInputChange,
  errors,
  handleSubmit,
  registrationLoading,
  registrationComplete,
}) => {
  const [showCreatePassword, setShowCreatePassword] = useState(false)
  const [showRepeatPassword, setShowRepeatPassword] = useState(false)
  const { SetFeatures } = useContext(AuthContext)
  useEffect(() => {
    SetFeatures(
      'create_password',
      'To create a strong password try adding At least 8 characters with mixture of both uppercase and lowercase letters',
    )
  }, [])

  return (
    <>
      <div>
        <Form onSubmit={(e) => handleSubmit(e)}>
          <div className="form-control width-100">
            <div className="form-control-label">Create Password</div>
            <Controls.Input
              placeholder="Create Password"
              type={showCreatePassword ? 'text' : 'password'}
              name="createPassword"
              value={values.createPassword}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowCreatePassword((prev) => !prev)
                      }}
                    >
                      {showCreatePassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <HiOutlineLockClosed />
                  </InputAdornment>
                ),
              }}
              error={errors.createPassword}
            />
          </div>
          <div className="form-control width-100">
            <div className="form-control-label">Repeat Password</div>
            <Controls.Input
              placeholder="Repeat Password"
              type={showRepeatPassword ? 'text' : 'password'}
              name="repeatPassword"
              value={values.repeatPassword}
              onChange={handleInputChange}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => {
                        setShowRepeatPassword((prev) => !prev)
                      }}
                    >
                      {showRepeatPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
                startAdornment: (
                  <InputAdornment position="start">
                    <HiOutlineLockClosed />
                  </InputAdornment>
                ),
              }}
              error={errors.repeatPassword}
            />
          </div>
          <div className="form-control width-100">
            <Controls.Button
              type="submit"
              startIcon={
                registrationLoading && (
                  <Spinner
                    size={20}
                    className="margin-left-unset position-unset"
                    color="inherit"
                  />
                )
              }
              endIcon={<CgArrowLongRight />}
              disabled={
                !(
                  !errors.name &&
                  !errors.email &&
                  !errors.role &&
                  !errors.createPassword &&
                  !errors.repeatPassword &&
                  values.createPassword &&
                  values.repeatPassword
                ) ||
                registrationLoading ||
                registrationComplete
              }
            >
              Save Password
            </Controls.Button>
          </div>
        </Form>
      </div>
    </>
  )
}

export default Step2
