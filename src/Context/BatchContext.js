import React, { createContext, useState, useContext, useEffect } from 'react'
import { useSnackbar } from 'notistack'
import { AuthContext } from './AuthContext'
import handleError from '../Global/HandleError/handleError'
import axiosGet from '../Global/Axios/axiosGet'
import axiosPost from '../Global/Axios/axiosPost'
import showSuccessSnackbar from '../Components/Snackbar/successSnackbar'
import axiosDelete from '../Global/Axios/axiosDelete'
import axiosPatch from '../Global/Axios/axiosPatch'
import axiosPut from '../Global/Axios/axiosPut'
import showErrorSnackbar from '../Components/Snackbar/errorSnackbar'

export const BatchContext = createContext()

const BatchContextProvider = (props) => {
  const { getAuthHeader, isLoggedIn } = useContext(AuthContext)

  const initialState = {
    batch: [],
    request: [],
  }

  const initialPollResult = {
    yes: 0,
    no: 0,
  }

  const [allReqAndBatches, setAllReqAndBatches] = useState(initialState)
  const [pollResult, setPollResult] = useState(initialPollResult)
  const [batchByCode, setBatchByCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [noBatchFound, setNoBatchFound] = useState(false)

  const [teacherBatches, setTeacherBatches] = useState(undefined)
  const [studentRequestByBatchId, setStudentRequestByBatchId] = useState([])
  const [notes, setNotes] = useState([])
  const [allBatchStudents, setAllBatchStudents] = useState([])
  const [batchNotices, setBatchNotices] = useState([])
  const [uploadPercent, setUploadPercent] = useState()

  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!isLoggedIn) {
      setAllReqAndBatches(initialState)
      setBatchByCode('')
      setTeacherBatches(undefined)
      setStudentRequestByBatchId([])
      setPollResult(initialPollResult)
      setNotes([])
      setAllBatchStudents([])
      setBatchNotices([])
    }
  }, [isLoggedIn])

  const getAllReqAndBatches = async () => {
    try {
      setLoading(true)
      const data = await axiosGet(`/request/`, {
        headers: getAuthHeader(),
      })
      const joinedBatches = await axiosGet(`/batch/`, {
        headers: getAuthHeader(),
      })
      setAllReqAndBatches({
        batch: joinedBatches.data,
        request: data.data.request,
      })
      setLoading(false)
    } catch (err) {
      // console.error(err)
    }
  }

  const FindBatchWithCode = async (code) => {
    try {
      const data = await axiosGet(`/batch/${code}/`, {
        headers: getAuthHeader(),
      })
      setBatchByCode(data.data)

      return data.data
    } catch (err) {
      setLoading(false)
      if (err.response.status === 404) {
        setNoBatchFound(true)
        setTimeout(() => setNoBatchFound(false), 4000)
      }
      return false
    }
  }

  const JoinBatchClass = (id) =>
    axiosPost(`/batch/${id}/join/`, { headers: getAuthHeader() })

  const RequestBatch = async (batchCode) => {
    try {
      await axiosPost(`/batch/${batchCode}/request/`, {
        headers: getAuthHeader(),
      })
      showSuccessSnackbar(enqueueSnackbar, 'Batch Requested')
    } catch (err) {
      // console.error(err)
    }
  }

  const GetTeacherBatches = async () => {
    try {
      setLoading(true)
      const res = await axiosGet('/batch/', { headers: getAuthHeader() })
      setTeacherBatches(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      handleError(enqueueSnackbar, err)
    }
  }

  const GetStudentRequestsForBatch = async (id) => {
    try {
      setLoading(true)
      const res = await axiosGet(`/batch/${id}/request/`, {
        headers: getAuthHeader(),
      })
      setStudentRequestByBatchId(res.data)
      setLoading(false)
    } catch (err) {
      setLoading(false)
      handleError(enqueueSnackbar, err)
    }
  }

  // We have to show schedule class popup after user create a batch, so commenting previous code.
  const CreateBatchTeacher = async (data) => {
    try {
      // setLoading(true);

      const res = await axiosPost('/batch/', {
        data,
        headers: getAuthHeader(),
      })
      // showSuccessSnackbar(enqueueSnackbar, `Batch ${res.data.name} Created`);
      // setTeacherBatches((batches) => {
      //     return [...batches, res.data];
      // });
      // setLoading(false);
      return res.data
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const DeleteBatchTeacher = async (id) => {
    try {
      await axiosDelete(`/batch/${id}/`, {
        headers: getAuthHeader(),
      })
      showSuccessSnackbar(enqueueSnackbar, 'Batch Deleted')
      return true
    } catch (err) {
      handleError(enqueueSnackbar, err)
      return false
    }
  }

  const AcceptStudentRequest = (id) =>
    axiosPatch(`/request/${id}/`, {
      data: {
        status: 'A',
      },
      headers: getAuthHeader(),
    })

  const RejectStudentRequest = (id) =>
    axiosPatch(`/request/${id}/`, {
      data: {
        status: 'R',
      },
      headers: getAuthHeader(),
    })

  const ChangeLocalStudentRequestStatus = (id, status) => {
    setStudentRequestByBatchId((students) => {
      const temp = students.filter((student) => student.id === id)
      const rest = students.filter((student) => student.id !== id)
      temp[0].status = status
      return [...rest, temp[0]]
    })
  }

  const EditBatchTeacher = async (id, data) => {
    if (!id) {
      return
    }
    try {
      const res = await axiosPatch(`/batch/${id}/`, {
        data,
        headers: getAuthHeader(),
      })
      showSuccessSnackbar(enqueueSnackbar, 'Batch Saved Successfully')
      return res.data
    } catch (err) {
      handleError(enqueueSnackbar, err)
      return false
    }
  }

  const GetEnrolledStudentsInBatch = async (id) => {
    try {
      const res = await axiosGet(`/batch/${id}/student/`, {
        headers: getAuthHeader(),
      })
      return res.data
    } catch (err) {
      return false
    }
  }

  const StartQuickPoll = async (payload) => {
    try {
      const res = await axiosPost(`/quick_poll/`, {
        data: payload,
        headers: getAuthHeader(),
      })
      return { pollId: res.data.id, pollEndTime: res.data.expiry }
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }
  const GetQuickPollResult = async (id) => {
    try {
      const res = await axiosGet(`/quick_poll/${id}/`, {
        headers: getAuthHeader(),
      })
      setPollResult({
        ...pollResult,
        yes: res.data.result.yes,
        no: res.data.result.no,
      })
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const AnswerPoll = async (data, pollId) => {
    try {
      await axiosPost(`/quick_poll/${pollId}/answer/`, {
        data,
        headers: getAuthHeader(),
      })
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const GetNotes = async (id) => {
    try {
      const res = await axiosGet(`/notes/?batch=${id}`, {
        headers: getAuthHeader(),
      })
      setNotes(res.data)
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const DeleteNotes = async (id) => {
    try {
      await axiosDelete(`/notes/${id}/`, {
        headers: getAuthHeader(),
      })

      showSuccessSnackbar(enqueueSnackbar, 'Note Deleted')
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const UploadNotes = async (formData) => {
    try {
      const token = localStorage.getItem('access')
      const config = {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        onUploadProgress: (ProgressEvent) => {
          const { loaded, total } = ProgressEvent
          const percent = Math.floor((loaded * 100) / total)
          setUploadPercent(percent)
        },
      }
      await axiosPost(`/notes/`, {
        data: formData,
        headers: config.headers,
        onUploadProgress: config.onUploadProgress,
      })
      showSuccessSnackbar(enqueueSnackbar, 'Notes Uploaded')
      return {
        success: true,
      }
    } catch (err) {
      if (err.response.status === 400) {
        return {
          success: false,
        }
      }
    }
  }

  const GetCurrentBatchStudents = async (id) => {
    try {
      const res = await axiosGet(`/batch/${id}/student/`, {
        headers: getAuthHeader(),
      })
      setAllBatchStudents(res.data)
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const GetCurrentBatchNotices = async (id) => {
    try {
      const res = await axiosGet(`/notice/?batch=${id}`, {
        headers: getAuthHeader(),
      })
      setBatchNotices(res.data)
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const SendBatchNotice = async (data) => {
    try {
      const res = await axiosPost(`/notice/`, {
        data,
        headers: getAuthHeader(),
      })
      setBatchNotices((notices) => [...notices, res.data])
      return res
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const AddSchedule = async (data) => {
    try {
      await axiosPost(`/schedule/`, {
        data,
        headers: getAuthHeader(),
      })
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const GetBatchSchedule = async (id) => {
    try {
      const res = await axiosGet(`/schedule/?batch=${id}`, {
        headers: getAuthHeader(),
      })

      if (res.data.length !== 0) {
        return {
          data: res.data[0].schedule,
          schedule_id: res.data[0].id,
        }
      }
      return res.data
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const DeleteSchedule = async (id) => {
    try {
      await axiosDelete(`/schedule/${id}/`, {
        headers: getAuthHeader(),
      })
      showSuccessSnackbar(enqueueSnackbar, 'Schedule Deleted')
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const UpdateScheduleWithId = async (id, data) => {
    try {
      await axiosPut(`/schedule/${id}/`, {
        data,
        headers: getAuthHeader(),
      })
      showSuccessSnackbar(enqueueSnackbar, 'Schedule Updated')
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const VerifyEmailWithOtp = async (data) => {
    try {
      const res = await axiosPost(`/verify_otp/`, {
        data,
        headers: getAuthHeader(),
      })
      if (res.status === 200) {
        showSuccessSnackbar(enqueueSnackbar, res.data.message)
      }
      return res.status
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const ResendEmailVerify = async (data) => {
    try {
      const res = await axiosPatch('/profile/', {
        data,
        headers: getAuthHeader(),
      })
      console.log(res)
      return res
    } catch (err) {
      console.error(err)
      console.log(err.response)
      return err.response
    }
  }

  const StartBatchLecture = async (id) => {
    if (id === null || id === undefined) {
      showErrorSnackbar(
        enqueueSnackbar,
        'Something went wrong, please refresh and try again!',
      )
    }
    try {
      try {
        const res = await axiosPost(`/batch/${id}/start/`, {
          data: {},
          headers: getAuthHeader(),
        })
        const result = await axiosGet(`/lecture/${res.data.id}/join/`, {
          headers: getAuthHeader(),
        })
        return { ...result.data, lecture_id: res.data.id }
      } catch (err) {
        if (err.response.status === 400) {
          const res = await FindBatchWithCode(id)
          const result = await axiosGet(`/lecture/${res.lecture.id}/join/`, {
            headers: getAuthHeader(),
          })
          return { ...result.data, lecture_id: res.lecture.id }
        }
      }
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const ResumeBatchLecture = async (id) => {
    try {
      const res = await axiosGet(`lecture/${id}/join/`, {
        headers: getAuthHeader(),
      })
      return res
    } catch (err) {
      handleError(enqueueSnackbar, err)
    }
  }

  const EndBatchLecture = async (id, showSnackbar = true) => {
    try {
      await axiosPost(`/batch/${id}/end/`, {
        data: {},
        headers: getAuthHeader(),
      })
      if (showSnackbar) {
        showSuccessSnackbar(enqueueSnackbar, 'Class Ended')
      }
    } catch (err) {
      if (showSnackbar) {
        handleError(enqueueSnackbar, err)
      }
    }
  }

  return (
    <BatchContext.Provider
      value={{
        getAllReqAndBatches,
        allReqAndBatches,
        FindBatchWithCode,
        batchByCode,
        loading,
        RequestBatch,
        JoinBatchClass,
        showAlert,
        setShowAlert,
        GetTeacherBatches,
        teacherBatches,
        setTeacherBatches,
        GetStudentRequestsForBatch,
        CreateBatchTeacher,
        DeleteBatchTeacher,
        AcceptStudentRequest,
        RejectStudentRequest,
        EditBatchTeacher,
        setStudentRequestByBatchId,
        studentRequestByBatchId,
        ChangeLocalStudentRequestStatus,
        GetEnrolledStudentsInBatch,
        setLoading,
        setBatchByCode,
        StartQuickPoll,
        GetQuickPollResult,
        pollResult,
        GetNotes,
        notes,
        UploadNotes,
        GetCurrentBatchStudents,
        allBatchStudents,
        AnswerPoll,
        uploadPercent,
        setUploadPercent,
        DeleteNotes,
        noBatchFound,
        AddSchedule,
        GetBatchSchedule,
        UpdateScheduleWithId,
        DeleteSchedule,
        StartBatchLecture,
        ResumeBatchLecture,
        EndBatchLecture,
        batchNotices,
        GetCurrentBatchNotices,
        SendBatchNotice,
        VerifyEmailWithOtp,
        ResendEmailVerify,
      }}
    >
      {props.children}
    </BatchContext.Provider>
  )
}

export default BatchContextProvider
