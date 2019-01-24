import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_POLLS = 'GET_POLLS'
const GET_SINGLE_POLL = 'GET_SINGLE_POLL'

/**
 * INITIAL STATE
 */
const initialState = {
  allPolls: [],
  singlePoll: {}
}

/**
 * ACTION CREATORS
 */
const getPolls = allPolls => ({
  type: GET_POLLS,
  allPolls
})

const getSinglePoll = singlePoll => ({
  type: GET_SINGLE_POLL,
  singlePoll
})

/**
 * THUNK CREATORS
 */
export const fetchPolls = clubId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/polls`)
    dispatch(getPolls(data || initialState.allPolls))
  } catch (err) {
    console.error(err)
  }
}

export const fetchSinglePoll = (clubId, pollId) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/polls/${pollId}`)
    dispatch(getSinglePoll(data || initialState.singlePoll))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = initialState, action) {
  switch (action.type) {
    case GET_POLLS:
      return {...state, allPolls: action.allPolls}
    case GET_SINGLE_POLL:
      return {...state, singlePoll: action.singlePoll}
    default:
      return state
  }
}
