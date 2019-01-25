import axios from 'axios'

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
    console.log('option ids of votes from server: ', data)
  } catch (err) {
    console.log(err)
  }
}

const voteForOptions = (state, optionIds) => {
  const updatedOptions = optionIds.map(optionId => {
    const updatedOption = state.allOptions.filter(
      optionObj => optionObj.option.id === optionId
    )[0]
    updatedOption.votes++
    return updatedOption
  })
  return updatedOptions
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
      const updatedOptions = voteForOptions(...state, action.optionIds)
      console.log('UPDATED OPTIONS: ', updatedOptions)
      return {...state, allOptions: updatedOptions}
    }
    default:
      return state
  }
}
