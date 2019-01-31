import axios from 'axios'
const initState = []

const WRITE_INPUT_MESSAGE = 'WRITE_INPUT_MESSAGE'

export const writeInputMessage = (message, clubId) => {
  console.log('in write message')
  return {
    type: WRITE_INPUT_MESSAGE,
    message,
    clubId
  }
}

const messageEntry = (state = initState, action) => {
  switch (action.type) {
    case WRITE_INPUT_MESSAGE:
      if (state.length && state.some(entry => entry.clubId === action.clubId)) {
        return state.filter(entry => {
          if (entry.clubId === action.clubId) entry.message = action.message
          return entry
        })
      }
      return [...state, {message: action.message, clubId: action.clubId}]

    default:
      return state
  }
}

export default messageEntry
