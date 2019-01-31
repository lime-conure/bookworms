import axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_CLUB_MEMBERS = 'GET_CLUB_MEMBERS'

/**
 * INITIAL STATE
 */
const clubMembers = []

/**
 * ACTION CREATORS
 */
const getClubMembers = members => ({
  type: GET_CLUB_MEMBERS,
  members
})

/**
 * THUNK CREATORS
 */

export const fetchClubMembers = clubId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/users`)
    dispatch(getClubMembers(data))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = clubMembers, action) {
  switch (action.type) {
    case GET_CLUB_MEMBERS:
      return action.members
    default:
      return state
  }
}
