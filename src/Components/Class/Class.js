import React, { useContext, useEffect, useRef, useState } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import AgoraRTM from 'agora-rtm-sdk'
import { makeStyles } from '@material-ui/core'
import Alert from '@material-ui/lab/Alert'
import Collapse from '@material-ui/core/Collapse'
import { useHistory } from 'react-router-dom'
import useAgoraRTC from '../../Hooks/Agora/useAgoraRTC'
import useAgoraRTM from '../../Hooks/Agora/useAgoraRTM'
import ClassNavbar from '../Navbar/ClassNavbar'
import { AuthContext } from '../../Context/AuthContext'
import { AgoraContext } from '../../Context/AgoraContext'
import { BatchContext } from '../../Context/BatchContext'
import VideoControls from '../Agora/VideoControls'
import Whiteboard from '../Whiteboard/Whiteboard'
import Notifications from '../Agora/Notifications'
import TeacherVideoContainer from '../Agora/TeacherVideoContainer'
import StudentVideoContainer from '../Agora/StudentVideoContainer'
import ClassLoader from './ClassLoader'
import GrantPermission from './GrantPermission'

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
    '& .MuiGrid-item': {
      height: '100%',
    },
  },
  alert: {
    position: 'absolute',
    top: 70,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 999,
  },
  container: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
})
let s

