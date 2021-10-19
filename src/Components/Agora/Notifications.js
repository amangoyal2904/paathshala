import { Card, Grid, IconButton, makeStyles } from '@material-ui/core'
import React, { useContext } from 'react'
import { AiOutlinePoweroff, AiOutlineQuestionCircle } from 'react-icons/ai'
import { FiMic, FiVideo, FiVideoOff } from 'react-icons/fi'
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined'
import { AgoraContext } from '../../Context/AgoraContext'
import { BatchContext } from '../../Context/BatchContext'

const useStyles = makeStyles({
  card: {
    borderRadius: 8,
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 16,
    right: '1rem',
    zIndex: 9999,
    width: 'max-content',
  },
})

const Notifications = ({ enrolledStudents }) => {
  const classes = useStyles()
  const { notificationState } = useContext(AgoraContext)

  const { batchByCode } = useContext(BatchContext)

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
  return (
    <>
      {notificationState.open && (
        <Card className={classes.card}>
          <Grid container alignItems="center">
            {notificationState.type === 'TEXT' && (
              <>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton>
                        <TextsmsOutlinedIcon />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <p style={{ fontWeight: 600, marginLeft: 6 }}>
                        {getName(notificationState.uid)}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <p
                    style={{
                      marginLeft: 12,
                      marginBottom: 6,
                      maxWidth: 35,
                    }}
                  >
                    {notificationState.content.length > 20
                      ? `${notificationState.content.substring(0, 19)}...`
                      : notificationState.content}
                  </p>
                </Grid>
              </>
            )}
            {notificationState.type === 'DOUBT_RAISED' && (
              <>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton>
                        <AiOutlineQuestionCircle />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <p
                        style={{
                          fontWeight: 500,
                          marginRight: 12,
                        }}
                      >
                        {`${getName(notificationState.uid)} raised a doubt`}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            {(notificationState.type === 'DOUBT_ACCEPTED' ||
              notificationState.type === 'DOUBT_ASKED' ||
              notificationState.type === 'DOUBT_RESOLVED') && (
              <>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton>
                        <AiOutlineQuestionCircle />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <p
                        style={{
                          fontWeight: 500,
                          marginRight: 12,
                        }}
                      >
                        {notificationState.content}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            {notificationState.type === 'AGORA_CAM_ON' && (
              <>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton>
                        <FiVideo />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <p
                        style={{
                          fontWeight: 500,
                          marginRight: 12,
                        }}
                      >
                        {`${notificationState.content}`}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            {notificationState.type === 'AGORA_CAM_OFF' && (
              <>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton>
                        <FiVideoOff />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <p
                        style={{
                          fontWeight: 500,
                          marginRight: 12,
                        }}
                      >
                        {`${notificationState.content}`}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            {notificationState.type === 'AGORA_MIC_ON' && (
              <>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton>
                        <FiMic />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <p
                        style={{
                          fontWeight: 500,
                          marginRight: 12,
                        }}
                      >
                        {`${notificationState.content}`}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            {notificationState.type === 'AGORA_MIC_OFF' && (
              <>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton>
                        <FiMic />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <p
                        style={{
                          fontWeight: 500,
                          marginRight: 12,
                        }}
                      >
                        {`${notificationState.content}`}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
            {notificationState.type === 'CLASS_END' && (
              <>
                <Grid item xs={12}>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton>
                        <AiOutlinePoweroff />
                      </IconButton>
                    </Grid>
                    <Grid item>
                      <p
                        style={{
                          fontWeight: 500,
                          marginRight: 12,
                        }}
                      >
                        {`${notificationState.content}`}
                      </p>
                    </Grid>
                  </Grid>
                </Grid>
              </>
            )}
          </Grid>
        </Card>
      )}
    </>
  )
}

export default Notifications
