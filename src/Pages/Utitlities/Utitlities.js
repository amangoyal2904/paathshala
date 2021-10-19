/* eslint-disable no-empty-function */
import React, { useEffect, useContext, useState, Fragment } from 'react'
import {
  AppBar,
  Tabs,
  Tab,
  Grid,
  Breadcrumbs,
  Typography,
  Link,
  InputAdornment,
} from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { FiPlus } from 'react-icons/fi'
import { IoIosArrowForward, IoIosSearch, IoMdClose } from 'react-icons/io'
import { BatchContext } from '../../Context/BatchContext'
import { AuthContext } from '../../Context/AuthContext'
import Controls from '../../Components/Controls/Controls'
import UploadDialog from '../../Components/Dialogs/UploadDialog'
import Notes from './Notes'
import Spinner from '../../Components/Progress/Spinner'

const NotesContainer = ({ notes, allBatchStudents, role, id }) => {
  const classes = useStyles()

  return (
    <>
      {notes.length !== 0 ? (
        <Grid container spacing={2} className={classes.card_container}>
          {notes.map((item) => (
            <Grid item xs={6} sm={6} md={4}>
              <Notes
                allBatchStudents={allBatchStudents}
                role={role}
                file={item.file}
                name={item.name}
                note_id={item.id}
                batch_id={id}
                date={item.created_at}
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <p className="fine-text secondary-text margin-top-small">
          No notes available
        </p>
      )}
    </>
  )
}

const Utilities = ({ title, id }) => {
  const classes = useStyles()
  const {
    FindBatchWithCode,
    GetCurrentBatchStudents,
    allBatchStudents,
    GetNotes,
    notes,
    uploadPercent,
    setUploadPercent,
    loading,
    batchByCode,
    setLoading,
  } = useContext(BatchContext)

  const { authState } = useContext(AuthContext)
  const { role } = authState

  const [open, setOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchedData, setSearchedData] = useState([])

  const search = (searchToken) => {
    setSearchedData(
      notes.filter((val) =>
        val.name.toLowerCase().includes(searchToken.toLowerCase()),
      ),
    )
  }

  const handleOpen = () => {
    setOpen(true)
  }
  const handleClose = () => {
    setOpen(false)
  }

  const clearSearchBar = () => {
    setSearchQuery('')
    setSelectedTab(0)
  }

  async function fetchNotes() {
    setLoading(true)
    await GetNotes(id)
    setLoading(false)
  }

  useEffect(() => {
    fetchNotes()
  }, [notes.length])

  useEffect(() => {
    if (searchQuery === '') {
      setSelectedTab(0)
      return
    }
    setSelectedTab(null)
    search(searchQuery)
  }, [searchQuery])

  useEffect(() => {
    FindBatchWithCode(id)

    async function fetchTeacherData() {
      await GetCurrentBatchStudents(id)
    }
    async function fetchStudentData() {}
    if (role === 'T') {
      fetchTeacherData()
    }
    if (role === 'S') {
      fetchStudentData()
    }
  }, [])

  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
  }

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <div className="full-height">
          <Grid container justify="space-between" className="padding-small">
            <Grid item xs={12} sm={6} md={8} lg={10}>
              <div className="height-100 flex-row align-items-center">
                <p className="bolder route-heading">Notes</p>
              </div>
            </Grid>
            <Grid item xs={12} sm={6} md={4} lg={2}>
              {role === 'T' && (
                <div>
                  <Controls.Button className={classes.btn} onClick={handleOpen}>
                    <FiPlus className="margin-right-smallest" /> Add Notes
                  </Controls.Button>
                </div>
              )}
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
                <Typography color="textPrimary">Notes</Typography>
              </Breadcrumbs>
            </Grid>
          </Grid>
          <div>
            <div className={classes.appBarContainer}>
              <AppBar position="static" className={classes.appBar}>
                <Tabs value={selectedTab} onChange={handleTabChange}>
                  <Tab label="Other Notes" className={classes.capitalizeText} />
                  <Tab
                    label="WhiteBoard Notes"
                    className={classes.capitalizeText}
                  />
                </Tabs>
                <Controls.Input
                  placeholder="Search for notes by name"
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
                  {selectedTab === 1 && (
                    <div>
                      <p className="fine-text secondary-text margin-top-small">
                        No notes available
                      </p>
                    </div>
                  )}
                  {selectedTab === 0 && (
                    <NotesContainer
                      notes={notes}
                      allBatchStudents={allBatchStudents}
                      role={role}
                      GetNotes={GetNotes}
                      id={id}
                      setLoading={setLoading}
                    />
                  )}
                </>
              )}
              {searchQuery !== '' && (
                <NotesContainer
                  notes={searchedData}
                  allBatchStudents={allBatchStudents}
                  role={role}
                  GetNotes={GetNotes}
                  id={id}
                />
              )}
            </div>
          </div>
          {role === 'T' && (
            <UploadDialog
              open={open}
              closeDialog={handleClose}
              title={title}
              id={id}
              GetNotes={GetNotes}
              uploadPercent={uploadPercent}
              setUploadPercent={setUploadPercent}
            />
          )}
        </div>
      )}
    </>
  )
}

const useStyles = makeStyles(() =>
  createStyles({
    card_container: {
      padding: '2rem 0rem',
    },
    btn: {
      backgroundColor: '#568ae1',
      '&:hover': {
        backgroundColor: '#568ae1',
      },
    },
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
      padding: '0 2rem',
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
  }),
)

export default Utilities
