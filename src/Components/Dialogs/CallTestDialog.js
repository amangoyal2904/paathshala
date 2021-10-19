import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import React, { useContext, useEffect, useState } from 'react'
import { IoIosClose } from 'react-icons/io'
import { AgoraContext } from '../../Context/AgoraContext'
import useForm from '../../Hooks/useForm'
import Controls from '../Controls/Controls'
import Form from '../Form/Form'
import MediaPlayerCallTest from '../Agora/MediaPlayerCallTest'
import Spinner from '../Progress/Spinner'
import Loader from '../Progress/Loader'
import SpeakerTestAlert from '../../Assets/Sounds/speaker_test_alert.mp3'
import Dialog from './Dialog'

const CallTestDialog = ({ open, handleClose }) => {
  const {
    GetCameras,
    GetMicrophones,
    allCameras,
    allMicrophones,
    testVolumeLevel,
    clearResources,
    localMediaTrack,
    setInputDeviceIds,
    inputDeviceIds,
    GetCameraStream,
    GetMicrophoneStream,
  } = useContext(AgoraContext)
  const [loading, setLoading] = useState(true)
  const classes = useStyles()
  const initialDeviceData = {
    cameraId: inputDeviceIds.cameraId,
    microphoneId: inputDeviceIds.microphoneId,
  }
  const { values, errors, resetForm, setValues } = useForm(initialDeviceData)
  useEffect(() => {
    async function init() {
      const cameras = await GetCameras()
      const microphones = await GetMicrophones()
      if (cameras && cameras.length > 0) {
        setInputDeviceIds((devices) => ({
          ...devices,
          cameraId: cameras[0].id,
        }))
      }
      if (microphones && microphones.length > 0) {
        setInputDeviceIds((devices) => ({
          ...devices,
          microphoneId: microphones[0].id,
        }))
      }
    }
    init()
  }, [])
  useEffect(() => {
    if (!open) {
      return
    }
    async function getStreams() {
      setLoading(true)
      if (inputDeviceIds.cameraId !== '') {
        await GetCameraStream()
      }
      if (inputDeviceIds.microphoneId !== '') {
        await GetMicrophoneStream()
      }
      setLoading(false)
    }
    getStreams()
  }, [open])
  const closeDialog = () => {
    clearResources()
    resetForm()
    handleClose()
  }
  const handleSubmit = () => {
    closeDialog()
  }
  const handleInputChange = (e) => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value,
    })
    setInputDeviceIds(() => {
      if (name === 'cameraId') {
        GetCameraStream(value)
      } else {
        GetMicrophoneStream(value)
      }
      return {
        ...inputDeviceIds,
        [name]: value,
      }
    })
  }

  return (
    <Dialog open={open} onClose={closeDialog} fullWidth maxWidth="xs">
      <IconButton className={classes.closeBtn} onClick={handleClose}>
        <IoIosClose />
      </IconButton>
      <DialogTitle>
        <p className="sub-text bold text-align-center">
          Select and Test Devices
        </p>
      </DialogTitle>
      <Divider />
      <DialogContent>
        {loading && <Spinner />}
        {!loading && (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Form>
                <div className="form-control width-100">
                  <div className="form-control-label bold">Select Camera</div>
                  <MediaPlayerCallTest
                    videoTrack={localMediaTrack.localVideoTrack}
                    className={classes.videoTrack}
                  />
                  <Controls.Select
                    label="Select Camera"
                    name="cameraId"
                    value={values.cameraId}
                    onChange={handleInputChange}
                    error={errors.cameraId}
                    options={allCameras}
                  />
                </div>
                <div className="form-control width-100">
                  <div className="form-control-label bold">
                    Select Microphone
                  </div>
                  <Loader value={testVolumeLevel} className={classes.loader} />
                  <Controls.Select
                    label="Select Microphone"
                    name="microphoneId"
                    value={values.microphoneId}
                    onChange={handleInputChange}
                    error={errors.microphoneId}
                    options={allMicrophones}
                  />
                </div>
                <div className="form-control width-100">
                  <div className="form-control-label bold">
                    Play Audio to Test Speakers
                  </div>
                  <audio controls className={classes.audio} loop preload="auto">
                    <source src={SpeakerTestAlert} />
                    <p className="fine-text bold">
                      Your browser does not support the audio element, you need
                      that to test your speakers
                    </p>
                  </audio>
                </div>
              </Form>
            </Grid>
          </Grid>
        )}
      </DialogContent>
      <Divider />
      <DialogActions>
        <Controls.Button
          text="Continue"
          onClick={handleSubmit}
          className={classes.btn}
        />
      </DialogActions>
    </Dialog>
  )
}
export default CallTestDialog

const useStyles = makeStyles(() =>
  createStyles({
    closeBtn: {
      position: 'absolute',
      right: 12,
      top: 12,
    },
    videoTrack: {
      width: '100%',
      height: '180px',
    },
    loader: {
      marginTop: '1rem',
      marginBottom: '0.7rem',
    },
    audio: {
      width: '100%',
      outline: 'none',
    },
    btn: {
      margin: '1rem',
    },
  }),
)
