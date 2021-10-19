import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Link } from '@material-ui/core'
import AttendanceTable from './AttendanceTable'

import { BatchContext } from '../../../../Context/BatchContext'
const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
  title: {
    // padding:"2rem",
    fontWeight: 600,
    color: '#6481e4',
    fontSize: '1.5rem',
  },
  titleSection: {
    padding: '2rem',
  },
})

export default function AttendanceList(props) {
  const classes = useStyles()
  const { batchByCode } = useContext(BatchContext)
  return (
    <div>
      <div className={classes.titleSection}>
        <div className={classes.title}>Attendance</div>
        <div>
          <Link color="inherit" href="/dashboard">
            Dashboard
          </Link>
          {'   >   '}
          <Link color="inherit" href={`/dashboard/view/${props.id}`}>
            {batchByCode.name}
          </Link>
          {'   >   e-Books'}
        </div>
        {/* <div style={{paddingLeft:"2%",paddingTop:"2%"}}>
          <h3 style={{paddingBottom:"5",fontWeight:"bold",color:"#a5a7ad",fontSize:"large"}}>Dashboard <ChevronRight/> Learn English <ChevronRight/> Attendance</h3>
      </div> */}
        <div style={{ width: '100%' }}>
          <AttendanceTable />
        </div>
      </div>
    </div>
  )
}
