/* eslint-disable jsx-a11y/aria-role */
import React, { useState, useContext, useEffect, Fragment } from 'react'
import { Grid, Breadcrumbs, Typography, Link } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { useHistory } from 'react-router-dom'
import { IoIosArrowForward } from 'react-icons/io'
import { BatchContext } from '../../Context/BatchContext'
import AVDialog from '../../Components/Dialogs/AVDialog'
import Spinner from '../../Components/Progress/Spinner'
import Controls from '../../Components/Controls/Controls'
import BatchDetailCard from '../../Components/Cards/BatchDetailCard'
import NoticeCard from '../../Components/Cards/NoticeCard'
import RefreshCard from '../../Components/Refresh/RefreshCard'

const StudentBatchDetail = ({ id }) => {
  const history = useHistory()
  const classes = useStyles()
  const [openAVDialog, setOpenAVDialog] = useState(false)
  const [continueButtonLoading, setContinueButtonLoading] = useState(false)

  const {
    FindBatchWithCode,
    batchByCode,
    GetCurrentBatchNotices,
    loading,
    batchNotices,
    ResumeBatchLecture,
    setLoading,
  } = useContext(BatchContext)

  async function fetchData() {
    setLoading(true)
    const res = await FindBatchWithCode(id)
    if (!res) {
      history.push('/')
    }
    await GetCurrentBatchNotices(id)
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleAVDialogOpen = () => {
    setOpenAVDialog(true)
  }

  const handleAVDialogClose = () => {
    setOpenAVDialog(false)
  }

  const displayCondition = (lecture) => {
    const { starts, ends } = lecture
    const now = new Date().getTime() / 1000
    if (now > starts && now < ends) {
      return true
    }
    return false
  }

  const handleResumeLecture = async () => {
    setContinueButtonLoading(true)
    try {
      const res = await ResumeBatchLecture(batchByCode.lecture.id)
      const { app_id, rtc_token, rtm_token, started_at, liveboard_url } =
        res.data
      history.push({
        pathname: `/dashboard/class/${batchByCode.lecture.id}`,
        state: {
          startClass: true,
          appId: app_id,
          RTCToken: rtc_token,
          RTMToken: rtm_token,
          classStartTime: started_at,
          liveboard_url,
          role: 'T',
          batch_id: id,
        },
      })
      setContinueButtonLoading(false)
    } catch (err) {
      setContinueButtonLoading(false)
    }
  }

  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <div className="full-height">
          <Grid container justify="space-between" className={classes.grid}>
            <Grid item xs={6} sm={9}>
              <div className="height-100 flex-row align-items-center">
                <p className={`${classes.batchName} bolder`}>
                  {batchByCode.name}
                </p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              {batchByCode.lecture ? (
                displayCondition(batchByCode.lecture) ? (
                  <Controls.Button
                    text="Join Class"
                    size="large"
                    onClick={handleAVDialogOpen}
                  />
                ) : (
                  <Controls.Button
                    text="Class not live"
                    size="large"
                    variant="outlined"
                    disabled
                  />
                )
              ) : (
                <Controls.Button
                  text="Class not live"
                  size="large"
                  variant="outlined"
                  disabled
                />
              )}
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
                <Typography color="textPrimary">Batch Details</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <BatchDetailCard
            batchCode={batchByCode.id}
            batchSubject={batchByCode.subject}
            batchStandard={batchByCode.standard}
            batchSchedule={batchByCode.schedule}
            batchName={batchByCode.name}
            batchBoard={batchByCode.board}
            nextLectureTiming={batchByCode.next_lecture_timing}
          />
          <div className={classes.container}>
            <h2 className={classes.heading}>Notice Board</h2>
            {batchNotices.slice(0, 3).map((batchNotice) => (
              <div style={{ marginBottom: '1rem' }}>
                <NoticeCard
                  key={batchNotice.id}
                  notice={batchNotice.message}
                  noticeTime={batchNotice.updated_at}
                />
              </div>
            ))}
            {batchNotices.length <= 0 && (
              <p className="fine-text secondary-text">
                No notice recieved from teacher
              </p>
            )}
          </div>

          {openAVDialog && (
            <AVDialog
              open={openAVDialog}
              onClose={handleAVDialogClose}
              batchId={batchByCode.id}
              handleGoToClass={
                displayCondition(batchByCode.lecture)
                  ? handleResumeLecture
                  : null
              }
              isLoading={continueButtonLoading}
            />
          )}
        </div>
      )}
      <RefreshCard
        msg="Please Refresh the page to to check if there is an update in this batch."
        onRefresh={fetchData}
      />
    </>
  )
}

const useStyles = makeStyles((theme) =>
  createStyles({
    grid: {
      padding: '2rem',
    },
    batchName: {
      fontSize: '24px',
      color: '#6481e4',
    },
    container: {
      width: '100%',
      margin: '1.5rem auto 0',
      padding: '0 2rem',
    },
    header: {
      display: 'flex',
      padding: '20px 0 0 0',
      justifyContent: 'space-between',
      borderBottom: '1px solid #d3d3d3',
    },
    heading: {
      fontSize: 18,
      margin: '0 0 1rem 0',
    },
    btn1: {
      backgroundColor: 'black',
      color: 'white',
      '&:hover': {
        backgroundColor: 'black',
      },
      margin: '1 0',
    },
    icons_div: {
      display: 'flex',
      alignItems: 'center',
    },
    icon: {
      color: 'black',
    },
    information: {
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px 0',
      borderBottom: '1px solid #d3d3d3',
      backgroundColor: '#f8f8f8',
    },
    small_heading: {
      fontSize: 15,
    },
    info: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    card_container: {
      padding: '20px 0',
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
    },
    card: {
      padding: '40px 60px',
      backgroundColor: '#d8d8d8',
      margin: '0 0 10px 0',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    paper: {
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      width: '30%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    modal_header: {
      padding: '0 0 10px 0',
    },
    modal_heading: {
      fontSize: 25,
      fontWeight: 'bold',
      display: 'flex',
      justifyContent: 'center',
    },
    modal_small_text: {
      fontSize: 14,
    },
    modal_middle1: {
      display: 'flex',
      flexDirection: 'column',
      borderBottom: '1px solid #d3d3d3',
      borderTop: '1px solid #d3d3d3',
    },
    modal_middle1_card: {
      display: 'flex',
      justifyContent: 'space-evenly',
      width: '100%',
      padding: '10px 0',
    },
    audio_video_card: {
      padding: '20px 30px',
      margin: '0 10px',
      backgroundColor: '#d8d8d8',
      '&:hover': {
        cursor: 'pointer',
      },
      display: 'flex',
      alignItems: 'center',
    },
    join_text: {
      fontSize: 13,
      fontWeight: 'bold',
    },
    modal_middle2: {
      display: 'flex',
      margin: '10px 0',
    },
    test_text: {
      fontSize: 13,
      fontWeight: 'bold',
      margin: '0 10px',
      textDecorationLine: 'underline',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    tick: {
      margin: '0 0 0 10px',
    },
    modal_bottom: {
      display: 'flex',
      alignItems: 'center',
    },
  }),
)

export default StudentBatchDetail
