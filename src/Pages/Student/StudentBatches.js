/* eslint-disable jsx-a11y/aria-role */
import React, { useContext, useState, useEffect } from 'react'
import { Grid, Divider } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import Controls from '../../Components/Controls/Controls'
import { AuthContext } from '../../Context/AuthContext'
import { BatchContext } from '../../Context/BatchContext'
import ApprovedCard from '../../Components/Cards/ApprovedCard'
import PendingCard from '../../Components/Cards/PendingCard'
import CreateBatchMessage from '../Teacher/Batch/CreateBatchMessage/CreateBatchMessage'
import JoinBatchDialog from '../../Components/Dialogs/JoinBatchDialog'
import RefreshCard from '../../Components/Refresh/RefreshCard'

const StudentBatches = ({ allReqAndBatches, setBatchByCode }) => {
  const { authState } = useContext(AuthContext)
  const { getAllReqAndBatches } = useContext(BatchContext)

  const [openJoinBatchDialog, setOpenJoinBatchDialog] = useState(false)

  const { batch, request } = allReqAndBatches

  const cardCount = batch.length + request.length

  useEffect(() => {}, [cardCount])

  const sortedBatches = batch.sort((a, b) => a.batchId - b.batchId)

  const sortedRequests = request.sort((a, b) => a.batchId - b.batchId)

  const handleJoinBatchDialogOpen = () => {
    setOpenJoinBatchDialog(true)
  }

  const handleJoinBatchDialogClose = () => {
    setOpenJoinBatchDialog(false)
  }

  return (
    <>
      <div className="container" style={{ backgroundColor: 'unset' }}>
        <Grid
          container
          alignItems="center"
          style={{ marginBottom: '1rem' }}
          spacing={2}
        >
          <Grid item xs={8} lg={10}>
            <div>
              <p className="sub-text bolder">My Batches</p>
            </div>
          </Grid>
          <Grid item xs={4} lg={2}>
            <Controls.Button
              startIcon={<Add />}
              text="Join Batch"
              color="secondary"
              onClick={handleJoinBatchDialogOpen}
              disabled={!authState.is_email_verified}
            />
          </Grid>
        </Grid>
        <Divider />
        {authState.is_email_verified ? (
          <>
            {cardCount > 0 && (
              <Grid
                container
                spacing={2}
                alignItems="stretch"
                style={{ marginTop: '0.5rem' }}
              >
                {sortedBatches.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.batchId}>
                    <ApprovedCard
                      batchName={item.name}
                      batchId={item.id}
                      subject={item.subject}
                      nextLectureTiming={item.nextLectureTiming}
                      lecture={item.lecture}
                      teacherName={item.owner_name}
                    />
                  </Grid>
                ))}
                {sortedRequests.map((item) => (
                  <Grid item xs={12} sm={6} md={4} key={item.batchId}>
                    <PendingCard
                      batchName={item.batch_name}
                      batchId={item.batch_id}
                      subject={item.subject}
                      standard={item.standard}
                      teacherName={item.teacher}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            {cardCount === 0 && <CreateBatchMessage role="S" />}
            {openJoinBatchDialog && (
              <JoinBatchDialog
                open={openJoinBatchDialog}
                onClose={handleJoinBatchDialogClose}
                allReqAndBatches={allReqAndBatches}
                setBatchByCode={setBatchByCode}
              />
            )}
          </>
        ) : (
          <CreateBatchMessage role="S" />
        )}
      </div>
      <RefreshCard
        msg="Please click on refresh to check if your join request is accepted or live class has started"
        onRefresh={getAllReqAndBatches}
      />
    </>
  )
}

export default StudentBatches
