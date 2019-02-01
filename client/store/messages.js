import axios from 'axios'
import socket from '../socket'

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
      const {data} = await axios.get(`/api/messages`)
      console.log(data, 'data')
      dispatch(getMessages(data))
    } catch (err) {
      console.error(err)
    }
  }
}
export const postMessage = (message, clubId) => {
  return async dispatch => {
    try {
      const {data} = await axios.post(`/api/clubs/${clubId}/messages`, message)
      dispatch(writeMessage(data))
      socket.emit('NEW_MESSAGE', data)
    } catch (err) {
      console.error(err)
    }
  }
}

const messages = (state = [], action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return action.messages
    case WRITE_MESSAGE:
      return [...state, action.message]
    default:
      return state
  }
}
export default messages
