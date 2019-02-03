import axios from 'axios'
import writeThreadMessage from './threadMessageEntry'
const initState = {
  open: false,
  thread: {}
}
const GET_THREAD = 'GET_THREAD'
const TOGGLE_OPEN = 'TOGGLE_OPEN'
const ADD_MESSAGE_TO_THREAD = 'ADD_MESSAGE_TO_THREAD'
const getThread = thread => ({
  type: GET_THREAD,
  thread
})
const addMessageToThread = message => ({
  type: ADD_MESSAGE_TO_THREAD,
  message
})

export const toggleOpen = open => ({
  type: TOGGLE_OPEN,
  open
})

export const fetchThread = (clubId, threadId) => {
  return async dispatch => {
    const {data} = await axios.get(`/api/clubs/${clubId}/threads/${threadId}`)
    console.log(data, 'thread fetched')
    dispatch(getThread(data))
  }
}
export const postToThread = (message, clubId, threadId, socket) => {
  return async dispatch => {
    try {
      console.log('in thunk', clubId, 'clubId', threadId, 'threadId')
      const {data} = await axios.post(
        `/api/clubs/${clubId}/threads/${threadId}`,
        message
      )

      dispatch(addMessageToThread(data))
      //need Jing's advice
      // socket.emit('NEW_MESSAGE', data)
    } catch (err) {
      console.error(err)
    }
  }
}

const singleThread = (state = initState, action) => {
  switch (action.type) {
    case GET_THREAD:
      return {...state, thread: action.thread}
    case TOGGLE_OPEN:
      return {...state, open: action.open}
    case ADD_MESSAGE_TO_THREAD:
      return {
        ...state,
        thread: {
          ...state.thread,
          name: action.message.text,
          messages: [...state.thread.messages, action.message]
        }
      }
    default:
      return state
  }
}
export default singleThread
