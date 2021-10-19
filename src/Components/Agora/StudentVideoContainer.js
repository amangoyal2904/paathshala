/* eslint-disable no-underscore-dangle */
import { makeStyles } from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { Rnd } from 'react-rnd'
import { AgoraContext } from '../../Context/AgoraContext'
import { AuthContext } from '../../Context/AuthContext'
import { BatchContext } from '../../Context/BatchContext'
import useWindowDimensions from '../../Hooks/useWindowDimensions'
import MediaPlayer from './MediaPlayer'
import WaitForTeacher from './WaitForTeacher'

const useStyles = makeStyles({
  videoContainer: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    position: 'relative',
  },
})

const StudentVideoContainer = ({
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
  const { height } = useWindowDimensions()
  const [studentVideoDimensions, setStudentVideoDimensions] = useState({
    height: height / 4,
    width: height / 4,
  })
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

  const onStudentBoxResize = (e, direction, ref) => {
    setStudentVideoDimensions({
      width: ref.offsetWidth,
      height: ref.offsetHeight,
    })
  }

  const getMainDisplayContent = () => {
    const val = remoteUsers.find((user) => user.uid === batchByCode.owner)
    if (val) {
      return (
        <div className={classes.videoContainer}>
          <MediaPlayer
            videoTrack={val.videoTrack}
            audioTrack={val.audioTrack}
            trackType="remote"
            name={batchByCode.owner_name}
            key={batchByCode.owner}
            isVideoEnabled={val.hasVideo}
            isAudioEnabled={val.hasAudio}
            style={{
              width: '100%',
              height: '100%',
              position: 'relative',
              margin: 'auto auto',
            }}
          />
          <Rnd
            size={{
              width: studentVideoDimensions.width,
              height: studentVideoDimensions.height,
            }}
            bounds="parent"
            onResize={onStudentBoxResize}
          >
            {(localAudioTrack._enabled || localVideoTrack._enabled) && (
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
                  boxShadow: '2px 4px 6px 2px rgb(0 0 0 / 6%)',
                }}
              />
            )}
          </Rnd>

          {remoteUsers.map((user) => {
            if (
              currentSpeakers.includes(user.uid) &&
              user.uid !== batchByCode.owner
            ) {
              return (
                <MediaPlayer
                  videoTrack={user.videoTrack}
                  audioTrack={user.audioTrack}
                  trackType="remote"
                  name={getName(user.uid)}
                  uid={user.uid}
                  key={user.uid}
                  sendCommandToSpecificUser={sendCommandToSpecificUser}
                  isVideoEnabled={false}
                  isAudioEnabled={user.hasAudio}
                  role={authState.role}
                  style={{
                    width: 0,
                    height: 0,
                    position: 'relative',
                    margin: 'auto auto',
                    display: 'none',
                  }}
                />
              )
            }
            return <></>
          })}
          {remoteUsers.map(
            (user) =>
              user.hasAudio &&
              user.uid !== batchByCode.owner &&
              !currentSpeakers.includes(user.uid) && (
                <MediaPlayer
                  videoTrack={user.videoTrack}
                  audioTrack={user.audioTrack}
                  trackType="remote"
                  name={getName(user.uid)}
                  uid={user.uid}
                  key={user.uid}
                  sendCommandToSpecificUser={sendCommandToSpecificUser}
                  isVideoEnabled={false}
                  isAudioEnabled={user.hasAudio}
                  role={authState.role}
                  style={{
                    width: 0,
                    height: 0,
                    position: 'relative',
                    margin: 'auto auto',
                    display: 'none',
                  }}
                />
              ),
          )}
        </div>
      )
    }
    return (
      <div className={classes.videoContainer}>
        <Rnd
          size={{
            width: studentVideoDimensions.width,
            height: studentVideoDimensions.height,
          }}
          bounds="parent"
          onResize={onStudentBoxResize}
        >
          {(localAudioTrack._enabled || localVideoTrack._enabled) && (
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
                boxShadow: '2px 4px 6px 2px rgb(0 0 0 / 6%)',
              }}
            />
          )}
        </Rnd>

        <WaitForTeacher />
        {remoteUsers.map(
          (user) =>
            user.hasAudio &&
            user.uid !== batchByCode.owner && (
              <MediaPlayer
                videoTrack={user.videoTrack}
                audioTrack={user.audioTrack}
                trackType="remote"
                name={getName(user.uid)}
                uid={user.uid}
                key={user.uid}
                sendCommandToSpecificUser={sendCommandToSpecificUser}
                isVideoEnabled={false}
                isAudioEnabled={user.hasAudio}
                role={authState.role}
                style={{
                  width: 0,
                  height: 0,
                  position: 'relative',
                  margin: 'auto auto',
                  display: 'none',
                }}
              />
            ),
        )}
      </div>
    )
  }

  return <>{getMainDisplayContent()}</>
}

export default StudentVideoContainer
