import React, { useContext, useState } from 'react'
import { Divider } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { IoPersonCircle, IoCheckmarkCircleSharp } from 'react-icons/io5'
import { HiOutlineMail, HiOutlinePhone } from 'react-icons/hi'
import { MdError } from 'react-icons/md'

import { useHistory } from 'react-router-dom'
import Controls from '../Controls/Controls'
import { AuthContext } from '../../Context/AuthContext'
import Card from './Card'
import { CheckForDaytime } from '../../Global/Functions'
import VerifyEmailDialog from '../Dialogs/VerifyEmailDialog'

const DashboardProfileCard = () => {
  const classes = useStyles()
  const history = useHistory()

  const [openVerifyEmailDialog, setOpenVerifyEmailDialog] = useState(false)

  const handleOpenVerifyEmailDialog = () => {
    setOpenVerifyEmailDialog(true)
  }

  const handleCloseVerifyEmailDialog = () => {
    setOpenVerifyEmailDialog(false)
  }

  const { authState } = useContext(AuthContext)
  const {
    email,
    is_email_verified,
    is_phone_verified,
    name,
    phone_number,
    role,
  } = authState

  return (
    <div className={classes.container}>
      <p className={classes.greeting_text}>Hi, Good {CheckForDaytime()}!</p>
      <Card>
        <div className={classes.card}>
          <div className={classes.div}>
            <IoPersonCircle color="#ffa92b" size={80} />
            <div>
              <p className={classes.name}>{name}</p>
              <p className={classes.role}>
                {role === 'S' ? 'Student' : 'Teacher'}
              </p>
            </div>
          </div>
          <div className={classes.div}>
            <Divider
              orientation="vertical"
              variant="fullWidth"
              style={{ marginRight: 20 }}
            />
            <div className={classes.icon}>
              <HiOutlineMail color="#6992e4" />
            </div>
            <div style={{ marginLeft: 10 }}>
              <p className={classes.heading}>Email ID</p>
              <p className={classes.info_text}>
                {email}{' '}
                {is_email_verified ? (
                  <IoCheckmarkCircleSharp
                    color="#00bea7"
                    style={{ marginLeft: 5 }}
                  />
                ) : (
                  <MdError color="#ff471b" style={{ marginLeft: 5 }} />
                )}
              </p>
            </div>
          </div>

          <div className={classes.div}>
            <Divider
              orientation="vertical"
              variant="fullWidth"
              style={{ marginRight: 20 }}
            />
            <div className={classes.icon}>
              <HiOutlinePhone color="#6992e4" />
            </div>
            <div style={{ marginLeft: 10 }}>
              <p className={classes.heading}>Mobile No.</p>
              {phone_number === null ? (
                <p
                  className={classes.add_mobile}
                  onClick={() => history.push('/dashboard/editprofile')}
                  onKeyDown={() => history.push('/dashboard/editprofile')}
                >
                  + Add Mobile No.
                </p>
              ) : (
                <p className={classes.info_text}>
                  {phone_number}{' '}
                  {is_phone_verified ? (
                    <IoCheckmarkCircleSharp
                      color="#00bea7"
                      style={{ marginLeft: 5 }}
                    />
                  ) : (
                    <MdError color="#ff471b" style={{ marginLeft: 5 }} />
                  )}
                </p>
              )}
            </div>
          </div>
          <div className={classes.div}>
            <Controls.Button
              className={classes.btn}
              variant="outlined"
              onClick={() => history.push('/dashboard/editprofile')}
            >
              Edit Profile
            </Controls.Button>
          </div>
        </div>
        {authState.is_email_verified ? null : (
          <div className={classes.verify_email}>
            <span className="bold">
              Please verify your email ID to proceed. The email could have
              landed in your spam/junk folder.
            </span>
            <Controls.Button
              text="Resend Link"
              size="small"
              style={{ width: 'unset', marginLeft: '1rem' }}
              onClick={handleOpenVerifyEmailDialog}
            />
          </div>
        )}
        {openVerifyEmailDialog && (
          <VerifyEmailDialog
            open={openVerifyEmailDialog}
            close={handleCloseVerifyEmailDialog}
            email={authState.email}
            sendOTP
          />
        )}
      </Card>
    </div>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      width: '100%',
      margin: '0 auto',
      padding: '2rem 2rem 0 2rem',
    },
    card: {
      marginTop: 10,
      padding: '20px 15px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    div: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    name: {
      fontSize: 18,
      fontWeight: 'bold',
    },
    role: {
      fontSize: 14,
      opacity: 0.8,
      color: '#538fe1',
      fontWeight: 500,
    },
    icon: {
      backgroundColor: '#eff3fd',
      borderRadius: '50%',
      height: 25,
      width: 25,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    greeting_text: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    info_text: {
      fontSize: '0.9rem',
      fontWeight: 'bold',
      display: 'flex',
      alignItems: 'center',
    },
    heading: {
      fontSize: '0.8rem',
    },
    add_mobile: {
      color: '#4f86e7',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      textDecorationLine: 'underline',
      cursor: 'pointer',
    },
    btn: {
      borderColor: '#4f86e7',
    },
    verify_email: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '5px 0',
      backgroundColor: '#ffe5e5',
      fontSize: '0.9rem',
    },
  }),
)

export default DashboardProfileCard
