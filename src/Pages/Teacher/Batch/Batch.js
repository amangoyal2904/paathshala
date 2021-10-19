import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import { makeStyles } from '@material-ui/core'
import Spinner from '../../../Components/Progress/Spinner'
import MyBatches from './MyBatches/MyBatches'
import BatchDetail from './BatchDetail/BatchDetail'
import { BatchContext } from '../../../Context/BatchContext'
import DashboardProfileCard from '../../../Components/Cards/DashboardProfileCard'
import Utilities from '../../Utitlities/Utitlities'
import { AuthContext } from '../../../Context/AuthContext'
import ComingSoonImage from '../../../Assets/Images/EbooksComingSoon.png'
import Navbar from '../../../Components/Navbar/Navbar'
import SideNav from '../../../Components/Navbar/SideNav/SideNav'
import StudentManagement from './StudentManagement/StudentManagement'
import AttendanceList from './Attendance/AttendanceList'
import ManageTimings from '../../ManageTimings/ManageTimings'
import MeetingLeftDialog from '../../../Components/Dialogs/MeetingLeftDialog'
import EditProfile from '../../UserManagement/EditProfile/EditProfile'
import NoticeBoard from './NoticeBoard/NoticeBoard'
import ComingSoon from '../../../Components/ComingSoon/ComingSoon'
import GrantPermissionDialog from '../../../Components/Dialogs/GrantPermissionDialog'

const Batch = () => {
  const history = useHistory()
  const { subroute, id } = useParams()
  const { isLoggedIn } = useContext(AuthContext)
  const location = useLocation()

  const [teacherFeebackData, setTeacherFeebackData] = useState({
    open: false,
    lectureId: null,
    openPermissions: false,
  })

  const { teacherBatches, setTeacherBatches, loading } =
    useContext(BatchContext)

  useEffect(() => {
    if (!isLoggedIn) {
      history.push({
        pathname: '/auth/login',
      })
    }
  }, [isLoggedIn, history])

  useEffect(() => {
    if (
      location.state === undefined ||
      location.state.feedback === undefined ||
      location.state.lectureId === undefined ||
      location.state.batchId === undefined ||
      location.state.showPermissions === undefined
    )
      return
    setTeacherFeebackData({
      open: location.state.feedback,
      lectureId: location.state.lectureId,
      batchId: location.state.batchId,
      openPermissions: location.state.showPermissions,
    })
  }, [location.state])

  useEffect(() => {
    if (
      subroute !== undefined &&
      subroute !== 'view' &&
      subroute !== 'notes' &&
      subroute !== 'ebooks' &&
      subroute !== 'students' &&
      subroute !== 'attendance' &&
      subroute !== 'editprofile' &&
      subroute !== 'timings' &&
      subroute !== 'notice'
    ) {
      history.push('/')
    }
    if (
      subroute !== undefined &&
      subroute !== 'editprofile' &&
      id === undefined
    ) {
      history.push('/')
    }
  }, [history, id, subroute])

  const getContent = () => {
    switch (subroute) {
      case undefined:
        if (loading || teacherBatches === undefined) {
          return <Spinner />
        }
        return (
          <>
            <DashboardProfileCard />
            <MyBatches
              setBatches={setTeacherBatches}
              batches={teacherBatches}
            />
          </>
        )

      case 'view':
        return <BatchDetail id={id} setBatches={setTeacherBatches} />

      case 'notes':
        return <Utilities title="Notes" id={id} />
      case 'ebooks':
        return (
          <ComingSoon
            id={id}
            src={ComingSoonImage}
            content="e-books coming Soon. You will be able to download and save books."
          />
        )
      case 'students':
        return <StudentManagement id={id} />
      case 'attendance':
        return <AttendanceList />
      case 'editprofile':
        return <EditProfile />
      case 'timings':
        return <ManageTimings id={id} />
      case 'notice':
        return <NoticeBoard id={id} />
      default:
        break
    }
  }

  const classes = useStyles()

  return (
    <>
      {subroute === undefined || subroute === 'editprofile' ? (
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
        open={teacherFeebackData.open}
        close={() => {
          setTeacherFeebackData({ ...teacherFeebackData, open: false })
          location.state.feedback = false
        }}
        lectureId={teacherFeebackData.lectureId}
        batchId={teacherFeebackData.batchId}
      />
      <GrantPermissionDialog
        open={teacherFeebackData.openPermissions}
        handleClose={() => {
          setTeacherFeebackData({
            ...teacherFeebackData,
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

export default Batch
