import React from 'react'
import { createStyles, makeStyles } from '@material-ui/core/styles'
import Card from './Card'
import { ReturnMonth } from '../../Global/Functions'

const NoticeCard = ({ noticeTime, notice }) => {
  const classes = useStyles()

  const getDateTime = () => {
    const date = new Date(noticeTime * 1000)
    const day = date.getDate()
    const month = ReturnMonth(date.getMonth())
    const year = date.getFullYear()
    const time = formatAMPM(date)
    return `${day} ${month}, ${year} | ${time}`
  }

  const formatAMPM = (date) => {
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours %= 12
    hours = hours || 12
    minutes = minutes < 10 ? `0${minutes}` : minutes
    return `${hours}:${minutes} ${ampm}`
  }
  return (
    <>
      <Card className={classes.card}>
        <div>
          <div>
            <h3 className={classes.notice}>&ldquo;{notice}</h3>
            <small className={classes.timeStamp}>{getDateTime()}</small>
          </div>
        </div>
      </Card>
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      paddingInlineStart: 15,
      paddingInlineEnd: 15,
      paddingBlock: 20,
    },
    notice: {
      fontSize: 16,
    },
    timeStamp: {
      fontSize: 12,
    },
  }),
)

export default NoticeCard
