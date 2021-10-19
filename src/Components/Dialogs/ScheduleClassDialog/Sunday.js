import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import {
  HoursMinutesToObject,
  ObjToHoursMinutes,
} from '../../../Global/Functions'

const Sunday = ({ timings, setTimings, schedule, setSchedule }) => {
  const SunStartTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    const end = new Date(time)
    end.setHours(end.getHours() + 1)
    setTimings({
      ...timings,
      sun: { ...timings.sun, start: time, end },
    })
    const startTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    const endTime = end.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      sun: { start: startTime, end: endTime },
    })
  }

  const SunEndTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    setTimings({
      ...timings,
      sun: { ...timings.sun, end: time },
    })
    const endTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      sun: { ...schedule.sun, end: endTime },
    })
  }
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <p>Sunday</p>
      <div className={`flex-row ${classes.wrapper}`}>
        <TextField
          id="time"
          label="Start Time"
          type="time"
          value={ObjToHoursMinutes(timings.sun.start)}
          onChange={SunStartTime}
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
          value={ObjToHoursMinutes(timings.sun.end)}
          onChange={SunEndTime}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          disabled={ObjToHoursMinutes(timings.sun.start) === '00:00'}
        />
      </div>
    </div>
  )
}

export default Sunday
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
