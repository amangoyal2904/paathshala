import { Grid, IconButton } from '@material-ui/core'
import React from 'react'

import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'

const TeacherVideoAdminControls = ({
  role,
  trackType,
  isAudioEnabled,
  isVideoEnabled,
  sendCommandToSpecificUser,
  uid,
}) => (
  <>
    {role === 'T' && trackType === 'remote' && (
      <Grid
        container
        alignItems="center"
        style={{
          backgroundColor: 'rgba(34,34,34,0.7)',
          borderRadius: 24,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: 96,
          zIndex: 999,
          padding: 0,
          boxShadow: '0 0 6px 2px rgba(255, 255, 255, 0.06)',
        }}
        id="admin-controls"
      >
        {!isAudioEnabled && (
          <Grid item xs={6}>
            <IconButton
              onClick={() => {
                sendCommandToSpecificUser(uid, 'AGORA', 'MIC_ON')
              }}
            >
              <MicOffIcon style={{ color: '#fff' }} />
            </IconButton>
          </Grid>
        )}
        {isAudioEnabled && (
          <Grid item xs={6}>
            <IconButton
              onClick={() => {
                sendCommandToSpecificUser(uid, 'AGORA', 'MIC_OFF')
              }}
            >
              <MicIcon style={{ color: '#fff' }} />
            </IconButton>
          </Grid>
        )}
        {!isVideoEnabled && (
          <Grid item xs={6}>
            <IconButton
              onClick={() => {
                sendCommandToSpecificUser(uid, 'AGORA', 'CAM_ON')
              }}
            >
              <VideocamOffIcon style={{ color: '#fff' }} />
            </IconButton>
          </Grid>
        )}
        {isVideoEnabled && (
          <Grid item xs={6}>
            <IconButton
              onClick={() => {
                sendCommandToSpecificUser(uid, 'AGORA', 'CAM_OFF')
              }}
            >
              <VideocamIcon style={{ color: '#fff' }} />
            </IconButton>
          </Grid>
        )}
      </Grid>
    )}
  </>
)

export default TeacherVideoAdminControls
