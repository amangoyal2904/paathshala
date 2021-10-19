import { Avatar, Chip } from '@material-ui/core'
import React, { useRef, useEffect, useState, Fragment } from 'react'

import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import TeacherVideoAdminControls from './TeacherVideoAdminControls'
import ScreenShareDisplay from './ScreenShareDisplay'

const MediaPlayer = ({
  videoTrack,
  audioTrack,
  trackType,
  style,
  uid,
  sendCommandToSpecificUser,
  role,
  isVideoEnabled,
  isAudioEnabled,
  name,
  stopScreenShare,
  isScreenShared,
}) => {
  const container = useRef(null)
  const [showScreenSharePanel, setShowScreenSharePanel] =
    useState(isScreenShared)

  useEffect(() => {
    setShowScreenSharePanel(isScreenShared)
  }, [isScreenShared])

  useEffect(() => {
    if (!container.current) return
    videoTrack?.play(container.current)
    return () => {
      videoTrack?.stop()
    }
  }, [container, videoTrack])
  useEffect(() => {
    if (trackType !== 'local') audioTrack?.play()
    return () => {
      audioTrack?.stop()
    }
  }, [audioTrack, trackType])

  return (
    <>
      {!isVideoEnabled && (
        <div
          style={{ ...style, backgroundColor: '#424242' }}
          className="media-player"
        >
          <TeacherVideoAdminControls
            role={role}
            trackType={trackType}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            sendCommandToSpecificUser={sendCommandToSpecificUser}
            uid={uid}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Avatar
              src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
              style={{ width: '20%', height: 'auto' }}
            />
            <p
              style={{
                fontWeight: 600,
                fontSize: '1.25rem',
                color: '#fff',
                marginTop: '1rem',
                textAlign: 'center',
              }}
            >
              {name}
            </p>
          </div>
          <Chip
            label={trackType === 'local' ? `You - ${name}` : name}
            icon={
              isAudioEnabled ? (
                <MicIcon style={{ color: '#fff' }} />
              ) : (
                <MicOffIcon style={{ color: '#fff' }} />
              )
            }
            size="small"
            style={{
              backgroundColor: '#424242',
              borderRadius: 4,
              position: 'absolute',
              left: 15,
              bottom: 3,
              zIndex: 999,
              color: '#fff',
              maxWidth: '100%',
            }}
          />
        </div>
      )}

      {isVideoEnabled && showScreenSharePanel && (
        <div style={{ ...style }}>
          <ScreenShareDisplay stopScreenShare={stopScreenShare} />
        </div>
      )}

      <div
        ref={container}
        style={isVideoEnabled && !showScreenSharePanel ? style : { height: 0 }}
        className="media-player"
      >
        {isVideoEnabled && !showScreenSharePanel && (
          <TeacherVideoAdminControls
            role={role}
            trackType={trackType}
            isAudioEnabled={isAudioEnabled}
            isVideoEnabled={isVideoEnabled}
            sendCommandToSpecificUser={sendCommandToSpecificUser}
            uid={uid}
          />
        )}
        <Chip
          label={trackType === 'local' ? `You - ${name}` : name}
          icon={
            isAudioEnabled ? (
              <MicIcon style={{ color: '#fff' }} />
            ) : (
              <MicOffIcon style={{ color: '#fff' }} />
            )
          }
          size="small"
          style={
            isVideoEnabled
              ? {
                  backgroundColor: '#424242',
                  borderRadius: 4,
                  position: 'absolute',
                  left: 15,
                  bottom: 3,
                  zIndex: 999,
                  color: '#fff',
                  maxWidth: '100%',
                }
              : { display: 'none' }
          }
        />
      </div>
    </>
  )
}

export default MediaPlayer
