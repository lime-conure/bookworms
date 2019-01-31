import axios from 'axios'

const GET_MESSAGES = 'GET_MESSAGES'
const WRITE_MESSAGE = 'WRITE_MESSAGE'
const getMessages = messages => ({
  type: GET_MESSAGES,
  messages
})

const writeMessage = message => ({
  type: WRITE_MESSAGE,
  message
})

export const fetchMessages = clubId => {
  return async dispatch => {
    try {
      const {data} = await axios.get(`/api/clubs/${clubId}/messages`)
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
