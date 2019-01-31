import axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_CLUB_BOOKS = 'GET_CLUB_BOOKS'

/**
 * INITIAL STATE
 */
const clubBooks = []

/**
 * ACTION CREATORS
 */
const getClubBooks = books => ({
  type: GET_CLUB_BOOKS,
  books
})

/**
 * THUNK CREATORS
 */

export const fetchClubBooks = clubId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/books`)
    dispatch(getClubBooks(data))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = clubBooks, action) {
  switch (action.type) {
    case GET_CLUB_BOOKS:
      return action.books
    default:
      return state
  }
}
