import {
  AppBar,
  Drawer,
  Grid,
  IconButton,
  makeStyles,
  Popover,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@material-ui/core'
import Badge from '@material-ui/core/Badge'
import PlaylistAddCheckIcon from '@material-ui/icons/PlaylistAddCheck'
import PeopleAltOutlinedIcon from '@material-ui/icons/PeopleAltOutlined'
import HelpOutlineOutlinedIcon from '@material-ui/icons/HelpOutlineOutlined'
import TextsmsOutlinedIcon from '@material-ui/icons/TextsmsOutlined'
import { useParams } from 'react-router-dom'
import React, { useState, useContext, useEffect, useRef } from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { GrFormClose } from 'react-icons/gr'
import QuickPoll from '../QuickPoll/QuickPoll'
import Chat from '../Agora/Chat'
import ClassStudentList from '../Lists/ClassStudentList'
import { AgoraContext } from '../../Context/AgoraContext'
import Logo from '../../Assets/Images/edvi-logo-blue.png'
import { BatchContext } from '../../Context/BatchContext'
import Doubts from '../Lists/Doubts'
import DoubtCard from '../Cards/DoubtCard'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    backgroundColor: '#fff',
  },
  title: {
    textAlign: 'center',
    color: '#000',
  },
  iconBorderLeft: {
    borderLeft: '1px solid #d8d8d8',
  },
  iconBorderRight: {
    borderRight: '1px solid #d8d8d8',
  },
  navIcons: {
    left: '50%',
    transform: 'translateX(-50%)',
    padding: 4,
    color: '#333',
  },
  navIconsActive: {
    left: '50%',
    transform: 'translateX(-50%)',
    padding: 4,
    color: '#6384e4',
  },
  img: {
    width: '90px',
    height: 'auto',
    margin: '5px 0 0 0',
  },
  drawerPaperTall: {
    padding: '64px 0 0 0',
    overflowY: 'auto',
    width: 350,
    overflowX: 'hidden',
    height: 'calc(100% - 64px)',
  },
  drawerPaperShort: {
    padding: '64px 0 0 0',
    overflowY: 'auto',
    width: 350,
    overflowX: 'hidden',
    height: 'calc(100% - 56px)',
  },
  menuRoot: {
    display: 'flex',
  },
  iconLabel: {
    margin: 'unset 0 0 0',
    color: '#333',
    textAlign: 'center',
    fontSize: '0.875rem',
  },
  iconLabelActive: {
    margin: 'unset 0 0 0',
    color: '#6384e4',
    textAlign: 'center',
    fontSize: '0.875rem',
    position: 'relative',
    '&::after': {
      content: '""',
      width: '100%',
      height: 4,
      backgroundColor: '#6480e4',
      position: 'absolute',
      bottom: '-4px',
      left: 0,
      borderBottomLeftRadius: 2,
      borderBottomRightRadius: 2,
    },
  },
  badge: {
    '& .MuiBadge-badge': {
      top: 6,
      right: 6,
      boxShadow: '0px 0px 0px 3px rgba(255,255,255,1)',
      '-webkit-box-shadow': '0px 0px 0px 3px rgba(255,255,255,1)',
      '-moz-box-shadow': '0px 0px 0px 3px rgba(255,255,255,1)',
    },
  },
  tabActive: {
    backgroundColor: '#f2f2ff',
  },
}))

