import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_POLLS = 'GET_POLLS'

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

/**
 * REDUCER
 */
export default function(state = defaultPolls, action) {
  switch (action.type) {
    case GET_POLLS:
      return action.polls
    default:
      return state
  }
}
