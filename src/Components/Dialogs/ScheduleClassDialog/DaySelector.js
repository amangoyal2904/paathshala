import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'

const DaySelector = ({
  selectedDays,
  setSelectedDays,
  timings,
  setTimings,
  initialTimings,
  schedule,
  setSchedule,
}) => {
  const classes = useStyles()

  return (
    <div className={classes.weekdays}>
      <button
        type="button"
        className={
          selectedDays.mon.selected ? classes.selected_day : classes.day
        }
        onClick={() => {
          setSelectedDays({
            ...selectedDays,
            mon: {
              ...selectedDays.mon,
              selected: !selectedDays.mon.selected,
            },
          })
          setTimings({
            ...timings,
            mon: initialTimings.mon,
          })
          if (selectedDays.mon.selected) {
            delete schedule.mon
          }
          if (!selectedDays.mon.selected) {
            setSchedule({
              ...schedule,
              mon: {
                start: timings.start.toLocaleTimeString('it-IT').slice(0, 5),
                end: timings.end.toLocaleTimeString('it-IT').slice(0, 5),
              },
            })
          }
        }}
      >
        <p className={classes.unselectable}>Mon</p>
      </button>
      <button
        type="button"
        className={
          selectedDays.tue.selected ? classes.selected_day : classes.day
        }
        onClick={() => {
          setSelectedDays({
            ...selectedDays,
            tue: {
              ...selectedDays.tue,
              selected: !selectedDays.tue.selected,
            },
          })
          setTimings({
            ...timings,
            tue: initialTimings.tue,
          })
          if (selectedDays.tue.selected) {
            delete schedule.tue
          }
          if (!selectedDays.tue.selected) {
            setSchedule({
              ...schedule,
              tue: {
                start: timings.start.toLocaleTimeString('it-IT').slice(0, 5),
                end: timings.end.toLocaleTimeString('it-IT').slice(0, 5),
              },
            })
          }
        }}
      >
        <p className={classes.unselectable}>Tue</p>
      </button>
      <button
        type="button"
        className={
          selectedDays.wed.selected ? classes.selected_day : classes.day
        }
        onClick={() => {
          setSelectedDays({
            ...selectedDays,
            wed: {
              ...selectedDays.wed,
              selected: !selectedDays.wed.selected,
            },
          })
          setTimings({
            ...timings,
            wed: initialTimings.wed,
          })
          if (selectedDays.wed.selected) {
            delete schedule.wed
          }
          if (!selectedDays.wed.selected) {
            setSchedule({
              ...schedule,
              wed: {
                start: timings.start.toLocaleTimeString('it-IT').slice(0, 5),
                end: timings.end.toLocaleTimeString('it-IT').slice(0, 5),
              },
            })
          }
        }}
      >
        <p className={classes.unselectable}>Wed</p>
      </button>
      <button
        type="button"
        className={
          selectedDays.thu.selected ? classes.selected_day : classes.day
        }
        onClick={() => {
          setSelectedDays({
            ...selectedDays,
            thu: {
              ...selectedDays.thu,
              selected: !selectedDays.thu.selected,
            },
          })
          setTimings({
            ...timings,
            thu: initialTimings.thu,
          })
          if (selectedDays.thu.selected) {
            delete schedule.thu
          }
          if (!selectedDays.thu.selected) {
            setSchedule({
              ...schedule,
              thu: {
                start: timings.start.toLocaleTimeString('it-IT').slice(0, 5),
                end: timings.end.toLocaleTimeString('it-IT').slice(0, 5),
              },
            })
          }
        }}
      >
        <p className={classes.unselectable}>Thu</p>
      </button>
      <button
        type="button"
        className={
          selectedDays.fri.selected ? classes.selected_day : classes.day
        }
        onClick={() => {
          setSelectedDays({
            ...selectedDays,
            fri: {
              ...selectedDays.fri,
              selected: !selectedDays.fri.selected,
            },
          })
          setTimings({
            ...timings,
            fri: initialTimings.fri,
          })
          if (selectedDays.fri.selected) {
            delete schedule.fri
          }
          if (!selectedDays.fri.selected) {
            setSchedule({
              ...schedule,
              fri: {
                start: timings.start.toLocaleTimeString('it-IT').slice(0, 5),
                end: timings.end.toLocaleTimeString('it-IT').slice(0, 5),
              },
            })
          }
        }}
      >
        <p className={classes.unselectable}>Fri</p>
      </button>
      <button
        type="button"
        className={
          selectedDays.sat.selected ? classes.selected_day : classes.day
        }
        onClick={() => {
          setSelectedDays({
            ...selectedDays,
            sat: {
              ...selectedDays.sat,
              selected: !selectedDays.sat.selected,
            },
          })
          setTimings({
            ...timings,
            sat: initialTimings.sat,
          })
          if (selectedDays.sat.selected) {
            delete schedule.sat
          }
          if (!selectedDays.sat.selected) {
            setSchedule({
              ...schedule,
              sat: {
                start: timings.start.toLocaleTimeString('it-IT').slice(0, 5),
                end: timings.end.toLocaleTimeString('it-IT').slice(0, 5),
              },
            })
          }
        }}
      >
        <p className={classes.unselectable}>Sat</p>
      </button>
      <button
        type="button"
        className={
          selectedDays.sun.selected ? classes.selected_day : classes.day
        }
        onClick={() => {
          setSelectedDays({
            ...selectedDays,
            sun: {
              ...selectedDays.sun,
              selected: !selectedDays.sun.selected,
            },
          })
          setTimings({
            ...timings,
            sun: initialTimings.sun,
          })
          if (selectedDays.sun.selected) {
            delete schedule.sun
          }
          if (!selectedDays.sun.selected) {
            setSchedule({
              ...schedule,
              sun: {
                start: timings.start.toLocaleTimeString('it-IT').slice(0, 5),
                end: timings.end.toLocaleTimeString('it-IT').slice(0, 5),
              },
            })
          }
        }}
      >
        <p className={classes.unselectable}>Sun</p>
      </button>
    </div>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
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
      backgroundColor: 'unset',
      font: 'inherit',
    },
    selected_day: {
      border: '1px solid #A9A9A9',
      font: 'inherit',
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

    unselectable: {
      WebkitUserSelect: 'none',
      KhtmlUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      userSelect: 'none',
    },
  }),
)

export default DaySelector
