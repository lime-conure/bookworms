import io from 'socket.io-client'
import store, {writeMessage} from './store'
import push from 'push.js'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('NEW_MESSAGE', message => {
  console.log('get new message')
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

export default socket
