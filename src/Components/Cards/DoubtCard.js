import { Grid, IconButton, makeStyles } from '@material-ui/core'
import React from 'react'
import { AiOutlineQuestionCircle } from 'react-icons/ai'
import { IoCloseSharp } from 'react-icons/io5'
import Controls from '../Controls/Controls'

const DoubtCard = ({ raiseDoubt, setDoubtAnchorEl, studentDoubt }) => {
  const classes = useStyles()
  const handleClose = () => {
    setDoubtAnchorEl(null)
  }
  return (
    <Grid container alignItems="center" className={classes.root}>
      <IconButton onClick={handleClose} size="small" className={classes.close}>
        <IoCloseSharp />
      </IconButton>
      {studentDoubt && (
        <Grid item xs={12}>
          <Grid container alignItems="center">
            <Grid item>
              <IconButton className={classes.iconBtn}>
                <AiOutlineQuestionCircle />
              </IconButton>
            </Grid>
            <Grid item>
              <p>Doubt Already Asked</p>
            </Grid>
          </Grid>
        </Grid>
      )}
      {!studentDoubt && (
        <Grid container alignItems="center" spacing={2}>
          <Grid item xs={12}>
            <p className={classes.question}>Ask a Doubt?</p>
          </Grid>
          <Grid item xs={6}>
            <Controls.Button
              text="Yes"
              color="primary"
              size="medium"
              onClick={raiseDoubt}
            />
          </Grid>
          <Grid item xs={6}>
            <Controls.Button
              text="No"
              size="medium"
              onClick={handleClose}
              className={classes.btn}
            />
          </Grid>
        </Grid>
      )}
    </Grid>
  )
}

export default DoubtCard

const useStyles = makeStyles({
  root: {
    padding: 20,
    borderRadius: 8,
  },
  question: {
    fontWeight: 600,
    fontSize: '1.125rem',
    color: '#6480e4',
  },
  close: {
    position: 'absolute',
    right: 5,
    top: 5,
  },
  btn: {
    backgroundImage: 'none',
    backgroundColor: '#585858',
  },
  iconBtn: {
    padding: 6,
  },
})
