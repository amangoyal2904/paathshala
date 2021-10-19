export default function showErrorSnackbar(enqueueSnackbar, message) {
  enqueueSnackbar(message, {
    variant: 'error',
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    autoHideDuration: 3000,
    preventDuplicate: true,
  })
}
