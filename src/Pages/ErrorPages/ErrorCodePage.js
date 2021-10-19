import { useHistory } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Grid from '@material-ui/core/Grid'
import { Typography } from '@material-ui/core'
import err500 from '../../Assets/Images/err500.svg'
import err404 from '../../Assets/Images/err404.png'
import Controls from '../../Components/Controls/Controls'

const errorImageContent = [
  {
    code: 404,
    image: err404,
    titleText: '404 - Page Not Found',
    subText: "The Page you are looking for doesn't exist",
    buttonText: 'Go back to Edvi',
  },
  {
    code: 500,
    image: err500,
    titleText: 'Internal Server Error',
    subText:
      "We're experencing internal server problem. Please try again later",
    buttonText: 'Go Back',
  },
]

const useStyles = makeStyles({
  imageGrid: {
    width: 400,
    margin: '6rem auto 0',
  },
  title: {
    color: '#666666',
    margin: '1rem 0 0 0',
    fontSize: '2rem',
    fontWeight: 600,
    textAlign: 'center',
  },
  content: {
    margin: '1rem 0 0 0',
    color: '#666666',
    textAlign: 'center',
  },
  btn: {
    width: '100%',
    margin: '1rem 0 0 0',
  },
})

const ErrorCodePage = ({ errCodeReceived }) => {
  const classes = useStyles()
  const history = useHistory()
  const [titleText, setTitleText] = useState(' ')
  const [images, setImages] = useState(' ')
  const [subText, setSubText] = useState(' ')
  const [buttonText, setButtonText] = useState(' ')

  useEffect(() => {
    const val = errorImageContent.find(
      (content) => content.code === errCodeReceived,
    )
    if (val) {
      setImages(val.image)
      setSubText(val.subText)
      setTitleText(val.titleText)
      setButtonText(val.buttonText)
    }
  }, [errCodeReceived])

  const handleButtonFunctionality = () => {
    if (errCodeReceived === 500) {
      history.goBack()
    } else {
      history.push('/')
    }
  }

  return (
    <Grid container justify="center" className={classes.imageGrid}>
      <Grid item xs={12}>
        <img src={images} height="auto" width="100%" alt={titleText} />
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.title}>{titleText}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Typography className={classes.content}>{subText}</Typography>
      </Grid>
      <Grid item xs={12}>
        <Controls.Button
          className={classes.btn}
          text={buttonText}
          onClick={() => {
            handleButtonFunctionality()
          }}
        />
      </Grid>
    </Grid>
  )
}

export default ErrorCodePage
