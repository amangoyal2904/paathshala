import React from 'react'
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Divider,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Checkbox,
} from '@material-ui/core'
import { IoCloseSharp } from 'react-icons/io5'
import { IoIosSearch } from 'react-icons/io'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import Controls from '../Controls/Controls'
import Dialog from './Dialog'

const ShareDialog = ({ open, closeDialog, allBatchStudents }) => {
  const classes = useStyles()

  return (
    <Dialog open={open} fullWidth={false}>
      <DialogTitle>
        <div className={classes.header}>
          <p className="sub-text bold text-align-center">Share Notes</p>
          <IconButton className={classes.close} onClick={closeDialog}>
            <IoCloseSharp />
          </IconButton>
        </div>
      </DialogTitle>
      <DialogContent>
        <div>
          <Controls.Input
            className={classes.input}
            placeholder="Search Student By name..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IoIosSearch />
                </InputAdornment>
              ),
            }}
          />
        </div>
        <div>
          <Controls.Button className={classes.btn}>
            Share With Complete Batch
          </Controls.Button>
        </div>
        <div>
          <List>
            {allBatchStudents.map((item) => (
              <ListItem>
                <ListItemAvatar>
                  <Avatar
                    src={
                      item.profileImageUrl ||
                      'https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png'
                    }
                  />
                </ListItemAvatar>
                <ListItemText primary={item.name} secondary={item.email} />
                <Checkbox color="primary" />
              </ListItem>
            ))}
          </List>
        </div>
      </DialogContent>
      <Divider />
      <DialogActions className={classes.actions}>
        <Controls.Button className={classes.btn}>Send</Controls.Button>
      </DialogActions>
    </Dialog>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    close: {
      position: 'absolute',
      right: 10,
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      padding: '0 0 0 20px',
      justifyContent: 'center',
      alignItems: 'center',
    },
    content: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
    },
    input: {
      width: '100%',
      padding: '10px 0',
    },
    infoText: {
      fontWeight: 'bold',
    },
    btn: {
      margin: '5px 0',
    },
    actions: {
      margin: '1rem',
    },
  }),
)

export default ShareDialog
