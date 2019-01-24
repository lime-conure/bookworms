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
          <div className="options">
            <p>Votes: 2</p>
            <input type="radio" name="options" />
            <label>Friday</label>
            <p>Votes: 8</p>
            <input type="radio" name="options" />
            <label>Saturday</label>
            <p>Votes: 3</p>
            <input type="radio" name="options" />
            <label>Sunday</label>
          </div>
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
