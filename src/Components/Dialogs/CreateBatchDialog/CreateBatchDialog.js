import {
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  makeStyles,
} from '@material-ui/core'
import React, { useContext, useState } from 'react'
import { IoIosClose } from 'react-icons/io'
import Controls from '../../Controls/Controls'
import Dialog from '../Dialog'
import useForm from '../../../Hooks/useForm'
import { BatchContext } from '../../../Context/BatchContext'
import { boards, standards } from './batchOptions'
import Spinner from '../../Progress/Spinner'
import ScheduleClassDialog from '../ScheduleClassDialog/ScheduleClassDialog'
import BatchCreatedDialog from '../BatchCreatedDialog'

const CreateBatchDialog = ({
  open,
  setOpen,
  mode,
  name,
  standard,
  board,
  subject,
  batchId,
}) => {
  const classes = useStyles()
  const [loading, setLoading] = useState(false)
  const handleClose = () => {
    setOpen(false)
    resetForm()
  }
  const {
    CreateBatchTeacher,
    EditBatchTeacher,
    setTeacherBatches,
    batchByCode,
    setBatchByCode,
    GetTeacherBatches,
  } = useContext(BatchContext)

  const [newBatchId, setNewBatchId] = useState()
  const [openScheduleClass, setOpenScheduleClass] = useState(false)
  const [isBatchCreated, setIsBatchCreated] = useState(false)
  const [batchCreatedDialog, setBatchCreatedDialog] = useState(false)

  const handleOpenScheduleClass = () => {
    setOpenScheduleClass(true)
    handleClose()
  }

  const handleCloseScheduleClass = () => {
    setOpenScheduleClass(false)
    handleOpenBatchCreatedDialog()
  }

  const handleOpenBatchCreatedDialog = () => {
    setBatchCreatedDialog(true)
  }

  const handleCloseBatchCreatedDialog = () => {
    GetTeacherBatches()
    setBatchCreatedDialog(false)
  }

  const batchCreateFormData = {
    name: '',
    standard: '',
    custom_standard: '',
    board: '',
    custom_board: '',
    subject: '',
  }

  if (mode === 'edit') {
    batchCreateFormData.name = name
    batchCreateFormData.subject = subject
    const boardType = boards.find((boardOption) => boardOption.id === board)
    if (boardType) {
      batchCreateFormData.board = boardType.id
    } else {
      batchCreateFormData.board = 'other'
      batchCreateFormData.custom_board = board
    }
    const standardType = standards.find(
      (standardOption) => standardOption.id === standard,
    )
    if (standardType) {
      batchCreateFormData.standard = standardType.id
    } else {
      batchCreateFormData.standard = 'other'
      batchCreateFormData.custom_standard = standard
    }
  }

  const validate = (fieldValues = values) => {
    const temp = { ...errors }
    if ('name' in fieldValues)
      temp.name = fieldValues.name ? '' : 'This field is required.'
    if ('subject' in fieldValues)
      temp.subject = fieldValues.subject ? '' : 'This field is required.'

    setErrors({
      ...temp,
    })

    if (fieldValues === values)
      return Object.values(temp).every((x) => x === '')
  }

  const { values, errors, setErrors, handleInputChange, resetForm } = useForm(
    batchCreateFormData,
    true,
    validate,
  )

  const onSubmitHandler = async () => {
    setLoading(true)
    const payload = {
      name: values.name,
      standard:
        values.standard === 'other' ? values.custom_standard : values.standard,
      board: values.board === 'other' ? values.custom_board : values.board,
      subject: values.subject,
    }

    if (mode === 'edit') {
      const res = await EditBatchTeacher(batchId, payload)
      setLoading(false)
      if (res) {
        setTeacherBatches((batches) => {
          const rest = batches.filter((batch) => batch.id !== batchId)
          return [...rest, res]
        })
        if (batchByCode.id === batchId) {
          setBatchByCode(res)
        }
      }
      setOpen(false)
    } else {
      const res = await CreateBatchTeacher(payload)
      setLoading(false)

      if (res) {
        setNewBatchId(res.id)
        setIsBatchCreated(true)
        handleOpenScheduleClass()
      }
    }
  }

  return (
    <>
      <Dialog open={open} onClose={handleClose} className={classes.root}>
        <IconButton className={classes.closeBtn} onClick={handleClose}>
          <IoIosClose />
        </IconButton>
        <DialogTitle>
          {mode === 'edit' ? 'Edit Batch' : 'Create Batch'}
        </DialogTitle>
        <Divider />
        <DialogContent>
          <Grid container>
            <Grid item xs={12}>
              <div className="form-control width-100">
                <div className="form-control-label bold text-align-left">
                  Batch Name*
                </div>
                <Controls.Input
                  type="text"
                  name="name"
                  value={values.name}
                  onChange={handleInputChange}
                  placeholder="Batch Name"
                  error={errors.name}
                  style={{ width: '100%' }}
                  autoFocus
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="form-control width-100">
                <div className="form-control-label bold text-align-left">
                  Subject*
                </div>
                <Controls.Input
                  type="text"
                  name="subject"
                  value={values.subject}
                  onChange={handleInputChange}
                  placeholder="Subject"
                  error={errors.subject}
                  style={{ width: '100%' }}
                />
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="form-control width-100">
                <div className="form-control-label bold text-align-left">
                  Class
                </div>
                <Controls.Select
                  name="standard"
                  value={values.standard}
                  onChange={handleInputChange}
                  options={standards}
                  style={{ width: '100%', textAlign: 'left' }}
                />
                {values.standard === 'other' ? (
                  <Controls.Input
                    type="text"
                    name="custom_standard"
                    value={values.custom_standard}
                    onChange={handleInputChange}
                    placeholder="Please Specify"
                    style={{ width: '100%', marginTop: '1rem' }}
                  />
                ) : null}
              </div>
            </Grid>

            <Grid item xs={12}>
              <div className="form-control width-100">
                <div className="form-control-label bold text-align-left">
                  Board
                </div>
                <Controls.Select
                  name="board"
                  value={values.board}
                  onChange={handleInputChange}
                  options={boards}
                  style={{ width: '100%', textAlign: 'left' }}
                />
                {values.board === 'other' ? (
                  <Controls.Input
                    type="text"
                    name="custom_board"
                    value={values.custom_board}
                    onChange={handleInputChange}
                    placeholder="Please specify"
                    style={{ width: '100%', marginTop: '1rem' }}
                  />
                ) : null}
              </div>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Controls.Button
            size="large"
            onClick={onSubmitHandler}
            className={classes.btn}
            text={
              loading
                ? mode === 'edit'
                  ? 'SAVING'
                  : 'CREATING BATCH'
                : mode === 'edit'
                ? 'SAVE'
                : 'CREATE BATCH'
            }
            startIcon={
              loading ? (
                <Spinner
                  size={20}
                  style={{ marginLeft: 'unset', position: 'unset' }}
                  color="inherit"
                />
              ) : null
            }
            disabled={!values.name || !values.subject || !!loading}
          />
        </DialogActions>
      </Dialog>
      {openScheduleClass && (
        <ScheduleClassDialog
          open={openScheduleClass}
          close={handleCloseScheduleClass}
          batch_id={newBatchId}
          isBatchCreated={isBatchCreated}
          refreshFunction={() => {
            handleCloseScheduleClass()
            handleOpenBatchCreatedDialog()
          }}
        />
      )}
      {batchCreatedDialog && (
        <BatchCreatedDialog
          open={batchCreatedDialog}
          close={handleCloseBatchCreatedDialog}
          batchId={newBatchId}
        />
      )}
    </>
  )
}

export default CreateBatchDialog

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
  btn: {
    width: 'unset',
    margin: '0 auto 1rem',
  },
})
