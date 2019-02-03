import axios from 'axios'
import {writeInputMessage} from './messageEntry'

const GET_MESSAGES = 'GET_MESSAGES'
const WRITE_MESSAGE = 'WRITE_MESSAGE'
const getMessages = messages => ({
  type: GET_MESSAGES,
  messages
})

export const writeMessage = message => ({
  type: WRITE_MESSAGE,
  message
})

export const fetchMessages = () => {
  return async dispatch => {
    try {
      let {data} = await axios.get(`/api/threads`)

      if (data.length) {
        data = data.sort((a, b) => {
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
        })
      }
      console.log(data, 'data')
      dispatch(getMessages(data))
    } catch (err) {
      console.error(err)
    }
  }
}

export const postMessage = (message, clubId, socket) => {
  return async dispatch => {
    try {
      const {data} = await axios.post(`/api/clubs/${clubId}/threads`, message)
      dispatch(await writeInputMessage('', clubId))
      dispatch(writeMessage(data))
      socket.emit('NEW_MESSAGE', data)
    } catch (err) {
      console.error(err)
    }
  }
}

const threads = (state = [], action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return action.messages
    case WRITE_MESSAGE:
      return [...state, action.message]
    default:
      return state
  }
}
export default threads
