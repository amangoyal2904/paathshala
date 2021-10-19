/* eslint-disable no-console */
/* eslint-disable array-callback-return */
/* eslint-disable no-useless-concat */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TablePagination from '@material-ui/core/TablePagination'
import TableRow from '@material-ui/core/TableRow'
import TextField from '@material-ui/core/TextField'
import { IconButton } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'

import { useSnackbar } from 'notistack'
import axios from 'axios'
import { render } from '@testing-library/react'
import InputAdornment from '@material-ui/core/InputAdornment'
import SearchIcon from '@material-ui/icons/Search'
import Divider from '@material-ui/core/Divider'
import { BatchContext } from '../../../../Context/BatchContext'
import Button from '../../../../Components/Controls/Button'
import showErrorSnackbar from '../../../../Components/Snackbar/errorSnackbar'

const columns = [
  { id: 'name', label: 'Name', minWidth: 170, fontWeight: '600' },
  { id: 'email', label: 'Email ID', minWidth: 100 },
  {
    id: 'lecture' + '1',
    label: 'Lecture 1',
    minWidth: 170,
    align: 'center',
    timeOfClass: '24 Mar,2020',
  },
  {
    id: 'lecture' + '2',
    label: 'Lecture 2',
    minWidth: 170,
    align: 'center',
    timeOfClass: '26 Mar,2020',
  },
  {
    id: 'lecture' + '3',
    label: 'Lecture 3',
    minWidth: 170,
    align: 'center',
    timeOfClass: '28 Mar,2020',
  },
]

function createColumns(i) {
  const processedColumnTemp = {
    id: `lecture${i}`,
    label: `Lecture ${i}`,
    minWidth: 170,
    align: 'center',
    timeOfClass: '24 Mar,2020',
  }
  columns.push(processedColumnTemp)
  console.log(columns)
}

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 500,
  },
})

