import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const INVITE_USER = 'INVITE_USER'
const GET_USER_BOOKS = 'GET_USER_BOOKS'
const REMOVE_USER_BOOK = 'REMOVE_USER_BOOK'
const ADD_USER_BOOK = 'ADD_USER_BOOK'

/**
 * INITIAL STATE
 */
const defaultUser = {
  inviteLink: '',
  books: []
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
export const inviteUser = inviteLink => ({type: INVITE_USER, inviteLink})
const getUserBooks = books => ({type: GET_USER_BOOKS, books})
const addUserBook = book => ({type: ADD_USER_BOOK, book})
const removeUserBook = book => ({
  type: REMOVE_USER_BOOK,
  book
})
/**
 * THUNK CREATORS
 */
export const me = socket => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    // After login through Google Auth, join all associated clubRooms
    if (res.data.id) socket.emit('LOGIN', res.data.id)
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.error(err)
  }
}

export const auth = (
  email,
  password,
  fullName,
  method,
  socket
) => async dispatch => {
  let res
  try {
    res = await axios.post(`/auth/${method}`, {email, password, fullName})
  } catch (authError) {
    return dispatch(getUser({error: authError}))
  }

  try {
    dispatch(getUser(res.data))
    socket.emit('LOGIN', res.data.id) //user should join all associated clubRooms
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = (userId, socket) => async dispatch => {
  try {
    await axios.post('/auth/logout')
    socket && socket.emit('LOGOUT', userId) //user should leave all associated clubRooms
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
  }
}

export const fetchUserBooks = () => async dispatch => {
  try {
    const {data} = await axios.get(`/api/user/books`)
    const formatedData = data.map(book => ({
      ...book.book,
      users_books: book.users_books
    }))
    dispatch(getUserBooks(formatedData))
  } catch (err) {
    console.log(err)
  }
}

export const postUserBook = (book, type) => async dispatch => {
  try {
    const {data} = await axios.post(`/api/user/books/add`, {
      book,
      type
    })
    if (data.book) {
      dispatch(
        addUserBook({
          ...data.book,
          users_books: data.users_books,
          authors: book.authors || [book.author]
        })
      )
    }
  } catch (err) {
    console.log(err)
  }
}

export const deleteUserBook = book => async dispatch => {
  try {
    await axios.put(`/api/user/books/delete`, {
      book
    })
    dispatch(removeUserBook(book))
  } catch (err) {
    console.log(err)
  }
}

/**
 * REDUCER
 */
export default function(state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return {...state, ...action.user}
    case REMOVE_USER:
      return defaultUser
    case INVITE_USER:
      return {...state, ...{inviteLink: action.inviteLink}}
    case GET_USER_BOOKS:
      return {...state, ...{books: action.books}}
    case ADD_USER_BOOK:
      return {...state, ...{books: [action.book, ...state.books]}}
    case REMOVE_USER_BOOK:
      return {
        ...state,
        ...{
          books: state.books.filter(
            book =>
              !(
                book.id === action.book.id &&
                book.users_books.type === action.book.users_books.type &&
                (book.users_books.type === 'past'
                  ? book.users_books.endTime === action.book.users_books.endTime
                  : true)
              )
          )
        }
      }
    default:
      return state
  }
}
