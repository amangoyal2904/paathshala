import React from 'react'
import { GrFormAdd } from 'react-icons/gr'
import { BiImageAlt } from 'react-icons/bi'
import { createStyles, makeStyles } from '@material-ui/core/styles'

const FileCard = ({ name, size, add }) => {
  const classes = useStyles()
  const fileSize = (sizeInp) => {
    let result
    if (sizeInp > 1000 && sizeInp < 1000000) {
      result = `${sizeInp / 1000}KB`
    }
    return result
  }

  return (
    <div className={add ? classes.add : classes.card}>
      {add ? <GrFormAdd size={40} /> : <BiImageAlt size={40} />}
      {!add && <p className="sub-text bold">{name}</p>}
      {!add && <p className="sub-text">{fileSize(size)}</p>}
    </div>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    card: {
      height: 160,
      border: '1px solid grey',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px 0',
    },
    add: {
      height: 160,
      border: '1px solid grey',
      borderRadius: '5px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '10px 0',
      '&:hover': {
        cursor: 'pointer',
      },
    },
  }),
)

export default FileCard
