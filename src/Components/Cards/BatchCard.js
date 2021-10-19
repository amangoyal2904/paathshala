import React, { useState, useContext } from 'react'
import CardContent from '@material-ui/core/CardContent'
import IconButton from '@material-ui/core/IconButton'
import Divider from '@material-ui/core/Divider'
import Grid from '@material-ui/core/Grid'
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component'
import { Menu, MenuItem } from '@material-ui/core'
import { Link, useHistory } from 'react-router-dom'
import { useSnackbar } from 'notistack'
import { FiEdit } from 'react-icons/fi'
import { CgMore } from 'react-icons/cg'
import { MdContentCopy } from 'react-icons/md'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Controls from '../Controls/Controls'
import showSuccessSnackbar from '../Snackbar/successSnackbar'
import CreateBatchDialog from '../Dialogs/CreateBatchDialog/CreateBatchDialog'
import ScheduleClassDialog from '../Dialogs/ScheduleClassDialog/ScheduleClassDialog'
import { BatchContext } from '../../Context/BatchContext'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import AVDialog from '../Dialogs/AVDialog'
import Card from './Card'
import BootstrapTooltip from '../Tooltips/BootstrapTooltip'
import {
  ConvertTime,
  displayCondition,
  ConvertTimeTo24Hours,
  ReturnMonth,
} from '../../Global/Functions'

