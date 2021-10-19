import { Divider, Grid, IconButton } from '@material-ui/core'
import React, { useContext, useEffect, useState, useRef } from 'react'
import { FiSend } from 'react-icons/fi'
import Linkify from 'react-linkify'
import Controls from '../Controls/Controls'
import Form from '../Form/Form'
import { AuthContext } from '../../Context/AuthContext'
import { BatchContext } from '../../Context/BatchContext'

const Chat = ({ channelMessages, sendMessage, batchId }) => {
  const [message, setMessage] = useState('')
  const { authState } = useContext(AuthContext)
  const { GetEnrolledStudentsInBatch } = useContext(BatchContext)
  const [students, setStudents] = useState([])

  useEffect(() => {
    async function getStudents() {
      const enrolledStudents = await GetEnrolledStudentsInBatch(batchId)
      if (enrolledStudents) {
        setStudents(enrolledStudents)
      }
    }

    getStudents()
  }, [])

  const messageEL = useRef(null)

  useEffect(() => {
    messageEL.current.scrollIntoView(false)
  }, [channelMessages.length])

  const sendTextMessage = async () => {
    if (message.trim().length === 0) return
    channelMessages.push({
      messageType: 'TEXT',
      text: { type: 'TEXT', message },
      senderId: authState.user_id,
      timestamp: new Date().getTime(),
    })
    sendMessage(message)
    setMessage('')
  }

  const getName = (id) => {
    const result = students.find((student) => student.id === id)
    if (result) {
      return result.name
    }
    return undefined
  }

  const formatAMPM = (timestamp) => {
    const date = new Date(timestamp)
    let hours = date.getHours()
    let minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    hours %= 12
    hours = hours || 12
    minutes = minutes < 10 ? `0${minutes}` : minutes
    const strTime = `${hours}:${minutes} ${ampm}`
    return strTime
  }

  const getContent = (m) => {
    if (m.text.type === 'TEXT') {
      return (
        <div
          style={{
            padding: '10px 14px',
            borderRadius: 4,
            border: 'solid 1px #dbdbdb',
            marginBottom: 16,
          }}
          key={m.timestamp}
        >
          <div style={{ fontSize: 12 }}>
            <span
              style={{ fontWeight: 600, color: '#6384e4', lineHeight: '1.33' }}
            >
              {getName(m.senderId) || 'Teacher'}
            </span>
            <span style={{ margin: '0 8px', lineHeight: '1.33' }}>|</span>
            <span style={{ lineHeight: '1.33' }}>
              {formatAMPM(m.timestamp)}
            </span>
          </div>
          <div>
            <Linkify
              componentDecorator={(decoratedHref, decoratedText, key) => (
                <a
                  target="_blank"
                  rel="noreferrer"
                  href={decoratedHref}
                  key={key}
                >
                  {decoratedText}
                </a>
              )}
            >
              <p
                style={{
                  fontSize: 14,
                  maxWidth: '100%',
                  wordBreak: 'break-word',
                  color: '#333',
                }}
              >
                {m.text.message}
              </p>
            </Linkify>
          </div>
        </div>
      )
    }
  }

  return (
    <>
      <Grid container style={{ height: '100%', width: 350 }} id="chat-panel">
        <Grid
          item
          style={{
            overflow: 'auto',
            height: 'calc(100% - 64px)',
          }}
          xs={12}
        >
          <p
            style={{
              backgroundColor: '#f2f5ff',
              color: '#333',
              fontSize: '1.25rem',
              padding: '0.5rem 1.125rem',
              fontWeight: 500,
              height: 44,
            }}
          >
            Chat
          </p>
          <div style={{ margin: '18px 15px 0' }} id="chat-box">
            {channelMessages.map((m) => getContent(m))}
          </div>
          <div ref={messageEL} />
        </Grid>
        <Grid
          item
          xs={12}
          style={{
            position: 'fixed',
            bottom: 64,
            width: 350,
          }}
        >
          <Divider />
          <Form
            style={{
              padding: '0 0.5rem',
              backgroundColor: '#f2f5ff',
            }}
            onSubmit={(e) => {
              e.preventDefault()
              sendTextMessage()
            }}
            id="message"
          >
            <Grid container alignItems="center">
              <Grid item sm={10}>
                <Controls.Input
                  type="text"
                  name="message"
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  size="small"
                  autoFocus
                  placeholder="Send message to everyone"
                  style={{ backgroundColor: '#fff' }}
                />
              </Grid>
              <Grid item sm={2}>
                <IconButton
                  onClick={() => {
                    sendTextMessage()
                  }}
                >
                  <FiSend />
                </IconButton>
              </Grid>
            </Grid>
          </Form>
        </Grid>
      </Grid>
    </>
  )
}

export default Chat
