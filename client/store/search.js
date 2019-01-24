import axios from 'axios'

/**
 * ACTION TYPES
 */
const GET_BOOKS = 'GET_BOOKS'

/**
 * INITIAL STATE
 */
const defaultBooks = []

/**
 * ACTION CREATORS
 */
const getBooks = books => ({
  type: GET_BOOKS,
  books
})

/**
 * THUNK CREATORS
 */
export const fetchBooks = () => async dispatch => {
  try {
    const {data} = await axios.get('/api/books')
    dispatch(getBooks(data || defaultBooks))
  } catch (err) {
    console.error(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultBooks, action) {
  switch (action.type) {
    case GET_BOOKS:
      return action.books
    default:
      return state
  }
}
