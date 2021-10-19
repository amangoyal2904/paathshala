import {
  Avatar,
  Card,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import CheckCircleIcon from '@material-ui/icons/CheckCircle'
import CancelIcon from '@material-ui/icons/Cancel'
import React, { useContext } from 'react'
import { useSnackbar } from 'notistack'
import showSuccessSnackbar from '../Snackbar/successSnackbar'
import handleError from '../../Global/HandleError/handleError'
import { BatchContext } from '../../Context/BatchContext'
import BootstrapTooltip from '../Tooltips/BootstrapTooltip'

const StudentAdmissionList = ({ items, mode }) => {
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const {
    RejectStudentRequest,
    AcceptStudentRequest,
    ChangeLocalStudentRequestStatus,
  } = useContext(BatchContext)

  const handleAcceptStudent = (id, name) => {
    AcceptStudentRequest(id)
      .then(() => {
        ChangeLocalStudentRequestStatus(id, 'A')
        showSuccessSnackbar(enqueueSnackbar, `${name} accepted to batch`)
      })
      .catch((err) => {
        handleError(enqueueSnackbar, err)
      })
  }

  const handleRejectStudent = (id, name) => {
    RejectStudentRequest(id)
      .then(() => {
        ChangeLocalStudentRequestStatus(id, 'R')
        showSuccessSnackbar(enqueueSnackbar, `${name} rejected from batch`)
      })
      .catch((err) => {
        handleError(enqueueSnackbar, err)
      })
  }
  return (
    <>
      {mode === 'card' ? (
        <Grid container alignItems="center" spacing={3}>
          {(items.length === 0 || !items) && (
            <Grid item xs={12}>
              <p className="fine-text bold secondary-text">
                No pending request found
              </p>
            </Grid>
          )}
          {items.map((item) => (
            <Grid item xs={6} key={item.id}>
              <Card key={item.id} className={classes.card}>
                <ListItem>
                  <ListItemAvatar>
                    <Avatar
                      src={
                        item.profileImageUrl ||
                        'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png'
                      }
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.student_name}
                    secondary={item.student_email}
                  />
                  <BootstrapTooltip title="Reject Student" placement="top">
                    <IconButton
                      onClick={() => {
                        handleRejectStudent(item.id, item.student_name)
                      }}
                      style={{ marginLeft: '1rem', color: '#c84444' }}
                    >
                      <CancelIcon />
                    </IconButton>
                  </BootstrapTooltip>
                  <BootstrapTooltip title="Accept Student" placement="top">
                    <IconButton
                      onClick={() => {
                        handleAcceptStudent(item.id, item.student_name)
                      }}
                      color="success"
                      className={classes.acceptIcon}
                    >
                      <CheckCircleIcon />
                    </IconButton>
                  </BootstrapTooltip>
                </ListItem>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <List>
          {(items.length === 0 || !items) && (
            <p className="fine-text bold secondary-text text-align-center">
              No pending request found
            </p>
          )}
          {items.map((item) => (
            <React.Fragment key={item.id}>
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src={
                      item.profileImageUrl ||
                      'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png'
                    }
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={item.student_name}
                  secondary={item.student_email}
                />
                <BootstrapTooltip title="Reject Student" placement="top">
                  <IconButton
                    onClick={() => {
                      handleRejectStudent(item.id, item.student_name)
                    }}
                    className={classes.rejectIcon}
                  >
                    <CancelIcon />
                  </IconButton>
                </BootstrapTooltip>
                <BootstrapTooltip title="Accept Student" placement="top">
                  <IconButton
                    onClick={() => {
                      handleAcceptStudent(item.id, item.student_name)
                    }}
                    color="success"
                    className={classes.acceptIcon}
                  >
                    <CheckCircleIcon />
                  </IconButton>
                </BootstrapTooltip>
              </ListItem>
              <Divider />
            </React.Fragment>
          ))}
        </List>
      )}
    </>
  )
}

export default StudentAdmissionList

const useStyles = makeStyles({
  card: {
    padding: '0 10px',
    borderRadius: 8,
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
  acceptIcon: {
    color: '#12b012',
  },
  rejectIcon: {
    margin: '0 0 0 1rem',
    color: '#c84444',
  },
})
