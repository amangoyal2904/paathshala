import React, { useContext, useEffect, useState } from 'react'
import Grid from '@material-ui/core/Grid'
import { Breadcrumbs, Link, Typography } from '@material-ui/core'
import { IoIosArrowForward } from 'react-icons/io'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { BatchContext } from '../../../../Context/BatchContext'
import Spinner from '../../../../Components/Progress/Spinner'
import Controls from '../../../../Components/Controls/Controls'
import NoticeCard from '../../../../Components/Cards/NoticeCard'

const NoticeBoard = ({ id }) => {
  const [messageValue, setMessageValue] = useState('')
  const [sortedNotices, setSortedNotices] = useState([])
  const classes = useStyles()

  const {
    SendBatchNotice,
    loading,
    batchByCode,
    FindBatchWithCode,
    GetCurrentBatchNotices,
    batchNotices,
  } = useContext(BatchContext)

  useEffect(() => {
    FindBatchWithCode(id)
    GetCurrentBatchNotices(id)
  }, [])

  useEffect(() => {
    setSortedNotices(batchNotices.sort((a, b) => b.id - a.id))
  }, [batchNotices])

  const handlePostNotice = async () => {
    if (messageValue.trim().length === 0) return
    SendBatchNotice({ batch: id, message: messageValue }).then(() => {
      setMessageValue('')
    })
  }
  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <div className="full-height">
          <Grid container justify="space-between" className="padding-small">
            <Grid item xs={12}>
              <div className="height-100 flex-row align-items-center">
                <p className="bolder route-heading">Notice Board</p>
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
                <Link color="inherit" href={`/dashboard/view/${id}`}>
                  {batchByCode.name}
                </Link>
                <Typography color="textPrimary">Notice Board</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <Grid container className={classes.container}>
            <Grid item xs={12} sm={10}>
              <Controls.Input
                placeholder="Type Notice to Publish"
                multiline
                rows={2}
                className={classes.input}
                value={messageValue}
                onChange={(e) => setMessageValue(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Controls.Button
                text="Post"
                size="large"
                onClick={handlePostNotice}
                className={classes.btn}
              />
            </Grid>
          </Grid>
          <Grid container className={classes.notice_container}>
            {sortedNotices.slice(0, 3).map((notice) => (
              <Grid item xs={12} className={classes.notice_grid}>
                <NoticeCard
                  key={notice.id}
                  notice={notice.message}
                  noticeTime={notice.updated_at}
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
    container: {
      padding: '1.5rem 2.5rem',
      backgroundColor: '#fff',
    },
    input: {
      width: 'calc(100% - 2rem)',
    },
    btn: {
      marginTop: '8%',
    },
    notice_container: {
      padding: '2rem 2.5rem 0',
    },
    notice_grid: {
      marginBottom: '1rem',
    },
  }),
)

export default NoticeBoard
