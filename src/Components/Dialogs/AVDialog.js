import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  makeStyles,
} from '@material-ui/core'
import React, { useState, useContext } from 'react'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import { IoIosClose } from 'react-icons/io'
import Dialog from './Dialog'
import Controls from '../Controls/Controls'
import Spinner from '../Progress/Spinner'
import CallTestDialog from './CallTestDialog'
import { AuthContext } from '../../Context/AuthContext'
import { AgoraContext } from '../../Context/AgoraContext'

const AVDialog = ({ open, onClose, handleGoToClass, isLoading }) => {
  const [isCallTestDialogOpen, setIsCallTestDialogOpen] = useState(false)

  const { authState } = useContext(AuthContext)

  const {
    AVState,
    setAVState,
    giveAVPermissionToStudent,
    setGiveAVPermissionToStudent,
  } = useContext(AgoraContext)

  const classes = useStyles()

  const openCallTestDialog = () => {
    setIsCallTestDialogOpen(true)
  }

  const closeCallTestDialog = () => {
    setIsCallTestDialogOpen(false)
  }

  const goToClass = () => {
    handleGoToClass()
  }

  const handleClose = () => {
    onClose()
  }

  const toggleAudioValue = () => {
    setAVState((av) => ({ ...av, audio: !av.audio }))
  }

  const toggleVideoValue = () => {
    setAVState((av) => ({ ...av, video: !av.video }))
  }

  const setPermission = () => {
    setGiveAVPermissionToStudent((perm) => !perm)
  }

  return (
    <>
      <Dialog open={open} fullWidth={false}>
        <IconButton className={classes.closeBtn} onClick={handleClose}>
          <IoIosClose />
        </IconButton>
        <DialogTitle>
          <p className="sub-text bold text-align-center">Audio & Video</p>
        </DialogTitle>
        <Divider />
        <DialogContent className={classes.dialogContent}>
          <div className={classes.wrapper}>
            <p className={`fine-text bold ${classes.text1}`}>
              Join with Audio & Video
            </p>
            <Grid container spacing={2}>
              {authState.role === 'T' ? (
                <Grid item xs={12} sm={6}>
                  {!AVState.audio ? (
                    <Controls.Button
                      text="Audio"
                      onClick={toggleAudioValue}
                      color="inherit"
                    >
                      <CancelIcon />
                    </Controls.Button>
                  ) : (
                    <Controls.Button
                      text="Audio"
                      size="large"
                      onClick={toggleAudioValue}
                      color="primary"
                    >
                      <CheckCircleIcon />
                    </Controls.Button>
                  )}
                </Grid>
              ) : null}
              {authState.role === 'T' ? (
                <Grid item xs={12} sm={6}>
                  {!AVState.video ? (
                    <Controls.Button
                      text="Video"
                      onClick={toggleVideoValue}
                      color="inherit"
                    >
                      <CancelIcon />
                    </Controls.Button>
                  ) : (
                    <Controls.Button
                      text="Video"
                      size="large"
                      onClick={toggleVideoValue}
                      color="primary"
                    >
                      <CheckCircleIcon />
                    </Controls.Button>
                  )}
                </Grid>
              ) : (
                <Grid item xs={12}>
                  {!AVState.video ? (
                    <Controls.Button
                      text="Video"
                      onClick={toggleVideoValue}
                      color="inherit"
                    >
                      <CancelIcon />
                    </Controls.Button>
                  ) : (
                    <Controls.Button
                      text="Video"
                      size="large"
                      onClick={toggleVideoValue}
                      color="primary"
                    >
                      <CheckCircleIcon />
                    </Controls.Button>
                  )}
                </Grid>
              )}
            </Grid>
          </div>
          <Divider />
          <p className={`fine-text bold margin-top-small ${classes.text2}`}>
            Test and Select devices before joining
          </p>
          <Grid
            container
            className={classes.containerStyle}
            alignItems="center"
            justify="space-evenly"
          >
            <Grid
              item
              xs={12}
              onClick={() => {
                openCallTestDialog()
              }}
            >
              <p className={`fine-text text-align-center ${classes.text3}`}>
                Audio, Video and Speakers
              </p>
            </Grid>
          </Grid>
          <div className={classes.permissionPanel}>
            {authState.role === 'T' && (
              <FormControlLabel
                className={classes.formControl}
                control={
                  <Switch
                    checked={giveAVPermissionToStudent}
                    onChange={setPermission}
                    name="AVpermission"
                    color="primary"
                  />
                }
                label="Allow Student to manage mic & camera"
                labelPlacement="start"
              />
            )}
          </div>
        </DialogContent>
        <Divider />
        <DialogActions>
          {!isLoading && (
            <Controls.Button
              text="Continue"
              onClick={goToClass}
              className={classes.btn}
            />
          )}
          {isLoading && (
            <Controls.Button
              onClick={goToClass}
              disabled
              startIcon={
                <Spinner
                  size={20}
                  style={{ marginLeft: 'unset', position: 'unset' }}
                />
              }
              className={classes.btn}
            >
              Fetching Class Data
            </Controls.Button>
          )}
        </DialogActions>
      </Dialog>
      {isCallTestDialogOpen && (
        <CallTestDialog
          open={isCallTestDialogOpen}
          handleClose={closeCallTestDialog}
        />
      )}
    </>
  )
}

export default AVDialog

const useStyles = makeStyles({
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  dialogContent: {
    padding: 0,
  },
  wrapper: {
    padding: '1rem 1.5rem 1.5rem',
  },
  text1: {
    marginBottom: 8,
    color: '#333',
  },
  text2: {
    padding: '0 1.5rem',
    color: '#333',
  },
  containerStyle: {
    padding: '1rem 1.5rem',
  },
  text3: {
    marginTop: 0,
    textDecoration: 'underline',
    cursor: 'pointer',
  },
  permissionPanel: {
    backgroundColor: '#ebebeb',
  },
  formControl: {
    marginRight: 'unset',
    padding: '0 1.5rem',
  },
  btn: {
    margin: '1rem',
  },
})
