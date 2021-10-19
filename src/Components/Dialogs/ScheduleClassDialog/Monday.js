import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import {
  HoursMinutesToObject,
  ObjToHoursMinutes,
} from '../../../Global/Functions'

const Monday = ({ timings, setTimings, schedule, setSchedule }) => {
  const MonStartTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    const end = new Date(time)
    end.setHours(end.getHours() + 1)
    setTimings({
      ...timings,
      mon: { ...timings.mon, start: time, end },
    })
    const startTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    const endTime = end.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      mon: { start: startTime, end: endTime },
    })
  }

  const MonEndTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    setTimings({
      ...timings,
      mon: { ...timings.mon, end: time },
    })
    const endTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      mon: { ...schedule.mon, end: endTime },
    })
  }
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <p>Monday</p>
      <div className={`flex-row ${classes.wrapper}`}>
        <TextField
          id="time"
          label="Start Time"
          type="time"
          value={ObjToHoursMinutes(timings.mon.start)}
          onChange={MonStartTime}
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
          value={ObjToHoursMinutes(timings.mon.end)}
          onChange={MonEndTime}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          disabled={ObjToHoursMinutes(timings.mon.start) === '00:00'}
        />
      </div>
    </div>
  )
}

export default Monday

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
