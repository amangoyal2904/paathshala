import React, { useContext, useEffect, useState } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom'
import Spinner from '../../Components/Progress/Spinner'
import { AgoraContext } from '../../Context/AgoraContext'
import { AuthContext } from '../../Context/AuthContext'
import Class from '../../Components/Class/Class'

const ClassPage = () => {
  const location = useLocation()
  const history = useHistory()
  const { id } = useParams()
  const [shouldLoad, setShouldLoad] = useState(false)
  const { authState } = useContext(AuthContext)
  const {
    setGiveAVPermissionToStudent,
    setIsDeviceControlsWithUser,
    hasAVPermissions,
  } = useContext(AgoraContext)

  useEffect(() => {
    if (location.state === undefined || !location.state.startClass) {
      history.push(`/dashboard`)
    } else {
      setShouldLoad(true)
    }
  }, [location])

  const loadFeedback = () => {
    const max = 9
    const min = 0
    const random = Math.floor(Math.random() * (max - min + 1)) + min
    if (random > 0) return true
    return false
  }

  const classCleanup = () => {
    const { state } = location
    state.startClass = false
    const isFeedback = loadFeedback()
    if (authState.role === 'T') {
      setGiveAVPermissionToStudent(false)
    } else {
      setIsDeviceControlsWithUser(false)
    }
    if (!isFeedback && authState.role === 'T') {
      history.push('/dashboard')
      window.location.reload()
    } else {
      history.push('/dashboard', {
        feedback: hasAVPermissions ? isFeedback : false,
        lectureId: id,
        batchId: location.state.batch_id,
        showPermissions: !hasAVPermissions,
      })
    }
  }
  return (
    <>
      {!shouldLoad && <Spinner />}
      {shouldLoad && (
        <Class
          appId={location.state.appId}
          RTCToken={location.state.RTCToken}
          RTMToken={location.state.RTMToken}
          classCleanup={classCleanup}
          lectureId={id}
          classStartTime={location.state.classStartTime}
          liveboardUrl={location.state.liveboard_url}
          batchId={location.state.batchId}
        />
      )}
    </>
  )
}

export default ClassPage
