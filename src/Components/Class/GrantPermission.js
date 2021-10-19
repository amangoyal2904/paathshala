import { makeStyles } from '@material-ui/core'
import React from 'react'
import Permissions from '../../Assets/Images/permissions.svg'
import UpArrow from '../../Assets/Images/up-arrow.svg'
import { mobileCheck } from '../../Global/Functions'

const useStyles = makeStyles(() => ({
  permissionsContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e9ecf5',
    padding: 40,
    position: 'relative',
  },
  innerWrapper: {
    width: '100%',
    height: '100%',
    backgroundColor: '#fff',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    height: '55%',
    width: 'max-content',
    margin: '0 auto',
    '& img': {
      width: 'auto',
      height: '100%',
    },
  },
  textWrapper: {
    width: '100%',
    marginTop: '1.4rem',
    '& #main-text': {
      width: '40%',
      margin: '0 auto',
      textAlign: 'center',
      color: '#000',
    },
    '& #info-text': {
      width: '50%',
      margin: '0 auto',
      textAlign: 'center',
    },
  },
  allowIconContainer: {
    width: 'max-content',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'absolute',
    top: '4.5rem',
    left: '15%',
  },
}))

const GrantPermission = () => {
  const classes = useStyles()
  return (
    <div className={classes.permissionsContainer}>
      <div className={classes.innerWrapper}>
        <div className={classes.imageContainer}>
          <img src={Permissions} alt="Provide Device Permission" />
        </div>
        <div className={classes.textWrapper}>
          <p className="sub-text bolder" id="main-text">
            Allow Camera & Microphone Permission to join a Live Class
          </p>
          <p className="bold" id="info-text">
            You can&apos;t join Live Classes without giving access to your
            camera & microphone!
          </p>
        </div>
      </div>
      {!mobileCheck() && (
        <div className={classes.allowIconContainer}>
          <img src={UpArrow} alt="Arrow Up" />
          <p className="bold">Click on Allow</p>
        </div>
      )}
    </div>
  )
}

export default GrantPermission
