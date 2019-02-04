import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchMeetings} from '../store/meetings'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  root: {
    flexGrow: 1,
    maxWidth: 752
  },
  demo: {
    backgroundColor: theme.palette.background.paper
  },
  title: {
    margin: `${theme.spacing.unit * 4}px 0 ${theme.spacing.unit * 2}px`
  }
})

class Meetings extends Component {
  state = {
    dense: false,
    secondary: false
  }
  componentDidMount() {
    const clubId = this.props.match.params.clubId
    this.props.fetchMeetings(clubId)
  }
  render() {
    let meetings = this.props.meetings
    console.log(meetings[0], '****')
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
                    <Typography variant="h5" color="secondary">
                      {meeting.name.toUpperCase()}
                      <br />
                    </Typography>
                    <Typography variant="h6">
                      <Icon>location</Icon> Location: {meeting.location}
                      <br />
                      Date: {meeting.date.slice(0, 10)}
                      <br />
                      Time: {meeting.date.slice(11, 16)}
                      <br />
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
