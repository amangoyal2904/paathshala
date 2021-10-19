import React, { useContext, useEffect, useState } from 'react'
import { Grid, makeStyles, useMediaQuery } from '@material-ui/core'
import MediaPlayer from './MediaPlayer'
import useWindowDimensions from '../../Hooks/useWindowDimensions'
import { BatchContext } from '../../Context/BatchContext'
import { AuthContext } from '../../Context/AuthContext'
import { AgoraContext } from '../../Context/AgoraContext'

const useStyles = makeStyles({
  videoContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
  },
})

const TeacherVideoContainer = ({
  remoteUsers,
  enrolledStudents,
  localAudioTrack,
  localVideoTrack,
  isAudioMuted,
  isVideoMuted,
  sendCommandToSpecificUser,
  isScreenShared,
  stopScreenShare,
}) => {
  const classes = useStyles()
  const { height, width } = useWindowDimensions()
  const matches = useMediaQuery('(min-width:600px)')
  const [videoHeight, setVideoHeight] = useState('100%')
  const [videoWidth, setVideoWidth] = useState('100%')
  const [gridWidth, setGridWidth] = useState(3)
  const { batchByCode } = useContext(BatchContext)
  const { authState } = useContext(AuthContext)
  const { currentSpeakers } = useContext(AgoraContext)

  const getName = (id) => {
    const result = enrolledStudents.find((student) => student.id === id)
    if (result) {
      return result.name
    }
    if (batchByCode.owner === id) {
      return 'Teacher'
    }
    return 'Guest'
  }

  const getNumberOfUsers = () => {
    const activeUsers = remoteUsers.filter((user) => {
      if (user.hasVideo) return true
      return false
    }).length

    if (activeUsers > 0) {
      setGridWidth(3)
    } else {
      setGridWidth(0)
    }
    return activeUsers
  }

  const setHeight = () => {
    const usersInCall = getNumberOfUsers()
    const heightWithoutNavAndControls = matches
      ? height - 128 - 12
      : height - 112 - 12
    const internalWidth = 3 * (width / 12)
    if (usersInCall <= 1) {
      setVideoHeight(internalWidth - 12)
    } else if (usersInCall <= 2) {
      setVideoHeight(heightWithoutNavAndControls / 2)
    } else if (usersInCall <= 3) {
      setVideoHeight(heightWithoutNavAndControls / 3)
    } else if (usersInCall <= 4) {
      setVideoHeight(heightWithoutNavAndControls / 4)
    } else if (usersInCall <= 6) {
      setVideoHeight(heightWithoutNavAndControls / 3)
    } else if (usersInCall <= 8) {
      setVideoHeight(heightWithoutNavAndControls / 4)
    } else if (usersInCall <= 12) {
      setVideoWidth(heightWithoutNavAndControls / 3)
    } else if (usersInCall <= 16) {
      setVideoWidth(heightWithoutNavAndControls / 4)
    }
  }

  const setWidth = () => {
    const usersInCall = getNumberOfUsers()
    const internalWidth = 3 * (width / 12) - 12
    if (usersInCall <= 4) {
      setVideoWidth(internalWidth)
    } else if (usersInCall <= 8) {
      setVideoWidth(internalWidth / 2)
    } else if (usersInCall <= 12) {
      setVideoWidth(internalWidth / 3)
    } else {
      setVideoWidth(internalWidth / 4)
    }
  }

  useEffect(() => {
    setHeight()
    setWidth()
  }, [remoteUsers])

  const getMainDisplayContent = () => {
    if (
      remoteUsers.filter((user) => {
        if (user.hasAudio || user.hasVideo) return true
        return false
      }).length > 0
    ) {
      return (
        <div className={classes.videoContainer}>
          <Grid container>
            <Grid item xs={12 - gridWidth}>
              <MediaPlayer
                videoTrack={localVideoTrack}
                audioTrack={localAudioTrack}
                trackType="local"
                stopScreenShare={stopScreenShare}
                isScreenShared={isScreenShared}
                name={authState.name}
                key={authState.user_id}
                isVideoEnabled={isScreenShared ? true : !isVideoMuted}
                isAudioEnabled={!isAudioMuted}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'relative',
                  margin: 'auto auto',
                }}
              />
            </Grid>
            <Grid item xs={gridWidth > 0 ? gridWidth : false}>
              <div
                className={classes.videoContainer}
                style={{ justifyContent: 'space-evenly', alignItems: 'center' }}
              >
                {remoteUsers.map((user) => {
                  if (currentSpeakers.includes(user.uid)) {
                    return (
                      <MediaPlayer
                        videoTrack={user.videoTrack}
                        audioTrack={user.audioTrack}
                        trackType="remote"
                        name={getName(user.uid)}
                        uid={user.uid}
                        key={user.uid}
                        sendCommandToSpecificUser={sendCommandToSpecificUser}
                        isVideoEnabled={user.hasVideo}
                        isAudioEnabled={user.hasAudio}
                        role={authState.role}
                        style={{
                          width: user.hasVideo ? videoWidth : 0,
                          height: user.hasVideo ? videoHeight : 0,
                          position: 'relative',
                          display: user.hasVideo ? 'inherit' : 'none',
                        }}
                      />
                    )
                  }
                  return <></>
                })}
                {remoteUsers.map(
                  (user) =>
                    (user.hasAudio || user.hasVideo) &&
                    !currentSpeakers.includes(user.uid) && (
                      <MediaPlayer
                        videoTrack={user.videoTrack}
                        audioTrack={user.audioTrack}
                        trackType="remote"
                        name={getName(user.uid)}
                        uid={user.uid}
                        key={user.uid}
                        sendCommandToSpecificUser={sendCommandToSpecificUser}
                        isVideoEnabled={user.hasVideo}
                        isAudioEnabled={user.hasAudio}
                        role={authState.role}
                        style={{
                          width: user.hasVideo ? videoWidth : 0,
                          height: user.hasVideo ? videoHeight : 0,
                          position: 'relative',
                          display: user.hasVideo ? 'inherit' : 'none',
                        }}
                      />
                    ),
                )}
              </div>
            </Grid>
          </Grid>
        </div>
      )
    }
    return (
      <div className={classes.videoContainer}>
        <Grid container>
          <Grid item xs={12}>
            <MediaPlayer
              videoTrack={localVideoTrack}
              audioTrack={localAudioTrack}
              trackType="local"
              stopScreenShare={stopScreenShare}
              isScreenShared={isScreenShared}
              name={authState.name}
              key={authState.user_id}
              isVideoEnabled={isScreenShared ? true : !isVideoMuted}
              isAudioEnabled={!isAudioMuted}
              style={{
                width: '100%',
                height: '100%',
                position: 'relative',
                margin: 'auto auto',
              }}
            />
          </Grid>
        </Grid>
      </div>
    )
  }
  return <>{getMainDisplayContent()}</>
}

export default TeacherVideoContainer
