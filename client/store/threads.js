import axios from 'axios'
import {writeInputMessage} from './messageEntry'
const initState = {
  threads: [],
  singleThread: {},
  open: false
}

const GET_MESSAGES = 'GET_MESSAGES'
const WRITE_MESSAGE = 'WRITE_MESSAGE'
const getMessages = messages => ({
  type: GET_MESSAGES,
  messages
})
const GET_THREAD = 'GET_THREAD'
const TOGGLE_OPEN = 'TOGGLE_OPEN'
const ADD_MESSAGE_TO_THREAD = 'ADD_MESSAGE_TO_THREAD'

const getThread = thread => ({
  type: GET_THREAD,
  thread
})
const addMessageToThread = (message, threadId) => ({
  type: ADD_MESSAGE_TO_THREAD,
  message,
  threadId
})

export const toggleOpen = open => ({
  type: TOGGLE_OPEN,
  open
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
export const fetchThread = (clubId, threadId) => {
  return async dispatch => {
    const {data} = await axios.get(`/api/clubs/${clubId}/threads/${threadId}`)
    dispatch(getThread(data))
  }
}
export const postToThread = (message, clubId, threadId, socket) => {
  return async dispatch => {
    console.log('socket', socket)
    try {
      const {data} = await axios.post(
        `/api/clubs/${clubId}/threads/${threadId}`,
        message
      )
      dispatch(addMessageToThread(data, threadId))
      //need Jing's advice
      socket.emit('NEW_THREAD', {data, threadId})
    } catch (err) {
      console.error(err)
    }
  }
}

const threads = (state = initState, action) => {
  switch (action.type) {
    case GET_MESSAGES:
      return {...state, threads: action.messages}
    case WRITE_MESSAGE:
      return {...state, threads: [...state.threads, action.message]}
    case GET_THREAD:
      return {...state, singleThread: action.thread}
    case TOGGLE_OPEN:
      return {...state, open: action.open}
    case ADD_MESSAGE_TO_THREAD:
      return {
        ...state,
        threads: state.threads.filter(thread => {
          if (thread.id === action.threadId)
            thread.messages = [...thread.messages, action.message]
          return thread
        }),
        singleThread: {
          ...state.singleThread,
          messages: [...state.singleThread.messages, action.message]
        }
      }
    default:
      return state
  }
}
export default threads
