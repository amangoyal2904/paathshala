import {
  Avatar,
  Badge,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import React, { Fragment, useContext, useEffect, useState } from 'react'
import VideocamOutlinedIcon from '@material-ui/icons/VideocamOutlined'
import MicNoneOutlinedIcon from '@material-ui/icons/MicNoneOutlined'
import VideocamOffOutlinedIcon from '@material-ui/icons/VideocamOffOutlined'
import MicOffOutlinedIcon from '@material-ui/icons/MicOffOutlined'
import Spinner from '../Progress/Spinner'
import { BatchContext } from '../../Context/BatchContext'
import { AuthContext } from '../../Context/AuthContext'

const useStyles = makeStyles(() => ({
  onlineBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#5dd01a',
      bottom: 8,
      right: 4,
      boxShadow: '0px 0px 0px 1px rgba(255,255,255,1)',
      '-webkit-box-shadow': '0px 0px 0px 1px rgba(255,255,255,1)',
      '-moz-box-shadow': '0px 0px 0px 1px rgba(255,255,255,1)',
    },
  },
  offlineBadge: {
    '& .MuiBadge-badge': {
      backgroundColor: '#ff0000',
      bottom: 8,
      right: 4,
      boxShadow: '0px 0px 0px 1px rgba(255,255,255,1)',
      '-webkit-box-shadow': '0px 0px 0px 1px rgba(255,255,255,1)',
      '-moz-box-shadow': '0px 0px 0px 1px rgba(255,255,255,1)',
    },
  },
  teacherControls: {
    backgroundColor: '#f2f5ff',
    boxShadow: '0 -1px 4px 0 rgba(0, 0, 0, 0.1)',
    padding: '6px 0',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  controlText: {
    cursor: 'pointer',
    '&:hover': {
      textDecoration: 'underline',
    },
  },
  gridContainer: {
    height: '100%',
    width: 350,
  },
  heading: {
    backgroundColor: '#f2f5ff',
    color: '#333',
    fontSize: '1.25rem',
    padding: '0.5rem 1.125rem',
    fontWeight: 500,
    height: 44,
  },
  message: {
    padding: '0 0.5rem',
  },
  onlinePanelIcon: {
    padding: 6,
    margin: '0 6px',
  },
  studentBoxIcon: {
    padding: 6,
    margin: '0 6px 0 12px',
  },
}))

