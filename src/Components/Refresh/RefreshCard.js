import React, { useContext } from 'react'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { RiRefreshLine } from 'react-icons/ri'
import Controls from '../Controls/Controls'
import { AuthContext } from '../../Context/AuthContext'

const RefreshCard = ({ onRefresh, msg }) => {
  const classes = useStyles()
  const { authState } = useContext(AuthContext)

  const handleRefresh = () => {
    onRefresh()
  }

  return (
    <>
      {authState.is_email_verified && (
        <div className={classes.container}>
          <div className={classes.flexBox}>
            <div>
              <RiRefreshLine size={30} color="#fff" />
            </div>
            <div className={classes.text}>
              <p>{msg}</p>
            </div>
            <div className={classes.btn}>
              <Controls.Button text="Refresh Now" onClick={handleRefresh} />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    container: {
      position: 'fixed',
      width: '35%',
      backgroundColor: '#606060',
      borderTopLeftRadius: 10,
      borderTopRightRadius: 10,
      bottom: 0,
      right: 10,
    },
    flexBox: {
      display: 'flex',
      alignItems: 'center',
      padding: 10,
    },
    text: {
      fontSize: '0.8rem',
      fontWeight: 'bold',
      paddingInline: 10,
      color: '#fff',
    },
    btn: {
      width: '60%',
    },
  }),
)

export default RefreshCard
