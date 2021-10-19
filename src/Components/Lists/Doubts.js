/* eslint-disable no-underscore-dangle */
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
import React, { useContext, Fragment, useState, useEffect } from 'react'
import MicOffIcon from '@material-ui/icons/MicOff'
import MicIcon from '@material-ui/icons/Mic'
import { useSnackbar } from 'notistack'
import { AgoraContext } from '../../Context/AgoraContext'
import { BatchContext } from '../../Context/BatchContext'
import Spinner from '../Progress/Spinner'
import Controls from '../Controls/Controls'
import BootstrapTooltip from '../Tooltips/BootstrapTooltip'
import showErrorSnackbar from '../Snackbar/errorSnackbar'

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
  gridContainer: {
    height: '100%',
    width: 350,
  },
  gridItem: {
    overflow: 'auto',
    height: 'calc(100% - 64px)',
  },
  heading: {
    backgroundColor: '#f2f5ff',
    color: '#333',
    fontSize: '1.25rem',
    padding: '0.5rem 1.125rem',
    fontWeight: 500,
    height: 44,
  },
  doubt: {
    padding: '0 0.5rem',
  },
  micIcon: {
    padding: 6,
  },
  resolveButton: {
    width: 'unset',
    backgroundImage: 'unset',
    border: '1px solid #979797',
  },
}))

