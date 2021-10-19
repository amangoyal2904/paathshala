import React, { useState, useEffect } from 'react'
import { Card, Divider, Radio } from '@material-ui/core'
import { makeStyles, createStyles, withStyles } from '@material-ui/core/styles'
import DaySelector from '../../Components/Dialogs/ScheduleClassDialog/DaySelector'
import Monday from '../../Components/Dialogs/ScheduleClassDialog/Monday'
import Tuesday from '../../Components/Dialogs/ScheduleClassDialog/Tuesday'
import Wednesday from '../../Components/Dialogs/ScheduleClassDialog/Wednesday'
import Thursday from '../../Components/Dialogs/ScheduleClassDialog/Thursday'
import Friday from '../../Components/Dialogs/ScheduleClassDialog/Friday'
import Saturday from '../../Components/Dialogs/ScheduleClassDialog/Saturday'
import Sunday from '../../Components/Dialogs/ScheduleClassDialog/Sunday'
import AllDay from '../../Components/Dialogs/ScheduleClassDialog/AllDay'
import { HoursMinutesToObject } from '../../Global/Functions'

const UpdateSchedule = ({
  selectedDays,
  setSelectedDays,
  updatedSchedule,
  setUpdatedSchedule,
  sameTiming,
  setSameTiming,
  timings,
  setTimings,
  initialTimings,
  defaultDate,
  defaultEndTime,
  setAllowSubmit,
  badTimings,
  invalidTimings,
}) => {
  const classes = useStyles()
  const [isAnyDaySelected, setIsAnyDaySelected] = useState(false)

  const setDefaultSchedule = () => {
    const t = defaultDate.toLocaleTimeString('it-IT').slice(0, 5)
    const e = defaultEndTime.toLocaleTimeString('it-IT').slice(0, 5)
    setUpdatedSchedule({
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
  }

  const handleRadioChange = (e) => {
    setSameTiming(e.target.value)
    setTimings(initialTimings)
    setDefaultSchedule()
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

  const checkForSameTimings = (sch) => {
    const scheduleArray = Object.values(sch)
    const startTimingsArray = []
    for (let i = 0; i < scheduleArray.length; i += 1) {
      const element = scheduleArray[i]
      startTimingsArray.push(element.start)
    }
    return startTimingsArray.every((v) => v === startTimingsArray[0])
  }

  const setTimingsFromData = () => {
    if (checkForSameTimings(updatedSchedule)) {
      if (updatedSchedule.mon) {
        setTimings({
          ...timings,
          start: HoursMinutesToObject(updatedSchedule.mon.start),
          end: HoursMinutesToObject(updatedSchedule.mon.end),
        })
      }
      if (updatedSchedule.tue) {
        setTimings({
          ...timings,
          start: HoursMinutesToObject(updatedSchedule.tue.start),
          end: HoursMinutesToObject(updatedSchedule.tue.end),
        })
      }
      if (updatedSchedule.wed) {
        setTimings({
          ...timings,
          start: HoursMinutesToObject(updatedSchedule.wed.start),
          end: HoursMinutesToObject(updatedSchedule.wed.end),
        })
      }
      if (updatedSchedule.thu) {
        setTimings({
          ...timings,
          start: HoursMinutesToObject(updatedSchedule.thu.start),
          end: HoursMinutesToObject(updatedSchedule.thu.end),
        })
      }
      if (updatedSchedule.fri) {
        setTimings({
          ...timings,
          start: HoursMinutesToObject(updatedSchedule.fri.start),
          end: HoursMinutesToObject(updatedSchedule.fri.end),
        })
      }
      if (updatedSchedule.sat) {
        setTimings({
          ...timings,
          start: HoursMinutesToObject(updatedSchedule.sat.start),
          end: HoursMinutesToObject(updatedSchedule.sat.end),
        })
      }
      if (updatedSchedule.sun) {
        setTimings({
          ...timings,
          start: HoursMinutesToObject(updatedSchedule.sun.start),
          end: HoursMinutesToObject(updatedSchedule.sun.end),
        })
      }
    } else {
      setTimings({
        ...timings,
        mon: updatedSchedule.mon
          ? {
              ...timings.mon,
              start: HoursMinutesToObject(updatedSchedule.mon.start),
              end: HoursMinutesToObject(updatedSchedule.mon.end),
            }
          : {
              ...timings.mon,
              start: defaultDate,
              end: defaultEndTime,
            },
        tue: updatedSchedule.tue
          ? {
              ...timings.tue,
              start: HoursMinutesToObject(updatedSchedule.tue.start),
              end: HoursMinutesToObject(updatedSchedule.tue.end),
            }
          : {
              ...timings.tue,
              start: defaultDate,
              end: defaultEndTime,
            },
        wed: updatedSchedule.wed
          ? {
              ...timings.wed,
              start: HoursMinutesToObject(updatedSchedule.wed.start),
              end: HoursMinutesToObject(updatedSchedule.wed.end),
            }
          : {
              ...timings.wed,
              start: defaultDate,
              end: defaultEndTime,
            },
        thu: updatedSchedule.thu
          ? {
              ...timings.thu,
              start: HoursMinutesToObject(updatedSchedule.thu.start),
              end: HoursMinutesToObject(updatedSchedule.thu.end),
            }
          : {
              ...timings.thu,
              start: defaultDate,
              end: defaultEndTime,
            },
        fri: updatedSchedule.fri
          ? {
              ...timings.fri,
              start: HoursMinutesToObject(updatedSchedule.fri.start),
              end: HoursMinutesToObject(updatedSchedule.fri.end),
            }
          : {
              ...timings.fri,
              start: defaultDate,
              end: defaultEndTime,
            },
        sat: updatedSchedule.sat
          ? {
              ...timings.sat,
              start: HoursMinutesToObject(updatedSchedule.sat.start),
              end: HoursMinutesToObject(updatedSchedule.sat.end),
            }
          : {
              ...timings.sat,
              start: defaultDate,
              end: defaultEndTime,
            },
        sun: updatedSchedule.sun
          ? {
              ...timings.sun,
              start: HoursMinutesToObject(updatedSchedule.sun.start),
              end: HoursMinutesToObject(updatedSchedule.sun.end),
            }
          : {
              ...timings.sun,
              start: defaultDate,
              end: defaultEndTime,
            },
      })
    }
  }

  useEffect(() => {
    if (checkForSameTimings(updatedSchedule)) {
      setSameTiming('yes')
    } else {
      setSameTiming('no')
    }
    setTimingsFromData()
  }, [])

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
    if (updatedSchedule) {
      if (Object.keys(updatedSchedule).length > 0) {
        setAllowSubmit(true)
      } else {
        setAllowSubmit(false)
      }
    }
    if (sameTiming === '') {
      setAllowSubmit(false)
    }
    if (badTimings() === true) {
      setAllowSubmit(false)
    }
    if (invalidTimings() === true) {
      setAllowSubmit(false)
    }
    if (!isAnyDaySelected) {
      setAllowSubmit(false)
    }
  }, [
    selectedDays,
    Object.keys(updatedSchedule).length,
    updatedSchedule,
    isAnyDaySelected,
  ])

  return (
    <Card className={classes.card}>
      <p>Days</p>
      <DaySelector
        selectedDays={selectedDays}
        setSelectedDays={setSelectedDays}
        timings={timings}
        setTimings={setTimings}
        initialTimings={initialTimings}
        schedule={updatedSchedule}
        setSchedule={setUpdatedSchedule}
      />
      <div className={classes.radio_div}>
        <p>Are the timings same for each day?</p>
        <div className={classes.radioWrapper}>
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
              name="Different Timings"
              disabled={!isAnyDaySelected}
            />
            <p>No</p>
          </div>
        </div>
      </div>
      <Divider />
      {isAnyDaySelected && (
        <div>
          {sameTiming === 'yes' ? (
            <div>
              <AllDay
                timings={timings}
                setTimings={setTimings}
                defaultDate={defaultDate}
                schedule={updatedSchedule}
                setSchedule={setUpdatedSchedule}
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
                  schedule={updatedSchedule}
                  setSchedule={setUpdatedSchedule}
                />
              )}
              {selectedDays.tue.selected && (
                <Tuesday
                  timings={timings}
                  setTimings={setTimings}
                  defaultDate={defaultDate}
                  schedule={updatedSchedule}
                  setSchedule={setUpdatedSchedule}
                />
              )}
              {selectedDays.wed.selected && (
                <Wednesday
                  timings={timings}
                  setTimings={setTimings}
                  defaultDate={defaultDate}
                  schedule={updatedSchedule}
                  setSchedule={setUpdatedSchedule}
                />
              )}
              {selectedDays.thu.selected && (
                <Thursday
                  timings={timings}
                  setTimings={setTimings}
                  defaultDate={defaultDate}
                  schedule={updatedSchedule}
                  setSchedule={setUpdatedSchedule}
                />
              )}
              {selectedDays.fri.selected && (
                <Friday
                  timings={timings}
                  setTimings={setTimings}
                  defaultDate={defaultDate}
                  schedule={updatedSchedule}
                  setSchedule={setUpdatedSchedule}
                />
              )}
              {selectedDays.sat.selected && (
                <Saturday
                  timings={timings}
                  setTimings={setTimings}
                  defaultDate={defaultDate}
                  schedule={updatedSchedule}
                  setSchedule={setUpdatedSchedule}
                />
              )}
              {selectedDays.sun.selected && (
                <Sunday
                  timings={timings}
                  setTimings={setTimings}
                  defaultDate={defaultDate}
                  schedule={updatedSchedule}
                  setSchedule={setUpdatedSchedule}
                />
              )}
            </div>
          )}
        </div>
      )}
      {badTimings() === true && (
        <p className={classes.error}>Please Enter a Valid Time Range.</p>
      )}
      {invalidTimings() === true && (
        <p className={classes.error}>Please Enter a Valid Time Range.</p>
      )}
    </Card>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      margin: '0 2rem',
      padding: 25,
    },

    bold: {
      fontWeight: '500',
    },
    radio: {
      display: 'flex',
      alignItems: 'center',
      margin: '0 20px 0 0',
    },
    radioSelect: {
      color: '#638FE5',
      '&:checked': {
        color: '#638FE5',
      },
    },
    radio_div: {
      padding: '10px 0',
    },
    radioWrapper: {
      display: 'flex',
    },
    error: {
      color: '#ff471b',
    },
  }),
)

export default UpdateSchedule
