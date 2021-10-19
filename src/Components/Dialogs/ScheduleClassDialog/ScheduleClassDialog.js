import React, { useContext, useState, useEffect } from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  Radio,
} from '@material-ui/core'
import { IoCloseSharp } from 'react-icons/io5'
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles'
import { useSnackbar } from 'notistack'
import Controls from '../../Controls/Controls'
import { BatchContext } from '../../../Context/BatchContext'
import Monday from './Monday'
import Tuesday from './Tuesday'
import Wednesday from './Wednesday'
import Thursday from './Thursday'
import Friday from './Friday'
import Saturday from './Saturday'
import Sunday from './Sunday'
import AllDay from './AllDay'
import DaySelector from './DaySelector'
import Dialog from '../Dialog'
import showSuccessSnackbar from '../../Snackbar/successSnackbar'
import {
  CheckForBadTimings,
  CheckInvalidTimings,
} from '../../../Global/Functions'
import BatchCreatedDialog from '../BatchCreatedDialog'

const ScheduleClassDialog = ({
  open,
  close,
  batch_id,
  isBatchCreated,
  refreshFunction,
}) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
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
  const [sameTiming, setSameTiming] = useState('')
  const [schedule, setSchedule] = useState({})

  // For Batch Created Dialog
  const [openBatchCreated, setOpenBatchCreated] = useState(false)
  const handleOpenBatchCreated = () => {
    setOpenBatchCreated(true)
  }

  const handleCloseBatchCreated = () => {
    setOpenBatchCreated(false)
  }

  const { AddSchedule } = useContext(BatchContext)

  const defaultDate = new Date()
  defaultDate.setHours(8, 0, 0, 0)

  const defaultEndTime = new Date()
  defaultEndTime.setHours(9, 0, 0, 0)

  const [isAnyDaySelected, setIsAnyDaySelected] = useState(false)
  const [allowSubmit, setAllowSubmit] = useState(false)
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

  const BadTimings = () => {
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

  const InvalidTimings = () => {
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

  useEffect(() => {
    const t = defaultDate.toLocaleTimeString('it-IT').slice(0, 5)
    const e = defaultEndTime.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      mon: {
        start: t,
        end: e,
      },
      tue: {
        start: t,
        end: e,
      },
      wed: {
        start: t,
        end: e,
      },
      thu: {
        start: t,
        end: e,
      },
      fri: {
        start: t,
        end: e,
      },
      sat: {
        start: t,
        end: e,
      },
      sun: {
        start: t,
        end: e,
      },
    })
  }, [sameTiming])

  useEffect(() => {
    if (
      selectedDays.mon.selected ||
      selectedDays.tue.selected ||
      selectedDays.wed.selected ||
      selectedDays.thu.selected ||
      selectedDays.fri.selected ||
      selectedDays.sat.selected ||
      selectedDays.sun.selected
    ) {
      setIsAnyDaySelected(true)
    } else {
      setIsAnyDaySelected(false)
      setTimings({
        ...timings,
        start: defaultDate,
        end: defaultEndTime,
      })
    }
    if (Object.keys(schedule).length > 0) {
      setAllowSubmit(true)
    } else {
      setAllowSubmit(false)
    }
    if (sameTiming === '') {
      setAllowSubmit(false)
    }
    if (BadTimings() === true) {
      setAllowSubmit(false)
    }
    if (InvalidTimings() === true) {
      setAllowSubmit(false)
    }
  }, [selectedDays, Object.keys(schedule).length, schedule])

  const handleDialogClose = () => {
    setTimeout(() => {
      setSameTiming('')
      setTimings(initialTimings)
      setSelectedDays(days)
      setAllowSubmit(false)
    }, 500)
    if (isBatchCreated) {
      showSuccessSnackbar(enqueueSnackbar, 'Batch Created')
    }
    close()
  }

  const handleRadioChange = (e) => {
    setSameTiming(e.target.value)
    setSchedule({})
    setTimings(initialTimings)
    setAllowSubmit(false)
  }

  const OnSubmit = async () => {
    const payload = {
      batch: batch_id,
      timezone: 'Asia/Kolkata',
      schedule,
    }
    if (!selectedDays.mon.selected) {
      delete schedule.mon
    }
    if (!selectedDays.tue.selected) {
      delete schedule.tue
    }
    if (!selectedDays.wed.selected) {
      delete schedule.wed
    }
    if (!selectedDays.thu.selected) {
      delete schedule.thu
    }
    if (!selectedDays.fri.selected) {
      delete schedule.fri
    }
    if (!selectedDays.sat.selected) {
      delete schedule.sat
    }
    if (!selectedDays.sun.selected) {
      delete schedule.sun
    }
    await AddSchedule(payload)
    if (isBatchCreated) {
      showSuccessSnackbar(enqueueSnackbar, 'Batch & Schedule Created')
    }
    if (!isBatchCreated) {
      showSuccessSnackbar(enqueueSnackbar, 'Schedule Created')
    }
    refreshFunction()
  }

  const onSkip = () => {
    handleDialogClose()
    if (isBatchCreated) {
      handleOpenBatchCreated()
    }
    if (!isBatchCreated) {
      refreshFunction()
    }
  }

  const StyledRadio = withStyles({
    root: {
      color: '#638FE5',
      '&$checked': {
        color: '#638FE5',
      },
    },
    checked: {},
  })((props) => <Radio color="default" {...props} />)

  return (
    <>
      <Dialog open={open} fullWidth maxWidth="xs">
        <DialogTitle>
          <div className={classes.header}>
            <p className="sub-text bold text-align-center">
              Schedule Class Timings
            </p>
            <IconButton className={classes.close} onClick={handleDialogClose}>
              <IoCloseSharp />
            </IconButton>
          </div>
        </DialogTitle>
        <Divider />
        <DialogContent>
          <>
            <p>Days</p>
            <DaySelector
              selectedDays={selectedDays}
              setSelectedDays={setSelectedDays}
              timings={timings}
              setTimings={setTimings}
              initialTimings={initialTimings}
              schedule={schedule}
              setSchedule={setSchedule}
            />
            <div className={classes.radio_div}>
              <p>Are the timings same for each day?</p>
              <div
                style={{
                  display: 'flex',
                }}
              >
                <div className={classes.radio}>
                  <StyledRadio
                    checked={sameTiming === 'yes'}
                    onChange={handleRadioChange}
                    value="yes"
                    name="Same Timings"
                    disabled={!isAnyDaySelected}
                  />
                  <p>Yes</p>
                </div>
                <div className={classes.radio}>
                  <StyledRadio
                    checked={sameTiming === 'no'}
                    onChange={handleRadioChange}
                    value="no"
                    name="Differene Timings"
                    disabled={!isAnyDaySelected}
                  />
                  <p>No</p>
                </div>
              </div>
            </div>
            {isAnyDaySelected && (
              <>
                {sameTiming === '' ? null : (
                  <div>
                    {sameTiming === 'yes' ? (
                      <div>
                        <AllDay
                          timings={timings}
                          setTimings={setTimings}
                          defaultDate={defaultDate}
                          schedule={schedule}
                          setSchedule={setSchedule}
                          selectedDays={selectedDays}
                        />
                      </div>
                    ) : (
                      <div>
                        {selectedDays.mon.selected && (
                          <Monday
                            timings={timings}
                            setTimings={setTimings}
                            defaultDate={defaultDate}
                            schedule={schedule}
                            setSchedule={setSchedule}
                          />
                        )}
                        {selectedDays.tue.selected && (
                          <Tuesday
                            timings={timings}
                            setTimings={setTimings}
                            defaultDate={defaultDate}
                            schedule={schedule}
                            setSchedule={setSchedule}
                          />
                        )}
                        {selectedDays.wed.selected && (
                          <Wednesday
                            timings={timings}
                            setTimings={setTimings}
                            defaultDate={defaultDate}
                            schedule={schedule}
                            setSchedule={setSchedule}
                          />
                        )}
                        {selectedDays.thu.selected && (
                          <Thursday
                            timings={timings}
                            setTimings={setTimings}
                            defaultDate={defaultDate}
                            schedule={schedule}
                            setSchedule={setSchedule}
                          />
                        )}
                        {selectedDays.fri.selected && (
                          <Friday
                            timings={timings}
                            setTimings={setTimings}
                            defaultDate={defaultDate}
                            schedule={schedule}
                            setSchedule={setSchedule}
                          />
                        )}
                        {selectedDays.sat.selected && (
                          <Saturday
                            timings={timings}
                            setTimings={setTimings}
                            defaultDate={defaultDate}
                            schedule={schedule}
                            setSchedule={setSchedule}
                          />
                        )}
                        {selectedDays.sun.selected && (
                          <Sunday
                            timings={timings}
                            setTimings={setTimings}
                            defaultDate={defaultDate}
                            schedule={schedule}
                            setSchedule={setSchedule}
                          />
                        )}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
            {BadTimings() === true && (
              <p className={classes.error}>Please Enter a Valid Time Range</p>
            )}
            {InvalidTimings() === true && (
              <p className={classes.error}>Please Enter a Valid Time Range</p>
            )}
          </>
        </DialogContent>
        <Divider />
        <DialogActions>
          <Controls.Button className={classes.btn} onClick={onSkip}>
            Skip
          </Controls.Button>
          <Controls.Button
            className={classes.btn}
            onClick={OnSubmit}
            disabled={!allowSubmit}
          >
            Done
          </Controls.Button>
        </DialogActions>
      </Dialog>
      <BatchCreatedDialog
        open={openBatchCreated}
        close={handleCloseBatchCreated}
        batchId={batch_id}
      />
    </>
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
    btn: {
      margin: '1rem',
    },
    weekdays: {
      display: 'flex',
      paddingBlock: 10,
    },
    day: {
      border: '1px solid #A9A9A9',
      borderRadius: 5,
      paddingBlock: 5,
      width: 50,
      textAlign: 'center',
      marginInline: 2,
      '&:hover': {
        cursor: 'pointer',
      },
    },
    selected_day: {
      border: '1px solid #A9A9A9',
      borderRadius: 5,
      paddingBlock: 5,
      width: 50,
      textAlign: 'center',
      marginInline: 2,
      backgroundColor: '#ffab41',
      color: '#fff',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    radio_div: {
      paddingBlock: 10,
    },
    unselectable: {
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none',
    },
    radio: {
      display: 'flex',
      alignItems: 'center',
      marginRight: 20,
    },
    radioSelect: {
      color: '#638FE5',
      '&:checked': {
        color: '#638FE5',
      },
    },
    error: {
      color: '#ff471b',
    },
  }),
)

export default ScheduleClassDialog
