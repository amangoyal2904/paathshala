import React, { useRef, useEffect } from 'react'

const MediaPlayerCallTest = ({
  videoTrack,
  audioTrack,
  trackType,
  style,
  ...rest
}) => {
  const container = useRef(null)
  useEffect(() => {
    if (!container.current) return
    videoTrack?.play(container.current)
    return () => {
      videoTrack?.stop()
    }
  }, [container, videoTrack])
  useEffect(() => {
    if (trackType !== 'local') audioTrack?.play()
    return () => {
      audioTrack?.stop()
    }
  }, [audioTrack, trackType])
  return (
    <div ref={container} style={style} {...rest}>
      {!videoTrack && (
        <div
          style={{ ...style, backgroundColor: '#424242' }}
          className="media-player"
        ></div>
      )}
    </div>
  )
}

export default MediaPlayerCallTest
