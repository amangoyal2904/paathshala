import React, { useState, Fragment, useContext } from 'react'
import { IconButton } from '@material-ui/core'
import { makeStyles, createStyles } from '@material-ui/core/styles'
import { FcDownload } from 'react-icons/fc'
import { saveAs } from 'file-saver'
import { AiOutlineDelete } from 'react-icons/ai'
import ShareDialog from '../../Components/Dialogs/ShareDialog'
import ConfirmDialog from '../../Components/Dialogs/ConfirmDialog'
import { BatchContext } from '../../Context/BatchContext'
import { ConvertTime } from '../../Global/Functions'
import BootstrapTooltip from '../../Components/Tooltips/BootstrapTooltip'

const Notes = ({
  date,
  allBatchStudents,
  role,
  file,
  name,
  note_id,
  batch_id,
}) => {
  const classes = useStyles()
  const [openShareDialog, setOpenShareDialog] = useState(false)
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false)
  const openInNewTab = (url) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer')
    if (newWindow) newWindow.opener = null
  }
  const handleCloseShareDialog = () => {
    setOpenShareDialog(false)
  }
  const { DeleteNotes, GetNotes } = useContext(BatchContext)
  const handleDeleteNote = async () => {
    await DeleteNotes(note_id)
    await GetNotes(batch_id)
    setOpenShareDialog(false)
  }
  return (
    <>
      <div className={classes.container}>
        <div className={classes.action}>
          <div
            role="button"
            tabIndex="0"
            onClick={() => openInNewTab(file)}
            onKeyDown={() => openInNewTab(file)}
            className="cursor-pointer"
          >
            <BootstrapTooltip title={name} placement="top">
              <p className={classes.title}>
                {name.length < 10 ? name : `${name.substring(0, 10)}...`}
              </p>
            </BootstrapTooltip>
            <p className={classes.date}>
              {`${ConvertTime(date).toLocaleDateString()} | ${ConvertTime(date)
                .toLocaleTimeString()
                .slice(0, 5)}` || 'No Date'}
            </p>
          </div>
          <div>
            <BootstrapTooltip title="Save File" placement="bottom">
              <IconButton
                size="small"
                className={classes.icon}
                onClick={() => {
                  saveAs(file)
                }}
              >
                <FcDownload />
              </IconButton>
            </BootstrapTooltip>
            {role === 'T' && (
              <BootstrapTooltip title="Delete" placement="bottom">
                <IconButton
                  size="small"
                  className={classes.icon}
                  onClick={() => setOpenConfirmDialog(true)}
                >
                  <AiOutlineDelete />
                </IconButton>
              </BootstrapTooltip>
            )}
          </div>
        </div>
        <ShareDialog
          open={openShareDialog}
          closeDialog={handleCloseShareDialog}
          allBatchStudents={allBatchStudents}
        />
        <ConfirmDialog
          open={openConfirmDialog}
          setOpen={setOpenConfirmDialog}
          title="Delete Note"
          content="Are You Sure you want ot delete this note"
          yesAction={handleDeleteNote}
          noAction={() => setOpenConfirmDialog(false)}
        />
      </div>
    </>
  )
}
const useStyles = makeStyles(() =>
  createStyles({
    container: {
      backgroundColor: '#fff',
      padding: '10px 20px',
      boxShadow: '2px 4px 6px 2px rgba(0, 0, 0, 0.06)',
      borderRadius: 8,
    },
    image: {
      backgroundColor: '#D8D8D8',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: 100,
      borderRadius: '5%',
    },
    action: {
      marginTop: 8,
      padding: '0px 5px',
      display: 'flex',
      alignItems: ' center',
      justifyContent: 'space-between',
      '&:hover': {
        cursor: 'pointer',
      },
    },
    title: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
    },
    date: {
      fontSize: '0.8rem',
      marginTop: 2,
      color: 'grey',
    },
    icon: {
      backgroundColor: '#F2F2FD',
      marginLeft: 10,
    },
  }),
)
export default Notes
