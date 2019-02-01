import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchMeetings} from '../store/meetings'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
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
        <Typography variant="h3" color="primary">
          Meetings
        </Typography>
        <Divider />
        <List>
          {meetings.length
            ? meetings.map(meeting => (
                <ListItem key={meeting.id}>
                  <ListItemText>
                    <Typography variant="h5">
                      {meeting.name}
                      {meeting.location}
                      {meeting.date}
                    </Typography>
                  </ListItemText>
                </ListItem>
              ))
            : ''}
        </List>
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
