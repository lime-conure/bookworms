import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchClubMembers} from '../store'
import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'

export class ClubMembers extends Component {
  componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchClubMembers(clubId)
  }

  render() {
    const members = this.props.members
    return (
      <div>
        <Typography variant="h3" gutterBottom color="primary">
          Members
        </Typography>
        <Divider />
        <List>
          {members.length
            ? members.map(member => (
                <ListItem button key={member.userId}>
                  {/* TODO: link these to user profiles */}
                  <ListItemIcon>
                    <img className="profile-picture" src={member.imageUrl} />
                  </ListItemIcon>
                  <ListItemText>
                    <Typography variant="h5">
                      {member.firstName} {member.lastName}
                      <br />
                      {member.email}
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
  members: state.clubMembers
})

const mapDispatch = dispatch => ({
  fetchClubMembers: clubId => dispatch(fetchClubMembers(clubId))
})

export default connect(mapState, mapDispatch)(ClubMembers)
