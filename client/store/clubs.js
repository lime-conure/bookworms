import axios from 'axios'

/**
 * ACTION TYPES
 */

const GET_CLUBS = 'GET_CLUBS'

/**
 * INITIAL STATE
 */
const clubs = []

/**
 * ACTION CREATORS
 */
const getClubs = clubs => ({
  type: GET_CLUBS,
  clubs
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

export default function(state = clubs, action) {
  switch (action.type) {
    case GET_CLUBS:
      return action.clubs
    default:
      return state
  }
}