const Doubts = ({ sendCommandToSpecificUser, id, remoteUsers }) => {
  const classes = useStyles()
  const { teacherDoubts, setTeacherDoubts, ResolveQuery } =
    useContext(AgoraContext)
  const { GetEnrolledStudentsInBatch } = useContext(BatchContext)
  const [isLoading, setIsLoading] = useState(true)
  const [students, setStudents] = useState([])
  const [isError, setIsError] = useState('')
  const { enqueueSnackbar } = useSnackbar()
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

  const isStudentOnline = (userId) => {
    const result = remoteUsers.find((remoteUser) => remoteUser.uid === userId)
    if (result) return true
    return false
  }

  const doubtInProgress = (uid) => {
    if (!isStudentOnline(uid)) {
      showErrorSnackbar(enqueueSnackbar, 'Student has gone offline')
      return
    }
    if (isMicrophoneMuted(uid)) {
      sendCommandToSpecificUser(uid, 'AGORA', 'MIC_ON')
    }
    sendCommandToSpecificUser(uid, 'DOUBT', 'ACCEPTED')
    setTeacherDoubts((tDoubts) => {
      const temp = tDoubts.find((tDoubt) => tDoubt.senderId === uid)
      const others = tDoubts.filter((tDoubt) => tDoubt.senderId !== uid)
      temp.state = 1
      return [...others, temp]
    })
  }

  const resolveDoubt = async (uid) => {
    const temp = teacherDoubts.find((tDoubt) => tDoubt.senderId === uid)
    await ResolveQuery(temp.id)
    if (!isMicrophoneMuted(uid))
      sendCommandToSpecificUser(uid, 'AGORA', 'MIC_OFF')
    sendCommandToSpecificUser(uid, 'DOUBT', 'CLEAR')
    setTeacherDoubts((tDoubts) => {
      const others = tDoubts.filter((tDoubt) => tDoubt.senderId !== uid)
      temp.state = 2
      return [...others, temp]
    })
  }

  const isMicrophoneMuted = (uid) => {
    const temp = remoteUsers.find((user) => user.uid === uid)
    if (temp) {
      return temp._audio_muted_
    }
    return false
  }
  return (
    <>
      {isLoading && <Spinner />}
      {!isLoading && (
        <>
          <Grid container className={classes.gridContainer}>
            <Grid item className={classes.gridItem} xs={12}>
              <p className={classes.heading}>Doubts</p>
              {Boolean(isError) && (
                <p
                  className={`${classes.doubt} secondary-text bold fine-text text-align-center`}
                >
                  {isError}
                </p>
              )}
              {!isError &&
                teacherDoubts.filter(
                  (doubt) => doubt.state === 0 || doubt.state === 1,
                ).length === 0 && (
                  <p
                    className={`${classes.doubt} secondary-text bold fine-text text-align-center`}
                  >
                    No students have raised a doubt
                  </p>
                )}
              {!isError && students.length > 0 && (
                <List>
                  {students.map((student) => {
                    const temp = teacherDoubts.find(
                      (tDoubt) => tDoubt.senderId === student.id,
                    )
                    if (temp !== undefined && temp.state !== 2) {
                      return (
                        <Fragment key={student.id}>
                          <ListItem>
                            <Grid container alignItems="center">
                              <Grid item xs={7}>
                                <Grid container alignItems="center">
                                  <Grid item xs={3}>
                                    <ListItemAvatar>
                                      <Badge
                                        className={classes.onlineBadge}
                                        variant="dot"
                                        invisible={!isStudentOnline(student.id)}
                                        anchorOrigin={{
                                          horizontal: 'right',
                                          vertical: 'bottom',
                                        }}
                                        badgeContent={2}
                                      >
                                        <Avatar
                                          src={
                                            student.profileImageUrl ||
                                            'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png'
                                          }
                                        />
                                      </Badge>
                                    </ListItemAvatar>
                                  </Grid>
                                  <Grid item xs={9}>
                                    <ListItemText primary={student.name} />
                                  </Grid>
                                </Grid>
                              </Grid>
                              <Grid item xs={5}>
                                <Grid
                                  container
                                  alignItems="center"
                                  justify="flex-end"
                                >
                                  {temp.state === 0 && (
                                    <Grid item xs={8}>
                                      <Controls.Button
                                        text="Accept"
                                        color="primary"
                                        size="small"
                                        onClick={() =>
                                          doubtInProgress(student.id)
                                        }
                                      />
                                    </Grid>
                                  )}
                                  <Grid item>
                                    <Grid container alignItems="center">
                                      <Grid item xs={4}>
                                        {temp.state === 1 &&
                                          isMicrophoneMuted(student.id) && (
                                            <BootstrapTooltip
                                              title="Grant Microphone Permissions"
                                              placement="top"
                                            >
                                              <IconButton
                                                onClick={() => {
                                                  sendCommandToSpecificUser(
                                                    student.id,
                                                    'AGORA',
                                                    'MIC_ON',
                                                  )
                                                }}
                                                className={classes.micIcon}
                                              >
                                                <MicOffIcon htmlColor="#333" />
                                              </IconButton>
                                            </BootstrapTooltip>
                                          )}
                                        {temp.state === 1 &&
                                          !isMicrophoneMuted(student.id) && (
                                            <BootstrapTooltip
                                              title="Revoke Microphone Permissions"
                                              placement="top"
                                            >
                                              <IconButton
                                                onClick={() => {
                                                  sendCommandToSpecificUser(
                                                    student.id,
                                                    'AGORA',
                                                    'MIC_OFF',
                                                  )
                                                }}
                                                className={classes.micIcon}
                                              >
                                                <MicIcon htmlColor="#333" />
                                              </IconButton>
                                            </BootstrapTooltip>
                                          )}
                                      </Grid>
                                      <Grid item xs={8}>
                                        {temp.state === 1 && (
                                          <Controls.Button
                                            text="Mark Resolved"
                                            color="primary"
                                            size="small"
                                            className={classes.resolveButton}
                                            onClick={() =>
                                              resolveDoubt(student.id)
                                            }
                                          />
                                        )}
                                      </Grid>
                                    </Grid>
                                  </Grid>
                                </Grid>
                              </Grid>
                            </Grid>
                          </ListItem>
                          <Divider />
                        </Fragment>
                      )
                    }
                    return <></>
                  })}
                </List>
              )}
            </Grid>
          </Grid>
        </>
      )}
    </>
  )
}

export default Doubts
