import React, { useState, useContext } from 'react'
import { DialogTitle, Divider } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { Rating } from '@material-ui/lab'
import axiosPost from '../../Global/Axios/axiosPost'
import { AuthContext } from '../../Context/AuthContext'
import Controls from '../Controls/Controls'
import Dialog from './Dialog'

const RateTeacherDialog = ({ open, close, lectureId }) => {
  const classes = useStyles()
  const { getAuthHeader } = useContext(AuthContext)
  const [teacherRating, setTeacherRating] = useState(5.0)

  const handleDialogClose = async () => {
    try {
      await axiosPost('/rating/', {
        data: {
          lecture: lectureId,
          teacher_rating: teacherRating,
        },
        headers: getAuthHeader(),
      })
    } finally {
      close()
      window.location.reload()
    }
  }

  return (
    <Dialog open={open}>
      <DialogTitle>
        <div className={classes.header}>
          <p className="sub-text bold text-align-center">Rate Your Teacher</p>
        </div>
      </DialogTitle>
      <Divider />
      <div className={classes.content}>
        <div className={classes.feedback}>
          <div>
            <p>Rate your Teacher. Your response will remain Anonymous</p>
          </div>
          <div className={classes.emoji_container}>
            <Rating
              name="teacher-rating"
              value={teacherRating}
              onChange={(e, value) => {
                setTeacherRating(value)
              }}
              max={5}
              className={classes.rating}
            />
          </div>
        </div>
      </div>
      <Divider />
      <div className={classes.btn_container_1}>
        <Controls.Button
          text="Cancel"
          style={{
            backgroundColor: '#585858',
            backgroundImage: 'unset',
            width: 'unset',
          }}
          size="medium"
          onClick={() => {
            close()
            window.location.reload()
          }}
        />
        <Controls.Button
          text="Submit"
          color="primary"
          className={classes.submitBtn}
          size="medium"
          onClick={handleDialogClose}
        />
      </div>
    </Dialog>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      padding: '0 0 0 20px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    rating: {
      fontSize: '5rem',
    },
    btn_container_1: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px 0',
    },

    submitBtn: {
      width: 'unset',
      marginLeft: '1rem',
    },
    feedback: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0',
    },
    content: {},
    emoji_container: {
      display: 'flex',
      padding: '20px 0',
    },
  }),
)

export default RateTeacherDialog
