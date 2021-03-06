import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */

const GET_CLUBS = 'GET_CLUBS'
const LEAVE_CLUB = 'LEAVE_CLUB'
const CREATE_NEW_CLUB = 'CREATE NEW CLUB'

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
  type: LEAVE_CLUB,
  clubId
})

const createClub = newClub => ({
  type: CREATE_NEW_CLUB,
  newClub
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
    history.push('/clubs')
  } catch (err) {
    console.log(err)
  }
}

export const createNewClub = () => async dispatch => {
  try {
    const {data} = await axios.post('/api/clubs/create')
    dispatch(createClub(data))
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
    case CREATE_NEW_CLUB:
      return [...state, action.newClub]
    case LEAVE_CLUB:
      return state.filter(club => {
        if (club.id !== action.clubId) {
          return club
        }
      })
    default:
      return state
  }
}
