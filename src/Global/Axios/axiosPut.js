import axios from 'axios'

const axiosPut = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  timeout: 5000,
  timeoutErrorMessage:
    'Request timed out, please check your internet connectivity',
  method: 'PUT',
})

export default axiosPut
