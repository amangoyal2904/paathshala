import { makeStyles } from '@material-ui/core/styles'
import React, { useContext, useState } from 'react'
import { AppBar, Toolbar, Typography, Menu, MenuItem } from '@material-ui/core'
import HelpOutlinedIcon from '@material-ui/icons/HelpOutlined'
import { Link, useHistory, useLocation, withRouter } from 'react-router-dom'
import AccountCircleIcon from '@material-ui/icons/AccountCircle'
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown'
import { MdLockOutline } from 'react-icons/md'
import { IoLogOutOutline } from 'react-icons/io5'
import Logo from '../../Assets/Images/edvi-logo-blue.png'
import Controls from '../Controls/Controls'
import { AuthContext } from '../../Context/AuthContext'
import ConfirmDialog from '../Dialogs/ConfirmDialog'
import ChangePasswordDialog from '../Dialogs/ChangePasswordDialog'
import HelpSupportDialog from '../Dialogs/HelpSupportDialog/HelpSupportDialog'

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
  navbar: {
    backgroundColor: '#fff',
    boxShadow: '0 2px 4px 0 rgba(0, 0, 0, 0.2)',
  },
  help_support: {
    display: 'flex',
    alignItems: 'center',
    height: '35px',
    border: '1px solid rgba(0, 0, 0, 0.3)',
    cursor: 'pointer',
  },
  help_support_text: {
    fontSize: '14px',
    color: 'black',
    padding: '0 10px 0 3px',
  },
  img: {
    width: '90px',
    height: 'auto',
    margin: '5px 0 0 0',
  },
  btn: {
    width: 'auto',
    color: '#000',
  },
  changePasswordIcon: {
    margin: '0 10px 0 0',
  },
  logoutIcon: {
    margin: '0 10px 0 2px',
  },
}))

const NavbarComponent = () => {
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [openDialogPassword, setOpenDialogPassword] = useState(false)
  const [openDialogLogout, setOpenDialogLogout] = useState(false)
  const [openHelpDialog, setOpenHelpDialog] = useState(false)
  const location = useLocation()
  const history = useHistory()
  const { isLoggedIn, LogOut, authState } = useContext(AuthContext)

  const classes = useStyles()
  if (location.pathname.match(/class/)) {
    return null
  }

  const handleClickOpenDialogPassword = () => {
    setOpenDialogPassword(true)
  }

  const openUserMenu = (e) => {
    setIsUserMenuOpen(e.currentTarget)
  }

  const closeUserMenu = () => {
    setIsUserMenuOpen(null)
  }

  const logoutAction = async () => {
    await LogOut()
    history.push('/', {})
  }

  const handleClickHelpDialog = () => {
    setOpenHelpDialog(true)
  }

  return (
    <>
      <ConfirmDialog
        open={openDialogLogout}
        setOpen={setOpenDialogLogout}
        title="Logout"
        content="Are you sure you want to Logout?"
        yesAction={logoutAction}
        noAction={() => {}}
      />
      <ChangePasswordDialog
        open={openDialogPassword}
        setOpen={setOpenDialogPassword}
        aria-labelledby="form-dialog-title"
      />
      <HelpSupportDialog open={openHelpDialog} setOpen={setOpenHelpDialog} />
      {isLoggedIn ? (
        <div className={classes.root}>
          <AppBar className={classes.navbar} position="static">
            <Toolbar>
              <Typography className={classes.title}>
                <Link to="/">
                  <img src={Logo} alt="edvi" className={classes.img} />
                </Link>
              </Typography>
              {isLoggedIn && (
                <Controls.Button
                  className={`${classes.help_support} ${classes.btn}`}
                  color="inherit"
                  variant="text"
                  onClick={handleClickHelpDialog}
                  startIcon={<HelpOutlinedIcon htmlColor="#638ee4" />}
                >
                  <p className={classes.help_support_text}>Help & Support</p>
                </Controls.Button>
              )}
              {/* {isLoggedIn && ( */}
              {/*  <IconButton color="inherit"> */}
              {/*    <Badge badgeContent={0} color="secondary"> */}
              {/*      <NotificationsNoneIcon */}
              {/*        htmlColor="#000" */}
              {/*        fontSize="default" */}
              {/*      /> */}
              {/*    </Badge> */}
              {/*  </IconButton> */}
              {/* )} */}
              {isLoggedIn && (
                <Controls.Button
                  color="inherit"
                  variant="text"
                  className={classes.btn}
                  onClick={openUserMenu}
                  startIcon={<AccountCircleIcon htmlColor="#ffa92b" />}
                  endIcon={<ArrowDropDownIcon />}
                >
                  {authState.name}
                </Controls.Button>
              )}
            </Toolbar>
          </AppBar>
          <Menu
            id="profile-menu"
            anchorEl={isUserMenuOpen}
            keepMounted
            open={Boolean(isUserMenuOpen)}
            onClose={closeUserMenu}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            transformOrigin={{ vertical: 'top', horizontal: 'center' }}
            getContentAnchorEl={null}
          >
            <MenuItem
              onClick={() => {
                closeUserMenu()
                handleClickOpenDialogPassword()
              }}
            >
              <MdLockOutline className={classes.changePasswordIcon} />
              Change Password
            </MenuItem>
            <MenuItem
              onClick={async () => {
                setOpenDialogLogout(true)
                closeUserMenu()
              }}
            >
              <IoLogOutOutline className={classes.logoutIcon} />
              Logout
            </MenuItem>
          </Menu>
        </div>
      ) : null}
    </>
  )
}
const Navbar = withRouter(NavbarComponent)
export default Navbar
