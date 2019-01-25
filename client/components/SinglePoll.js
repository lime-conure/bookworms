import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSinglePoll} from '../store'

export class SinglePoll extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const singlePollId = Number(this.props.match.params.pollId)
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchSinglePoll(clubId, singlePollId)
  }
  handleClick() {
    console.log('you clicked')
  }

  render() {
    const singlePoll = this.props.singlePoll
    if (singlePoll) {
      return (
        <div>
          <h2>{singlePoll.title}</h2>
          <h3>{singlePoll.notes}</h3>
          {singlePoll.bookOptions && singlePoll.bookOptions.length ? (
            <div>
              <h4>Book Options:</h4>
              <div className="options">
                {singlePoll.bookOptions.map((option, i) => (
                  <div key={option.id}>
                    <p>Votes: {option.votes}</p>
                    <input type="radio" name="options" />
                    <label>{option.option.bookName}</label>
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
                {singlePoll.timeOptions.map(option => (
                  <div key={option.id}>
                    <p>Votes: {option.votes}</p>
                    <input type="radio" name="options" />
                    <label>{option.option.dateTime}</label>
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
                {singlePoll.locationOptions.map(option => (
                  <div key={option.id}>
                    <p>Votes: {option.votes}</p>
                    <input type="radio" name="options" />
                    <label>{option.option.location}</label>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            ''
          )}
          <button type="submit" onClick={this.handleClick}>
            Submit vote
          </button>
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
  fetchSinglePoll: (clubId, pollId) => dispatch(fetchSinglePoll(clubId, pollId))
})

export default connect(mapState, mapDispatch)(SinglePoll)
