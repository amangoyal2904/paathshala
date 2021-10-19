import React from 'react'
import { makeStyles, TextField } from '@material-ui/core'
import {
  HoursMinutesToObject,
  ObjToHoursMinutes,
} from '../../../Global/Functions'

const Thursday = ({ timings, setTimings, schedule, setSchedule }) => {
  const ThuStartTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    const end = new Date(time)
    end.setHours(end.getHours() + 1)
    setTimings({
      ...timings,
      thu: { ...timings.thu, start: time, end },
    })
    const startTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    const endTime = end.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      thu: { start: startTime, end: endTime },
    })
  }

  const ThuEndTime = (t) => {
    const time = HoursMinutesToObject(t.target.value)
    setTimings({
      ...timings,
      thu: { ...timings.thu, end: time },
    })
    const endTime = time.toLocaleTimeString('it-IT').slice(0, 5)
    setSchedule({
      ...schedule,
      thu: { ...schedule.thu, end: endTime },
    })
  }
  const classes = useStyles()
  return (
    <div className={classes.container}>
      <p>Thursday</p>
      <div className={`flex-row ${classes.wrapper}`}>
        <TextField
          id="time"
          label="Start Time"
          type="time"
          value={ObjToHoursMinutes(timings.thu.start)}
          onChange={ThuStartTime}
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
          value={ObjToHoursMinutes(timings.thu.end)}
          onChange={ThuEndTime}
          className={classes.textField}
          InputLabelProps={{
            shrink: true,
          }}
          inputProps={{
            step: 300, // 5 min
          }}
          disabled={ObjToHoursMinutes(timings.thu.start) === '00:00'}
        />
      </div>
    </div>
  )
}

export default Thursday
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
