import React, { useContext, useEffect, useState } from 'react'
import { Grid, Breadcrumbs, Link, Typography } from '@material-ui/core'
import { IoIosArrowForward } from 'react-icons/io'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { MdDelete } from 'react-icons/md'
import Spinner from '../../Components/Progress/Spinner'
import { BatchContext } from '../../Context/BatchContext'
import Controls from '../../Components/Controls/Controls'
import TimingsCard from './TimingsCard'
import UpdateSchedule from '../Schedule/UpdateSchedule'
import { CheckForBadTimings, CheckInvalidTimings } from '../../Global/Functions'
import ConfirmDialog from '../../Components/Dialogs/ConfirmDialog'

const ManageTimings = ({ id }) => {
  const {
    loading,
    batchByCode,
    FindBatchWithCode,
    GetBatchSchedule,
    UpdateScheduleWithId,
    DeleteSchedule,
    setLoading,
  } = useContext(BatchContext)
  const classes = useStyles()
  const [step, setStep] = useState('timings')
  const [updatedSchedule, setUpdatedSchedule] = useState()
  const [sameTiming, setSameTiming] = useState('yes')
  const [scheduleId, setScheduleId] = useState('')
  const [allowSubmit, setAllowSubmit] = useState(false)

  const days = {
    mon: { selected: false },
    tue: { selected: false },
    wed: { selected: false },
    thu: { selected: false },
    fri: { selected: false },
    sat: { selected: false },
    sun: { selected: false },
  }
  const [selectedDays, setSelectedDays] = useState(days)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)

  const defaultDate = new Date()
  defaultDate.setHours(8, 0, 0, 0)

  const defaultEndTime = new Date()
  defaultEndTime.setHours(9, 0, 0, 0)

  const initialTimings = {
    start: defaultDate,
    end: defaultEndTime,
    mon: {
      start: defaultDate,
      end: defaultEndTime,
    },
    tue: {
      start: defaultDate,
      end: defaultEndTime,
    },
    wed: {
      start: defaultDate,
      end: defaultEndTime,
    },
    thu: {
      start: defaultDate,
      end: defaultEndTime,
    },
    fri: {
      start: defaultDate,
      end: defaultEndTime,
    },
    sat: {
      start: defaultDate,
      end: defaultEndTime,
    },
    sun: {
      start: defaultDate,
      end: defaultEndTime,
    },
  }
  const [timings, setTimings] = useState(initialTimings)

  const badTimings = () => {
    const result = []
    if (sameTiming === 'yes') {
      return CheckForBadTimings(timings.start, timings.end)
    }
    if (sameTiming === 'no') {
      if (selectedDays.mon.selected) {
        result.push(CheckForBadTimings(timings.mon.start, timings.mon.end))
      }
      if (selectedDays.tue.selected) {
        result.push(CheckForBadTimings(timings.tue.start, timings.tue.end))
      }
      if (selectedDays.wed.selected) {
        result.push(CheckForBadTimings(timings.wed.start, timings.wed.end))
      }
      if (selectedDays.thu.selected) {
        result.push(CheckForBadTimings(timings.thu.start, timings.thu.end))
      }
      if (selectedDays.fri.selected) {
        result.push(CheckForBadTimings(timings.fri.start, timings.fri.end))
      }
      if (selectedDays.sat.selected) {
        result.push(CheckForBadTimings(timings.sat.start, timings.sat.end))
      }
      if (selectedDays.sun.selected) {
        result.push(CheckForBadTimings(timings.sun.start, timings.sun.end))
      }
      if (result.every((v) => v === false)) {
        return false
      }
      return true
    }
  }

  const invalidTimings = () => {
    const result = []
    if (sameTiming === 'yes') {
      return CheckInvalidTimings(timings.start, timings.end)
    }
    if (sameTiming === 'no') {
      if (selectedDays.mon.selected) {
        result.push(CheckInvalidTimings(timings.mon.start, timings.mon.end))
      }
      if (selectedDays.tue.selected) {
        result.push(CheckInvalidTimings(timings.tue.start, timings.tue.end))
      }
      if (selectedDays.wed.selected) {
        result.push(CheckInvalidTimings(timings.wed.start, timings.wed.end))
      }
      if (selectedDays.thu.selected) {
        result.push(CheckInvalidTimings(timings.thu.start, timings.thu.end))
      }
      if (selectedDays.fri.selected) {
        result.push(CheckInvalidTimings(timings.fri.start, timings.fri.end))
      }
      if (selectedDays.sat.selected) {
        result.push(CheckInvalidTimings(timings.sat.start, timings.sat.end))
      }
      if (selectedDays.sun.selected) {
        result.push(CheckInvalidTimings(timings.sun.start, timings.sun.end))
      }
      if (result.every((v) => v === false)) {
        return false
      }
      return true
    }
  }

  const fetchScheduleData = async () => {
    setLoading(true)
    setStep('timings')
    await FindBatchWithCode(id)
    const res = await GetBatchSchedule(id)
    let schedule
    if (res.length === 0) {
      schedule = []
      setUpdatedSchedule(schedule)
    } else {
      schedule = res.data
      setUpdatedSchedule(schedule)

      setScheduleId(res.schedule_id)
    }
    setSelectedDays({
      ...selectedDays,
      mon:
        schedule.mon !== undefined
          ? { ...selectedDays, selected: true }
          : { ...selectedDays, selected: false },
      tue:
        schedule.tue !== undefined
          ? { ...selectedDays, selected: true }
          : { ...selectedDays, selected: false },
      wed:
        schedule.wed !== undefined
          ? { ...selectedDays, selected: true }
          : { ...selectedDays, selected: false },
      thu:
        schedule.thu !== undefined
          ? { ...selectedDays, selected: true }
          : { ...selectedDays, selected: false },
      fri:
        schedule.fri !== undefined
          ? { ...selectedDays, selected: true }
          : { ...selectedDays, selected: false },
      sat:
        schedule.sat !== undefined
          ? { ...selectedDays, selected: true }
          : { ...selectedDays, selected: false },
      sun:
        schedule.sun !== undefined
          ? { ...selectedDays, selected: true }
          : { ...selectedDays, selected: false },
    })
    setLoading(false)
  }

  useEffect(() => {
    fetchScheduleData()
  }, [])

  const OnSubmit = async () => {
    const payload = {
      batch: id,
      timezone: 'Asia/Kolkata',
      schedule: updatedSchedule,
    }
    if (!selectedDays.mon.selected) {
      delete updatedSchedule.mon
    }
    if (!selectedDays.tue.selected) {
      delete updatedSchedule.tue
    }
    if (!selectedDays.wed.selected) {
      delete updatedSchedule.wed
    }
    if (!selectedDays.thu.selected) {
      delete updatedSchedule.thu
    }
    if (!selectedDays.fri.selected) {
      delete updatedSchedule.fri
    }
    if (!selectedDays.sat.selected) {
      delete updatedSchedule.sat
    }
    if (!selectedDays.sun.selected) {
      delete updatedSchedule.sun
    }
    await UpdateScheduleWithId(scheduleId, payload)
    fetchScheduleData()
  }

  const handleScheduleDelete = async () => {
    await DeleteSchedule(scheduleId)
    fetchScheduleData()
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="full-height">
          <Grid
            container
            justify="space-between"
            className={classes.gridContainer}
          >
            <Grid item xs={12} sm={6} md={8} lg={step === 'timings' ? 10 : 8}>
              <div className="height-100 flex-row align-items-center">
                <p className={`${classes.heading} bolder`}>
                  Manage Class Timings
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={step === 'timings' ? 2 : 4}>
              <div>
                {step === 'timings' && (
                  <Controls.Button
                    className={classes.btn}
                    onClick={() => setStep('update')}
                    disabled={Array.isArray(updatedSchedule)}
                  >
                    Edit
                  </Controls.Button>
                )}
                {step === 'update' && (
                  <Grid container spacing={2} justify="space-between">
                    <Grid item xs={4}>
                      <Controls.Button
                        className={classes.delete_btn}
                        onClick={() => setOpenConfirmDialog(true)}
                      >
                        <MdDelete size="25.70px" color="#fff" />
                      </Controls.Button>
                    </Grid>
                    <Grid item xs={8}>
                      <Controls.Button
                        className={classes.btn}
                        onClick={OnSubmit}
                        disabled={!allowSubmit}
                      >
                        Save
                      </Controls.Button>
                    </Grid>
                  </Grid>
                )}
              </div>
            </Grid>
            <Grid item xs={12}>
              <Breadcrumbs
                separator={<IoIosArrowForward />}
                aria-label="breadcrumb"
              >
                <Link color="inherit" href="/dashboard">
                  Dashboard
                </Link>
                <Link color="inherit" href={`/dashboard/view/${id}`}>
                  {batchByCode.name}
                </Link>
                <Typography color="textPrimary">
                  Manage Class Timings
                </Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          {step === 'timings' && (
            <TimingsCard
              nextLectureTiming={batchByCode.next_lecture_timing}
              updatedSchedule={updatedSchedule}
              fetchScheduleData={fetchScheduleData}
              batchId={id}
            />
          )}
          {step === 'update' && (
            <UpdateSchedule
              id={id}
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              updatedSchedule={updatedSchedule}
              setUpdatedSchedule={setUpdatedSchedule}
              days={days}
              sameTiming={sameTiming}
              setSameTiming={setSameTiming}
              timings={timings}
              setTimings={setTimings}
              initialTimings={initialTimings}
              defaultDate={defaultDate}
              defaultEndTime={defaultEndTime}
              setAllowSubmit={setAllowSubmit}
              badTimings={badTimings}
              invalidTimings={invalidTimings}
              handleScheduleDelete={handleScheduleDelete}
            />
          )}
          <ConfirmDialog
            open={openConfirmDialog}
            setOpen={setOpenConfirmDialog}
            title="Delete Schedule"
            content="Are you Sure you want to delete this schedule"
            yesAction={handleScheduleDelete}
            noAction={() => setOpenConfirmDialog(false)}
          />
        </div>
      )}
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    gridContainer: {
      padding: '2rem',
    },
    heading: {
      fontSize: '24px',
      color: '#6481e4',
    },
    btn: {
      backgroundColor: '#568ae1',
      '&:hover': {
        backgroundColor: '#568ae1',
      },
    },
    delete_btn: {
      background: '#808080',
      '&:hover': {
        background: '#808080',
      },
    },
  }),
)

export default ManageTimings
