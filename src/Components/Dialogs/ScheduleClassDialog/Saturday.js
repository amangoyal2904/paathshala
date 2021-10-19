import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import {
  HoursMinutesToObject,
  ObjToHoursMinutes,
} from '../../../Global/Functions'

const Saturday = ({ timings, setTimings, schedule, setSchedule }) => {
  const SatStartTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    const end = new Date(time)
    end.setHours(end.getHours() + 1)
    setTimings({
      ...timings,
      sat: { ...timings.sat, start: time, end },
    })
    const startTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    const endTime = end.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      sat: { start: startTime, end: endTime },
    })
  }

  const SatEndTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    setTimings({
      ...timings,
      sat: { ...timings.sat, end: time },
    })
    const endTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      sat: { ...schedule.sat, end: endTime },
    })
  }
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <p>Saturday</p>
      <div className={`flex-row ${classes.wrapper}`}>
        <TextField
          id="time"
          label="Start Time"
          type="time"
          value={ObjToHoursMinutes(timings.sat.start)}
          onChange={SatStartTime}
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
          value={ObjToHoursMinutes(timings.sat.end)}
          onChange={SatEndTime}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          disabled={ObjToHoursMinutes(timings.sat.start) === '00:00'}
        />
      </div>
    </div>
  )
}

export default Saturday
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
