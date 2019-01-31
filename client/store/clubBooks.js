import axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_CLUB_BOOKS = 'GET_CLUB_BOOKS'
const ADD_CLUB_BOOK = 'ADD_CLUB_BOOK'

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

const addClubBook = book => ({
  type: ADD_CLUB_BOOK,
  book
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

export const postClubBook = (book, clubId) => async dispatch => {
  try {
    const {data} = await axios.post(`/api/clubs/${clubId}/books/add`, book)
    dispatch(addClubBook(data))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = clubBooks, action) {
  switch (action.type) {
    case GET_CLUB_BOOKS:
      return action.books
    case ADD_CLUB_BOOK:
      return [...state.books, action.book]
    default:
      return state
  }
}
