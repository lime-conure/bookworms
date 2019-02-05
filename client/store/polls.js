import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_POLLS = 'GET_POLLS'
const REMOVE_POLL = 'REMOVE_POLL'

/**
 * INITIAL STATE
 */
const defaultPolls = []

/**
 * ACTION CREATORS
 */
const getPolls = polls => ({
  type: GET_POLLS,
  polls
})

const removePoll = pollId => ({
  type: REMOVE_POLL,
  pollId
})

/**
 * THUNK CREATORS
 */
export const fetchPolls = clubId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/polls`)
    dispatch(getPolls(data || defaultPolls))
  } catch (err) {
    console.error(err)
  }
}

export const deletePoll = (clubId, pollId) => async dispatch => {
  try {
    await axios.put(`/api/clubs/${clubId}/polls/delete`, {
      pollId
    })
    dispatch(removePoll(pollId))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultPolls, action) {
  switch (action.type) {
    case GET_POLLS:
      return action.polls
    case REMOVE_POLL:
      return state.filter(poll => poll.id !== action.pollId)
    default:
      return state
  }
}
