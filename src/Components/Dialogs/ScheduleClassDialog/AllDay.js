import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import {
  HoursMinutesToObject,
  ObjToHoursMinutes,
} from '../../../Global/Functions'

const AllDay = ({
  timings,
  setTimings,
  schedule,
  setSchedule,
  selectedDays,
}) => {
  const handleStartTimeChange = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    const end = new Date(time)
    end.setHours(end.getHours() + 1)

    setTimings({
      ...timings,
      start: time,
      end,
    })

    const startTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    const endTime = end.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      mon: selectedDays.mon.selected
        ? { start: startTime, end: endTime }
        : null,
      tue: selectedDays.tue.selected
        ? { start: startTime, end: endTime }
        : null,
      wed: selectedDays.wed.selected
        ? { start: startTime, end: endTime }
        : null,
      thu: selectedDays.thu.selected
        ? { start: startTime, end: endTime }
        : null,
      fri: selectedDays.fri.selected
        ? { start: startTime, end: endTime }
        : null,
      sat: selectedDays.sat.selected
        ? { start: startTime, end: endTime }
        : null,
      sun: selectedDays.sun.selected
        ? { start: startTime, end: endTime }
        : null,
    })
  }

  const handleEndTimeChange = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    setTimings({
      ...timings,
      end: time,
    })
    const endTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      mon: selectedDays.mon.selected
        ? { start: schedule.mon.start, end: endTime }
        : null,
      tue: selectedDays.tue.selected
        ? { start: schedule.tue.start, end: endTime }
        : null,
      wed: selectedDays.wed.selected
        ? { start: schedule.wed.start, end: endTime }
        : null,
      thu: selectedDays.thu.selected
        ? { start: schedule.thu.start, end: endTime }
        : null,
      fri: selectedDays.fri.selected
        ? { start: schedule.fri.start, end: endTime }
        : null,
      sat: selectedDays.sat.selected
        ? { start: schedule.sat.start, end: endTime }
        : null,
      sun: selectedDays.sun.selected
        ? { start: schedule.sun.start, end: endTime }
        : null,
    })
  }

  const classes = useStyles()

  return (
    <div className={classes.container}>
      <p>Timings</p>
      <div className={`flex-row ${classes.wrapper}`}>
        <TextField
          id="time"
          label="Start Time"
          type="time"
          value={ObjToHoursMinutes(timings.start)}
          onChange={handleStartTimeChange}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
        />
        <TextField
          id="time"
          label="End Time"
          type="time"
          value={ObjToHoursMinutes(timings.end)}
          onChange={handleEndTimeChange}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          disabled={ObjToHoursMinutes(timings.start) === '00:00'}
        />
      </div>
    </div>
  )
}

export default AllDay

const useStyles = makeStyles({
  textField: {
    width: '48%',
  },
  container: {
    margin: '15px 0',
  },
  wrapper: {
    margin: '5px 0',
    justifyContent: 'space-between',
  },
})
