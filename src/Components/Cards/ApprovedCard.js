import React, { useContext, useState } from 'react'
import { Link, useHistory } from 'react-router-dom'
import {
  Divider,
  CardContent,
  Grid,
  makeStyles,
  createStyles,
  useMediaQuery,
} from '@material-ui/core'
import Controls from '../Controls/Controls'
import { BatchContext } from '../../Context/BatchContext'
import AVDialog from '../Dialogs/AVDialog'
import Card from './Card'
import {
  ConvertTime,
  ConvertTimeTo24Hours,
  ReturnMonth,
  StudentDisplayCondition,
} from '../../Global/Functions'
import BootstrapTooltip from '../Tooltips/BootstrapTooltip'

const ApprovedCard = ({
  batchName,
  batchId,
  subject,
  nextLectureTiming,
  lecture,
  teacherName,
}) => {
  const history = useHistory()
  const classes = useStyles()
  const matches = useMediaQuery('(min-width:1280px)')

  const [openAVDialog, setOpenAVDialog] = useState(false)
  const [continueButtonLoading, setContinueButtonLoading] = useState(false)

  const { FindBatchWithCode, ResumeBatchLecture, StartBatchLecture } =
    useContext(BatchContext)

  const handleAVDialogOpen = () => {
    setOpenAVDialog(true)
  }

  const handleAVDialogClose = () => {
    setOpenAVDialog(false)
  }

  const NextClass = (t) => {
    const date = ConvertTime(t)
    const day = date.getDate()
    const month = ReturnMonth(date.getMonth())
    const year = date.getFullYear().toString().slice(2, 4)
    const time = ConvertTimeTo24Hours(date.toTimeString().slice(0, 5))
    return `${day} ${month}, ${year} | ${time}`
  }

  const handleResumeLecture = async () => {
    setContinueButtonLoading(true)
    try {
      await FindBatchWithCode(batchId)
      const res = await ResumeBatchLecture(lecture.id)
      const { app_id, rtc_token, rtm_token, started_at, liveboard_url } =
        res.data
      history.push({
        pathname: `/dashboard/class/${lecture.id}`,
        state: {
          startClass: true,
          appId: app_id,
          RTCToken: rtc_token,
          RTMToken: rtm_token,
          classStartTime: started_at,
          liveboard_url,
          role: 'T',
          batchId,
        },
      })
      setContinueButtonLoading(false)
    } catch (err) {
      setContinueButtonLoading(false)
    }
  }

  const handleStartClass = async () => {
    setContinueButtonLoading(true)
    try {
      const res = await StartBatchLecture(batchId)
      const {
        app_id,
        rtc_token,
        rtm_token,
        started_at,
        liveboard_url,
        lecture_id,
      } = res
      setContinueButtonLoading(false)
      history.push({
        pathname: `/dashboard/class/${lecture_id}`,
        state: {
          startClass: true,
          appId: app_id,
          RTCToken: rtc_token,
          RTMToken: rtm_token,
          classStartTime: started_at,
          liveboard_url,
          role: 'T',
          batchId,
        },
      })
    } catch (err) {
      setContinueButtonLoading(false)
    }
  }

  const handleGoToClass = () => {
    if (nextLectureTiming) {
      if (lecture) {
        handleResumeLecture()
      } else if (StudentDisplayCondition(nextLectureTiming)) {
        handleStartClass()
      }
    } else if (lecture) {
      handleResumeLecture()
    }
  }

  const handleJoinClass = () => {
    history.push(`dashboard/view/${batchId}`)
  }

  return (
    <>
      <Card>
        <CardContent classes={{ root: classes.removeBottomPadding }}>
          <Grid container className={classes.first_grid}>
            <Grid item xs={12}>
              <Link to={`/dashboard/view/${batchId}`} className={classes.link}>
                <div className="height-100 flex-row align-items-center">
                  <p className={`bolder ${classes.batchName}`}>{batchName}</p>
                </div>
              </Link>
            </Grid>
          </Grid>
          <Divider light />
          <Grid
            container
            className={classes.second_grid}
            justify="space-around"
          >
            <Grid item xs={12} sm={6}>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <p className={classes.key}>Subject</p>
                </Grid>
                <Grid item xs={12}>
                  {subject ? (
                    subject.length > 16 ? (
                      <BootstrapTooltip title={subject} placement="top">
                        <p className="fine-text bold">
                          {`${subject.substring(0, 14)}..`}
                        </p>
                      </BootstrapTooltip>
                    ) : (
                      <p className="fine-text bold">{subject}</p>
                    )
                  ) : (
                    <p className="fine-text bold">NA</p>
                  )}
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Grid container alignItems="center">
                <Grid item xs={12}>
                  <p className={classes.key}>Teacher</p>
                </Grid>
                <Grid item xs={12}>
                  {teacherName ? (
                    teacherName.length > 16 ? (
                      <BootstrapTooltip title={teacherName} placement="top">
                        <p className="fine-text bold">
                          {`${teacherName.substring(0, 14)}..`}
                        </p>
                      </BootstrapTooltip>
                    ) : (
                      <p className="fine-text bold">{teacherName}</p>
                    )
                  ) : (
                    <p className="fine-text bold">NA</p>
                  )}
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid container className={classes.third_grid}>
            <Grid item xs={12}>
              <p className={classes.key}>Next Class</p>
            </Grid>
            <Grid item xs={12}>
              {nextLectureTiming ? (
                <p className="fine-text bold">
                  {NextClass(nextLectureTiming.starts)}
                </p>
              ) : (
                <p className="fine-text bold">No Schedule</p>
              )}
            </Grid>
          </Grid>
          <Grid
            container
            className={classes.fourth_grid}
            direction="row"
            spacing={2}
          >
            {nextLectureTiming ? (
              <>
                {lecture ? (
                  <>
                    <Grid item sm={12} lg={6}>
                      <Controls.Button
                        variant="contained"
                        color="primary"
                        text="Join Class"
                        onClick={handleAVDialogOpen}
                      />
                    </Grid>
                    {matches && (
                      <Grid item sm={12} lg={6}>
                        <Controls.Button
                          variant="outlined"
                          className={classes.button}
                          color="primary"
                          onClick={handleJoinClass}
                          text="Show Batch Detail"
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    {StudentDisplayCondition(nextLectureTiming) ? (
                      <>
                        <Grid item sm={12} lg={6}>
                          <Controls.Button
                            variant="contained"
                            color="primary"
                            text="Join Class"
                            onClick={handleAVDialogOpen}
                          />
                        </Grid>
                        {matches && (
                          <Grid item sm={12} lg={6}>
                            <Controls.Button
                              variant="outlined"
                              className={classes.button}
                              color="primary"
                              onClick={handleJoinClass}
                              text="Show Batch Detail"
                            />
                          </Grid>
                        )}
                      </>
                    ) : (
                      <>
                        <Grid item sm={12} lg={6}>
                          <Controls.Button
                            text="Class not live"
                            variant="contained"
                            disabled
                            style={{ color: 'rgba(255,255,255,.8)' }}
                          />
                        </Grid>
                        {matches && (
                          <Grid item sm={12} lg={6}>
                            <Controls.Button
                              variant="outlined"
                              className={classes.button}
                              color="primary"
                              onClick={handleJoinClass}
                              text="Show Batch Detail"
                            />
                          </Grid>
                        )}
                      </>
                    )}
                  </>
                )}
              </>
            ) : (
              <>
                {lecture ? (
                  <>
                    <Grid item sm={12} lg={6}>
                      <Controls.Button
                        variant="contained"
                        color="primary"
                        text="Join Class"
                        onClick={handleAVDialogOpen}
                      />
                    </Grid>
                    {matches && (
                      <Grid item sm={12} lg={6}>
                        <Controls.Button
                          variant="outlined"
                          className={classes.button}
                          color="primary"
                          onClick={handleJoinClass}
                          text="Show Batch Detail"
                        />
                      </Grid>
                    )}
                  </>
                ) : (
                  <>
                    <Grid item sm={12} lg={6}>
                      <Controls.Button
                        text="Class not live"
                        variant="contained"
                        disabled
                        style={{ color: 'rgba(255,255,255,.8)' }}
                      />
                    </Grid>
                    {matches && (
                      <Grid item sm={12} lg={6}>
                        <Controls.Button
                          variant="outlined"
                          className={classes.button}
                          color="primary"
                          onClick={handleJoinClass}
                          text="Show Batch Detail"
                        />
                      </Grid>
                    )}
                  </>
                )}
              </>
            )}
          </Grid>
        </CardContent>
      </Card>
      {openAVDialog && (
        <AVDialog
          open={openAVDialog}
          onClose={handleAVDialogClose}
          batchId={batchId}
          handleGoToClass={handleGoToClass}
          isLoading={continueButtonLoading}
        />
      )}
    </>
  )
}

export default ApprovedCard

const useStyles = makeStyles(() =>
  createStyles({
    button: {
      '&.MuiButton-outlinedPrimary:hover': {
        backgroundColor: '#5f80eb',
        color: '#fff',
      },
    },
    first_grid: {
      padding: '9px 0',
    },
    second_grid: {
      padding: '0.5rem 1rem',
    },
    third_grid: {
      padding: '0.55rem 1rem',
    },
    fourth_grid: {
      padding: '0 1rem 1rem',
    },
    key: {
      fontSize: 11,
      opacity: 0.8,
      fontWeight: '500',
    },
    removeBottomPadding: {
      paddingBottom: '0px !important',
    },
    link: {
      textDecoration: 'none',
      color: 'unset',
    },
    batchName: {
      marginLeft: '1rem',
      color: '#5a8aeb',
      fontSize: '1.125rem',
    },
  }),
)
