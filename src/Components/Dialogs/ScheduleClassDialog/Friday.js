import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import {
  HoursMinutesToObject,
  ObjToHoursMinutes,
} from '../../../Global/Functions'

const Friday = ({ timings, setTimings, schedule, setSchedule }) => {
  const FriStartTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    const end = new Date(time)
    end.setHours(end.getHours() + 1)
    setTimings({
      ...timings,
      fri: { ...timings.fri, start: time, end },
    })
    const startTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    const endTime = end.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      fri: { start: startTime, end: endTime },
    })
  }

  const FriEndTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    setTimings({
      ...timings,
      fri: { ...timings.fri, end: time },
    })
    const endTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      fri: { ...schedule.fri, end: endTime },
    })
  }
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <p>Friday</p>
      <div className={`flex-row ${classes.wrapper}`}>
        <TextField
          id="time"
          label="Start Time"
          type="time"
          value={ObjToHoursMinutes(timings.fri.start)}
          onChange={FriStartTime}
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
          value={ObjToHoursMinutes(timings.fri.end)}
          onChange={FriEndTime}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          disabled={ObjToHoursMinutes(timings.fri.start) === '00:00'}
        />
      </div>
    </div>
  )
}

export default Friday

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
