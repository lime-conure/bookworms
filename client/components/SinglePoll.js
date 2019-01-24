import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSinglePoll} from '../store'

const FAKE_CLUB_ID = 1

export class SinglePoll extends Component {
  constructor(props) {
    super(props)
  }

  componentDidMount() {
    console.log(this.props, 'this.props *******')
    const singlePollId = Number(this.props.match.params.pollId)
    console.log(singlePollId, 'singlePollId')
    this.props.fetchSinglePoll(FAKE_CLUB_ID, singlePollId)
  }

  render() {
    const singlePoll = this.props.singlePoll
    if (singlePoll) {
      return (
        <div>
          <h2>{singlePoll.title}</h2>
        </div>
      )
    } else {
      return <div>Loading...</div>
    }
  }
}

const mapState = state => ({
  singlePoll: state.polls.singlePoll
})

const mapDispatch = dispatch => ({
  fetchSinglePoll: (clubId, pollId) => dispatch(fetchSinglePoll(clubId, pollId))
})

export default connect(mapState, mapDispatch)(SinglePoll)