const Class = ({
  lectureId,
  appId,
  RTCToken,
  RTMToken,
  classCleanup,
  classStartTime,
  liveboardUrl,
  batchId,
}) => {
  const classes = useStyles()
  const history = useHistory()
  const [isLoading, setIsLoading] = useState(true)
  const [enrolledStudents, setEnrolledStudents] = useState([])
  const [alert, setAlert] = useState(true)
  const [permissions, setPermissions] = useState(false)
  const [isTeacherPresent, setisTeacherPresent] = useState(true)
  const RTCClient = useRef()
  const RTMInstance = useRef()
  const leaveTimer = useRef()

  const {
    inputDeviceIds,
    setSpeakerUid,
    setTimeOfClassStart,
    isLiveBoardActive,
    AVState,
    notificationState,
    GetCameras,
    GetMicrophones,
    setInputDeviceIds,
    hasAVPermissions,
    setCurrentSpeakers,
    setNotification,
    GetAllQueriesInALecture,
    teacherLeft,
  } = useContext(AgoraContext)

  const { authState } = useContext(AuthContext)
  const { batchByCode, GetEnrolledStudentsInBatch, FindBatchWithCode } =
    useContext(BatchContext)
  const joinClass = useRef()
  const leaveVideoAndChat = useRef()

  useEffect(() => {
    if (!hasAVPermissions) {
      history.push('/dashboard')
    }
  }, [hasAVPermissions])

  // volume indicator
  useEffect(() => {
    RTCClient.current = AgoraRTC.createClient({
      codec: 'h264',
      mode: 'rtc',
    })
    RTCClient.current.enableAudioVolumeIndicator()
    RTCClient.current.on('volume-indicator', (volumes) => {
      volumes.sort((v1, v2) => v2.level - v1.level)
      if (volumes.length > 0) {
        setCurrentSpeakers(() => volumes.map((volume) => volume.uid))
      } else {
        setCurrentSpeakers([])
      }
      if (volumes[0] && volumes[0].level !== 0) {
        setSpeakerUid(volumes[0].uid)
      } else {
        setSpeakerUid(undefined)
      }
    })
    const RTMConfig = {
      logFilter: process.env.REACT_APP_AGORA_RTM_LOG_ENABLED
        ? AgoraRTM.LOG_FILTER_INFO
        : AgoraRTM.LOG_FILTER_OFF,
    }
    RTMInstance.current = AgoraRTM.createInstance(appId, RTMConfig)
  }, [])

  useEffect(() => {
    async function startClass() {
      await FindBatchWithCode(batchId)
      const val = await GetEnrolledStudentsInBatch(batchId)
      if (val) {
        setEnrolledStudents(val)
      }
      if (authState.role === 'T') {
        await GetAllQueriesInALecture(lectureId)
      }
      joinClass.current()
    }

    startClass()

    return () => {
      leaveVideoAndChat.current()
    }
  }, [])

  useEffect(() => {
    if (authState.role === 'T') return
    if (!isTeacherPresent && !teacherLeft) {
      setNotification(
        null,
        'CLASS_END',
        "Teacher is offline, class will end in 10 minutes if Teacher doesn't rejoin",
      )
      leaveTimer.current = setTimeout(() => {
        leaveVideoAndChat.current()
      }, 600000)
    } else if (!isTeacherPresent && teacherLeft) {
      leaveTimer.current = setTimeout(() => {
        leaveVideoAndChat.current()
      }, 5000)
    } else if (leaveTimer.current) {
      clearTimeout(leaveTimer.current)
    }
  }, [isTeacherPresent])

  useEffect(() => {
    if (AVState.video) {
      showVideo()
    } else if (!AVState.video) {
      hideVideo()
    }
  }, [AVState.video])

  useEffect(() => {
    if (AVState.audio) {
      unmuteAudio()
    } else if (!AVState.audio) {
      muteAudio()
    }
  }, [AVState.audio])

  useEffect(() => {
    if (notificationState.type !== 'RTM_DUPLICATE_USER') return
    setTimeout(() => {
      leaveVideoAndChat.current()
    }, 5000)
  }, [notificationState.type])

  useEffect(() => {
    setTimeout(() => {
      setAlert(false)
    }, 15000)
  }, [])

  async function init() {
    const cameras = await GetCameras()
    const microphones = await GetMicrophones()
    setPermissions(true)
    if (cameras && cameras.length > 0) {
      setInputDeviceIds((devices) => ({ ...devices, cameraId: cameras[0].id }))
    }
    if (microphones && microphones.length > 0) {
      setInputDeviceIds((devices) => ({
        ...devices,
        microphoneId: microphones[0].id,
      }))
    }
  }

  function startTime() {
    let hrs = 0
    let min = 0
    let sec = 0
    let hrs_string = '00'
    let min_string = '00'
    let sec_string = '00'

    if (classStartTime) {
      // eslint-disable-next-line no-param-reassign
      classStartTime = Math.ceil(Date.now() / 1000) - classStartTime
      let zero_string_hrs = ''
      let zero_string_min = ''
      let zero_string_sec = ''

      const hours = Math.floor(classStartTime / 3600)
      const minutes = Math.floor(classStartTime / 60)
      const seconds = classStartTime - minutes * 60

      hrs = hours
      min = minutes
      sec = seconds
      if (hours <= 9 && hours >= 0) {
        zero_string_hrs = '0'
      }
      hrs_string = zero_string_hrs + hours.toString()

      if (minutes <= 9 && minutes >= 0) {
        zero_string_min = '0'
      }
      min_string = zero_string_min + minutes.toString()

      if (seconds <= 9 && seconds >= 0) {
        zero_string_sec = '0'
      }
      sec_string = zero_string_sec + seconds.toString()
    }

    let zero_string = ''
    let time
    s = setInterval(() => {
      sec += 1
      if (sec <= 9 && sec > 0) {
        zero_string = '0'
      }
      sec_string = zero_string + sec.toString()
      zero_string = ''
      if (sec >= 60) {
        sec = 0
        sec_string = '00'
        min += 1
        if (min <= 9 && min > 0) {
          zero_string = '0'
        }
        min_string = zero_string + min.toString()
        zero_string = ''
        if (min >= 60) {
          min = 0
          min_string = '00'
          hrs += 1
          if (hrs <= 9 && hrs > 0) {
            zero_string = '0'
          }
          hrs_string = zero_string + hrs.toString()
          zero_string = ''
        }
      }
      time = `${hrs_string}:${min_string}:${sec_string}`
      setTimeOfClassStart(time)
    }, 1000)
  }

  joinClass.current = async () => {
    await init()
    join(appId, lectureId, RTCToken, authState.user_id).then(() => {
      login(authState.user_id, RTMToken)
        .then(() => {
          createChannelAndJoin(lectureId).then(() => {
            startTime()
            setIsLoading(false)
          })
        })
        .catch(() => {
          // handleerror
        })
    })
  }

  leaveVideoAndChat.current = () => {
    clearInterval(s)
    leave()
    leaveChannel()
      .then(() => {
        logout()
      })
      .then(() => {
        classCleanup()
      })
      .catch(() => {
        classCleanup()
      })
  }

  const {
    localAudioTrack,
    localVideoTrack,
    leave,
    join,
    joinState,
    remoteUsers,
    muteAudio,
    unmuteAudio,
    showVideo,
    hideVideo,
    shareScreen,
    stopShareScreen,
    isAudioMuted,
    isVideoMuted,
    isScreenShared,
  } = useAgoraRTC(RTCClient.current, AVState, inputDeviceIds)

  const {
    login,
    logout,
    createChannelAndJoin,
    leaveChannel,
    sendMessage,
    channelMessages,
    sendCommandToSpecificUser,
    sendCommandToChannel,
    isJoined,
  } = useAgoraRTM(RTMInstance.current)

  useEffect(() => {
    if (authState.role !== 'S') return
    const val = remoteUsers.find((user) => user.uid === batchByCode.owner)
    if (val === undefined) {
      setisTeacherPresent(false)
    } else {
      setisTeacherPresent(true)
    }
  }, [remoteUsers])

  return (
    <>
      <div className={classes.alert}>
        <Collapse in={alert && !isLoading}>
          <Alert
            severity="info"
            onClose={() => {
              setAlert(false)
            }}
          >
            {authState.role === 'T'
              ? remoteUsers.length === 0
                ? 'Wait for students to join class!'
                : 'Students have joined, you can start class now!'
              : remoteUsers.find((user) => user.uid === batchByCode.owner)
              ? 'Your Teacher is here, class has started!'
              : 'Wait for your Teacher to join!'}
          </Alert>
        </Collapse>
      </div>
      <ClassNavbar
        remoteUsers={remoteUsers}
        sendMessage={sendMessage}
        channelMessages={channelMessages}
        role={authState.role}
        batchId={batchId}
        sendCommandToChannel={sendCommandToChannel}
        sendCommandToSpecificUser={sendCommandToSpecificUser}
        isLoading={isLoading && !joinState}
      />
      <div className="main-view">
        {isLoading && !joinState && !permissions && <GrantPermission />}
        {isLoading && !joinState && permissions && <ClassLoader />}
        {!isLoading && joinState && permissions && (
          <div className={classes.container}>
            {authState.role === 'T' ? (
              <TeacherVideoContainer
                remoteUsers={remoteUsers}
                enrolledStudents={enrolledStudents}
                localAudioTrack={localAudioTrack}
                localVideoTrack={localVideoTrack}
                isAudioMuted={isAudioMuted}
                isVideoMuted={isVideoMuted}
                sendCommandToSpecificUser={sendCommandToSpecificUser}
                isScreenShared={isScreenShared}
                stopScreenShare={stopShareScreen}
              />
            ) : (
              <StudentVideoContainer
                remoteUsers={remoteUsers}
                enrolledStudents={enrolledStudents}
                localAudioTrack={localAudioTrack}
                localVideoTrack={localVideoTrack}
                isAudioMuted={isAudioMuted}
                isVideoMuted={isVideoMuted}
                sendCommandToSpecificUser={sendCommandToSpecificUser}
                isScreenShared={isScreenShared}
                stopScreenShare={stopShareScreen}
              />
            )}
          </div>
        )}
        {!isLoading && joinState && permissions && isLiveBoardActive && (
          <Whiteboard src={liveboardUrl} title={batchId} />
        )}
        {!isLoading && joinState && permissions && (
          <Notifications enrolledStudents={enrolledStudents} />
        )}
      </div>
      <VideoControls
        isScreenShared={isScreenShared}
        shareScreen={shareScreen}
        stopShareScreen={stopShareScreen}
        isAudioMuted={isAudioMuted}
        isVideoMuted={isVideoMuted}
        leaveVideoAndChat={leaveVideoAndChat}
        classStartTime={classStartTime}
        enrolledStudents={enrolledStudents}
        sendCommandToChannel={sendCommandToChannel}
        remoteUsers={remoteUsers}
        RTMJoined={isJoined}
        isLoading={isLoading && !joinState}
        batchId={batchId}
      />
    </>
  )
}

export default Class
