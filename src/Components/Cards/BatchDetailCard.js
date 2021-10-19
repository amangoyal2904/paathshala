import React, { useContext, useState } from 'react'
import { Divider, Drawer, Menu, MenuItem, MenuList } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component'
import IconButton from '@material-ui/core/IconButton'
import { FiEdit, FiMoreHorizontal } from 'react-icons/fi'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { MdContentCopy } from 'react-icons/md'
import { IoPeopleOutline } from 'react-icons/io5'
import { useSnackbar } from 'notistack'
import Badge from '@material-ui/core/Badge'
import Grid from '@material-ui/core/Grid'
import { useHistory } from 'react-router-dom'
import { IoIosArrowBack } from 'react-icons/io'
import { BatchContext } from '../../Context/BatchContext'
import StudentAdmissionList from '../Lists/StudentAdmissionList'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import showSuccessSnackbar from '../Snackbar/successSnackbar'
import CreateBatchDialog from '../Dialogs/CreateBatchDialog/CreateBatchDialog'
import { AuthContext } from '../../Context/AuthContext'
import ScheduleClassDialog from '../Dialogs/ScheduleClassDialog/ScheduleClassDialog'
import Card from './Card'
import {
  ConvertTime,
  ReturnMonth,
  ConvertTimeTo24Hours,
} from '../../Global/Functions'

