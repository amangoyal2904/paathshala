import React, { useState, useContext, useEffect } from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Grid,
  LinearProgress,
  Box,
  Typography,
} from '@material-ui/core'
import { IoCloseSharp } from 'react-icons/io5'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Controls from '../Controls/Controls'
import { BatchContext } from '../../Context/BatchContext'
import FileCard from '../Cards/FileCard'
import Dialog from './Dialog'

const LinearProgressWithLabel = (props) => (
  <Box display="flex" alignItems="center">
    <Box width="100%" mr={1}>
      <LinearProgress variant="determinate" {...props} />
    </Box>
    <Box minWidth={35}>
      <Typography variant="body2" color="textSecondary">{`${Math.round(
        props.value,
      )}%`}</Typography>
    </Box>
  </Box>
)

const UploadDialog = ({
  open,
  closeDialog,
  title,
  id,
  GetNotes,
  uploadPercent,
  setUploadPercent,
}) => {
  const classes = useStyles()
  const [files, setFiles] = useState([])
  const [isSelected, setIsSelected] = useState(false)
  const [noteTitle, setNoteTitle] = useState('')
  const [errors, setErrors] = useState({
    title: '',
  })
  const [allowSubmit, setAllowSubmit] = useState(false)

  const { UploadNotes } = useContext(BatchContext)

  const onClose = () => {
    closeDialog()
    setIsSelected(false)
    setNoteTitle('')
    setFiles([])
    setUploadPercent('')
  }

  const changeHandler = (e) => {
    setFiles(e.target.files)
    setIsSelected(true)
  }

  const handleNoteTitleChange = async (event) => {
    await setNoteTitle(event.target.value)
  }

  const validate = () => {
    if (noteTitle.length < 1) {
      setErrors({ ...errors, title: 'Please provide the title' })
    } else {
      setErrors({ ...errors, title: '' })
    }
  }

  useEffect(() => {
    validate()
  }, [noteTitle])

  useEffect(() => {
    if (errors.title.length === 0 && files.length !== 0) {
      setAllowSubmit(true)
    } else {
      setAllowSubmit(false)
    }
  }, [errors, files])

  const handleSubmission = async () => {
    validate()
    if (errors.title.length === 0) {
      const formData = new FormData()
      formData.append('batch', id)
      formData.append('name', noteTitle)
      formData.append('file', files[0])

      await UploadNotes(formData).then((res) => {
        if (!res.success) {
          setErrors({ ...errors, title: 'Please provide the title' })
        } else {
          onClose()
          setIsSelected(false)
          GetNotes(id)
        }
      })
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        <div className={classes.header}>
          <p className="sub-text bold text-align-center">Upload {title}</p>
          <IconButton className={classes.close} onClick={onClose}>
            <IoCloseSharp />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div>
          <p className={classes.infoText}>{title} Title</p>
          <Controls.Input
            className={classes.input}
            placeholder={`Enter ${title} Title`}
            value={noteTitle}
            autoFocus
            onChange={handleNoteTitleChange}
            error={errors.title}
          />
        </div>
        <div>
          <p className={classes.infoText}>Upload {title}</p>
          <input
            className={classes.upload}
            id="upload"
            onChange={changeHandler}
            type="file"
            accept="image/jpeg,image/png,application/pdf,image/jpg"
          />
          {isSelected ? (
            <Grid container spacing={1} alignItems="stretch">
              {Object.keys(files).map((item) => (
                <Grid item xs={12} sm={12} md={12}>
                  <FileCard name={files[item].name} size={files[item].size} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <label htmlFor="upload">
              <div className={classes.empty_upload_div}>
                <p>+ Click to Upload File </p>
                <p>Files Supported: jpeg, png & pdf</p>
              </div>
            </label>
          )}
        </div>
      </DialogContent>
      <Divider />
      {uploadPercent && <LinearProgressWithLabel value={uploadPercent} />}
      <DialogActions className={classes.actions}>
        <Controls.Button variant="outlined" onClick={onClose}>
          Cancel
        </Controls.Button>
        <Controls.Button disabled={!allowSubmit} onClick={handleSubmission}>
          Upload
        </Controls.Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    close: {
      position: 'absolute',
      right: 10,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      padding: '0 0 0 20px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      paddingBlock: 10,
    },
    infoText: {
      fontWeight: 'bold',
    },
    upload: {
      display: 'none',
    },
    empty_upload_div: {
      border: '1px dotted black',
      width: '100%',
      height: 160,
      margin: '10px 0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: '5px',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    upload_div: {
      border: '1px dotted black',
      width: '100%',
      height: 160,
      padding: '10px 0',
      margin: '10px 0',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      borderRadius: '5px',
    },
    card: {
      height: 160,
      border: '1px solid grey',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px 0',
    },
    add: {
      height: 160,
      border: '1px solid grey',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px 0',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    actions: {
      margin: '1rem',
    },
  }),
)

export default UploadDialog
