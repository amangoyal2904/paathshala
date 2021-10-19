import React, { useContext } from 'react'
import {
  Divider,
  Drawer,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  makeStyles,
} from '@material-ui/core'
import { IoIosArrowBack } from 'react-icons/io'
import { useHistory, Link } from 'react-router-dom'
import { CopyToClipboard } from 'react-copy-to-clipboard/lib/Component'
import { MdContentCopy } from 'react-icons/md'
import { useSnackbar } from 'notistack'
import showSuccessSnackbar from '../../Snackbar/successSnackbar'
import SideNavOptions from './sideNavOptions'
import { AuthContext } from '../../../Context/AuthContext'
import { BatchContext } from '../../../Context/BatchContext'

const SideNav = ({ batchId, route }) => {
  const history = useHistory()
  const classes = useStyles()
  const { enqueueSnackbar } = useSnackbar()
  const { authState } = useContext(AuthContext)
  const { getAllReqAndBatches, GetTeacherBatches } = useContext(BatchContext)

  const showNotification = () => {
    showSuccessSnackbar(enqueueSnackbar, 'Copied to clipboard')
  }
  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
      anchor="left"
    >
      <div className={classes.toolbar}>
        <Grid
          container
          alignItems="center"
          className={classes.gridContainer}
          onClick={() => {
            history.push('/dashboard')
            if (authState.role === 'T') {
              GetTeacherBatches()
            }
            if (authState.role === 'S') {
              getAllReqAndBatches()
            }
          }}
        >
          <Grid item xs={3}>
            <IconButton color="inherit">
              <IoIosArrowBack />
            </IconButton>
          </Grid>
          <Grid item xs={9}>
            <p>Back to Dashboard</p>
          </Grid>
        </Grid>
      </div>
      <Divider className={classes.divider} />
      <List>
        {SideNavOptions.map((option) => (
          <>
            {option.role === 'A' ? (
              <Link
                to={`/dashboard/${option.route}/${batchId}`}
                className={classes.link}
                key={option.route}
              >
                <ListItem
                  button
                  key={option.route}
                  className={
                    route === option.route ? classes.activeListItem : null
                  }
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.title}
                    className={classes.listItemText}
                  />
                </ListItem>
              </Link>
            ) : option.role === 'T' && authState.role === 'T' ? (
              <Link
                to={`/dashboard/${option.route}/${batchId}`}
                className={classes.link}
                key={option.route}
              >
                <ListItem
                  button
                  key={option.route}
                  className={
                    route === option.route ? classes.activeListItem : null
                  }
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.title}
                    className={classes.listItemText}
                  />
                </ListItem>
              </Link>
            ) : option.role === 'S' && authState.role === 'S' ? (
              <Link
                to={`/dashboard/${option.route}/${batchId}`}
                className={classes.link}
                key={option.route}
              >
                <ListItem
                  button
                  key={option.route}
                  className={
                    route === option.route ? classes.activeListItem : null
                  }
                >
                  <ListItemIcon className={classes.listItemIcon}>
                    {option.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={option.title}
                    className={classes.listItemText}
                  />
                </ListItem>
              </Link>
            ) : null}
          </>
        ))}
      </List>
      <Grid container alignItems="center" className={classes.batchCode}>
        <Grid item xs={12}>
          <p className={classes.batchCodeLabel}>Batch Code</p>
        </Grid>
        <Grid item xs={12}>
          <span className={classes.batchCodeText}>{batchId}</span>
          <CopyToClipboard text={batchId}>
            <IconButton
              onClick={showNotification}
              color="inherit"
              className={classes.copyIcon}
            >
              <MdContentCopy />
            </IconButton>
          </CopyToClipboard>
        </Grid>
      </Grid>
    </Drawer>
  )
}

export default SideNav

const drawerWidth = 240

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  gridContainer: {
    height: '100%',
    cursor: 'pointer',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0,
    },
  },
  drawerPaper: {
    width: drawerWidth,
    backgroundImage: 'linear-gradient(127deg, #638ee4 29%, #6480e4 68%)',
    color: '#fff',
  },
  link: {
    textDecoration: 'none',
  },
  activeListItem: {
    borderTopLeftRadius: 100,
    borderBottomLeftRadius: 100,
    backgroundColor: '#ffffff33',
  },
  listItemIcon: {
    color: '#fff',
  },
  listItemText: {
    '& .MuiTypography-body1': {
      fontFamily: 'Poppins',
      color: '#fff',
    },
  },
  toolbar: theme.mixins.toolbar,
  content: {
    marginLeft: drawerWidth,
  },
  divider: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  copyIcon: {
    fontSize: '1rem',
  },
  batchCode: {
    padding: '14px',
    position: 'fixed',
    bottom: 0,
    width: drawerWidth,
    backgroundColor: '#ffffff33',
  },
  batchCodeLabel: {
    fontSize: '0.75rem',
    fontWeight: 'normal',
  },
  batchCodeText: {
    fontSize: '0.875rem',
    fontWeight: 500,
  },
}))
