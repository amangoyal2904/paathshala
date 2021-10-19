import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import React from 'react'
import { IoIosClose } from 'react-icons/io'
import Controls from '../Controls/Controls'
import Dialog from './Dialog'

const GrantPermissionDialog = ({ open, handleClose }) => {
  const classes = useStyles()
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      className={classes.root}
      fullWidth={false}
    >
      <IconButton className={classes.closeBtn} onClick={handleClose}>
        <IoIosClose />
      </IconButton>
      <DialogTitle>Camera & Mic Permission</DialogTitle>
      <DialogContent>
        edvi needs Camera and Microphone permissions to let you join live
        classes.
      </DialogContent>
      <Divider />
      <DialogActions className={classes.actionStyle}>
        <Controls.Button
          size="medium"
          text="How to grant Permission - Learn Now"
          onClick={() => {}}
        />
      </DialogActions>
    </Dialog>
  )
}

export default GrantPermissionDialog

const useStyles = makeStyles({
  root: {
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
  closeBtn: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  actionStyle: {
    margin: '1rem',
  },
})
