import axios from 'axios'

const FAKE_USER_ID = 1

/**
 * ACTION TYPES
 */
const GET_SINGLE_POLL = 'GET_SINGLE_POLL'
const INCREMENT_VOTES = 'INCREMENT_VOTES'

/**
 * INITIAL STATE
 */
const defaultPoll = {
  poll: {},
  // allOptions is an array of option objects:
  // { option: { id: 1,... }, numVotes: 1, votes: [{ userId: 1 }] }
  allOptions: []
}

/**
 * ACTION CREATORS
 */
const getSinglePoll = poll => ({
  type: GET_SINGLE_POLL,
  poll
})

const updateOptionVotes = optionIds => ({
  type: INCREMENT_VOTES,
  optionIds
})

/**
 * THUNK CREATORS
 */
export const fetchSinglePoll = (clubId, pollId) => async dispatch => {
  try {
    const {data} = await axios.get(`/api/clubs/${clubId}/polls/${pollId}`)
    dispatch(getSinglePoll(data || defaultPoll))
  } catch (err) {
    console.error(err)
  }
}

export const sendVotes = (clubId, pollId, votes) => async dispatch => {
  try {
    const {data} = await axios.put(`/api/clubs/${clubId}/polls/${pollId}`, {
      votes
    })
    dispatch(updateOptionVotes(data))
  } catch (err) {
    console.log(err)
  }
}

// optionIds = [3, 6]
const voteForOptions = (state, optionIds) => {
  return state.allOptions.map(optionObj => {
    if (optionIds.includes(optionObj.option.id)) {
      const voteUserIds = optionObj.votes.map(vote => vote.userId)
      // prevent users from voting multiple times for the same option
      if (!voteUserIds.includes(FAKE_USER_ID)) {
        optionObj.numVotes++
        optionObj.votes.push({userId: FAKE_USER_ID})
      }
    }
    return optionObj
  })
}

/**
 * REDUCER
 */
export default function(state = defaultPoll, action) {
  switch (action.type) {
    case GET_SINGLE_POLL: {
      return action.poll
    }
    case INCREMENT_VOTES: {
      // action.optionIds is an array of optionIds that you voted for
      // e.g. [3, 6]
      const updatedOptions = voteForOptions({...state}, action.optionIds)
      return {...state, allOptions: updatedOptions}
    }
    default:
      return state
  }
}
