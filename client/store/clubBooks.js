import axios from 'axios'
/**
 * ACTION TYPES
 */
const GET_CLUB_BOOKS = 'GET_CLUB_BOOKS'
const ADD_CLUB_BOOK = 'ADD_CLUB_BOOK'
const REMOVE_CLUB_BOOK = 'REMOVE_CLUB_BOOK'

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

const removeClubBook = (bookId, bookType) => ({
  type: REMOVE_CLUB_BOOK,
  bookId,
  bookType
})

/**
 * THUNK CREATORS
 */

export const fetchClubBooks = clubId => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/books`)
    const formatedData = data.map(book => ({
      ...book.book,
      clubs_books: book.clubs_books
    }))
    dispatch(getClubBooks(formatedData))
  } catch (err) {
    console.log(err)
  }
}

export const postClubBook = (book, type, clubId) => async dispatch => {
  try {
    const {data} = await axios.post(`/api/clubs/${clubId}/books/add`, {
      book,
      type
    })
    if (data.id) {
      dispatch(
        addClubBook({
          ...data,
          clubs_books: {type},
          authors: book.authors || [book.author]
        })
      )
    }
  } catch (err) {
    console.log(err)
  }
}

export const deleteClubBook = (bookId, type, clubId) => async dispatch => {
  try {
    await axios.put(`/api/clubs/${clubId}/books/delete`, {
      bookId,
      type
    })
    dispatch(removeClubBook(bookId, type))
  } catch (err) {
    console.log(err)
  }
}

export default function(state = clubBooks, action) {
  switch (action.type) {
    case GET_CLUB_BOOKS:
      return action.books
    case ADD_CLUB_BOOK:
      return [...state, action.book]
    case REMOVE_CLUB_BOOK:
      return state.filter(
        book =>
          !(
            book.id === action.bookId &&
            book.clubs_books.type === action.bookType
          )
      )

    default:
      return state
  }
}
