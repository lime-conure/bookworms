import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_MEETINGS = 'GET_MEETINGS'
const CREATE_MEETING = 'CREATE_MEETING'
const REMOVE_MEETING = 'REMOVE_MEETING'

/**
 * INITIAL STATE
 */
const defaultMeetings = []

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

const removeClubMeeting = meetingId => ({
  type: REMOVE_MEETING,
  meetingId
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

export const deleteMeeting = (clubId, meetingId) => async dispatch => {
  try {
    console.log(`about to delete meeting ${meetingId} for club ${clubId}`)
    await axios.put(`/api/clubs/${clubId}/meetings/delete`, {
      meetingId
    })
    dispatch(removeClubMeeting(meetingId))
  } catch (err) {
    console.log(err)
  }
}

/**
 * REDUCER
 */

export default function(state = defaultMeetings, action) {
  switch (action.type) {
    case GET_MEETINGS:
      return action.meetings
    case CREATE_MEETING:
      return [...state, action.newMeeting]
    case REMOVE_MEETING:
      return state.filter(meeting => meeting.id !== action.meetingId)
    default:
      return state
  }
}