const BatchCard = ({ batch }) => {
  const classes = useStyles()
  const [batchMenu, setBatchMenu] = useState(null)
  const [openScheduleClass, setOpenScheduleClass] = useState(false)
  const history = useHistory()
  const [openEditBatch, setOpenEditBatch] = useState(false)
  const {
    EndBatchLecture,
    GetTeacherBatches,
    ResumeBatchLecture,
    StartBatchLecture,
  } = useContext(BatchContext)
  const [continueButtonLoading, setContinueButtonLoading] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const [openAVDialog, setOpenAVDialog] = useState(false)

  const handleAVDialogOpen = () => {
    setOpenAVDialog(true)
  }

  const handleAVDialogClose = () => {
    setOpenAVDialog(false)
  }

  const handleOpenBatchMenu = (event) => {
    setBatchMenu(event.currentTarget)
  }

  const handleCloseBatchMenu = () => {
    setBatchMenu(null)
  }

  const handleOpenScheduleClass = () => {
    setOpenScheduleClass(true)
  }

  const handleCloseScheduleClass = () => {
    setOpenScheduleClass(false)
  }

  const handleEditBatch = () => {
    setOpenEditBatch(true)
  }

  const { enqueueSnackbar } = useSnackbar()

  const showNotification = () => {
    showSuccessSnackbar(enqueueSnackbar, 'Copied to clipboard')
  }

  const NextClass = (t) => {
    const date = ConvertTime(t)
    const day = date.getDate()
    const month = ReturnMonth(date.getMonth())
    const year = date.getFullYear().toString().slice(2, 4)
    const time = ConvertTimeTo24Hours(date.toTimeString().slice(0, 5))
    return `${day} ${month},${year} ${time}`
  }

  const handleGoToClass = async () => {
    setContinueButtonLoading(true)
    try {
      const res = await StartBatchLecture(batch.id)
      const {
        // eslint-disable-next-line camelcase
        app_id,
        // eslint-disable-next-line camelcase
        rtc_token,
        // eslint-disable-next-line camelcase
        rtm_token,
        // eslint-disable-next-line camelcase
        started_at,
        // eslint-disable-next-line camelcase
        liveboard_url,
        // eslint-disable-next-line camelcase
        lecture_id,
      } = res
      setContinueButtonLoading(false)
      history.push({
        // eslint-disable-next-line camelcase
        pathname: `/dashboard/class/${lecture_id}`,
        state: {
          startClass: true,
          appId: app_id,
          RTCToken: rtc_token,
          RTMToken: rtm_token,
          classStartTime: started_at,
          liveboard_url,
          role: 'T',
          batchId: batch.id,
        },
      })
    } catch (err) {
      setContinueButtonLoading(false)
    }
  }

  const handleResumeLecture = async () => {
    setContinueButtonLoading(true)
    try {
      const res = await ResumeBatchLecture(batch.lecture.id)
      // eslint-disable-next-line camelcase
      const { app_id, rtc_token, rtm_token, started_at, liveboard_url } =
        res.data
      history.push({
        pathname: `/dashboard/class/${batch.lecture.id}`,
        state: {
          startClass: true,
          appId: app_id,
          RTCToken: rtc_token,
          RTMToken: rtm_token,
          classStartTime: started_at,
          liveboard_url,
          role: 'T',
          batchId: batch.id,
        },
      })
      setContinueButtonLoading(false)
    } catch (err) {
      setContinueButtonLoading(false)
    }
  }

  const handleEndLecture = async () => {
    await EndBatchLecture(batch.id)
    GetTeacherBatches()
  }

  return (
    <>
      <CreateBatchDialog
        open={openEditBatch}
        setOpen={setOpenEditBatch}
        mode="edit"
        name={batch.name}
        subject={batch.subject}
        standard={batch.standard}
        board={batch.board}
        batchId={batch.id}
      />
      <ConfirmDialog
        open={openConfirmDialog}
        setOpen={setOpenConfirmDialog}
        title="End Class"
        content="Are you sure you want to end this class"
        yesAction={handleEndLecture}
        noAction={() => setOpenConfirmDialog(false)}
      />
      <Menu
        id="batch-menu"
        anchorEl={batchMenu}
        keepMounted
        open={Boolean(batchMenu)}
        onClose={handleCloseBatchMenu}
      >
        <MenuItem onClick={() => handleEditBatch()}>
          <FiEdit style={{ padding: '0 5px' }} />
          Edit Batch
        </MenuItem>
      </Menu>

      <Card>
        <CardContent classes={{ root: classes.removeBottomPadding }}>
          <Grid container className={classes.first_grid}>
            <Grid item xs={10}>
              <Link
                to={`/dashboard/view/${batch.id}`}
                style={{ textDecoration: 'none', color: 'unset' }}
              >
                <div className="height-100 flex-row align-items-center">
                  <p
                    className="bolder"
                    style={{
                      marginLeft: '1rem',
                      color: '#5a8aeb',
                      fontSize: '1.125rem',
                    }}
                  >
                    {batch.name}
                  </p>
                </div>
              </Link>
            </Grid>
            <Grid item xs={2} style={{ paddingRight: '1rem' }}>
              <Grid container justify="flex-end">
                <Grid item>
                  <IconButton
                    aria-label="settings"
                    onClick={handleOpenBatchMenu}
                    className={classes.moreIcon}
                  >
                    <CgMore size={18} />
                  </IconButton>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Divider light />
          <Grid
            container
            className={classes.second_grid}
            justify="space-around"
          >
            <Grid item xs={5}>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <p className={classes.key}>Batch Code</p>
                </Grid>
                <Grid item xs={12}>
                  <BootstrapTooltip title={batch.id} placement="top">
                    <p className="fine-text bold" style={{ marginTop: 0 }}>
                      {batch.id}
                      <CopyToClipboard text={batch.id}>
                        <IconButton
                          onClick={showNotification}
                          color="inherit"
                          style={{ marginLeft: 4, opacity: 0.5 }}
                          size="small"
                        >
                          <MdContentCopy size={15} />
                        </IconButton>
                      </CopyToClipboard>
                    </p>
                  </BootstrapTooltip>
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={7} style={{ paddingLeft: 6 }}>
              <Link
                to={`/dashboard/view/${batch.id}`}
                style={{ textDecoration: 'none', color: 'unset' }}
              >
                <Grid container alignItems="flex-start">
                  <Grid item xs={6}>
                    <div className="flex-column">
                      <p className={classes.key}>Subject</p>
                      {batch.subject ? (
                        batch.subject.length > 8 ? (
                          <BootstrapTooltip
                            title={batch.subject}
                            placement="top"
                          >
                            <p className="fine-text bold">
                              {`${batch.subject.substring(0, 6)}..`}
                            </p>
                          </BootstrapTooltip>
                        ) : (
                          <p className="fine-text bold">{batch.subject}</p>
                        )
                      ) : (
                        <p className="fine-text bold">NA</p>
                      )}
                    </div>
                  </Grid>
                  <Grid item xs={6}>
                    <div className="flex-column" style={{ marginLeft: '25%' }}>
                      <p className={classes.key}>Class</p>
                      {batch.standard ? (
                        batch.standard.length > 8 ? (
                          <BootstrapTooltip
                            title={batch.standard}
                            placement="top"
                          >
                            <p className="fine-text bold">
                              {`${batch.standard.substring(0, 6)}..`}
                            </p>
                          </BootstrapTooltip>
                        ) : (
                          <p className="fine-text bold">{batch.standard}</p>
                        )
                      ) : (
                        <p className="fine-text bold">NA</p>
                      )}
                    </div>
                  </Grid>
                </Grid>
              </Link>
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.third_grid}
            justify="space-around"
            spacing={2}
          >
            <Grid item xs={5}>
              <p className={classes.key}>Next Class</p>
              {batch.next_lecture_timing ? (
                <p className="fine-text bold">
                  {NextClass(batch.next_lecture_timing.starts)}
                </p>
              ) : (
                <p
                  className="fine-text bold"
                  style={{
                    color: '#638FE5',
                    cursor: 'pointer',
                  }}
                  onClick={handleOpenScheduleClass}
                  onKeyDown={handleOpenScheduleClass}
                >
                  +Schedule Class
                </p>
              )}
            </Grid>
            <Grid item xs={7}>
              <p className={classes.key}>Pending Request</p>
              <p
                className="fine-text bold"
                style={{
                  color: 'red',
                }}
              >
                {batch.number_of_pending_requests || 0}
              </p>
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.fourth_grid}
            direction="row"
            spacing={2}
          >
            {batch.lecture ? (
              <>
                {displayCondition(batch.lecture) ? (
                  <>
                    <Grid item sm={12} lg={6}>
                      <Controls.Button
                        text="Rejoin Class"
                        size="large"
                        onClick={handleAVDialogOpen}
                      />
                    </Grid>
                    <Grid item sm={12} lg={6}>
                      <Controls.Button
                        text="End Class"
                        variant="contained"
                        size="large"
                        style={{
                          backgroundColor: '#f44236',
                          backgroundImage: 'unset',
                        }}
                        onClick={() => setOpenConfirmDialog(true)}
                      />
                    </Grid>
                  </>
                ) : (
                  <>
                    <Grid item sm={12} lg={6}>
                      <Controls.Button
                        text="Start Class"
                        size="large"
                        onClick={handleAVDialogOpen}
                      />
                    </Grid>
                    <Grid item sm={12} lg={6}>
                      <Controls.Button
                        text="Show Batch Detail"
                        variant="outlined"
                        size="large"
                        onClick={() => {
                          history.push(`dashboard/view/${batch.id}`)
                        }}
                      />
                    </Grid>
                  </>
                )}
              </>
            ) : (
              <>
                <Grid item sm={12} lg={6}>
                  <Controls.Button
                    text="Start Class"
                    size="large"
                    onClick={handleAVDialogOpen}
                  />
                </Grid>
                <Grid item sm={12} lg={6}>
                  <Controls.Button
                    text="Show Batch Detail"
                    variant="outlined"
                    size="large"
                    onClick={() => {
                      history.push(`dashboard/view/${batch.id}`)
                    }}
                  />
                </Grid>
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      <ScheduleClassDialog
        open={openScheduleClass}
        close={handleCloseScheduleClass}
        batch_id={batch.id}
        refreshFunction={GetTeacherBatches}
      />
      {openAVDialog && (
        <AVDialog
          open={openAVDialog}
          onClose={handleAVDialogClose}
          batchId={batch.id}
          handleGoToClass={
            batch.lecture
              ? displayCondition(batch.lecture)
                ? handleResumeLecture
                : handleGoToClass
              : handleGoToClass
          }
          isLoading={continueButtonLoading}
        />
      )}
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    moreIcon: {
      padding: 7,
      backgroundColor: '#f2f5ff',
    },
    first_grid: {
      padding: '7px 0',
    },
    second_grid: {
      padding: '0.5rem 1rem',
    },
    third_grid: {
      padding: '0.5rem 1rem',
    },
    fourth_grid: {
      padding: '0px 1rem 1rem',
    },
    key: {
      fontSize: 11,
      opacity: 0.8,
      fontWeight: '500',
    },
    removeBottomPadding: {
      paddingBottom: '0px !important',
    },
  }),
)

export default BatchCard
