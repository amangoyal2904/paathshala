import React, { useContext, useEffect } from 'react'
import { Grid, Link, Breadcrumbs, Typography, Paper } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { IoIosArrowForward } from 'react-icons/io'
import { BatchContext } from '../../../Context/BatchContext'
import Spinner from '../../../Components/Progress/Spinner'

const AttendanceCard = ({ title, date, percent }) => {
  const classes = useStyles()
  return (
    <Paper className={classes.card}>
      <div>
        <p className={classes.title}>{title}</p>
        <p className={classes.date}>{date}</p>
      </div>
      <div>
        <p className={classes.percent}>{percent}</p>
      </div>
    </Paper>
  )
}

const StudentAttendance = ({ id }) => {
  const classes = useStyles()

  const { loading, batchByCode, FindBatchWithCode } = useContext(BatchContext)

  useEffect(() => {
    FindBatchWithCode(id)
  }, [])

  const temp = [
    {
      title: 'Live Class 1',
      date: '4 Mar, 2021 | 03:00 PM',
      percent: '98%',
    },
    {
      title: 'Live Class 2',
      date: '4 Mar, 2021 | 04:00 PM',
      percent: '92%',
    },
    {
      title: 'Live Class 3',
      date: '4 Mar, 2021 | 05:00 PM',
      percent: '93%',
    },
    {
      title: 'Live Class 4',
      date: '4 Mar, 2021 | 06:00 PM',
      percent: '95%',
    },
    {
      title: 'Live Class 5',
      date: '4 Mar, 2021 | 07:00 PM',
      percent: '91%',
    },
    {
      title: 'Live Class 6',
      date: '4 Mar, 2021 | 08:00 PM',
      percent: '96%',
    },
  ]

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className={`${classes.divWrapper} full-height`}>
          <Grid container className={classes.gridContainer}>
            <Grid item xs={6} sm={9}>
              <div className="height-100 flex-row align-items-center">
                <p
                  className={`${classes.heading} bolder`}
                  style={{ fontSize: '24px', color: '#6481e4' }}
                >
                  My Attendance
                </p>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Breadcrumbs
                separator={<IoIosArrowForward />}
                aria-label="breadcrumb"
              >
                <Link color="inherit" href="/dashboard">
                  Dashboard
                </Link>
                <Link
                  color="inherit"
                  href={`/dashboard/view/${batchByCode.id}`}
                >
                  {batchByCode.name}
                </Link>
                <Typography color="textPrimary">Attendance</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems="stretch">
            {temp.map((item) => (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                <AttendanceCard
                  title={item.title}
                  date={item.date}
                  percent={item.percent}
                />
              </Grid>
            ))}
          </Grid>
        </div>
      )}
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '20px',
      borderRadius: 8,
      boxShadow: '2px 4px 6px 2px rgba(0, 0, 0, 0.06)',
    },
    title: {
      fontWeight: 'bold',
    },
    date: {
      fontSize: '0.8rem',
      color: '#888888',
    },
    percent: {
      fontWeight: 'bold',
    },
    divWrapper: {
      padding: '2rem',
    },
    gridContainer: {
      padding: '0 0 2rem 0',
    },
    heading: {
      fontSize: '24px',
      color: '#6481e4',
    },
  }),
)

export default StudentAttendance
