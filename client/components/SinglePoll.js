import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSinglePoll, sendVotes} from '../store'

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

  render() {
    const singlePoll = this.props.singlePoll
    if (singlePoll) {
      return (
        <div>
          <h2>{singlePoll.title}</h2>
          <h3>{singlePoll.notes}</h3>
          <form onSubmit={this.handleSubmit}>
            {singlePoll.bookOptions && singlePoll.bookOptions.length ? (
              <div>
                <h4>Book Options:</h4>
                <div className="options">
                  {singlePoll.bookOptions.map(optionObj => (
                    <div key={optionObj.option.id}>
                      <p>Votes: {optionObj.votes}</p>
                      <input
                        value={optionObj.option.id}
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
            {singlePoll.timeOptions && singlePoll.timeOptions.length ? (
              <div>
                <h4>Date/Time Options:</h4>
                <div className="options">
                  {singlePoll.timeOptions.map(optionObj => (
                    <div key={optionObj.option.id}>
                      <p>Votes: {optionObj.votes}</p>
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
            {singlePoll.locationOptions && singlePoll.locationOptions.length ? (
              <div>
                <h4>Location Options:</h4>
                <div className="options">
                  {singlePoll.locationOptions.map(optionObj => (
                    <div key={optionObj.option.id}>
                      <p>Votes: {optionObj.votes}</p>
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
