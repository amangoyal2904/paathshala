import AgoraRTC from 'agora-rtc-sdk-ng'
import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useSnackbar } from 'notistack'
import useAgoraRTC from '../Hooks/Agora/useAgoraRTC'
import { AuthContext } from './AuthContext'
import axiosPost from '../Global/Axios/axiosPost'
import handleError from '../Global/HandleError/handleError'
import axiosGet from '../Global/Axios/axiosGet'

export const AgoraContext = createContext()

const AgoraContextProvider = (props) => {
  const [inputDeviceIds, setInputDeviceIds] = useState({
    cameraId: '',
    microphoneId: '',
  })
  const { createLocalVideoTrack, createLocalAudioTrack } = useAgoraRTC(
    undefined,
    undefined,
    inputDeviceIds,
  )
  const { authState, getAuthHeader } = useContext(AuthContext)

  const [isNewMessage, setIsNewMessage] = useState(false)
  const [unreadMessage, setUnreadMessage] = useState(false)

  const [allCameras, setAllCameras] = useState([])
  const [allMicrophones, setAllMicrophones] = useState([])
  const [testVolumeLevel, setTestVolumeLevel] = useState(0)
  const [localMediaTrack, setLocalMediaTrack] = useState({
    localAudioTrack: undefined,
    localVideoTrack: undefined,
  })

  const [timeOfClassStart, setTimeOfClassStart] = useState('00:00:00')
  const [speakerUid, setSpeakerUid] = useState(undefined)
  const [isLiveBoardActive, setIsLiveBoardActive] = useState(false)
  const [AVState, setAVState] = useState({
    video: false,
    audio: false,
  })

  const [poll, setPoll] = useState(undefined)
  const [studentPollId, setStudentPollId] = useState(undefined)
  const [isQuickPollOpen, setIsQuickPollOpen] = useState(false)

  const [teacherDoubts, setTeacherDoubts] = useState([])
  const [studentDoubt, setStudentDoubt] = useState(false)

  const [notificationState, setNotificationState] = useState({
    open: true,
    uid: '',
    type: '',
    content: '',
  })

  const [hasAVPermissions, setHasAVPermissions] = useState(true)

  const [currentSpeakers, setCurrentSpeakers] = useState([])

  const [isDeviceControlsWithUser, setIsDeviceControlsWithUser] =
    useState(false)

  const [giveAVPermissionToStudent, setGiveAVPermissionToStudent] =
    useState(false)

  const [teacherLeft, setTeacherLeft] = useState(false)

  const volTimeout = useRef(null)

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (authState.role === 'T') {
      setPoll('teacherfirstpoll')
      setIsDeviceControlsWithUser(true)
    } else {
      setPoll('studentfirstpoll')
    }
  }, [authState.role])

  const clearResources = () => {
    if (localMediaTrack.localVideoTrack) {
      localMediaTrack.localVideoTrack.stop()
      localMediaTrack.localVideoTrack.close()
    }
    if (localMediaTrack.localAudioTrack) {
      localMediaTrack.localAudioTrack.stop()
      localMediaTrack.localAudioTrack.close()
    }
    clearTimeout(volTimeout.current)
  }

  const GetCameraStream = async (id) => {
    if (id !== '') {
      const videoTrack = await createLocalVideoTrack(id)
      setLocalMediaTrack((mediaTracks) => ({
        ...mediaTracks,
        localVideoTrack: videoTrack,
      }))
    }
  }

  const GetMicrophoneStream = async (id) => {
    if (id !== '') {
      const audioTrack = await createLocalAudioTrack(id)
      volTimeout.current = setInterval(() => {
        if (audioTrack !== undefined) {
          const val = audioTrack.getVolumeLevel() * 100
          setTestVolumeLevel(val)
        } else {
          setTestVolumeLevel(0)
        }
      }, 250)
      setLocalMediaTrack((mediaTracks) => ({
        ...mediaTracks,
        localAudioTrack: audioTrack,
      }))
    }
  }

  const GetCameras = async () => {
    try {
      let cameras = await AgoraRTC.getCameras()
      cameras = cameras.map((camera) => ({
        ...camera,
        id: camera.deviceId,
        title: camera.label,
      }))
      setAllCameras(cameras)
      return cameras
    } catch (err) {
      setHasAVPermissions(false)
    }
  }

  const GetMicrophones = async () => {
    try {
      let microphones = await AgoraRTC.getMicrophones()
      microphones = microphones.map((microphone) => ({
        ...microphone,
        id: microphone.deviceId,
        title: microphone.label,
      }))
      setAllMicrophones(microphones)
      return microphones
    } catch (err) {
      setHasAVPermissions(false)
    }
  }

  const SetCameraId = (id) => {
    setInputDeviceIds({
      ...inputDeviceIds,
      cameraId: id,
    })
  }

  const SetMicrophoneId = (id) => {
    setInputDeviceIds({
      ...inputDeviceIds,
      microphoneId: id,
    })
  }

  let timeout

  function releaseNotification() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      setNotificationState({
        open: false,
        uid: null,
        type: null,
        content: null,
      })
    }, 3500)
  }

  const setNotification = (uid, type, content) => {
    setNotificationState({
      open: true,
      uid,
      type,
      content,
    })
    releaseNotification()
  }

  const HandleCommand = async (
    command_category,
    command_method,
    body,
    senderId,
    sendCommandToSpecificUser,
  ) => {
    switch (command_category) {
      case 'AGORA': {
        switch (command_method) {
          case 'MIC_ON': {
            setAVState((devices) => ({ ...devices, audio: true }))
            setNotification(
              null,
              'AGORA_MIC_ON',
              'Your microphone has been turned on by the Teacher',
            )
            break
          }
          case 'MIC_OFF': {
            setAVState((devices) => ({ ...devices, audio: false }))
            setNotification(
              null,
              'AGORA_MIC_OFF',
              'Your microphone has been turned off by the Teacher',
            )
            break
          }
          case 'CAM_ON': {
            setAVState((devices) => ({ ...devices, video: true }))
            setNotification(
              null,
              'AGORA_CAM_ON',
              'Your camera has been turned on by the Teacher',
            )
            break
          }
          case 'CAM_OFF': {
            setAVState((devices) => ({ ...devices, video: false }))
            setNotification(
              null,
              'AGORA_CAM_OFF',
              'Your camera has been turned off by the Teacher',
            )
            break
          }
          case 'CONTROLS_GRANTED': {
            setNotification(
              null,
              'AGORA_CAM_ON',
              'Teacher has given you access for mic and video',
            )

            setIsDeviceControlsWithUser(true)
            break
          }
          case 'CONTROLS_REVOKED': {
            setNotification(
              null,
              'AGORA_CAM_OFF',
              'Teacher has the control to your mic and video',
            )
            setIsDeviceControlsWithUser(false)
            break
          }
          default:
            break
        }
        break
      }
      case 'QUICK_POLL': {
        switch (command_method) {
          case 'STARTED': {
            const id = parseInt(body, 10)
            if (Number.isInteger(id)) {
              setStudentPollId(id)
              setPoll('studentpoll')
              setIsQuickPollOpen(true)
            }
            break
          }
          case 'EXPIRED': {
            setPoll('studentendpoll')
            break
          }
          default:
            break
        }
        break
      }
      case 'DOUBT': {
        switch (command_method) {
          case 'ASK': {
            const search = teacherDoubts.find(
              (doubt) => doubt.senderId === senderId,
            )
            if (search === undefined) {
              teacherDoubts.push({ id: body, senderId, state: 0 })
              sendCommandToSpecificUser(senderId, 'DOUBT', 'RECEIVED')
            } else if (search.state === 2) {
              search.state = 0
              const others = teacherDoubts.filter(
                (tDoubt) => tDoubt.senderId !== senderId,
              )
              setTeacherDoubts([...others, search])
              sendCommandToSpecificUser(senderId, 'DOUBT', 'RECEIVED')
            } else {
              sendCommandToSpecificUser(senderId, 'DOUBT', 'RECEIVED')
            }
            setNotification(true, senderId, 'DOUBT_RAISED', null)
            break
          }
          case 'RECEIVED': {
            setNotification(
              senderId,
              'DOUBT_ASKED',
              'Your doubt is raised. Wait for your Teacher to accept it',
            )
            setStudentDoubt(true)
            break
          }
          case 'ACCEPTED': {
            setNotification(
              null,
              'DOUBT_ACCEPTED',
              'Your doubt is accepted. You may speak now',
            )
            break
          }
          case 'CLEAR': {
            setStudentDoubt(false)
            setNotification(
              null,
              'DOUBT_RESOLVED',
              'Your doubt has been resolved',
            )
            break
          }
          default:
            break
        }
        break
      }
      case 'CALL': {
        switch (command_method) {
          case 'END': {
            setTeacherLeft(true)
            setNotification(
              null,
              'CLASS_END',
              'Teacher has left, class will end now',
            )
            break
          }
          default:
            break
        }
        break
      }
      default:
        break
    }
  }

  const RaiseQuery = async (lecture_id) => {
    if (!lecture_id) return
    try {
      const res = await axiosPost(`/query/`, {
        data: {
          lecture_id,
        },
        headers: getAuthHeader(),
      })
      return res
    } catch (err) {
      return false
    }
  }

  const GetAllQueriesInALecture = async (lecture_id) => {
    if (!lecture_id) return
    try {
      const res = await axiosGet(`/query/?lecture=${lecture_id}`, {
        headers: getAuthHeader(),
      })
      setTeacherDoubts(() =>
        res.data.map((data) => ({
          id: data.id,
          senderId: data.student_id,
          state: data.status === 'D' ? 0 : 2,
        })),
      )
    } catch (err) {
      setTeacherDoubts([])
      handleError(enqueueSnackbar, err)
    }
  }

  const ResolveQuery = async (query_id) => {
    if (!query_id) return
    try {
      const res = await axiosPost(`/query/${query_id}/resolve/`, {
        data: {},
        headers: getAuthHeader(),
      })
      return res
    } catch (err) {
      return false
    }
  }

  return (
    <AgoraContext.Provider
      value={{
        GetCameras,
        GetMicrophones,
        SetCameraId,
        SetMicrophoneId,
        inputDeviceIds,
        setInputDeviceIds,
        allCameras,
        allMicrophones,
        testVolumeLevel,
        setTestVolumeLevel,
        localMediaTrack,
        setLocalMediaTrack,
        clearResources,
        GetCameraStream,
        GetMicrophoneStream,
        timeOfClassStart,
        setTimeOfClassStart,
        speakerUid,
        setSpeakerUid,
        isNewMessage,
        setIsNewMessage,
        isLiveBoardActive,
        setIsLiveBoardActive,
        HandleCommand,
        AVState,
        setAVState,
        poll,
        setPoll,
        studentPollId,
        isQuickPollOpen,
        setIsQuickPollOpen,
        teacherDoubts,
        setTeacherDoubts,
        studentDoubt,
        setStudentDoubt,
        notificationState,
        setNotificationState,
        volTimeout,
        hasAVPermissions,
        setHasAVPermissions,
        currentSpeakers,
        setCurrentSpeakers,
        unreadMessage,
        setUnreadMessage,
        isDeviceControlsWithUser,
        giveAVPermissionToStudent,
        setGiveAVPermissionToStudent,
        setIsDeviceControlsWithUser,
        RaiseQuery,
        ResolveQuery,
        GetAllQueriesInALecture,
        setNotification,
        teacherLeft,
      }}
    >
      {props.children}
    </AgoraContext.Provider>
  )
}

export default AgoraContextProvider
