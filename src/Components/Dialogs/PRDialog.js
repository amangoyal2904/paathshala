import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/styles'
import React, { useContext } from 'react'
import { BatchContext } from '../../Context/BatchContext'
import Controls from '../Controls/Controls'
import StudentAdmissionList from '../Lists/StudentAdmissionList'
import Dialog from './Dialog'

const PRDialog = ({ open, onClose, goNext }) => {
  const { studentRequestByBatchId } = useContext(BatchContext)

  const handleClose = () => {
    onClose()
  }

  const openAVDialog = () => {
    onClose()
    goNext()
  }

  const classes = useStyles()

  return (
    <Dialog open={open} onClose={handleClose} fullWidth={false}>
      <DialogTitle>
        <p className="sub-text bold text-align-center">Pending Requests</p>
        <p
          className={`fine-text bold secondary-text text-align-center ${classes.textMargin}`}
        >
          You have following requests pending. Do you want to take action on it?
        </p>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <StudentAdmissionList
          items={studentRequestByBatchId.filter(
            (request) => request.status === 'D',
          )}
        />
      </DialogContent>
      <Divider />
      <DialogActions>
        <Controls.Button
          text="Continue"
          onClick={openAVDialog}
          className={classes.btn}
        />
      </DialogActions>
    </Dialog>
  )
}

export default PRDialog

const useStyles = makeStyles(() =>
  createStyles({
    textMargin: {
      marginTop: 0,
    },
    btn: {
      margin: '1rem',
    },
  }),
)
