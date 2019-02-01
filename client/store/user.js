import axios from 'axios'
import history from '../history'

/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'
const INVITE_USER = 'INVITE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {
  inviteLink: ''
}

/**
 * ACTION CREATORS
 */
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})
export const inviteUser = inviteLink => ({type: INVITE_USER, inviteLink})

/**
 * THUNK CREATORS
 */
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
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
    socket.emit('LOGIN', res.data.id) //user should join all existing clubRooms
  } catch (dispatchOrHistoryErr) {
    console.error(dispatchOrHistoryErr)
  }
}

export const logout = (userId, socket) => async dispatch => {
  try {
    await axios.post('/auth/logout')
    socket && socket.emit('LOGOUT', userId) //user should be removed from all clubRooms
    dispatch(removeUser())
    history.push('/login')
  } catch (err) {
    console.error(err)
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
    default:
      return state
  }
}
