import axios from 'axios'

/**
 * ACTION TYPES
 */

const GET_CLUBS = 'GET_CLUBS'

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

/**
 * REDUCER
 */

export default function(state = allClubs, action) {
  switch (action.type) {
    case GET_CLUBS:
      return action.allClubs
    default:
      return state
  }
}
