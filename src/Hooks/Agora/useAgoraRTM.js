import { useState, useEffect, useContext } from 'react'
import { AgoraContext } from '../../Context/AgoraContext'
import { AuthContext } from '../../Context/AuthContext'

/*
MESSAGE FORMAT:
{
    TYPE:'TEXT | COMMAND',
    'MESSAGE': ' ',
}

WHEN TYPE IS TEXT
MESSAGE: {
  BODY: "" //32KB STRING
}

WHEN TYPE IS COMMAND
MESSAGE: {
    COMMAND_CATEGORY: ' AGORA || QUICK_POLL || DOUBT',
    //IF COMMAND CATEGORY=== 'AGORA'
    COMMAND_METHOD: 'MIC_ON || MIC_OFF || CAM_ON || CAM_OFF || CONTROLS_GRANTED || CONTROLS_REVOKED'
    //IF COMMAND CATEGORY==='DOUBT'
    COMMAND_METHOD: 'ASK || CLEAR || RECEIVED'
    //IF COMMAND CATEGORY==='QUICK_POLL'
    COMMAND_METHOD: 'STARTED || EXPIRED'
}

*/

export default function useAgoraRTM(client) {
  const [channel, setChannel] = useState(undefined)
  const [isJoined, setIsJoined] = useState(false)
  const {
    setIsNewMessage,
    HandleCommand,
    setNotificationState,
    setUnreadMessage,
    giveAVPermissionToStudent,
  } = useContext(AgoraContext)

  const { authState } = useContext(AuthContext)

  const [channelMessages, setChannelMessages] = useState([])

  async function login(uid, token) {
    return client.login({ token, uid })
  }

  async function logout() {
    if (!isJoined) return true
    setIsJoined(false)
    return client.logout()
  }

  function createChannel(channelName) {
    return client.createChannel(channelName)
  }

  async function createChannelAndJoin(channelName) {
    setChannel(() => {
      const newChannel = createChannel(channelName)
      joinChannel(newChannel).then(() => {
        setIsJoined(true)
      })
      return newChannel
    })
  }

  // eslint-disable-next-line no-shadow
  async function joinChannel(channel) {
    if (!channel) {
      return
    }

    return channel.join()
  }

  async function leaveChannel() {
    if (!channel) return
    setIsJoined(false)
    return channel.leave()
  }

  async function sendMessage(text) {
    if (!channel) return
    if (text.trim().length < 1) return
    const sendPayload = {
      type: 'TEXT',
      message: {
        body: text,
      },
    }
    return channel.sendMessage({ text: JSON.stringify(sendPayload) })
  }

  async function sendCommandToSpecificUser(
    uid,
    command_category,
    command_method,
    body = '',
  ) {
    const sendPayload = {
      type: 'COMMAND',
      message: {
        command_category,
        command_method,
        body,
      },
    }
    await client.sendMessageToPeer({ text: JSON.stringify(sendPayload) }, uid)
  }

  async function sendCommandToChannel(
    command_category,
    command_method,
    body = '',
  ) {
    const sendPayload = {
      type: 'COMMAND',
      message: {
        command_category,
        command_method,
        body,
      },
    }
    try {
      await channel.sendMessage({ text: JSON.stringify(sendPayload) })
    } catch (err) {
      setTimeout(() => {
        sendCommandToChannel(command_category, command_method, body)
      }, 2500)
    }
  }

  let timeout

  function releaseNotification() {
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(() => {
      setNotificationState({
        open: false,
        uid: null,
        type: null,
        content: null,
      })
    }, 3500)
  }

  useEffect(() => {
    if (!channel || !client) return
    channel.on('ChannelMessage', (messageObject, senderId, messagePros) => {
      const messageType = JSON.parse(messageObject.text).type
      if (messageType === 'TEXT') {
        setIsNewMessage(true)
        setUnreadMessage(true)
        setChannelMessages((messages) => [
          ...messages,
          {
            messageType: messageObject.messageType,
            text: {
              type: 'TEXT',
              message: JSON.parse(messageObject.text).message.body,
            },
            senderId,
            timestamp: messagePros.serverReceivedTs,
          },
        ])
        setNotificationState({
          open: true,
          uid: senderId,
          type: messageType,
          content: JSON.parse(messageObject.text).message.body,
        })
        releaseNotification()
      } else if (messageType === 'COMMAND') {
        const { command_category, command_method, body } = JSON.parse(
          messageObject.text,
        ).message
        HandleCommand(
          command_category,
          command_method,
          body,
          senderId,
          sendCommandToSpecificUser,
        )
      }
    })

    client.on('MessageFromPeer', (messageObject, senderId) => {
      const messageType = JSON.parse(messageObject.text).type
      if (messageType === 'COMMAND') {
        const { command_category, command_method, body } = JSON.parse(
          messageObject.text,
        ).message
        HandleCommand(
          command_category,
          command_method,
          body,
          senderId,
          sendCommandToSpecificUser,
        )
      }
    })

    client.on('ConnectionStateChanged', (newState) => {
      if (newState === 'ABORTED') {
        setNotificationState({
          open: true,
          uid: null,
          type: 'CLASS_END',
          content: 'Multiple login detected, your session here will end',
        })
        releaseNotification()
      }
      setIsJoined(false)
    })

    channel.on('MemberJoined', () => {
      if (authState.role !== 'T') return
      if (giveAVPermissionToStudent) {
        sendCommandToChannel('AGORA', 'CONTROLS_GRANTED')
      } else {
        sendCommandToChannel('AGORA', 'CONTROLS_REVOKED')
      }
    })

    return () => {
      if (!channel || !client) return
      channel.removeAllListeners()
    }
  }, [channel, client, setChannelMessages, giveAVPermissionToStudent])
  return {
    login,
    createChannelAndJoin,
    leaveChannel,
    sendMessage,
    channelMessages,
    logout,
    sendCommandToSpecificUser,
    sendCommandToChannel,
    channel,
    isJoined,
  }
}
