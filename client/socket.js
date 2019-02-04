import io from 'socket.io-client'
import store, {writeMessage, addMessageToThread} from './store'
import push from 'push.js'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('NEW_MESSAGE', message => {
  console.log('Received NEW_MESSGE', message)
  store.dispatch(writeMessage(message))
  push.create('New Message!', {
    body: `You have a new message from ${message.userId} in Club ${
      message.clubId
    }`,
    icon: '',
    timeout: 4000,
    onClick: () => {
      window.focus()
      this.close()
    }
  })
})
socket.on('NEW_THREAD', message => {
  console.log('Received NEW_THREAD', message)
  store.dispatch(addMessageToThread(...message))
  push.create('New Message!', {
    body: `You have a new message from ${message.data.userId} in Club ${
      message.data.clubId
    }`,
    icon: '',
    timeout: 4000,
    onClick: () => {
      window.focus()
      this.close()
    }
  })
})

export default socket