const BatchDetailCard = ({
  batchCode,
  batchStandard,
  batchSubject,
  batchBoard,
  batchName,
  nextLectureTiming,
  fetchData,
}) => {
  const classes = useStyles()

  const [batchMenu, setBatchMenu] = useState(null)
  const [drawerOpen, setDrawerOpen] = useState(false)

  const history = useHistory()
  const {
    DeleteBatchTeacher,
    batchByCode,
    studentRequestByBatchId,
    setTeacherBatches,
  } = useContext(BatchContext)

  const { authState } = useContext(AuthContext)
  const { role } = authState

  const handleOpenBatchMenu = (event) => {
    setBatchMenu(event.currentTarget)
  }

  const handleCloseBatchMenu = () => {
    setBatchMenu(null)
  }

  const handleEditBatch = () => {
    setOpenEditBatch(true)
  }

  const handleDeleteBatch = async () => {
    const isDeleted = await DeleteBatchTeacher(batchByCode.id)
    handleCloseBatchMenu()
    if (isDeleted) {
      setTeacherBatches((batches) =>
        batches.filter((remoteBatch) => remoteBatch.id !== batchByCode.id),
      )
      history.push('/dashboard')
    }
  }

  const handleDrawerOpen = () => {
    setDrawerOpen(true)
  }

  const handleDrawerClose = () => {
    setDrawerOpen(false)
  }

  const openDeleteDialog = () => {
    setShowDeleteConfirmation(true)
  }

  const { enqueueSnackbar } = useSnackbar()

  const showNotification = () => {
    showSuccessSnackbar(enqueueSnackbar, 'Copied to clipboard')
  }

  const [openScheduleClass, setOpenScheduleClass] = useState(false)

  const handleOpenScheduleClass = () => {
    setOpenScheduleClass(true)
  }

  const handleCloseScheduleClass = () => {
    setOpenScheduleClass(false)
  }

  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false)
  const [openEditBatch, setOpenEditBatch] = useState(false)

  const NextClass = (t) => {
    const date = ConvertTime(t)
    const day = date.getDate()
    const month = ReturnMonth(date.getMonth())
    const year = date.getFullYear().toString().slice(2, 4)
    const time = ConvertTimeTo24Hours(date.toTimeString().slice(0, 5))
    return `${day} ${month}, ${year} | ${time}`
  }

  return (
    <>
      <CreateBatchDialog
        open={openEditBatch}
        setOpen={setOpenEditBatch}
        mode="edit"
        name={batchName}
        subject={batchSubject}
        standard={batchStandard}
        board={batchBoard}
        batchId={batchCode}
      />
      <ConfirmDialog
        open={showDeleteConfirmation}
        setOpen={setShowDeleteConfirmation}
        title="Delete Batch"
        content="Are you sure you want to Delete this Batch?"
        yesAction={handleDeleteBatch}
        noAction={() => {}}
      />
      <Menu
        id="batch-menu"
        anchorEl={batchMenu}
        keepMounted
        open={Boolean(batchMenu)}
        onClose={handleCloseBatchMenu}
      >
        <MenuList>
          {role === 'T' ? (
            <>
              <MenuItem onClick={() => handleEditBatch()}>
                <FiEdit className={classes.menuItemStyle} />
                Edit Batch
              </MenuItem>
              <MenuItem onClick={() => openDeleteDialog()}>
                <RiDeleteBin6Line className={classes.menuItemStyle} />
                Delete Batch
              </MenuItem>
            </>
          ) : null}
        </MenuList>
      </Menu>
      <div className={classes.container}>
        <Card className={classes.card} shadow={false}>
          <div className={classes.divContainer}>
            <div className={classes.divContainer}>
              <div className={classes.div}>
                <div>
                  <p className={classes.batchCodeHeading}>Batch Code</p>
                  <p className={classes.batchCodeInfo}>
                    {batchCode}
                    <CopyToClipboard text={batchCode}>
                      <IconButton onClick={showNotification} color="inherit">
                        <MdContentCopy size={16} />
                      </IconButton>
                    </CopyToClipboard>
                  </p>
                </div>
              </div>
              <div className={classes.div}>
                <Divider
                  orientation="vertical"
                  variant="fullWidth"
                  className={classes.divider}
                />
                <div>
                  <p className={classes.heading}>Subject</p>
                  <p className={classes.info}>
                    {batchSubject || 'Not Specified'}
                  </p>
                </div>
              </div>

              <div className={classes.div}>
                <Divider
                  orientation="vertical"
                  variant="fullWidth"
                  className={classes.divider}
                />
                <div>
                  <p className={classes.heading}>Class</p>
                  <p className={classes.info}>
                    {batchStandard || 'Not Specified'}
                  </p>
                </div>
              </div>

              <div className={classes.div}>
                <Divider
                  orientation="vertical"
                  variant="fullWidth"
                  className={classes.divider}
                />
                <div>
                  <p className={classes.heading}>Next Class</p>
                  {role === 'T' ? (
                    <>
                      {nextLectureTiming ? (
                        <p className={`fine-text bold ${classes.timingInfo}`}>
                          {NextClass(nextLectureTiming.starts)}
                        </p>
                      ) : (
                        <p
                          className={`fine-text bold ${classes.timingInfoBtn}`}
                          onClick={handleOpenScheduleClass}
                          onKeyDown={handleOpenScheduleClass}
                        >
                          +Schedule Class
                        </p>
                      )}
                    </>
                  ) : (
                    <>
                      {nextLectureTiming ? (
                        <p
                          className={`fine-text bold ${classes.timingInfo}`}
                          style={{
                            marginTop: '12px',
                          }}
                        >
                          {NextClass(nextLectureTiming.starts)}
                        </p>
                      ) : (
                        <p className={classes.info}>No Schedule</p>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {role === 'T' ? (
              <div className={classes.iconDiv}>
                <IconButton aria-label="people" onClick={handleDrawerOpen}>
                  <Badge
                    badgeContent={
                      studentRequestByBatchId.filter(
                        (request) => request.status === 'D',
                      ).length
                    }
                    color="error"
                  >
                    <IoPeopleOutline />
                  </Badge>
                </IconButton>
                <IconButton aria-label="settings" onClick={handleOpenBatchMenu}>
                  <FiMoreHorizontal />
                </IconButton>
              </div>
            ) : null}
          </div>
        </Card>
      </div>
      <Drawer
        variant="temporary"
        anchor="right"
        open={drawerOpen}
        onClose={handleDrawerClose}
        classes={{
          paper: classes.drawerPaper,
        }}
      >
        <Grid container alignItems="center" className={classes.pendingGrid}>
          <Grid item>
            <IconButton onClick={handleDrawerClose} color="inherit">
              <IoIosArrowBack />
            </IconButton>
          </Grid>
          <Grid item>
            <div>
              <p className="bolder" style={{ fontSize: '1.25rem' }}>
                Pending Request
              </p>
            </div>
          </Grid>
        </Grid>
        <StudentAdmissionList
          items={studentRequestByBatchId.filter(
            (request) => request.status === 'D',
          )}
        />
      </Drawer>
      <ScheduleClassDialog
        open={openScheduleClass}
        close={handleCloseScheduleClass}
        batch_id={batchCode}
        refreshFunction={fetchData}
      />
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      margin: '0 auto',
      padding: '0 2rem',
    },
    card: {
      padding: '20px 15px',
    },
    divContainer: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    div: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginRight: '2rem',
    },
    iconDiv: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    heading: {
      fontSize: '14px',
      color: '#333333',
      marginTop: '-10px',
    },
    info: {
      fontSize: '16px',
      fontWeight: 500,
      color: '#333333',
      marginTop: '10px',
    },
    drawerPaper: {
      width: 350,
    },
    menuItemStyle: {
      padding: '0 5px',
    },
    batchCodeHeading: {
      fontSize: '14px',
      color: '#333333',
    },
    batchCodeInfo: {
      fontSize: '16px',
      fontWeight: 500,
      color: '#333333',
    },
    divider: {
      marginRight: 20,
    },
    timingInfo: {
      marginTop: '12px',
    },
    timingInfoBtn: {
      marginTop: '12px',
      color: '#638FE5',
      cursor: 'pointer',
    },
    pendingGrid: {
      padding: '0.5rem 1rem 0.5rem 0',
      backgroundColor: '#f2f5ff',
    },
  }),
)

export default BatchDetailCard
