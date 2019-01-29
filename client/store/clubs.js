import axios from 'axios'

/**
 * ACTION TYPES
 */

const GET_CLUBS = 'GET_CLUBS'
const LEAVE_CLUBS = 'LEAVE_CLUBS'

/**
 * INITIAL STATE
 */
const allClubs = []

/**
 * ACTION CREATORS
 */
const getClubs = allClubs => ({
  type: GET_CLUBS,
  allClubs
})

const leavingClub = clubId => ({
  type: LEAVE_CLUBS,
  clubId
})
/**
 * THUNK CREATORS
 */

export const fetchClubs = () => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs`)
    dispatch(getClubs(data))
  } catch (err) {
    console.log(err)
  }
}

export const leaveClub = clubId => async dispatch => {
  try {
    const {data} = await axios.post(`/api/clubs/${clubId}/deletemember`)
    dispatch(leavingClub(clubId))
  } catch (err) {
    console.log(err)
  }
}

/**
 * REDUCER
 */

export default function(state = allClubs, action) {
  switch (action.type) {
    case GET_CLUBS:
      return action.allClubs
    case LEAVE_CLUBS:
      return state.filter(club => {
        if (club.id !== action.clubId) {
          return club
        }
      })
    default:
      return state
  }
}
