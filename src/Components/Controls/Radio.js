import React from 'react'
import {
  FormControl,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormLabel,
} from '@material-ui/core'

export default function Select(props) {
  const {
    name,
    label,
    value,
    error = null,
    onChange,
    options,
    color,
    ...other
  } = props

  return (
    <FormControl variant="outlined" {...(error && { error: true })}>
      <FormLabel>{label}</FormLabel>
      <RadioGroup label={name} value={value} onChange={onChange} row>
        {options.map((item) => (
          <FormControlLabel
            label={item.title}
            value={item.id}
            control={<Radio color={color || 'primary'} name={name} />}
            {...other}
          >
            {item.title}
          </FormControlLabel>
        ))}
      </RadioGroup>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