export default function AttendanceTable() {
  const classes = useStyles()
  const [page, setPage] = React.useState(0)
  const [rowsPerPage, setRowsPerPage] = React.useState(50)
  const [columnsPage, setColumnsPage] = useState(2)
  const { enqueueSnackbar } = useSnackbar()
  // const {GetAttendance,attendanceData} = useContext(BatchContext)
  const [tableSet, setTableSet] = useState()
  const [attendanceData, setAttendanceData] = useState([{}])
  const [valueLoaded, setValueLoaded] = useState(false)
  const [valueLoadedColumn, setValueLoadedColumn] = useState(true)
  const [lectureLength, setLectureLength] = useState(0)
  const [textForSearch, setTextForSearch] = useState({
    searchquery: '',
  })
  const [rows, setRows] = useState([])

  const [displayedColumns, setDisplayedColumns] = useState([])
  const [displayedDates, setDisplayedDates] = useState([])
  const [chevronDisplay, setChevronDisplay] = useState(1)

  useEffect(() => {
    reloadPage()
    GetAttendance()
    if (attendanceData.length === 0) {
      console.log(`attendance length ${attendanceData.length}`)
      console.log(`${valueLoaded}value loaded`)
      console.log(attendanceData)
    } else {
      console.log('reached exit')
      console.log(attendanceData)

      setValueLoaded(!valueLoaded)
      reloadPage()
      searchNames()
    }
  }, [])

  useEffect(() => {
    setDisplayedColumns([
      columns[0],
      columns[1],
      columns[columnsPage],
      columns[columnsPage + 1],
      columns[columnsPage + 2],
    ])
    setDisplayedDates([
      columns[columnsPage],
      columns[columnsPage + 1],
      columns[columnsPage + 2],
    ])
  }, [columnsPage])

  function createData(id, name, email, lecList) {
    const lengTime = lecList.length
    const processedData = {
      id,
      name,
      email,
      displayStat: true,
    }
    for (let i = 1; i <= lengTime; i += 1) {
      const numberLec = `lecture${i}`
      processedData[numberLec] = lecList[i - 1]
    }
    setRows((r) => [...r, processedData])
  }

  function nextColumnSet() {
    if (columnsPage + 3 < columns.length - 2) {
      setColumnsPage(columnsPage + 3)
      setChevronDisplay(chevronDisplay + 1)
    } else {
      showErrorSnackbar(enqueueSnackbar, 'Reached the end of the list')
    }
  }
  function previousColumnSet() {
    if (columnsPage - 3 >= 2) {
      console.log(columnsPage)

      setColumnsPage(columnsPage - 3)
      setChevronDisplay(chevronDisplay - 1)
    } else {
      showErrorSnackbar(enqueueSnackbar, 'Reached the end of the list')
    }
  }

  function reloadPage() {
    if (columnsPage + 3 < columns.length - 2) {
      setColumnsPage(columnsPage + 3)
    }
    if (columnsPage - 3 >= 2) {
      console.log(columnsPage)

      setColumnsPage(columnsPage - 3)
    }
  }

  const GetAttendance = async () => {
    await axios
      .get(`http://localhost:8000/users`)
      .then((res) => {
        const persons = res.data.users
        // console.log(persons[0])
        let i
        for (i = 0; i < persons.length; i += 1) {
          attendanceData.push(persons[i])
        }
        console.log(persons[0].numberOfLectures)
        const { numberOfLectures } = persons[0]
        for (i = 4; i <= numberOfLectures; i += 1) {
          createColumns(i)
        }
        if ((columns.length - 2) % 3 === 1) {
          columns.push(
            {
              id: 'none1',
              label: ' ',
              minWidth: 170,
              align: 'right',
            },
            {
              id: 'none2',
              label: ' ',
              minWidth: 170,
              align: 'right',
            },
          )
        }
        if ((columns.length - 2) % 3 === 2) {
          columns.push({
            id: 'none3',
            label: ' ',
            minWidth: 170,
            align: 'right',
          })
        }
        setLectureLength(persons[0].numberOfLectures)
        rowSetter()
      })
      .catch((err) => console.log(err))
  }

  const rowSetter = () => {
    let i
    for (i = 1; i <= attendanceData.length; i += 1) {
      createData(
        i,
        attendanceData[i].name,
        attendanceData[i].email,
        attendanceData[i].lecture,
      )
    }
  }

  useEffect(() => {
    console.log(textForSearch)
    let i
    for (i = 0; i < rows.length; i += 1) {
      const temp = rows[i].name
      if (temp.search(textForSearch.searchquery) === -1) {
        rows[i].displayStat = false
      } else {
        rows[i].displayStat = true
      }
      console.log('loop time')
      //  reloadPage()
    }
  }, [textForSearch.searchquery, valueLoaded])

  const searchNames = () => {
    console.log(textForSearch)
    let i
    for (i = 0; i < rows.length; i += 1) {
      const temp = rows[i].name
      if (temp.search('') === -1) {
        rows[i].displayStat = false
      } else {
        rows[i].displayStat = true
      }
      console.log('loop time')
      reloadPage()
    }
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value)
    setPage(0)
  }

  const [valueChevron, setValueChevron] = useState()

  const colorPreference = (id) => {
    if (id % 2 === 0) {
      return {
        backgroundColor: '#f2f5ff',
      }
    }

    return { backgroundColor: '#fffff' }
  }

  useEffect(() => {
    setLectureLength(columns.length - 2)
    setValueChevron(Math.ceil(lectureLength / 3))
  }, [lectureLength])

  return (
    <div>
      <div style={{ marginLeft: '85%' }}>
        <IconButton onClick={previousColumnSet}>
          <ChevronLeft />
        </IconButton>
        <span>
          {chevronDisplay}-{valueChevron}
        </span>
        <IconButton onClick={nextColumnSet}>
          <ChevronRight />
        </IconButton>
      </div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow style={{ borderRadius: '25%', position: 'sticky' }}>
                {displayedColumns.map((column) => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{
                      minWidth: column.minWidth,
                      backgroundColor: '#4f4f4f',
                      color: '#ffffff',
                      fontFamily: 'Poppins',
                      fontWeight: 'bold',
                      fontSize: 'large',
                    }}
                  >
                    {column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableHead stickyHeader>
              <TableRow style={{ borderRadius: '25%', position: 'sticky' }}>
                <TableCell
                  style={{ backgroundColor: '#e1e1e1', position: 'sticky' }}
                >
                  <TextField
                    id="searchName"
                    variant="outlined"
                    placeholder="Search Name"
                    // value={textForSearch.searchquery}
                    onChange={(event) => {
                      setTextForSearch({
                        searchquery: event.target.value,
                      })
                    }}
                    style={{
                      fontFamily: 'Poppins',
                      backgroundColor: '#fff',
                      height: '3%',
                    }}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <SearchIcon />
                        </InputAdornment>
                      ),
                    }}
                  />
                </TableCell>
                <TableCell style={{ backgroundColor: '#e1e1e1' }}></TableCell>
                {displayedDates.map((dates) => (
                  <TableCell
                    key={dates.id}
                    align={dates.align}
                    style={{
                      minWidth: dates.minWidth,
                      backgroundColor: '#e1e1e1',
                      color: '#4f4f4f',
                    }}
                  >
                    {dates.timeOfClass}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .filter((row) => {
                  if (textForSearch.searchquery === '') {
                    return row
                  }
                  if (
                    row.name.toLowerCase().includes(textForSearch.searchquery)
                  ) {
                    return row
                  }
                })
                .map((row) => (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {displayedColumns.map((column) => {
                      // if(row.displayStat====true)
                      //  {
                      const value = row[column.id]
                      return (
                        <TableCell
                          key={column.id}
                          align={column.align}
                          style={colorPreference(row.id)}
                        >
                          {column.format && typeof value === 'number'
                            ? column.format(value)
                            : value}
                        </TableCell>
                      )
                      // }
                    })}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[50, 25, 10]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      </Paper>
    </div>
  )
}
