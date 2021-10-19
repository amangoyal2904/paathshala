import {
  AppBar,
  Breadcrumbs,
  Grid,
  InputAdornment,
  Link,
  makeStyles,
  Tab,
  Tabs,
  Typography,
} from '@material-ui/core'
import { useSnackbar } from 'notistack'
import React, { useContext, useEffect, useState } from 'react'
import { IoIosArrowForward, IoIosSearch, IoMdClose } from 'react-icons/io'
import { useHistory } from 'react-router-dom'
import StudentAdmissionList from '../../../../Components/Lists/StudentAdmissionList'
import StudentList from '../../../../Components/Lists/StudentList'
import Spinner from '../../../../Components/Progress/Spinner'
import showErrorSnackbar from '../../../../Components/Snackbar/errorSnackbar'
import { BatchContext } from '../../../../Context/BatchContext'
import Controls from '../../../../Components/Controls/Controls'
import RefreshCard from '../../../../Components/Refresh/RefreshCard'

const StudentManagement = ({ id }) => {
  const classes = useStyles()
  const {
    loading,
    GetStudentRequestsForBatch,
    studentRequestByBatchId,
    FindBatchWithCode,
    batchByCode,
    setLoading,
  } = useContext(BatchContext)
  const history = useHistory()
  const { enqueueSnackbar } = useSnackbar()
  const [selectedTab, setSelectedTab] = useState(0)

  const handleChange = (event, newValue) => {
    setSearchQuery('')
    setSelectedTab(newValue)
  }

  const [searchQuery, setSearchQuery] = useState('')
  const [searchedData, setSearchedData] = useState([])

  const search = (searchToken) => {
    setSearchedData(
      studentRequestByBatchId.filter((val) =>
        val.student_name.toLowerCase().includes(searchToken.toLowerCase()),
      ),
    )
  }

  const clearSearchBar = () => {
    setSearchQuery('')
    setSelectedTab(0)
  }

  useEffect(() => {
    if (searchQuery === '') {
      setSelectedTab(0)
      return
    }
    setSelectedTab(null)
    search(searchQuery)
  }, [searchQuery])

  // Pulled Out This function from useEffect to use it in RefreshCard Component at the Bottom
  async function fetchData() {
    setLoading(true)
    const res = await FindBatchWithCode(id)
    if (res) {
      await GetStudentRequestsForBatch(id)
    } else {
      showErrorSnackbar(enqueueSnackbar, 'This batch does not exist!')
      history.push('/dashboard')
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchData()
  }, [id])
  return (
    <>
      {loading && <Spinner />}
      {!loading && (
        <div className="full-height">
          <Grid container justify="space-between" style={{ padding: '2rem' }}>
            <Grid item xs={12}>
              <div className="height-100 flex-row align-items-center">
                <p className="bolder route-heading">Manage Students</p>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Breadcrumbs
                separator={<IoIosArrowForward />}
                aria-label="breadcrumb"
              >
                <Link color="inherit" href="/dashboard">
                  Dashboard
                </Link>
                <Link color="inherit" href={`/dashboard/view/${id}`}>
                  {batchByCode.name}
                </Link>
                <Typography color="textPrimary">Manage Students</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <div>
            <div className={classes.appBarContainer}>
              <AppBar position="static" className={classes.appBar}>
                <Tabs
                  value={selectedTab}
                  onChange={handleChange}
                  className={classes.tabContainer}
                >
                  <Tab
                    label="Active Students"
                    className={classes.capitalizeText}
                  />
                  <Tab
                    label="Pending Requests"
                    className={classes.capitalizeText}
                  />
                  <Tab
                    label="Rejected Requests"
                    className={classes.capitalizeText}
                  />
                </Tabs>
                <Controls.Input
                  placeholder="Search for student by name"
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                  }}
                  className={classes.searchBar}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <IoIosSearch />
                      </InputAdornment>
                    ),
                    endAdornment:
                      searchQuery !== '' ? (
                        <InputAdornment
                          position="end"
                          onClick={clearSearchBar}
                          className="cursor-pointer"
                        >
                          <IoMdClose />
                        </InputAdornment>
                      ) : null,
                  }}
                />
              </AppBar>
            </div>
            <div className={classes.content}>
              {searchQuery === '' && (
                <>
                  <div>
                    {selectedTab === 0 && (
                      <p className={classes.info}>
                        {
                          studentRequestByBatchId.filter(
                            (request) => request.status === 'A',
                          ).length
                        }{' '}
                        active{' '}
                        {studentRequestByBatchId.filter(
                          (request) => request.status === 'A',
                        ).length === 1
                          ? 'Student'
                          : 'students'}
                      </p>
                    )}
                    {selectedTab === 1 && (
                      <p className={classes.info}>
                        {
                          studentRequestByBatchId.filter(
                            (request) => request.status === 'D',
                          ).length
                        }{' '}
                        pending{' '}
                        {studentRequestByBatchId.filter(
                          (request) => request.status === 'D',
                        ).length === 1
                          ? 'request'
                          : 'requests'}
                      </p>
                    )}
                    {selectedTab === 2 && (
                      <p className={classes.info}>
                        {
                          studentRequestByBatchId.filter(
                            (request) => request.status === 'R',
                          ).length
                        }{' '}
                        rejected{' '}
                        {studentRequestByBatchId.filter(
                          (request) => request.status === 'R',
                        ).length === 1
                          ? 'request'
                          : 'requests'}
                      </p>
                    )}
                  </div>
                  <div className={classes.tabContent}>
                    {selectedTab === 0 && (
                      <StudentList
                        items={studentRequestByBatchId.filter(
                          (request) => request.status === 'A',
                        )}
                      />
                    )}
                    {selectedTab === 1 && (
                      <StudentAdmissionList
                        items={studentRequestByBatchId.filter(
                          (request) => request.status === 'D',
                        )}
                        mode="card"
                      />
                    )}
                    {selectedTab === 2 && (
                      <StudentList
                        items={studentRequestByBatchId.filter(
                          (request) => request.status === 'R',
                        )}
                      />
                    )}
                  </div>
                </>
              )}
              {searchQuery !== '' && (
                <div className={classes.tabContent}>
                  <p className={classes.info}>Active or rejected students</p>
                  <StudentList
                    items={searchedData.filter((data) => data.status !== 'D')}
                  />
                  <p className={classes.info}>Requests pending</p>
                  <StudentAdmissionList
                    items={searchedData.filter((data) => data.status === 'D')}
                    mode="card"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <RefreshCard
        msg="Please click on refresh to check if new students have requested to join the batch"
        onRefresh={fetchData}
      />
    </>
  )
}

export default StudentManagement

const useStyles = makeStyles({
  appBar: {
    backgroundColor: '#fff',
    color: '#999',
    flexDirection: 'row',
    boxShadow: 'none',
    '& .Mui-selected': {
      color: '#000',
    },
    '& .MuiTabs-indicator': {
      backgroundColor: '#6484e4',
      marginBottom: 5,
      width: '30%',
    },
  },
  appBarContainer: {
    padding: '0 2rem',
    backgroundColor: '#fff',
  },
  capitalizeText: {
    textTransform: 'capitalize',
  },
  content: {
    padding: '2rem',
  },
  info: {
    color: '#999',
    fontSize: '0.875rem',
    padding: '10px 0px',
  },
  tabContainer: {
    width: 'fit-content',
  },
  tabContent: {
    paddingTop: 6,
  },
  searchBar: {
    marginLeft: 'auto',
    '& .MuiInputBase-root': {
      borderRadius: 15.5,
      height: 34,
      margin: 'auto 0',
      '& .MuiInputBase-input': {
        fontSize: '0.9rem',
      },
    },
  },
})
