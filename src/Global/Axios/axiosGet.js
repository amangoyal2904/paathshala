import axios from 'axios'

const axiosGet = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 5000,
  timeoutErrorMessage:
    'Request timed out, please check your internet connectivity',
  method: 'GET',
})

export default axiosGet
