import React, { useContext, useState, useEffect } from 'react'
import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Card,
} from '@material-ui/core'
import { Alert } from '@material-ui/lab'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { IoCloseSharp } from 'react-icons/io5'
import { BatchContext } from '../../Context/BatchContext'
import Controls from '../Controls/Controls'
import Dialog from './Dialog'

const BatchInfoCard = ({ batchByCode }) => {
  const classes = useStyles()
  return (
    <div>
      <p>Batch Details</p>
      <Card variant="outlined" className={classes.card}>
        <div className={classes.card_body}>
          <p className={classes.title}>{batchByCode.name}</p>
        </div>
        <Divider />
        <div className={classes.card_body}>
          <div>
            <p className={classes.small_heading}>Batch Code</p>
            <p className={classes.info}>{batchByCode.id}</p>
          </div>
          <div>
            <p className={classes.small_heading}>Subject</p>
            <p className={classes.info}>{batchByCode.subject}</p>
          </div>
          <div>
            <p className={classes.small_heading}>Class</p>
            <p className={classes.info}>{batchByCode.standard}</p>
          </div>
        </div>
        <div className={classes.card_body}>
          <div>
            <p className={classes.small_heading}>Teacher&apos;s Name</p>
            <p className={classes.info}>{batchByCode.owner_name}</p>
          </div>
        </div>
      </Card>
    </div>
  )
}

function JoinBatchDialog({ open, onClose, allReqAndBatches }) {
  const classes = useStyles()
  const [batchCode, setBatchCode] = useState('')
  const {
    FindBatchWithCode,
    batchByCode,
    setBatchByCode,
    RequestBatch,
    getAllReqAndBatches,
    noBatchFound,
    // allReqAndBatches,
  } = useContext(BatchContext)
  const [alreadyBatch, setAlreadyBatch] = useState(false)
  const [alreadyRequest, setAlreadyRequest] = useState(false)

  const { batch, request } = allReqAndBatches

  useEffect(() => {
    setBatchByCode('')
  }, [])

  const handleFindBatch = () => {
    if (batch.find((ele) => ele.id === parseInt(batchCode, 10))) {
      setAlreadyBatch(true)
      setTimeout(() => setAlreadyBatch(false), 4000)
    } else if (
      request.find((ele) => ele.batch_id === parseInt(batchCode, 10))
    ) {
      setAlreadyRequest(true)
      setTimeout(() => setAlreadyRequest(false), 4000)
    } else {
      FindBatchWithCode(batchCode)
    }
  }

  const handleChange = (e) => {
    setBatchCode(e.target.value)
  }

  const handleDialogClose = () => {
    onClose()
    setBatchCode('')
    setBatchByCode('')
  }

  const handleJoinBatch = async () => {
    await RequestBatch(batchCode)
    handleDialogClose()
    getAllReqAndBatches()
  }

  return (
    <Dialog open={open} fullWidth maxWidth="xs">
      <DialogTitle>
        <div className={classes.header}>
          <p className="sub-text bold text-align-center">Join Batch</p>
          <IconButton className={classes.close} onClick={handleDialogClose}>
            <IoCloseSharp />
          </IconButton>
        </div>
      </DialogTitle>
      <Divider />
      <DialogContent>
        <div className={classes.input_div}>
          <p className={classes.infoText}>Batch Code</p>
          <Controls.Input
            name="Batch Id"
            value={batchCode}
            onChange={handleChange}
            className={classes.input}
            placeholder="Enter Batch Code"
            disabled={batchByCode}
            autoFocus
          />
        </div>
        {batchByCode && <BatchInfoCard batchByCode={batchByCode} />}
      </DialogContent>
      {alreadyBatch && (
        <Alert severity="warning" color="error" className={classes.alert}>
          <p>You are already part of this Batch.</p>
          <p>Please try another batch code.</p>
        </Alert>
      )}
      {alreadyRequest && (
        <Alert severity="warning" color="error" className={classes.alert}>
          <p>Your request is already pending in this Batch.</p>
          <p>Please try another batch code.</p>
        </Alert>
      )}
      {noBatchFound && (
        <Alert severity="warning" color="error" className={classes.alert}>
          <p>No Batch exist with above entered batch code.</p>
          <p>Please check and re-enter.</p>
        </Alert>
      )}
      <Divider />
      <DialogActions>
        <div className={classes.btn_div}>
          {batchByCode ? (
            <Controls.Button
              text="Join Batch"
              className={classes.btn}
              disabled={!batchCode}
              onClick={handleJoinBatch}
            />
          ) : (
            <Controls.Button
              text="Request Batch Details"
              className={classes.btn}
              disabled={!batchCode}
              onClick={handleFindBatch}
            />
          )}
        </div>
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
      paddingLeft: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    input_div: {
      paddingBlock: 20,
    },
    input: {
      width: '100%',
      paddingBlock: 5,
    },
    infoText: {
      fontWeight: 'bold',
    },
    btn: {
      backgroundColor: '#6481e4',
      '&:hover': {
        backgroundColor: '#6481e4',
      },
      marginInline: 20,
      alignSelf: 'center',
    },
    btn_div: {
      width: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingBlock: 15,
    },
    card: {
      backgroundColor: '#f3f3fe',
    },
    card_body: {
      display: 'flex',
      paddingInline: 20,
      paddingBlock: 10,
      justifyContent: 'space-between',
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#6481e4',
    },
    small_heading: {
      fontSize: 12,
      color: '#000',
      opacity: 0.8,
    },
    info: {
      fontWeight: 'bold',
    },
    alert: {
      '&.MuiAlert-standardError': {
        backgroundColor: '#eb34345a',
        borderRadius: 0,
        color: '#eb3434',
        padding: '15px 25px ',
      },
      '&.MuiAlert-standardError .MuiAlert-icon': {
        color: '#eb3434',
      },
    },
  }),
)

export default JoinBatchDialog
