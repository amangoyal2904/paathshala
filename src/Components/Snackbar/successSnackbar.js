export default function showSuccessSnackbar(enqueueSnackbar, message) {
  enqueueSnackbar(message, {
    variant: 'success',
    anchorOrigin: {
      vertical: 'bottom',
      horizontal: 'center',
    },
    autoHideDuration: 3000,
    preventDuplicate: true,
  })
}
