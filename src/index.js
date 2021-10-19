import React from 'react'
import ReactDOM from 'react-dom'
import './index.scss'
import { SnackbarProvider } from 'notistack'
import { ThemeProvider } from '@material-ui/styles'
import App from './App'
import reportWebVitals from './reportWebVitals'
import MaterialUITheme from './MaterialUITheme'

ReactDOM.render(
  <React.StrictMode>
    <SnackbarProvider maxSnack={4}>
      <ThemeProvider theme={MaterialUITheme}>
        <App />
      </ThemeProvider>
    </SnackbarProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
