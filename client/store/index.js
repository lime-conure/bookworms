import {createStore, combineReducers, applyMiddleware} from 'redux'
import createLogger from 'redux-logger'
import thunkMiddleware from 'redux-thunk'
import {composeWithDevTools} from 'redux-devtools-extension'
import user from './user'
import polls from './polls'
import newPoll from './newPoll'
import singlePoll from './singlePoll'

const reducer = combineReducers({user, polls, newPoll, singlePoll})
const middleware = composeWithDevTools(
  applyMiddleware(thunkMiddleware, createLogger({collapsed: true}))
)
const store = createStore(reducer, middleware)

export default store
export * from './user'
export * from './polls'
export * from './newPoll'
export * from './singlePoll'
