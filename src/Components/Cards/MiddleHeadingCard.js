import { CardHeader, makeStyles } from '@material-ui/core'
import React from 'react'
import Card from './Card'

const useStyles = makeStyles(() => ({
  root: {
    maxWidth: '768px',
    margin: '0 auto',
    position: 'relative',
    top: '50%',
    transform: 'translateY(-50%)',
    maxHeight: 'calc(100% - 2rem)',
    overflowY: 'auto',
  },
  title: {
    '& .MuiCardHeader-title': {
      textAlign: 'center',
      fontWeight: '600',
    },
  },
}))
const MiddleHeadingCard = (props) => {
  const classes = useStyles()
  const { title, children } = props
  return (
    <Card className={classes.root}>
      <CardHeader title={title} className={classes.title} />
      {children}
    </Card>
  )
}

export default MiddleHeadingCard
