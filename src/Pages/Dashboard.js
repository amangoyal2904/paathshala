import React, { useContext, useEffect, Suspense, lazy, useState } from 'react'
import { Route, Switch } from 'react-router-dom'
import Spinner from '../Components/Progress/Spinner'
import { AuthContext } from '../Context/AuthContext'
import { BatchContext } from '../Context/BatchContext'
import VerifyEmailDialog from '../Components/Dialogs/VerifyEmailDialog'

const ClassPage = lazy(() => import('./Class/ClassPage'))
const Batch = lazy(() => import('./Teacher/Batch/Batch'))
const Student = lazy(() => import('./Student/Student'))

const Dashboard = () => {
  const { authState } = useContext(AuthContext)
  const { GetTeacherBatches, getAllReqAndBatches, setTeacherBatches } =
    useContext(BatchContext)

  const [openVerifyEmailDialog, setOpenVerifyEmailDialog] = useState(false)

  const handleOpenVerifyEmailDialog = () => {
    setOpenVerifyEmailDialog(true)
  }

  const handleCloseVerifyEmailDialog = () => {
    setOpenVerifyEmailDialog(false)
  }

  useEffect(() => {
    if (!authState.is_email_verified) {
      handleOpenVerifyEmailDialog()
    }
  }, [])

  useEffect(() => {
    if (authState.role === 'S' && authState.is_email_verified) {
      getAllReqAndBatches()
    } else if (authState.role === 'T') {
      if (authState.is_email_verified) {
        GetTeacherBatches()
      } else {
        setTeacherBatches([])
      }
    }
  }, [authState.role])

  return (
    <>
      {authState.role === 'T' ? (
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/dashboard/class/:id" component={ClassPage} />
            <Route path="/dashboard/:subroute/:id" component={Batch} />
            <Route path="/dashboard/:subroute" component={Batch} />
            <Route path="/dashboard" component={() => <Batch />} />
          </Switch>
        </Suspense>
      ) : (
        <Suspense fallback={<Spinner />}>
          <Switch>
            <Route path="/dashboard/class/:id" component={ClassPage} />
            <Route path="/dashboard/:subroute/:id" component={Student} />
            <Route path="/dashboard/:subroute" component={Student} />
            <Route path="/dashboard" component={Student} />
          </Switch>
        </Suspense>
      )}
      {openVerifyEmailDialog && (
        <VerifyEmailDialog
          open={openVerifyEmailDialog}
          close={handleCloseVerifyEmailDialog}
          email={authState.email}
          sendOTP
        />
      )}
    </>
  )
}

export default Dashboard