const ClassStudentList = ({
  id,
  remoteUsers,
  sendCommandToChannel,
  sendCommandToSpecificUser,
}) => {
  const classes = useStyles()
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [isError, setIsError] = useState(null)
  const [studentAVState, setStudentAVState] = useState({
    video: false,
    audio: false,
  })
  const [onlineUsers, setOnlineUsers] = useState([])
  const [offlineUsers, setOfflineUsers] = useState([])
  const { GetEnrolledStudentsInBatch } = useContext(BatchContext)
  const { authState } = useContext(AuthContext)

  useEffect(() => {
    async function getStudents() {
      const enrolledStudents = await GetEnrolledStudentsInBatch(id)
      setIsLoading(false)
      if (enrolledStudents) {
        setStudents(enrolledStudents)
      } else {
        setIsError('Cannot load enrolled students')
      }
    }
    getStudents()
  }, [])

  useEffect(() => {
    getOnlineAndOfflineUsers()
  }, [students, remoteUsers])

  const getOnlineAndOfflineUsers = () => {
    const onlineStudents = students.filter((student) =>
      remoteUsers.some((user) => user.uid === student.id),
    )
    if (authState.role === 'S') {
      const val = students.find((student) => student.id === authState.user_id)
      if (val) {
        onlineStudents.push(val)
      }
    }
    const offlineStudents = students.filter(
      (student) => !onlineStudents.includes(student),
    )
    setOnlineUsers(onlineStudents)
    setOfflineUsers(offlineStudents)
  }

  const isStudentMicOn = (userId) => {
    const result = remoteUsers.find((remoteUser) => remoteUser.uid === userId)
    if (result) return result.hasAudio
    return false
  }

  const isStudentCamOn = (userId) => {
    const result = remoteUsers.find((remoteUser) => remoteUser.uid === userId)
    if (result) return result.hasVideo
    return false
  }

  const turnOnAllCameras = () => {
    sendCommandToChannel('AGORA', 'CAM_ON')
    setStudentAVState({ ...studentAVState, video: true })
  }

  const turnOnAllMics = () => {
    sendCommandToChannel('AGORA', 'MIC_ON')
    setStudentAVState({ ...studentAVState, audio: true })
  }

  const turnOffAllCameras = () => {
    sendCommandToChannel('AGORA', 'CAM_OFF')
    setStudentAVState({ ...studentAVState, video: false })
  }

  const turnOffAllMics = () => {
    sendCommandToChannel('AGORA', 'MIC_OFF')
    setStudentAVState({ ...studentAVState, audio: false })
  }

  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <Grid container className={classes.gridContainer}>
            <Grid
              item
              style={{
                overflow: 'auto',
                height:
                  remoteUsers.length === 0 ||
                  remoteUsers.length > 16 ||
                  authState.role === 'S'
                    ? '100%'
                    : 'calc(100% - 64px)',
              }}
              xs={12}
            >
              <p className={classes.heading} style={{}}>
                Students
              </p>
              {Boolean(isError) && (
                <p
                  className={`${classes.message} secondary-text bold fine-text text-align-center`}
                >
                  {isError}
                </p>
              )}
              {!isError && students.length === 0 && (
                <p
                  className={`${classes.message} secondary-text bold fine-text text-align-center`}
                >
                  No students enrolled in this batch
                </p>
              )}
              {!isError && students.length > 0 && (
                <List>
                  {onlineUsers.map((student) => (
                    <Fragment key={student.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Badge
                            className={classes.onlineBadge}
                            variant="dot"
                            anchorOrigin={{
                              horizontal: 'right',
                              vertical: 'bottom',
                            }}
                          >
                            <Avatar
                              src={
                                student.profileImageUrl ||
                                'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png'
                              }
                            />
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText primary={student.name} />
                        {authState.role === 'T' && !isStudentMicOn(student.id) && (
                          <IconButton
                            className={classes.onlinePanelIcon}
                            onClick={() => {
                              sendCommandToSpecificUser(
                                student.id,
                                'AGORA',
                                'MIC_ON',
                              )
                            }}
                          >
                            <MicOffOutlinedIcon />
                          </IconButton>
                        )}
                        {authState.role === 'T' && isStudentMicOn(student.id) && (
                          <IconButton
                            className={classes.onlinePanelIcon}
                            onClick={() => {
                              sendCommandToSpecificUser(
                                student.id,
                                'AGORA',
                                'MIC_OFF',
                              )
                            }}
                          >
                            <MicNoneOutlinedIcon />
                          </IconButton>
                        )}
                        {authState.role === 'T' && !isStudentCamOn(student.id) && (
                          <IconButton
                            className={classes.onlinePanelIcon}
                            onClick={() => {
                              sendCommandToSpecificUser(
                                student.id,
                                'AGORA',
                                'CAM_ON',
                              )
                            }}
                          >
                            <VideocamOffOutlinedIcon />
                          </IconButton>
                        )}
                        {authState.role === 'T' && isStudentCamOn(student.id) && (
                          <IconButton
                            className={classes.onlinePanelIcon}
                            onClick={() => {
                              sendCommandToSpecificUser(
                                student.id,
                                'AGORA',
                                'CAM_OFF',
                              )
                            }}
                          >
                            <VideocamOutlinedIcon />
                          </IconButton>
                        )}
                      </ListItem>
                      <Divider />
                    </Fragment>
                  ))}
                  {offlineUsers.map((student) => (
                    <Fragment key={student.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Badge
                            className={classes.offlineBadge}
                            variant="dot"
                            anchorOrigin={{
                              horizontal: 'right',
                              vertical: 'bottom',
                            }}
                          >
                            <Avatar
                              src={
                                student.profileImageUrl ||
                                'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png'
                              }
                            />
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText primary={student.name} />
                      </ListItem>
                      <Divider />
                    </Fragment>
                  ))}
                </List>
              )}
            </Grid>
            {authState.role === 'T' &&
              remoteUsers.length > 0 &&
              remoteUsers.length <= 16 && (
                <Grid item xs={12}>
                  <Grid
                    container
                    alignItems="center"
                    justify="space-evenly"
                    className={classes.teacherControls}
                  >
                    <Grid item xs={7}>
                      {studentAVState.video ? (
                        <>
                          <IconButton
                            className={classes.studentBoxIcon}
                            onClick={turnOffAllCameras}
                          >
                            <VideocamOutlinedIcon />
                          </IconButton>
                          <span
                            role="button"
                            tabIndex="0"
                            className={`${classes.controlText} finer-text`}
                            onClick={turnOffAllCameras}
                            onKeyDown={turnOffAllCameras}
                          >
                            Turn off Camera for all
                          </span>
                        </>
                      ) : (
                        <>
                          <IconButton
                            className={classes.studentBoxIcon}
                            onClick={turnOnAllCameras}
                          >
                            <VideocamOffOutlinedIcon />
                          </IconButton>
                          <span
                            role="button"
                            tabIndex="0"
                            className={`${classes.controlText} finer-text`}
                            onClick={turnOnAllCameras}
                            onKeyDown={turnOnAllCameras}
                          >
                            Turn on Camera for all
                          </span>
                        </>
                      )}
                    </Grid>
                    <Grid item xs={5}>
                      {studentAVState.audio ? (
                        <>
                          <IconButton
                            className={classes.studentBoxIcon}
                            onClick={turnOffAllMics}
                          >
                            <MicNoneOutlinedIcon />
                          </IconButton>
                          <span
                            role="button"
                            tabIndex="0"
                            className={`${classes.controlText} finer-text`}
                            onClick={turnOffAllMics}
                            onKeyDown={turnOffAllMics}
                          >
                            Mute all
                          </span>
                        </>
                      ) : (
                        <>
                          <IconButton
                            className={classes.studentBoxIcon}
                            onClick={turnOnAllMics}
                          >
                            <MicOffOutlinedIcon />
                          </IconButton>
                          <span
                            role="button"
                            tabIndex="0"
                            className={`${classes.controlText} finer-text`}
                            onClick={turnOnAllMics}
                            onKeyDown={turnOnAllMics}
                          >
                            Unmute all
                          </span>
                        </>
                      )}
                    </Grid>
                  </Grid>
                </Grid>
              )}
            {authState.role === 'T' && remoteUsers.length > 16 && (
              <Grid item xs={12}>
                <Grid
                  container
                  alignItems="center"
                  justify="space-evenly"
                  className={classes.teacherControls}
                >
                  <Grid item xs={7}>
                    <>
                      <IconButton
                        className={classes.studentBoxIcon}
                        onClick={turnOffAllCameras}
                      >
                        <VideocamOutlinedIcon />
                      </IconButton>
                      <span
                        role="button"
                        tabIndex="0"
                        className={`${classes.controlText} finer-text`}
                        onClick={turnOffAllCameras}
                        onKeyDown={turnOffAllCameras}
                      >
                        Turn off Camera for all
                      </span>
                    </>
                  </Grid>
                  <Grid item xs={5}>
                    <>
                      <IconButton
                        className={classes.studentBoxIcon}
                        onClick={turnOffAllMics}
                      >
                        <MicNoneOutlinedIcon />
                      </IconButton>
                      <span
                        role="button"
                        tabIndex="0"
                        className={`${classes.controlText} finer-text`}
                        onClick={turnOffAllMics}
                        onKeyDown={turnOffAllMics}
                      >
                        Mute all
                      </span>
                    </>
                  </Grid>
                </Grid>
              </Grid>
            )}
          </Grid>
        </>
      )}
    </>
  )
}

export default ClassStudentList
