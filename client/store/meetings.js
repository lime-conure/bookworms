import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_MEETINGS = 'GET_MEETINGS'
const CREATE_MEETING = 'CREATE_MEETING'

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

const createNewMeeting = newMeeting => ({
  type: CREATE_MEETING,
  newMeeting
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

export const createMeeting = clubId => async dispatch => {
  try {
    const {data} = await axios.post(`/api/clubs/${clubId}/meetings/create`)
    dispatch(createNewMeeting(data))
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
    case CREATE_MEETING:
      return [...state, action.newMeeting]
    default:
      return state
  }
}
