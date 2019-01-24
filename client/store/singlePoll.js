import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_SINGLE_POLL = 'GET_SINGLE_POLL'

/**
 * INITIAL STATE
 */
const defaultPoll = {}

/**
 * ACTION CREATORS
 */
const getSinglePoll = poll => ({
  type: GET_SINGLE_POLL,
  poll
})

/**
 * THUNK CREATORS
 */
export const fetchSinglePoll = (clubId, pollId) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/polls/${pollId}`)
    dispatch(getSinglePoll(data || defaultPoll))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultPoll, action) {
  switch (action.type) {
    case GET_SINGLE_POLL:
      return action.poll
    default:
      return state
  }
}
