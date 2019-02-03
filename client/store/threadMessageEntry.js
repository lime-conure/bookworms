import axios from 'axios'
const initState = []
const WRITE_THREAD_MESSAGE = 'WRITE_THREAD_MESSAGE'

export const writeThreadMessage = (message, clubId, threadId) => ({
  type: WRITE_THREAD_MESSAGE,
  message,
  clubId,
  threadId
})

const threadMessageEntry = (state = initState, action) => {
  switch (action.type) {
    case WRITE_THREAD_MESSAGE:
      if (
        state.length &&
        state.some(
          entry =>
            entry.clubId === action.clubId && entry.threadId === action.threadId
        )
      ) {
        console.log('inside thread message entry')
        return state.filter(entry => {
          if (
            entry.clubId === action.clubId &&
            entry.threadId === action.threadId
          )
            entry.message = action.message
          return entry
        })
      } else
        return [
          ...state,
          {
            message: action.message,
            clubId: action.clubId,
            threadId: action.threadId
          }
        ]

    default:
      return state
  }
}

export default threadMessageEntry