const ClassNavbar = ({
  channelMessages,
  sendMessage,
  remoteUsers,
  role,
  sendCommandToChannel,
  sendCommandToSpecificUser,
  batchId,
  isLoading,
}) => {
  const { id } = useParams()
  const { batchByCode } = useContext(BatchContext)
  const classes = useStyles()
  const matches = useMediaQuery('(min-width:600px)')
  const interval = useRef()
  const [doubtId, setDoubtId] = useState('')

  const {
    isNewMessage,
    setIsNewMessage,
    setIsQuickPollOpen,
    isQuickPollOpen,
    poll,
    setPoll,
    studentDoubt,
    teacherDoubts,
    RaiseQuery,
  } = useContext(AgoraContext)

  // if doubt not addresses within 5 min, resend doubt to ensure delivery to Teacher
  useEffect(() => {
    if (!studentDoubt) {
      if (interval.current) clearInterval(interval.current)
      return
    }
    interval.current = setInterval(() => {
      sendCommandToSpecificUser(batchByCode.owner, 'DOUBT', 'ASK', doubtId)
    }, 300000)
  }, [studentDoubt])

  const [drawerRight, setDrawerRight] = useState({
    open: false,
    anchor: 'right',
    type: '',
  })

  const openRightDrawer = (type) => {
    if (type === 'Chats') {
      setIsNewMessage(false)
    }
    setDrawerRight({
      anchor: 'right',
      open: true,
      type,
    })
  }

  const closeDrawer = () => {
    setDrawerRight((state) => ({
      ...state,
      open: false,
      type: '',
    }))
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const handlePopoverClick = (event) => {
    if (role === 'T') {
      setAnchorEl(event.currentTarget)
    }
    setPoll('teacherfirstpoll')
    setIsQuickPollOpen(true)
  }
  const handlePopoverClose = () => {
    setIsQuickPollOpen(false)
    setAnchorEl(null)
  }

  const [doubtAnchorEl, setDoubtAnchorEl] = useState(null)
  const handleDoubtPopoverClick = (event) => {
    setDoubtAnchorEl(event.currentTarget)
  }

  // raise doubt
  const raiseDoubt = async () => {
    setDoubtAnchorEl(null)
    const res = await RaiseQuery(id)
    setDoubtId(res?.data?.id)
    sendCommandToSpecificUser(batchByCode.owner, 'DOUBT', 'ASK', res?.data?.id)
  }

  return (
    <div className={classes.root}>
      <AppBar position="fixed" className={classes.appBar}>
        <Toolbar>
          {!isLoading && (
            <Grid container alignItems="center">
              <Grid item sm={4}>
                <Grid container justify="flex-start">
                  {role === 'T' && (
                    <Grid item sm={3} className={classes.iconBorderRight}>
                      <Grid
                        container
                        alignItems="center"
                        className={anchorEl ? classes.tabActive : null}
                      >
                        <Grid item sm={12}>
                          <IconButton
                            className={
                              anchorEl
                                ? classes.navIconsActive
                                : classes.navIcons
                            }
                            onClick={handlePopoverClick}
                          >
                            <PlaylistAddCheckIcon fontSize="default" />
                          </IconButton>
                        </Grid>
                        <Grid item sm={12}>
                          <div>
                            <p
                              className={
                                anchorEl
                                  ? classes.iconLabelActive
                                  : classes.iconLabel
                              }
                            >
                              Quick Poll
                            </p>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                  )}

                  <Popover
                    open={isQuickPollOpen}
                    anchorEl={anchorEl}
                    anchorOrigin={{
                      vertical: 'bottom',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <QuickPoll
                      closePoll={handlePopoverClose}
                      lecture_id={id}
                      poll={poll}
                      setPoll={setPoll}
                      sendCommandToChannel={sendCommandToChannel}
                      remoteUsers={remoteUsers}
                    />
                  </Popover>

                  {/* <Grid item sm={3} className={classes.iconBorderRight}> */}
                  {/*  <Grid container alignItems="center"> */}
                  {/*    <Grid item sm={12}> */}
                  {/*      <IconButton className={classes.navIcons}> */}
                  {/*        <ImportContacts /> */}
                  {/*      </IconButton> */}
                  {/*    </Grid> */}
                  {/*    <Grid item sm={12}> */}
                  {/*      <div> */}
                  {/*        <p className={classes.iconLabel}>Library</p> */}
                  {/*      </div> */}
                  {/*    </Grid> */}
                  {/*  </Grid> */}
                  {/* </Grid> */}
                </Grid>
              </Grid>
              <Grid item sm={4}>
                <Grid container>
                  <Grid item sm={12}>
                    <Typography variant="h5" className={classes.title}>
                      <img src={Logo} className={classes.img} alt="edvi" />
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item sm={4}>
                <Grid container justify="flex-end" alignItems="center">
                  <>
                    <Grid item sm={3} className={classes.iconBorderLeft}>
                      <Grid
                        container
                        alignItems="center"
                        className={
                          drawerRight.type === 'Students'
                            ? classes.tabActive
                            : null
                        }
                      >
                        <Grid item sm={12}>
                          <IconButton
                            className={
                              drawerRight.type === 'Students'
                                ? classes.navIconsActive
                                : classes.navIcons
                            }
                            onClick={() => {
                              openRightDrawer('Students')
                            }}
                          >
                            <PeopleAltOutlinedIcon fontSize="default" />
                          </IconButton>
                        </Grid>
                        <Grid item sm={12}>
                          <div>
                            <p
                              className={
                                drawerRight.type === 'Students'
                                  ? classes.iconLabelActive
                                  : classes.iconLabel
                              }
                            >
                              {role === 'T'
                                ? `${remoteUsers.length} Students`
                                : `Students`}
                            </p>
                          </div>
                        </Grid>
                      </Grid>
                    </Grid>
                    {/* )} */}
                  </>
                  <>
                    {role === 'T' && (
                      <Grid item sm={3} className={classes.iconBorderLeft}>
                        <Grid
                          container
                          alignItems="center"
                          className={
                            drawerRight.type === 'Queries'
                              ? `${classes.tabActive} text-align-center`
                              : 'text-align-center'
                          }
                        >
                          <Grid item sm={12}>
                            <Badge
                              color="error"
                              variant="dot"
                              className={classes.badge}
                              invisible={
                                teacherDoubts.filter(
                                  (doubt) => doubt.state !== 2,
                                ).length === 0 || drawerRight.open
                              }
                            >
                              <IconButton
                                className={
                                  drawerRight.type === 'Queries'
                                    ? classes.navIconsActive
                                    : classes.navIcons
                                }
                                onClick={() => {
                                  openRightDrawer('Queries')
                                }}
                              >
                                <HelpOutlineOutlinedIcon fontSize="default" />
                              </IconButton>
                            </Badge>
                          </Grid>
                          <Grid item sm={12}>
                            <div>
                              <p
                                className={
                                  drawerRight.type === 'Queries'
                                    ? classes.iconLabelActive
                                    : classes.iconLabel
                                }
                              >
                                Doubts
                              </p>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </>
                  <>
                    {role === 'S' && (
                      <Grid item sm={3}>
                        <Grid
                          container
                          alignItems="center"
                          className={classes.iconBorderLeft}
                        >
                          <Grid item sm={12}>
                            <IconButton
                              className={classes.navIcons}
                              onClick={handleDoubtPopoverClick}
                              style={
                                studentDoubt
                                  ? {
                                      backgroundColor: '#ffb031',
                                      padding: 0,
                                      marginTop: 4,
                                      marginBottom: 4,
                                      color: '#fff',
                                    }
                                  : {}
                              }
                              disabled={
                                studentDoubt ||
                                remoteUsers.find(
                                  (user) => user.uid === batchByCode.owner,
                                ) === undefined
                              }
                            >
                              <AiOutlineQuestionCircle fontSize="default" />
                            </IconButton>
                          </Grid>
                          <Grid item sm={12}>
                            <div>
                              <p className={classes.iconLabel}>
                                {studentDoubt ? 'Doubt Asked' : 'Ask a Doubt'}
                              </p>
                            </div>
                          </Grid>
                        </Grid>
                      </Grid>
                    )}
                  </>
                  <Popover
                    open={Boolean(doubtAnchorEl)}
                    anchorEl={doubtAnchorEl}
                    anchorOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                    transformOrigin={{
                      vertical: 'top',
                      horizontal: 'center',
                    }}
                  >
                    <DoubtCard
                      raiseDoubt={raiseDoubt}
                      setDoubtAnchorEl={setDoubtAnchorEl}
                      studentDoubt={studentDoubt}
                    />
                  </Popover>
                  <Grid item sm={3} className={classes.iconBorderLeft}>
                    <Grid
                      container
                      alignItems="center"
                      className={
                        drawerRight.type === 'Chats'
                          ? `${classes.tabActive} text-align-center`
                          : 'text-align-center'
                      }
                    >
                      <Grid item sm={12}>
                        <Badge
                          color="error"
                          variant="dot"
                          className={classes.badge}
                          invisible={!isNewMessage || drawerRight.open}
                        >
                          <IconButton
                            className={
                              drawerRight.type === 'Chats'
                                ? classes.navIconsActive
                                : classes.navIcons
                            }
                            onClick={() => {
                              openRightDrawer('Chats')
                            }}
                          >
                            <TextsmsOutlinedIcon fontSize="default" />
                          </IconButton>
                        </Badge>
                      </Grid>
                      <Grid item sm={12}>
                        <div>
                          <p
                            className={
                              drawerRight.type === 'Chats'
                                ? classes.iconLabelActive
                                : classes.iconLabel
                            }
                          >
                            Chats
                          </p>
                        </div>
                      </Grid>
                    </Grid>
                  </Grid>
                  {drawerRight.open && (
                    <Grid
                      item
                      style={{
                        textAlign: 'center',
                        position: 'absolute',
                        right: 6,
                      }}
                    >
                      <IconButton
                        style={{ padding: 6, backgroundColor: '#fff' }}
                        onClick={() => {
                          closeDrawer()
                        }}
                      >
                        <GrFormClose />
                      </IconButton>
                    </Grid>
                  )}
                </Grid>
              </Grid>
            </Grid>
          )}
          {isLoading && (
            <Grid container justify="center" alignItems="center">
              <Grid item sm={12}>
                <Typography variant="h5" className={classes.title}>
                  <img src={Logo} alt="edvi" className={classes.img} />
                </Typography>
              </Grid>
            </Grid>
          )}
        </Toolbar>
      </AppBar>

      <Drawer
        variant="persistent"
        open={drawerRight.open}
        classes={{
          paper: matches ? classes.drawerPaperTall : classes.drawerPaperShort,
        }}
        anchor={drawerRight.anchor}
      >
        {drawerRight.type === 'Chats' && (
          <Chat
            channelMessages={channelMessages}
            sendMessage={sendMessage}
            id={id}
            batchId={batchId}
          />
        )}
        {drawerRight.type === 'Students' && (
          <ClassStudentList
            remoteUsers={remoteUsers}
            id={batchId}
            sendCommandToChannel={sendCommandToChannel}
            sendCommandToSpecificUser={sendCommandToSpecificUser}
          />
        )}
        {drawerRight.type === 'Queries' && (
          <Doubts
            sendCommandToSpecificUser={sendCommandToSpecificUser}
            id={batchId}
            lectureId={id}
            remoteUsers={remoteUsers}
          />
        )}
      </Drawer>
    </div>
  )
}

export default ClassNavbar
