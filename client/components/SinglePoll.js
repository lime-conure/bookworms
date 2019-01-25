import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSinglePoll, sendVotes} from '../store'

const FAKE_USER_ID = 1

export class SinglePoll extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
  }

  componentDidMount() {
    const singlePollId = Number(this.props.match.params.pollId)
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchSinglePoll(clubId, singlePollId)
  }
  handleSubmit(event) {
    event.preventDefault()
    const singlePollId = Number(this.props.match.params.pollId)
    const clubId = Number(this.props.match.params.clubId)
    const bookVote = event.target.bookOptions
      ? event.target.bookOptions.value
      : null
    const timeVote = event.target.timeOptions
      ? event.target.timeOptions.value
      : null
    const locationVote = event.target.locationOptions
      ? event.target.locationOptions.value
      : null
    const votes = []
    if (bookVote) {
      votes.push(Number(bookVote))
    }
    if (timeVote) {
      votes.push(Number(timeVote))
    }
    if (locationVote) {
      votes.push(Number(locationVote))
    }
    this.props.sendVotes(clubId, singlePollId, votes)
  }

  optionIsChecked(optionObj) {
    if (optionObj.votes.map(vote => vote.userId).includes(FAKE_USER_ID)) {
      return true
    }
  }

  // eslint-disable-next-line complexity
  render() {
    const poll = this.props.singlePoll.poll
    const allOptions = this.props.singlePoll.allOptions
    const bookOptions = allOptions.filter(
      optionObj => optionObj.option.type === 'book'
    )
    const timeOptions = allOptions.filter(
      optionObj => optionObj.option.type === 'time'
    )
    const locationOptions = allOptions.filter(
      optionObj => optionObj.option.type === 'location'
    )

    if (poll) {
      return (
        <div>
          <Link to={`/clubs/${this.props.match.params.clubId}/polls/`}>
            ← Back to all polls
          </Link>
          <h2>{poll.title}: </h2>
          <h3>{poll.notes}</h3>
          <p>
            <em>
              {poll.dueDate ? (
                <span>Poll ends on {poll.dueDate.slice(0, 10)}</span>
              ) : (
                ''
              )}
            </em>
          </p>
          <form onSubmit={this.handleSubmit}>
            {bookOptions && bookOptions.length ? (
              <div>
                <h4>Book Options:</h4>
                <div className="options">
                  {bookOptions.map(optionObj => (
                    <div key={optionObj.option.id}>
                      <p>Votes: {optionObj.numVotes}</p>
                      <input
                        value={optionObj.option.id}
                        defaultChecked={
                          this.optionIsChecked(optionObj) ? 'checked' : ''
                        }
                        type="radio"
                        name="bookOptions"
                      />
                      <label>{optionObj.option.bookName}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ''
            )}
            {timeOptions && timeOptions.length ? (
              <div>
                <h4>Date/Time Options:</h4>
                <div className="options">
                  {timeOptions.map(optionObj => (
                    <div key={optionObj.option.id}>
                      <p>Votes: {optionObj.numVotes}</p>
                      <input
                        value={optionObj.option.id}
                        type="radio"
                        name="timeOptions"
                      />
                      <label>{optionObj.option.dateTime}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ''
            )}
            {locationOptions && locationOptions.length ? (
              <div>
                <h4>Location Options:</h4>
                <div className="options">
                  {locationOptions.map(optionObj => (
                    <div key={optionObj.option.id}>
                      <p>Votes: {optionObj.numVotes}</p>
                      <input
                        value={optionObj.option.id}
                        type="radio"
                        name="locationOptions"
                      />
                      <label>{optionObj.option.location}</label>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              ''
            )}
            <button type="submit">Submit vote</button>
          </form>
        </div>
      )
    } else {
      return <div>Loading...</div>
    }
  }
}

const mapState = state => ({
  singlePoll: state.singlePoll
})

const mapDispatch = dispatch => ({
  fetchSinglePoll: (clubId, pollId) =>
    dispatch(fetchSinglePoll(clubId, pollId)),
  sendVotes: (clubId, pollId, votes) =>
    dispatch(sendVotes(clubId, pollId, votes))
})

export default connect(mapState, mapDispatch)(SinglePoll)
