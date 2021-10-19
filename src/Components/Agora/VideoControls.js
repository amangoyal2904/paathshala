import {
  AppBar,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  makeStyles,
  Popover,
  Switch,
  Toolbar,
} from '@material-ui/core'
import React, { useContext, useEffect, useState } from 'react'
import ScreenShareIcon from '@material-ui/icons/ScreenShare'
import MicIcon from '@material-ui/icons/Mic'
import MicOffIcon from '@material-ui/icons/MicOff'
import VideocamIcon from '@material-ui/icons/Videocam'
import VideocamOffIcon from '@material-ui/icons/VideocamOff'
import AccessTimeIcon from '@material-ui/icons/AccessTime'
import { MdContentCopy } from 'react-icons/md'
import VolumeUpIcon from '@material-ui/icons/VolumeUp'
import CallEndOutlinedIcon from '@material-ui/icons/CallEndOutlined'
import TvIcon from '@material-ui/icons/Tv'
import SettingsIcon from '@material-ui/icons/Settings'
import { IoIosClose } from 'react-icons/io'
import CopyToClipboard from 'react-copy-to-clipboard'
import { useSnackbar } from 'notistack'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import Controls from '../Controls/Controls'
import showSuccessSnackbar from '../Snackbar/successSnackbar'
import { AuthContext } from '../../Context/AuthContext'
import { BatchContext } from '../../Context/BatchContext'
import { AgoraContext } from '../../Context/AgoraContext'

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#fff',
    color: '#333333',
    bottom: 0,
    top: 'auto',
    boxShadow:
      '0px -2px 4px -1px rgb(0 0 0 / 20%), 0px -4px 5px 0px rgb(0 0 0 / 14%), 0px -1px 10px 0px rgb(0 0 0 / 12%)',
    zIndex: 1250,
  },
  iconLabel: {
    marginTop: 'unset',
    color: '#333',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
  navIcons: {
    padding: 4,
    color: '#333',
  },
  iconBorderLeft: {
    borderLeft: '1px solid #d8d8d8',
  },
  settingHeading: {
    fontWeight: 'bold',
    paddingLeft: 20,
    fontSize: 18,
  },
  popover: {
    '& .MuiPopover-paper': {
      borderRadius: 12,
      paddingTop: 30,
    },
  },
  batchCode: {
    padding: 6,
    backgroundColor: 'rgba(216,216,216,0.5)',
    '& p': {
      fontSize: 14,
      textAlign: 'center',
    },
  },
  chipTime: {
    width: '96px',
    borderRadius: '4px',
    border: 'solid 1px rgba(0, 0, 0, 0.4)',
    backgroundColor: 'unset',
  },
  chip: {
    backgroundColor: 'unset',
  },
  closeEdviBoardBtn: {
    padding: '0.5rem 0',
    backgroundImage: 'unset',
    backgroundColor: '#f44236',
  },
  padding1: {
    padding: '5px',
  },
  horizontalCenter: {
    left: '50%',
    transform: 'translateX(-50%)',
  },
  closeBtn: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding: 6,
  },
  activeBtn: {
    border: 'solid 1px #999999',
  },
  formControl: {
    marginRight: 'unset',
  },
})

