import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core/styles'
import Spinner from '../../Components/Progress/Spinner'
import Navbar from '../../Components/Navbar/Navbar'
import SideNav from '../../Components/Navbar/SideNav/SideNav'
import { BatchContext } from '../../Context/BatchContext'
import ComingSoonImage from '../../Assets/Images/EbooksComingSoon.png'
import DashboardProfileCard from '../../Components/Cards/DashboardProfileCard'
import { AuthContext } from '../../Context/AuthContext'
import StudentBatches from './StudentBatches'
import StudentBatchDetail from './StudentBatchDetail'
import Utilities from '../Utitlities/Utitlities'
import StudentAttendance from './Attendance/StudentAttendance'
import MeetingLeftDialog from '../../Components/Dialogs/MeetingLeftDialog'
import RateTeacherDialog from '../../Components/Dialogs/RateTeacherDialog'
import EditProfile from '../UserManagement/EditProfile/EditProfile'
import ComingSoon from '../../Components/ComingSoon/ComingSoon'
import GrantPermissionDialog from '../../Components/Dialogs/GrantPermissionDialog'

const Student = () => {
  const history = useHistory()
  const location = useLocation()
  const { subroute, id } = useParams()
  const { isLoggedIn } = useContext(AuthContext)
  const { allReqAndBatches, loading, setBatchByCode } = useContext(BatchContext)
  const [studentFeedbackData, setStudentFeedbackData] = useState({
    open: false,
    lectureId: null,
    openPermissions: false,
  })

  const [rateTeacher, setRateTeacher] = useState(false)

  const classes = useStyles()
  useEffect(() => {
    if (
      location.state === undefined ||
      location.state.feedback === undefined ||
      location.state.lectureId === undefined ||
      location.state.showPermissions === undefined
    ) {
      return
    }
    if (!location.state.feedback && !location.state.showPermissions) {
      setRateTeacher(true)
    }
    setStudentFeedbackData({
      open: location.state.feedback,
      lectureId: location.state.lectureId,
      batchId: location.state.batchId,
      openPermissions: location.state.showPermissions,
    })
  }, [location.state])

  useEffect(() => {
    if (!isLoggedIn) {
      history.push({
        pathname: '/auth/login',
      })
    }
  }, [isLoggedIn, history])

  useEffect(() => {
    if (
      subroute !== undefined &&
      subroute !== 'view' &&
      subroute !== 'notes' &&
      subroute !== 'ebooks' &&
      subroute !== 'editprofile' &&
      subroute !== 'attendance' &&
      subroute !== 'timings'
    ) {
      history.push('/')
    }
    if (subroute === 'view' && !id) {
      history.push('/')
    }
  }, [history, id, subroute])

  const getContent = () => {
    switch (subroute) {
      case undefined:
        if (loading || allReqAndBatches === undefined) {
          return <Spinner />
        }
        return (
          <>
            <DashboardProfileCard />
            <StudentBatches
              allReqAndBatches={allReqAndBatches}
              setBatchByCode={setBatchByCode}
            />
          </>
        )

      case 'view':
        return <StudentBatchDetail id={id} />
      case 'notes':
        return <Utilities id={id} />
      case 'ebooks':
        return (
          <ComingSoon
            id={id}
            src={ComingSoonImage}
            content="e-books coming Soon. You will be able to download and save books."
          />
        )
      case 'editprofile':
        return <EditProfile />
      case 'attendance':
        return <StudentAttendance id={id} />
      default:
        break
    }
  }

  return (
    <>
      {subroute === undefined ||
      subroute === 'join' ||
      subroute === 'editprofile' ? (
        <>
          <Navbar />
          {getContent()}
        </>
      ) : (
        <>
          <SideNav batchId={id} route={subroute} />
          <div className={classes.content}>
            <Navbar />
            {getContent()}
          </div>
        </>
      )}
      <MeetingLeftDialog
        open={studentFeedbackData.open}
        close={() => {
          setStudentFeedbackData({ ...studentFeedbackData, open: false })
          location.state.feedback = false
          setRateTeacher(true)
        }}
        lectureId={studentFeedbackData.lectureId}
        batchId={studentFeedbackData.batchId}
      />
      <RateTeacherDialog
        open={rateTeacher}
        close={() => setRateTeacher(false)}
        lectureId={studentFeedbackData.lectureId}
      />
      <GrantPermissionDialog
        open={studentFeedbackData.openPermissions}
        handleClose={() => {
          setStudentFeedbackData({
            ...studentFeedbackData,
            openPermissions: false,
          })
          location.state.showPermissions = false
        }}
      />
    </>
  )
}

const drawerWidth = 240

const useStyles = makeStyles(() => ({
  content: {
    marginLeft: drawerWidth,
  },
}))

export default Student
