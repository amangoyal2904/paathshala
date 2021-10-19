import React from 'react'
import { Button as MuiButton, makeStyles } from '@material-ui/core'

const useStyles = makeStyles((theme) => ({
  root: {
    margin: theme.spacing(0),
    width: '100%',
    boxShadow: 'none',
    '&.MuiButton-contained.Mui-disabled': {
      backgroundColor: '#ababab',
      backgroundImage: 'unset',
    },
    '&.MuiButton-outlinedPrimary': {
      '&:hover': {
        backgroundColor: '#5f80eb',
        color: '#fff',
      },
    },
  },
  label: {
    textTransform: 'none',
  },
  buttonBg: {
    margin: theme.spacing(0),
    width: '100%',
    backgroundImage: 'linear-gradient(93deg, #638ee4 1%, #6480e4 99%)',
    color: '#fff',
    boxShadow: 'none',
    '&.Mui-disabled': {
      backgroundColor: '#ababab',
      backgroundImage: 'unset',
    },
  },
}))

export default function Button(props) {
  const { text, size, color, variant, onClick, disabled, children, ...other } =
    props
  const classes = useStyles()

  return (
    <MuiButton
      variant={variant || 'contained'}
      size={size || 'large'}
      color={color || 'primary'}
      onClick={onClick}
      disabled={disabled}
      {...other}
      classes={{
        root:
          (color === undefined || color === 'primary') && variant !== 'outlined'
            ? classes.buttonBg
            : classes.root,
        label: classes.label,
      }}
    >
      {text}
      {children}
    </MuiButton>
  )
}
