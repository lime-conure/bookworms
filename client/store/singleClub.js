import axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_SINGLE_CLUB = 'GET_SINGLE_CLUB'

/**
 * INITIAL STATE
 */
const singleClub = {}

/**
 * ACTION CREATORS
 */
const getSingleClub = club => ({
  type: GET_SINGLE_CLUB,
  club
})

/**
 * THUNK CREATORS
 */

export const fetchSingleClub = clubId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}`)
    dispatch(getSingleClub(data))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = singleClub, action) {
  switch (action.type) {
    case GET_SINGLE_CLUB:
      return action.club
    default:
      return state
  }
}
