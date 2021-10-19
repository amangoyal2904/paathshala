import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import screenShare from '../../Assets/Images/screenshare.svg'
import Controls from '../Controls/Controls'

const useStyles = makeStyles({
  imageGrid: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#424242',
  },
  title: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 600,
    textAlign: 'center',
  },
  img: {
    height: '100%',
    width: 'auto',
  },
  marginTop: {
    marginTop: '1rem',
  },
  btn: {
    width: 'unset',
  },
})

const ScreenShareDisplay = ({ stopScreenShare }) => {
  const classes = useStyles()

  return (
    <div className={classes.imageGrid}>
      <div className="text-align-center">
        <img src={screenShare} className={classes.img} alt="Screen shared" />
      </div>
      <div className={classes.marginTop}>
        <Typography className={classes.title}>
          You&apos;re presenting to everyone
        </Typography>
      </div>
      <div className={`text-align-center ${classes.marginTop}`}>
        <Controls.Button
          text="Stop Presenting"
          onClick={() => {
            stopScreenShare()
          }}
          className={classes.btn}
        />
      </div>
    </div>
  )
}

export default ScreenShareDisplay
