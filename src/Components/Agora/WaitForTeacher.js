import { Avatar, makeStyles } from '@material-ui/core'
import React from 'react'

const useStyles = makeStyles({
  waitForTeacher: {
    width: '100%',
    height: '100%',
    backgroundColor: '#424242',
    overflow: 'hidden',
  },
  wrapper: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  img: {
    width: '20%',
    height: 'auto',
  },
  text: {
    fontWeight: 600,
    fontSize: '1.25rem',
    color: '#fff',
    marginTop: '1rem',
  },
})

const WaitForTeacher = () => {
  const classes = useStyles()
  return (
    <div className={classes.waitForTeacher}>
      <div className={classes.wrapper}>
        <Avatar
          src="https://www.pngfind.com/pngs/m/610-6104451_image-placeholder-png-user-profile-placeholder-image-png.png"
          className={classes.img}
        />
        <p className={classes.text}>Waiting for Teacher to Join..</p>
      </div>
    </div>
  )
}

export default WaitForTeacher
