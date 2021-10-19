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

const ConfirmDialog = ({
  open,
  setOpen,
  title,
  content,
  yesAction,
  noAction,
  acceptButton,
  rejectButton,
  videoControl,
}) => {
  const classes = useStyles()

  const handleClose = () => {
    setOpen(false)
  }

  const handleRefresh = () => {
    handleClose()
    window.location.reload()
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} className={classes.root}>
        <IconButton className={classes.closeBtn} onClick={handleClose}>
          <IoIosClose />
        </IconButton>
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>{content}</DialogContent>
        <Divider />
        <DialogActions className={classes.actionStyle}>
          <Controls.Button
            size="large"
            text={acceptButton || 'YES'}
            onClick={() => {
              yesAction()
              handleClose()
            }}
            style={{
              backgroundColor: '#585858',
              backgroundImage: 'unset',
            }}
          />
          <Controls.Button
            size="large"
            text={rejectButton || 'NO'}
            onClick={
              videoControl
                ? handleRefresh
                : () => {
                    noAction()
                    handleClose()
                  }
            }
          />
        </DialogActions>
      </Dialog>
    </>
  )
}

export default ConfirmDialog

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
