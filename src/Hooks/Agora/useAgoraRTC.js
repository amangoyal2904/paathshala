import { useState, useEffect, useContext } from 'react'
import AgoraRTC from 'agora-rtc-sdk-ng'
import { AuthContext } from '../../Context/AuthContext'
import { BatchContext } from '../../Context/BatchContext'

export default function useAgoraRTC(
  client,
  AVState = {
    audio: true,
    video: true,
  },
  inputDeviceIds,
) {
  AgoraRTC.setLogLevel(process.env.REACT_APP_AGORA_RTC_LOG_LEVEL)
  const { authState } = useContext(AuthContext)
  const { batchByCode } = useContext(BatchContext)

  const [localVideoTrack, setLocalVideoTrack] = useState(undefined)
  const [localAudioTrack, setLocalAudioTrack] = useState(undefined)

  const [joinState, setJoinState] = useState(false)

  const [isAudioMuted, setIsAudioMuted] = useState(false)

  const [isVideoMuted, setIsVideoMuted] = useState(false)

  const [isScreenShared, setIsScreenShared] = useState(false)

  const [remoteUsers, setRemoteUsers] = useState([])

  const [connectionState, setConnectionState] = useState('CONNECTED')

  async function createLocalVideoTrack() {
    const cameraTrack = await AgoraRTC.createCameraVideoTrack({
      encoderConfig: authState.role === 'T' ? '480p_1' : '180p_3',
      deviceId: inputDeviceIds.cameraId,
    })
    return cameraTrack
  }

  async function createLocalAudioTrack() {
    const microphoneTrack = await AgoraRTC.createMicrophoneAudioTrack({
      deviceId: inputDeviceIds.cameraId,
    })
    return microphoneTrack
  }

  function setLocalTracks(cameraTrack, microphoneTrack) {
    setLocalVideoTrack(cameraTrack)
    setLocalAudioTrack(microphoneTrack)
  }

  async function join(appid, channel, token, uid) {
    if (!client) return

    const cameraTrack = await createLocalVideoTrack()
    const microphoneTrack = await createLocalAudioTrack()
    setLocalTracks(cameraTrack, microphoneTrack)

    if (!AVState.video) {
      setIsVideoMuted(true)
    }

    if (!AVState.audio) {
      setIsAudioMuted(true)
    }

    cameraTrack.on('track-ended', () => {
      cameraTrack.stop()
      cameraTrack.close()
    })

    microphoneTrack.on('track-ended', () => {
      microphoneTrack.stop()
      microphoneTrack.close()
    })

    await client.join(appid, channel, token, uid)
    await client.publish([microphoneTrack, cameraTrack])

    if (!AVState.audio) microphoneTrack.setEnabled(false)
    if (!AVState.video) cameraTrack.setEnabled(false)
    setJoinState(true)
  }

  async function leave() {
    if (!joinState) return
    if (localAudioTrack) {
      localAudioTrack.stop()
      localAudioTrack.close()
    }
    if (localVideoTrack) {
      localVideoTrack.stop()
      localVideoTrack.close()
    }
    setRemoteUsers([])
    setJoinState(false)
    await client.leave()
  }

  async function muteAudio() {
    if (!localAudioTrack) return
    await localAudioTrack.setEnabled(false)
    setIsAudioMuted(true)
  }

  async function hideVideo() {
    if (!localVideoTrack) return
    if (isScreenShared) {
      setIsVideoMuted(true)
      return
    }
    await localVideoTrack.setEnabled(false)
    setIsVideoMuted(true)
  }

  async function unmuteAudio() {
    if (!localAudioTrack) return
    localAudioTrack.setEnabled(true)
    setIsAudioMuted(false)
  }

  async function showVideo() {
    if (!localVideoTrack) return
    localVideoTrack.setEnabled(true)
    setIsVideoMuted(false)
  }

  async function shareScreen() {
    if (!client) return
    const screenVideoTrack = await AgoraRTC.createScreenVideoTrack(
      { optimizationMode: 'balanced', encoderConfig: '720p_3' },
      'disable',
    )
    await client.unpublish(localVideoTrack)
    setLocalVideoTrack(screenVideoTrack)
    await client.publish(screenVideoTrack)
    setIsScreenShared(true)
    // Handles toolbar stop event
    screenVideoTrack.on('track-ended', async () => {
      const cameraTrack = await createLocalVideoTrack()
      setLocalVideoTrack(cameraTrack)
      await client.unpublish(screenVideoTrack)
      await client.publish(cameraTrack)
      if (isVideoMuted) {
        cameraTrack.setEnabled(false)
      }
      screenVideoTrack.stop()
      screenVideoTrack.close()
      setIsScreenShared(false)
    })
  }

  async function stopShareScreen() {
    if (!client) return
    const cameraTrack = await createLocalVideoTrack()
    cameraTrack.on('track-ended', () => {
      cameraTrack.stop()
      cameraTrack.close()
    })
    await client.unpublish(localVideoTrack)
    await client.publish(cameraTrack)
    if (isVideoMuted) {
      cameraTrack.setEnabled(false)
    }
    await localVideoTrack.stop()
    await localVideoTrack.close()
    setLocalVideoTrack(cameraTrack)
    setIsScreenShared(false)
  }

  useEffect(() => {
    if (!client) return
    setRemoteUsers(client.remoteUsers)

    const handleUserPublished = async (user, mediaType) => {
      if (authState.role === 'S') {
        if (batchByCode.owner === user.uid && mediaType === 'video') {
          await client.subscribe(user, mediaType)
        }
      } else {
        await client.subscribe(user, mediaType)
      }
      setRemoteUsers(() => Array.from(client.remoteUsers))
    }
    const handleUserUnpublished = () => {
      setRemoteUsers(() => Array.from(client.remoteUsers))
    }
    const handleUserJoined = () => {
      setRemoteUsers(() => Array.from(client.remoteUsers))
    }
    const handleUserLeft = () => {
      setRemoteUsers(() => Array.from(client.remoteUsers))
    }
    const handleConnectionStateChange = (currentState) => {
      setConnectionState(currentState)
    }
    client.on('user-published', handleUserPublished)
    client.on('user-unpublished', handleUserUnpublished)
    client.on('user-joined', handleUserJoined)
    client.on('user-left', handleUserLeft)
    client.on('connection-state-change', handleConnectionStateChange)

    return () => {
      client.off('user-published', handleUserPublished)
      client.off('user-unpublished', handleUserUnpublished)
      client.off('user-joined', handleUserJoined)
      client.off('user-left', handleUserLeft)
      client.off('connection-state-change', handleConnectionStateChange)
    }
  }, [client])

  return {
    localAudioTrack,
    localVideoTrack,
    joinState,
    leave,
    join,
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
    createLocalAudioTrack,
    createLocalVideoTrack,
    connectionState,
  }
}
