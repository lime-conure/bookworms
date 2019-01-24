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
  singlePoll: state.singlePoll
})

const mapDispatch = dispatch => ({
  fetchSinglePoll: (clubId, pollId) => dispatch(fetchSinglePoll(clubId, pollId))
})

export default connect(mapState, mapDispatch)(SinglePoll)
