import { makeStyles, createStyles } from '@material-ui/core/styles'
import { IoDocumentTextOutline } from 'react-icons/io5'
import React, { useContext } from 'react'
import { AuthContext } from '../../../../Context/AuthContext'
import Arrow from '../../../../Assets/Images/curved-arrow.svg'

const CreateBatchMessage = () => {
  const classes = useStyles()
  const { authState } = useContext(AuthContext)
  return (
    <>
      <div className={classes.container}>
        <div>
          <img src={Arrow} alt="Arrow" className={classes.arrow_icon} />
        </div>
        <div>
          <IoDocumentTextOutline size={100} className={classes.document_icon} />
        </div>
        <div>
          <p className="sub-text bold" id="greeting-text">
            {authState.role === 'T'
              ? "Let's Create your first batch"
              : "Let's Join your first batch"}
          </p>
        </div>
        <div>
          <p className="bold" id="helper-text">
            {authState.role === 'T'
              ? 'Create your batch and invite students to start your live classes'
              : 'Join your batch and start learning'}
          </p>
        </div>
      </div>
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    verify_email: {
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      width: '100%',
      backgroundColor: '#3f3f3f',
      color: '#fff',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 6,
    },
    container: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      position: 'relative',
    },
    document_icon: {
      marginTop: '5rem',
      color: 'rgba(0,0,0,0.1)',
    },
    arrow_icon: {
      position: 'absolute',
      right: '5rem',
      top: '2rem',
    },
  }),
)

export default CreateBatchMessage
