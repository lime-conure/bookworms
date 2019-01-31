import io from 'socket.io-client'
//import store, {gotNewMessage} from './store'
import push from 'push.js'

const socket = io(window.location.origin)

socket.on('connect', () => {
  console.log('Connected!')
})

socket.on('NEW_MESSAGE', message => {
  //store.dispatch(gotNewMessage(message))
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
