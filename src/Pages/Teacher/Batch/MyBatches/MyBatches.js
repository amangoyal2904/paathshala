import React, { useContext, useState, useEffect } from 'react'
import { Divider, Grid } from '@material-ui/core'
import Add from '@material-ui/icons/Add'
import BatchCard from '../../../../Components/Cards/BatchCard'
import Controls from '../../../../Components/Controls/Controls'
import CreateBatchMessage from '../CreateBatchMessage/CreateBatchMessage'
import { AuthContext } from '../../../../Context/AuthContext'
import CreateBatchDialog from '../../../../Components/Dialogs/CreateBatchDialog/CreateBatchDialog'
import { BatchContext } from '../../../../Context/BatchContext'
import RefreshCard from '../../../../Components/Refresh/RefreshCard'

const MyBatches = ({ batches, openBatchMenu, setBatches }) => {
  useEffect(() => {}, [batches.length])

  const openCreateDialog = () => {
    setCreateBatchDialog(true)
  }

  const sortedBatches = batches.sort((a, b) => a.id - b.id)

  const { authState } = useContext(AuthContext)
  const { GetTeacherBatches } = useContext(BatchContext)

  const [createBatchDialog, setCreateBatchDialog] = useState(false)

  return (
    <>
      <CreateBatchDialog
        open={createBatchDialog}
        setOpen={setCreateBatchDialog}
      />
      <div className="container bg-unset">
        <Grid
          container
          alignItems="center"
          className="mg-bottom-1rem"
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
              text="Create Batch"
              onClick={openCreateDialog}
              color="secondary"
              disabled={!authState.is_email_verified}
            />
          </Grid>
        </Grid>
        <Divider />
        {authState.is_email_verified ? (
          <>
            {batches.length > 0 && (
              <Grid
                container
                spacing={4}
                justify="flex-start"
                alignItems="stretch"
                className="mg-top-1rem"
              >
                {sortedBatches.map((batch) => (
                  <Grid item xs={12} sm={6} md={4} xl={3} key={batch.id}>
                    <BatchCard
                      batch={batch}
                      openBatchMenu={openBatchMenu}
                      setBatches={setBatches}
                      batches={batches}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
            {batches.length === 0 && <CreateBatchMessage />}
          </>
        ) : (
          <CreateBatchMessage />
        )}
      </div>
      <RefreshCard
        msg="Please click on refresh to check if new students have requested to join the batch"
        onRefresh={GetTeacherBatches}
      />
    </>
  )
}

export default MyBatches
