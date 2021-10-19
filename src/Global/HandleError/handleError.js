import showErrorSnackbar from '../../Components/Snackbar/errorSnackbar'

export default function handleError(enqueueSnackbar, err) {
  if (err) {
    if (err.response) {
      if (err.response.status === 401) {
        if (
          err.response.data.detail !==
          'Given token not valid for any token type'
        )
          showErrorSnackbar(enqueueSnackbar, err.response.data.detail)
      }
      if (err.response.status === 400) {
        const values = Object.values(err.response.data)
        values.forEach((value) => {
          showErrorSnackbar(enqueueSnackbar, value)
        })
      }
      if (err.response.status === 404) {
        showErrorSnackbar(enqueueSnackbar, err.response.data.detail)
      }
      if (err.response.status.toString().charAt(0) === '5') {
        window.location.replace(
          `${window.location.protocol}//${window.location.hostname}${
            window.location.port ? `:${window.location.port}` : ''
          }/internal-error`,
        )
      }
    }
  }
}
