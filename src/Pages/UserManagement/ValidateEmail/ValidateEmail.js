import { useSnackbar } from 'notistack'
import React, { useContext, useEffect, useCallback } from 'react'
import { useHistory, useLocation } from 'react-router-dom'
import Spinner from '../../../Components/Progress/Spinner'
import showErrorSnackbar from '../../../Components/Snackbar/errorSnackbar'
import showSuccessSnackbar from '../../../Components/Snackbar/successSnackbar'
import { AuthContext } from '../../../Context/AuthContext'

const ValidateEmail = () => {
  const location = useLocation()
  const history = useHistory()
  const token = location.search.split('=')[1]
  const { VerifyEmail, authState } = useContext(AuthContext)
  const { enqueueSnackbar } = useSnackbar()
  const verifyToken = useCallback(
    async (t) => {
      const { data } = await VerifyEmail(t)
      if (data === 200) {
        history.push({
          pathname: '/auth/email-verified',
          state: {
            verified: true,
          },
        })
      } else if (data === 400) {
        showErrorSnackbar(
          enqueueSnackbar,
          'Your verification token has expired!',
        )
        history.push('/')
      } else {
        showErrorSnackbar(enqueueSnackbar, 'We could not verify you!')
        history.push('/')
      }
    },
    [token],
  )
  useEffect(() => {
    if (location.search === '') {
      showErrorSnackbar(enqueueSnackbar, 'Verification Token Invalid')
      history.push('/')
    } else if (!authState.is_email_verified && token) {
      verifyToken(token)
    } else {
      showSuccessSnackbar(
        enqueueSnackbar,
        'You have already verified you email!',
      )
      history.push('/')
    }
  }, [])
  return (
    <>
      <Spinner />
    </>
  )
}

export default ValidateEmail
