import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchSinglePoll, sendVotes} from '../store'

const FAKE_USER_ID = 1

export class SinglePoll extends Component {
  constructor(props) {
    super(props)
    // local state for keeping track of which checkbox options are selected
    this.state = {
      votes: []
    }
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCheck = this.handleCheck.bind(this)
  }

  componentDidMount() {
    const singlePollId = Number(this.props.match.params.pollId)
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchSinglePoll(clubId, singlePollId)
  }
  handleCheck(id) {
    this.setState(prevState => ({
      votes: [...prevState.votes, Number(id)]
    }))
  }
  handleSubmit(event) {
    event.preventDefault()
    const singlePollId = Number(this.props.match.params.pollId)
    const clubId = Number(this.props.match.params.clubId)
    this.props.sendVotes(clubId, singlePollId, this.state.votes)
  }

  optionIsChecked(optionObj) {
    if (optionObj.votes.map(vote => vote.userId).includes(FAKE_USER_ID)) {
      return true
    } else return false
  }
  renderPoll(options, type) {
    const columnName =
      type === 'Book'
        ? 'bookName'
        : type === 'Date/Time' ? 'dateTime' : 'location'
    if (options && options.length) {
      return (
        <div>
          <h4>{type} Options:</h4>
          <div className="options">
            {options.map(optionObj => (
              <div key={optionObj.option.id}>
                <p>Votes: {optionObj.numVotes}</p>
                <input
                  value={optionObj.option.id}
                  defaultChecked={
                    this.optionIsChecked(optionObj) ? 'checked' : ''
                  }
                  onChange={() => this.handleCheck(optionObj.option.id)}
                  type="checkbox"
                  name="options"
                />
                <label>{optionObj.option[columnName]}</label>
                {this.optionIsChecked(optionObj) ? (
                  <small>
                    <em>You voted for this</em>
                  </small>
                ) : (
                  ''
                )}
              </div>
            ))}
          </div>
        </div>
      )
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
            {this.renderPoll(bookOptions, 'Book')}
            {this.renderPoll(timeOptions, 'Date/Time')}
            {this.renderPoll(locationOptions, 'Location')}
            <button type="submit" disabled={!this.state.votes.length}>
              Submit vote
            </button>
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
