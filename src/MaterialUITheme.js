import { createMuiTheme } from '@material-ui/core'
const MaterialUITheme = createMuiTheme({
  palette: {
    primary: {
      main: '#5f80eb',
      contrastText: '#fff',
    },
    secondary: {
      main: '#ffb031',
      contrastText: '#fff',
    },
    success: {
      main: '#32bea6',
    },
    error: {
      main: '#ff4c04',
    },
  },
  typography: {
    fontFamily: [
      'Poppins',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
  },
})

export default MaterialUITheme
