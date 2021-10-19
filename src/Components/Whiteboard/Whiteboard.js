import { useMediaQuery } from '@material-ui/core'
import React from 'react'
import useWindowDimensions from '../../Hooks/useWindowDimensions'

const Whiteboard = ({ src, title }) => {
  const { height, width } = useWindowDimensions()
  const matches = useMediaQuery('(min-width:600px)')
  return (
    <iframe
      src={src}
      frameBorder="0"
      title={title}
      style={{
        width,
        height: matches ? height - 128 : height - 104,
        position: 'absolute',
        top: 0,
        zIndex: 1001,
      }}
    />
  )
}

export default Whiteboard
