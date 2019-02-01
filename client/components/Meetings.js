import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchMeetings} from '../store/meetings'

import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import {ClubMembers} from './ClubMembers'

class Meetings extends Component {
  componentDidMount() {
    const clubId = this.props.match.params.clubId
    this.props.fetchMeetings(clubId)
  }
  render() {
    let meetings = this.props.meetings
    return (
      <div>
        {meetings.length
          ? meetings.map(meeting => (
              <h3 key={meeting.id}>
                {meeting.name}
                {meeting.location}
                {meeting.date}
              </h3>
            ))
          : ''}
      </div>
    )
  }
}

const mapState = state => ({
  meetings: state.meetings,
  userId: state.user.id
})

const mapDispatch = dispatch => ({
  fetchMeetings: clubId => dispatch(fetchMeetings(clubId))
})

export default connect(mapState, mapDispatch)(Meetings)
