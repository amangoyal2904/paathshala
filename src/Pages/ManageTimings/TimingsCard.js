import React, { useState } from 'react'
import { Divider } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { FaCaretRight } from 'react-icons/fa'
import Spinner from '../../Components/Progress/Spinner'
import Card from '../../Components/Cards/Card'
import Controls from '../../Components/Controls/Controls'
import {
  ConvertTimeTo24Hours,
  ConvertTime,
  ReturnMonth,
} from '../../Global/Functions'
import ScheduleClassDialog from '../../Components/Dialogs/ScheduleClassDialog/ScheduleClassDialog'

const WeekDays = (day) => {
  switch (day) {
    case 'mon':
      return 'Monday'
    case 'tue':
      return 'Tuesday'
    case 'wed':
      return 'Wednesday'
    case 'thu':
      return 'Thursday'
    case 'fri':
      return 'Friday'
    case 'sat':
      return 'Saturday'
    case 'sun':
      return 'Sunday'
    default:
      break
  }
}

const ObjToArr = (obj) => {
  const keys = Object.keys(obj)
  const values = Object.values(obj)
  const result = []
  const temp = {
    day: '',
    start: '',
    end: '',
  }
  for (let i = 0; i < keys.length; i += 1) {
    const newObj = Object.create(temp)
    newObj.day = WeekDays(keys[i])
    newObj.start = values[i].start
    newObj.end = values[i].end
    result.push(newObj)
  }
  return result
}

const SortedArray = (obj) => {
  const data = ObjToArr(obj)
  const sorter = {
    monday: 1,
    tuesday: 2,
    wednesday: 3,
    thursday: 4,
    friday: 5,
    saturday: 6,
    sunday: 7,
  }

  data.sort(function sortByDay(a, b) {
    const day1 = a.day.toLowerCase()
    const day2 = b.day.toLowerCase()
    return sorter[day1] - sorter[day2]
  })
  return data
}

const TimingsCard = ({
  updatedSchedule,
  nextLectureTiming,
  batchId,
  fetchScheduleData,
}) => {
  const classes = useStyles()
  const NextClass = (t) => {
    const date = ConvertTime(t)
    const day = date.getDate()
    const month = ReturnMonth(date.getMonth())
    const year = date.getFullYear().toString().slice(2, 4)
    const time = ConvertTimeTo24Hours(date.toTimeString().slice(0, 5))
    return `${day} ${month}, ${year} | ${time}`
  }

  const [openScheduleClass, setOpenScheduleClass] = useState(false)

  const handleOpenScheduleClass = () => {
    setOpenScheduleClass(true)
  }

  const handleCloseScheduleClass = () => {
    setOpenScheduleClass(false)
  }

  return (
    <>
      {updatedSchedule ? (
        <>
          <Card className={classes.card}>
            {Array.isArray(updatedSchedule) ? (
              <>
                <div className={classes.no_schedule}>
                  <p>There is no schedule available for this batch.</p>
                  <Controls.Button
                    text="Add Schedule"
                    className={classes.add_schedule_btn}
                    onClick={handleOpenScheduleClass}
                  />
                </div>
              </>
            ) : (
              <>
                <div className={classes.next_class}>
                  <p className={classes.day}>Next Class</p>
                  <p className={classes.bold}>
                    {NextClass(nextLectureTiming.starts)}
                  </p>
                </div>
                <Divider />
                {SortedArray(updatedSchedule).map((item) => (
                  <div className={classes.rest_schedule}>
                    <div className={classes.dayWrapper}>
                      <p className={classes.day}>{item.day}</p>
                      <div className={classes.time_div}>
                        <FaCaretRight />
                        <p className={classes.bold}>
                          {ConvertTimeTo24Hours(item.start)} to{' '}
                          {ConvertTimeTo24Hours(item.end)}
                        </p>
                      </div>
                    </div>
                    <Divider />
                  </div>
                ))}
              </>
            )}
          </Card>
          {/* <ConfirmDialog
            open={openConfirmDialog}
            setOpen={setOpenConfirmDialog}
            title="Delete Schedule"
            content="Are you Sure you want to delete this schedule"
            yesAction={handleScheduleDelete}
            noAction={() => setOpenConfirmDialog(false)}
          /> */}
          {/* {!Array.isArray(updatedSchedule) && (
            <Fragment>
              <div className={classes.delete}>
                <Controls.Button
                  className={classes.delete_btn}
                  variant="contained"
                  onClick={() => setOpenConfirmDialog(true)}
                  text="Delete Schedule"
                />
              </div>
            </Fragment>
          )} */}
        </>
      ) : (
        <Spinner />
      )}
      <ScheduleClassDialog
        open={openScheduleClass}
        close={handleCloseScheduleClass}
        batch_id={batchId}
        refreshFunction={fetchScheduleData}
      />
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      margin: '0 2rem',
    },
    next_class: {
      padding: 20,
    },
    rest_schedule: {
      padding: '0 2px',
    },
    dayWrapper: {
      padding: '20px 0',
    },
    day: {
      fontSize: '0.8rem',
      margin: '0 0 0 16px',
    },
    bold: {
      fontWeight: '500',
    },
    time_div: {
      display: 'flex',
      alignItems: 'center',
    },
    delete: {
      padding: '20px 2rem',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'flex-end',
    },
    delete_btn: {
      background: 'linear-gradient(to right, #cf2030, #bc222a)',
      '&:hover': {
        background: 'linear-gradient(to right, #cf2030, #bc222a)',
      },
      color: '#fff',
      width: 'unset',
    },
    add_schedule_btn: {
      margin: '20px 0',
      width: '30%',
    },
    no_schedule: {
      padding: 30,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
  }),
)

export default TimingsCard
