import {
  Avatar,
  Card,
  Grid,
  IconButton,
  ListItem,
  ListItemAvatar,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useContext } from 'react'
import { FiUserX, FiUserCheck } from 'react-icons/fi'
import { BatchContext } from '../../Context/BatchContext'
import handleError from '../../Global/HandleError/handleError'
import showSuccessSnackbar from '../Snackbar/successSnackbar'
import BootstrapTooltip from '../Tooltips/BootstrapTooltip'

const StudentList = ({ items }) => {
  const classes = useStyles()
  const { AcceptStudentRequest, RejectStudentRequest } =
    useContext(BatchContext)
  const { enqueueSnackbar } = useSnackbar()
  const { ChangeLocalStudentRequestStatus } = useContext(BatchContext)

  const handleChangeStatus = (id, status, name) => {
    if (status === 'A') {
      RejectStudentRequest(id)
        .then(() => {
          ChangeLocalStudentRequestStatus(id, 'R')
          showSuccessSnackbar(
            enqueueSnackbar,
            `${name} has been removed from batch`,
          )
        })
        .catch((err) => {
          handleError(enqueueSnackbar, err)
        })
    }
    if (status === 'R') {
      AcceptStudentRequest(id)
        .then(() => {
          ChangeLocalStudentRequestStatus(id, 'A')
          showSuccessSnackbar(
            enqueueSnackbar,
            `${name} has been accepted to batch`,
          )
        })
        .catch((err) => {
          handleError(enqueueSnackbar, err)
        })
    }
  }

  return (
    <>
      <Grid container alignItems="center" spacing={3}>
        {(items.length === 0 || !items) && (
          <Grid item xs={12}>
            <p className="fine-text bold secondary-text">
              No students available
            </p>
          </Grid>
        )}
        {items.map((item) => (
          <Grid item xs={6} key={item.id}>
            <Card className={classes.card}>
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
                <BootstrapTooltip
                  title={
                    item.status === 'A' ? 'Reject Student' : 'Accept Student'
                  }
                  placement="bottom"
                >
                  <IconButton
                    onClick={() => {
                      handleChangeStatus(
                        item.id,
                        item.status,
                        item.student_name,
                      )
                    }}
                  >
                    {item.status === 'A' ? <FiUserX /> : <FiUserCheck />}
                  </IconButton>
                </BootstrapTooltip>
              </ListItem>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  )
}

export default StudentList

const useStyles = makeStyles({
  card: {
    padding: '0 10px',
    borderRadius: 8,
    backgroundColor: '#fff',
    boxShadow: 'none',
  },
})