const VideoControls = ({
  isScreenShared,
  shareScreen,
  stopShareScreen,
  isAudioMuted,
  isVideoMuted,
  leaveVideoAndChat,
  enrolledStudents,
  sendCommandToChannel,
  RTMJoined,
  isLoading,
  batchId,
}) => {
  const classes = useStyles()
  const { timeOfClassStart, speakerUid } = useContext(AgoraContext)
  const { batchByCode, EndBatchLecture, FindBatchWithCode } =
    useContext(BatchContext)
  const {
    setIsLiveBoardActive,
    isLiveBoardActive,
    teacherDoubts,
    isDeviceControlsWithUser,
    giveAVPermissionToStudent,
    setGiveAVPermissionToStudent,
    AVState,
    setAVState,
  } = useContext(AgoraContext)
  const { authState } = useContext(AuthContext)
  const [confirmLeave, setConfirmLeave] = useState(false)
  const [anchorEl, setAnchorEl] = useState(false)
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (authState.role !== 'T' || !RTMJoined) return
    if (giveAVPermissionToStudent) {
      sendCommandToChannel('AGORA', 'CONTROLS_GRANTED')
    } else {
      sendCommandToChannel('AGORA', 'CONTROLS_REVOKED')
    }
  }, [RTMJoined, giveAVPermissionToStudent])

  const handleShareScreen = () => {
    updateAVState('video', false)
    shareScreen()
  }

  const handleLeaveClass = () => {
    if (authState.role === 'S') {
      leaveVideoAndChat.current()
    } else if (authState.role === 'T') {
      setConfirmLeave(true)
    }
  }

  const handleWhiteBoard = () => {
    if (authState.role === 'T' && !isLiveBoardActive) {
      handleShareScreen()
    } else if (authState.role === 'T' && isLiveBoardActive) {
      stopShareScreen()
    }
    setIsLiveBoardActive((isActive) => !isActive)
  }

  const getSpeakerName = () => {
    if (speakerUid === batchByCode.owner) {
      if (authState.role === 'T') {
        return `You - ${authState.name}`
      }
      return `Teacher`
    }
    const val = enrolledStudents.find((student) => student.id === speakerUid)
    if (val) {
      return val.name
    }

    return 'Guest'
  }

  const openSettingMenu = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const closeSettingMenu = () => {
    setAnchorEl(null)
  }

  const showNotification = () => {
    showSuccessSnackbar(enqueueSnackbar, 'Copied to Clipboard')
  }

  const setPermission = () => {
    setGiveAVPermissionToStudent((perm) => !perm)
  }

  const updateAVState = (key, value) => {
    setAVState({
      ...AVState,
      [key]: value,
    })
  }

  return (
    <>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {!isLoading && (
            <>
              <ConfirmDialog
                open={confirmLeave}
                setOpen={setConfirmLeave}
                title="End Live Class?"
                content={
                  teacherDoubts.filter((doubt) => doubt.state === 0).length > 0
                    ? `You still have ${
                        teacherDoubts.filter((doubt) => doubt.state === 0)
                          .length
                      } pending doubts. Do you still want to end live class?`
                    : 'Do you want to end live class?'
                }
                acceptButton="Yes, End class for all"
                rejectButton="No, I want to Refresh/Rejoin"
                videoControl
                yesAction={async () => {
                  sendCommandToChannel('CALL', 'END')
                  await EndBatchLecture(batchId)
                  await FindBatchWithCode(batchId)
                  leaveVideoAndChat.current()
                }}
                noAction={() => {}}
              />
              <Grid container alignItems="center">
                <Grid item xs={4}>
                  <Grid container alignItems="center" justify="flex-start">
                    <Grid item xs={12} sm={4}>
                      <Chip
                        label={timeOfClassStart}
                        icon={<AccessTimeIcon />}
                        size="small"
                        className={classes.chipTime}
                      />
                    </Grid>
                    {speakerUid && (
                      <Grid item xs={12} sm={4}>
                        <Chip
                          label={
                            speakerUid === batchByCode.owner
                              ? authState.user_id === speakerUid
                                ? `You - ${authState.name}`
                                : 'Teacher'
                              : getSpeakerName()
                          }
                          size="small"
                          icon={<VolumeUpIcon />}
                          className={classes.chip}
                        />
                      </Grid>
                    )}
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container alignItems="center" justify="flex-start">
                    {!isAudioMuted && (
                      <Grid item sm={4} className="text-align-right">
                        <IconButton
                          disabled={!isDeviceControlsWithUser}
                          onClick={() => {
                            updateAVState('audio', false)
                          }}
                          className={`${classes.navIcons} ${classes.activeBtn}`}
                        >
                          <MicIcon />
                        </IconButton>
                      </Grid>
                    )}
                    {isAudioMuted && (
                      <Grid item sm={4} className="text-align-right">
                        <IconButton
                          disabled={!isDeviceControlsWithUser}
                          onClick={() => {
                            updateAVState('audio', true)
                          }}
                          style={{
                            backgroundColor: isDeviceControlsWithUser
                              ? '#fc0303'
                              : '#fd6464',
                            padding: 6,
                          }}
                        >
                          <MicOffIcon htmlColor="#fff" />
                        </IconButton>
                      </Grid>
                    )}
                    {!isVideoMuted && (
                      <Grid item sm={4} className="text-align-center">
                        <IconButton
                          disabled={!isDeviceControlsWithUser}
                          onClick={() => {
                            updateAVState('video', false)
                          }}
                          className={`${classes.navIcons} ${classes.activeBtn}`}
                        >
                          <VideocamIcon />
                        </IconButton>
                      </Grid>
                    )}
                    {isVideoMuted && (
                      <Grid item sm={4} className="text-align-center">
                        <IconButton
                          disabled={!isDeviceControlsWithUser || isScreenShared}
                          onClick={() => {
                            updateAVState('video', true)
                          }}
                          style={{
                            backgroundColor:
                              isDeviceControlsWithUser && !isScreenShared
                                ? '#fc0303'
                                : '#fd6464',
                            padding: 6,
                          }}
                        >
                          <VideocamOffIcon htmlColor="#fff" />
                        </IconButton>
                      </Grid>
                    )}
                    <Grid item sm={4} className="text-align-left">
                      <IconButton
                        style={{ backgroundColor: '#fc0303', padding: 6 }}
                        onClick={() => {
                          handleLeaveClass()
                        }}
                      >
                        <CallEndOutlinedIcon htmlColor="#fff" />
                      </IconButton>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={4}>
                  <Grid container alignItems="center" justify="flex-end">
                    {authState.role === 'T' && !isLiveBoardActive && (
                      <Grid item sm={4} className={classes.iconBorderLeft}>
                        <IconButton
                          onClick={() => {
                            if (isScreenShared) {
                              setIsLiveBoardActive(true)
                            } else {
                              handleWhiteBoard()
                            }
                          }}
                          className={`${classes.navIcons} ${classes.horizontalCenter}`}
                        >
                          <TvIcon />
                        </IconButton>
                        <Grid item sm={12}>
                          <div>
                            <p className={classes.iconLabel}>Edvi Board</p>
                          </div>
                        </Grid>
                      </Grid>
                    )}

                    {authState.role === 'T' && isLiveBoardActive && (
                      <Grid
                        item
                        sm={4}
                        className={`${classes.iconBorderLeft} ${classes.padding1}`}
                      >
                        <Controls.Button
                          text=" Close Edvi Board"
                          onClick={() => {
                            if (isScreenShared) {
                              handleWhiteBoard()
                            } else {
                              setIsLiveBoardActive(false)
                            }
                          }}
                          className={classes.closeEdviBoardBtn}
                        />
                      </Grid>
                    )}

                    {!isScreenShared && authState.role === 'T' && (
                      <Grid item sm={4} className={classes.iconBorderLeft}>
                        <IconButton
                          onClick={() => {
                            handleShareScreen()
                          }}
                          className={`${classes.navIcons} ${classes.horizontalCenter}`}
                        >
                          <ScreenShareIcon />
                        </IconButton>
                        <Grid item sm={12}>
                          <div>
                            <p className={classes.iconLabel}>Present Screen</p>
                          </div>
                        </Grid>
                      </Grid>
                    )}
                    {isScreenShared && authState.role === 'T' && (
                      <Grid item sm={4} className={classes.iconBorderLeft}>
                        <IconButton
                          disabled
                          className={`${classes.navIcons} ${classes.horizontalCenter}`}
                        >
                          <ScreenShareIcon />
                        </IconButton>
                        <Grid item sm={12}>
                          <div>
                            <p className={classes.iconLabel}>
                              You are presenting
                            </p>
                          </div>
                        </Grid>
                      </Grid>
                    )}
                    <Popover
                      open={Boolean(anchorEl)}
                      anchorEl={anchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'center',
                      }}
                      transformOrigin={{
                        vertical: 'center',
                        horizontal: 'center',
                      }}
                      className={classes.popover}
                    >
                      <IconButton
                        onClick={closeSettingMenu}
                        className={classes.closeBtn}
                      >
                        <IoIosClose />
                      </IconButton>
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
                      <div className={classes.batchCode}>
                        <p>
                          Batch Code:{' '}
                          <span className="bold">{batchByCode.id}</span>
                          <CopyToClipboard text={batchByCode.id}>
                            <IconButton
                              onClick={showNotification}
                              color="inherit"
                            >
                              <MdContentCopy size={16} />
                            </IconButton>
                          </CopyToClipboard>
                        </p>
                      </div>
                    </Popover>

                    <Grid item sm={4} className={classes.iconBorderLeft}>
                      <IconButton
                        onClick={openSettingMenu}
                        className={`${classes.navIcons} ${classes.horizontalCenter}`}
                      >
                        <SettingsIcon />
                      </IconButton>
                      <Grid item sm={12}>
                        <div>
                          <p className={classes.iconLabel}>Settings</p>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Toolbar>
      </AppBar>
    </>
  )
}

export default VideoControls
