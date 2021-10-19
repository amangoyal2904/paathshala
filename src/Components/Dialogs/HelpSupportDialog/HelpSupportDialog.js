import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import React, { useState } from 'react'
import { IoIosClose } from 'react-icons/io'
import { ImAttachment } from 'react-icons/im'
import { useSnackbar } from 'notistack'
import Controls from '../../Controls/Controls'
import { supportCategory } from './supportOptions'
import HelpSupport from '../../../Assets/Images/help-support.svg'
import FileCard from '../../Cards/FileCard'
import axiosPost from '../../../Global/Axios/axiosPost'
import showSuccessSnackbar from '../../Snackbar/successSnackbar'
import Dialog from '../Dialog'
import showErrorSnackbar from '../../Snackbar/errorSnackbar'

const HelpSupportDialog = ({ open, setOpen }) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()

  const [subject, setSubject] = useState('issues_live_class')
  const [description, setDescription] = useState('')
  const [attachments, setAttachments] = useState([])
  const [isSelected, setIsSelected] = useState(false)
  const [errors, setErrors] = useState({
    description: '',
  })

  const handleSubjectChange = (e) => {
    setSubject(e.target.value)
  }

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value)
    validate()
  }

  const changeHandler = (e) => {
    for (let i = 0; i < e.target.files.length; i += 1) {
      setAttachments(attachments.concat(e.target.files[i]))
    }
    setIsSelected(true)
  }

  const validate = () => {
    if (description.length <= 10) {
      setErrors((err) => ({
        ...err,
        description: 'Please elaborate on the issue',
      }))
    } else {
      setErrors((err) => ({
        ...err,
        description: '',
      }))
    }
  }

  const handleSubmission = async () => {
    validate()
    if (errors.description.length === 0) {
      const formData = new FormData()
      formData.append('subject', subject)
      formData.append('description', description)
      for (let i = 0; i < attachments.length; i += 1) {
        formData.append('attachments', attachments[i])
      }

      try {
        const token = localStorage.getItem('access')
        const config = {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
        await axiosPost(`/support/`, {
          data: formData,
          headers: config.headers,
        })
        showSuccessSnackbar(enqueueSnackbar, 'Ticket Raised Successfully')
        handleClose()
      } catch (err) {
        showErrorSnackbar(enqueueSnackbar, "Request Couldn't be Submitted")
      }
    }
  }

  const handleClose = () => {
    setOpen(false)
    setAttachments([])
    setSubject('issues_live_class')
    setDescription('')
    setIsSelected(false)
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        className={classes.root}
        maxWidth="md"
        fullWidth
      >
        <Grid container>
          <Grid item xs={6} className={classes.content_right}>
            <div className="text-align-center">
              <img
                src={HelpSupport}
                alt="Help & Support"
                className="margin-top-medium margin-bottom-small"
              />
              <h3 className={`fine-text ${classes.heading1}`}>
                You can also Call/Whatsapp us to help us resolve your concern
              </h3>
              <h3 className={`sub-text bold ${classes.heading2}`}>
                1800-180-55-77
              </h3>
            </div>
          </Grid>
          <Grid item xs={6}>
            <IconButton className={classes.closeBtn} onClick={handleClose}>
              <IoIosClose />
            </IconButton>
            <DialogTitle>Help & Support</DialogTitle>
            <Divider />
            <DialogContent>
              <Grid container>
                <Grid item xs={12}>
                  <div className="form-control width-100">
                    <div className="form-control-label bold text-align-left">
                      Ticket Type *
                    </div>
                    <Controls.Select
                      name="subject"
                      value={subject}
                      onChange={handleSubjectChange}
                      options={supportCategory}
                      style={{ width: '100%', textAlign: 'left' }}
                      error={errors.subject}
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div className="form-control width-100">
                    <div className="form-control-label bold text-align-left">
                      Description *
                    </div>
                    <Controls.Input
                      placeholder="Have feedback or facing any issue? We'd love to hear it."
                      multiline
                      rows={5}
                      style={{ width: '100%' }}
                      value={description}
                      onChange={handleDescriptionChange}
                      error={errors.description}
                      autoFocus
                    />
                  </div>
                </Grid>
                <Grid item xs={12}>
                  <div>
                    <input
                      className={classes.upload}
                      name="attachments"
                      id="upload"
                      onChange={changeHandler}
                      type="file"
                      multiple
                      accept="image/jpeg,image/png,application/pdf,image/jpg"
                    />
                    {isSelected ? (
                      <Grid container spacing={1} alignItems="stretch">
                        {attachments.map((attachment) => (
                          <Grid
                            item
                            xs={6}
                            sm={4}
                            md={4}
                            key={`${attachment.lastModified}+${attachment.size}`}
                          >
                            <FileCard
                              name={attachment.name}
                              size={attachment.size}
                            />
                          </Grid>
                        ))}

                        <Grid item xs={6} sm={4} md={4}>
                          <label htmlFor="upload">
                            <FileCard add />
                          </label>
                        </Grid>
                      </Grid>
                    ) : (
                      <label htmlFor="upload">
                        <div className={classes.empty_upload_div}>
                          <IconButton>
                            <ImAttachment />
                          </IconButton>
                          Attachment
                        </div>
                      </label>
                    )}
                  </div>
                </Grid>
              </Grid>
            </DialogContent>
            <DialogActions>
              <Controls.Button
                size="large"
                text="Send Feedback"
                onClick={handleSubmission}
                className={classes.btn}
              />
            </DialogActions>
          </Grid>
        </Grid>
      </Dialog>
    </>
  )
}

export default HelpSupportDialog

const useStyles = makeStyles({
  root: {
    '& .MuiPaper-root': {
      borderRadius: 18,
      backgroundColor: '#ffffff',
    },
    '& .MuiTypography-h6': {
      fontSize: '1.5rem',
      fontWeight: 600,
      textAlign: 'center',
    },
    '& .MuiDialogContent-root': {
      color: '#333',
      fontSize: '1.125rem',
      textAlign: 'center',
    },
  },
  content_right: {
    backgroundColor: '#f2f5fe',
  },
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  upload: {
    display: 'none',
  },
  empty_upload_div: {
    width: '38%',
    height: 70,
    margin: '10px 0',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: '5px',
    '&:hover': {
      cursor: 'pointer',
    },
  },
  heading1: {
    padding: '0 10%',
  },
  heading2: {
    color: '#6482e4',
  },
  btn: {
    width: 'unset',
    margin: '0 auto',
  },
})
