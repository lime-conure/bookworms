import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_MEETINGS = 'GET_MEETINGS'

/**
 * INITIAL STATE
 */
const meetings = []

/**
 * ACTION CREATORS
 */

const getMeetings = meetings => ({
  type: GET_MEETINGS,
  meetings
})

/**
 * THUNK CREATORS
 */

export const fetchMeetings = clubId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/meetings`)
    dispatch(getMeetings(data))
  } catch (err) {
    console.log(err)
  }
}

/**
 * REDUCER
 */

export default function(state = meetings, action) {
  switch (action.type) {
    case GET_MEETINGS:
      return action.meetings
    default:
      return state
  }
}
