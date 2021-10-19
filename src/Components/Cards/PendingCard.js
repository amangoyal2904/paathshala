import React from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { IconButton, Grid, Divider, CardContent } from '@material-ui/core'
import { IoLockClosed } from 'react-icons/io5'
import Controls from '../Controls/Controls'
import Card from './Card'

const PendingCard = ({ batchName, subject, teacherName }) => {
  const classes = useStyles()

  return (
    <Card>
      <CardContent classes={{ root: classes.removeBottomPadding }}>
        <Grid container className={classes.first_grid}>
          <Grid item xs={12}>
            <div className="height-100 flex-row align-items-center">
              <p className={`bolder ${classes.batchName}`}>{batchName}</p>
            </div>
          </Grid>
        </Grid>
        <Divider light />
        <Grid container className={classes.second_grid} justify="space-around">
          <Grid item xs={12} sm={6}>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <p className={classes.key}>Subject</p>
              </Grid>
              <Grid item xs={12}>
                <p className="fine-text bold">{subject}</p>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Grid container alignItems="center">
              <Grid item xs={12}>
                <p className={classes.key}>Teacher</p>
              </Grid>
              <Grid item xs={12}>
                <p className="fine-text bold">{teacherName}</p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
        <Grid container className={classes.third_grid}>
          <Grid item xs={12}>
            <p className={classes.key}>Next Class</p>
          </Grid>
          <Grid item xs={12}>
            <IconButton disabled className={classes.iconButton}>
              <IoLockClosed size={16} />
            </IconButton>
          </Grid>
        </Grid>
        <Grid
          container
          className={classes.fourth_grid}
          direction="row"
          spacing={2}
        >
          <Grid item xs={12}>
            <Controls.Button
              text="Request Pending"
              variant="outlined"
              disabled
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    iconButton: {
      padding: 0,
    },
    first_grid: {
      padding: '9px 0',
    },
    second_grid: {
      padding: '0.5rem 1rem',
    },
    third_grid: {
      padding: '0.4rem 1rem',
    },
    fourth_grid: {
      padding: '1rem',
    },
    key: {
      fontSize: 11,
      opacity: 0.8,
      fontWeight: '500',
    },
    removeBottomPadding: {
      paddingBottom: '0px !important',
    },
    batchName: {
      marginLeft: '1rem',
      color: '#5a8aeb',
      fontSize: '1.125rem',
    },
  }),
)
export default PendingCard
