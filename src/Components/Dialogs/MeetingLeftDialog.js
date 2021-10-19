import React, { useState, useContext } from 'react'
import { DialogTitle, Divider, Grid, IconButton } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { IoIosClose } from 'react-icons/io'
import Controls from '../Controls/Controls'
import AwesomeColor from '../../Assets/Emojis/smiling_color.svg'
import AwesomeGray from '../../Assets/Emojis/smiling_gray.svg'
import FineColor from '../../Assets/Emojis/smile_color.svg'
import FineGray from '../../Assets/Emojis/smile_gray.svg'
import BadColor from '../../Assets/Emojis/sad_color.svg'
import BadGray from '../../Assets/Emojis/sad_gray.svg'
import axiosPost from '../../Global/Axios/axiosPost'
import { AuthContext } from '../../Context/AuthContext'
import Dialog from './Dialog'

const MeetingLeftDialog = ({ open, close, lectureId }) => {
  const classes = useStyles()
  const [emoji, selectEmoji] = useState('')

  const [reasons, setReasons] = useState([
    { id: 0, selected: false, label: `I couldn't hear others` },
    { id: 1, selected: false, label: `Audio was breaking` },
    { id: 2, selected: false, label: `Video was breaking` },
    { id: 3, selected: false, label: `Video was blurry` },
    { id: 4, selected: false, label: `Camera didn't work` },
    { id: 5, selected: false, label: `Others` },
  ])

  const [otherProblem, setOtherProblem] = useState('')
  const { authState, getAuthHeader } = useContext(AuthContext)

  const handleDialogClose = async () => {
    if (emoji === '') {
      close()
      setTimeout(() => selectEmoji(''), 500)
      if (authState.role === 'T') {
        window.location.reload()
      }
      return
    }
    const feedback = []
    reasons
      .filter((reason) => reason.selected === true)
      .forEach((data) => {
        if (data.id !== 5) {
          feedback.push(data.label)
        } else {
          feedback.push(otherProblem)
        }
      })
    try {
      await axiosPost('/feedback/', {
        data: {
          lecture: lectureId,
          experience_rating: emoji.charAt(0).toUpperCase(),
          problem: feedback,
        },
        headers: getAuthHeader(),
      })
    } finally {
      close()
      setTimeout(() => selectEmoji(''), 500)
      if (authState.role === 'T') {
        window.location.reload()
      }
    }
  }

  const handleSelectProblem = (id) => {
    const val = reasons.find((reason) => reason.id === id)
    const rest = reasons.filter((reason) => reason.id !== id)
    const newArr = [...rest, { ...val, selected: !val.selected }]
    setReasons(newArr.sort((a, b) => a.id - b.id))
  }

  return (
    <>
      <Dialog open={open}>
        <DialogTitle>
          <div className={classes.header}>
            <p className="sub-text bold text-align-center">
              You Left The Meeting
            </p>
          </div>
          <IconButton className={classes.closeBtn} onClick={handleDialogClose}>
            <IoIosClose />
          </IconButton>
        </DialogTitle>
        <Divider />
        <div className={classes.content}>
          <div className={classes.feedback}>
            <div>
              <p>Tell us about your live class experience.</p>
            </div>
            <div className={classes.emoji_container}>
              <div className={classes.emoji}>
                <img
                  draggable="false"
                  src={emoji === 'bad' ? BadColor : BadGray}
                  className={classes.img}
                  onClick={() => selectEmoji('bad')}
                  onKeyDown={() => selectEmoji('bad')}
                  alt="bad"
                />
                <p>Bad</p>
              </div>
              <div className={classes.emoji}>
                <img
                  draggable="false"
                  src={emoji === 'fine' ? FineColor : FineGray}
                  className={classes.img}
                  onClick={() => selectEmoji('fine')}
                  onKeyDown={() => selectEmoji('fine')}
                  alt="fine"
                />
                <p>Fine</p>
              </div>
              <div className={classes.emoji}>
                <img
                  draggable="false"
                  src={emoji === 'awesome' ? AwesomeColor : AwesomeGray}
                  className={classes.img}
                  onClick={() => selectEmoji('awesome')}
                  onKeyDown={() => selectEmoji('awesome')}
                  alt="awesome"
                />
                <p>Awesome!</p>
              </div>
            </div>
          </div>
          {(emoji === 'bad' || emoji === 'fine') && (
            <>
              <p className={`bold text-align-center ${classes.paragraph}`}>
                What Went Wrong?
              </p>
              <div className={classes.reason_div}>
                <Grid container alignItems="center" spacing={2}>
                  {reasons.map((reason) => (
                    <Grid item xs={4} key={reason.id}>
                      <Controls.Button
                        text={reason.label}
                        variant={reason.selected ? 'contained' : 'outlined'}
                        color="secondary"
                        disableRipple
                        className={
                          reason.selected
                            ? classes.btnSelected
                            : classes.btnNotSelected
                        }
                        onClick={() => {
                          handleSelectProblem(reason.id)
                        }}
                      />
                    </Grid>
                  ))}
                  {reasons.find((reason) => reason.id === 5).selected && (
                    <Grid item xs={12}>
                      <Controls.Input
                        placeholder="If others, please explain"
                        className="width-100"
                        value={otherProblem}
                        onChange={(e) => {
                          setOtherProblem(e.target.value)
                        }}
                      />
                    </Grid>
                  )}
                </Grid>
              </div>
            </>
          )}
          <Divider />
          <div className={classes.btn_container_1}>
            <Controls.Button
              text="Return to Dashboard"
              className={classes.btnRight}
              variant="outlined"
              onClick={handleDialogClose}
            />
            <Controls.Button
              text="Submit"
              className={classes.btnLeft}
              onClick={handleDialogClose}
              disabled={emoji === ''}
            />
          </div>
        </div>
      </Dialog>
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    header: {
      display: 'flex',
      flexDirection: 'row',
      paddingLeft: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    btn_container_1: {
      display: 'flex',
      paddingLeft: 50,
      paddingRight: 50,
      paddingTop: 20,
      paddingBottom: 20,
    },
    feedback: {
      backgroundColor: '#f3f3fe',
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px 0px',
    },
    content: {},
    emoji_container: {
      display: 'flex',
      padding: '20px 0px',
    },
    emoji: {
      paddingLeft: 20,
      paddingRight: 20,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
    img: {
      height: 100,
      width: 100,
      marginBottom: 10,
      '&:hover': {
        cursor: 'pointer',
      },
    },
    reason_div: {
      display: 'flex',
      padding: 20,
      justifyContent: 'space-evenly',
    },
    reasons: {
      display: 'flex',
      flexDirection: 'column',
    },
    reason: {
      fontSize: 15,
      border: '1px solid #A0A0A0',
      marginBottom: 10,
      padding: 10,
      textAlign: 'center',
      borderRadius: 6,
      color: '#707070',
    },
    closeBtn: {
      position: 'absolute',
      right: 12,
      top: 12,
    },
    btnLeft: {
      marginLeft: 10,
    },
    btnRight: {
      marginRight: 10,
    },
    btnSelected: {
      padding: 5,
      color: '#fff',
    },
    btnNotSelected: {
      padding: 5,
      color: '#333',
      border: 'solid 1px #999',
    },
    paragraph: {
      paddingTop: 20,
    },
  }),
)

export default MeetingLeftDialog
