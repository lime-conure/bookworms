import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import polls from './polls'
import search from './search'
import singlePoll from './singlePoll'
import clubs from './clubs'
import singleClub from './singleClub'

const reducer = combineReducers({
  user,
  polls,
  search,
  singlePoll,
  clubs,
  singleClub
})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './polls'
export * from './search'
export * from './singlePoll'
export * from './clubs'
export * from './singleClub'
