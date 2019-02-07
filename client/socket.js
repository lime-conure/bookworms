import io from 'socket.io-client'
import store, {writeMessage, addMessageToThread} from './store'
import push from 'push.js'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('NEW_MESSAGE', message => {
  store.dispatch(writeMessage(message.message))
  push.create('🐛🐛', {
    body: `${
      message.message.messages[0].user.fullName
    } posted a message in Club ${message.clubName}`,
    icon: '',
    timeout: 4000,
    onClick: () => {
      window.focus()
      this.close()
    }
  })
})
socket.on('NEW_THREAD', message => {
  store.dispatch(addMessageToThread(message.data, message.threadId))
  push.create('🐛🐛', {
    body: `${message.data.user.fullName} posted a reply in Club ${
      message.clubName
    }`,
    icon: '',
    timeout: 10000,
    onClick: () => {
      window.focus()
      this.close()
    }
  })
})

export default socket
