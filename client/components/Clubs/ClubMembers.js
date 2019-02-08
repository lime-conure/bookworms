import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {fetchClubMembers} from '../../store'

import Typography from '@material-ui/core/Typography'
import Divider from '@material-ui/core/Divider'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'
import Avatar from '@material-ui/core/Avatar'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    flexGrow: 1,
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 24,
    marginRight: theme.spacing.unit * 24
  },
  bigAvatar: {
    margin: 10,
    width: 90,
    height: 90
  }
})

export class ClubMembers extends Component {
  componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchClubMembers(clubId)
  }

  render() {
    const {classes} = this.props
    const members = this.props.members
    return (
      <div>
        <Typography variant="h3" component="h3">
          Members
        </Typography>
        <Divider />
        <List>
          {members.length
            ? members.map(member => (
                <div key={member.id}>
                  <ListItem
                    button
                    component={Link}
                    to={member.id === this.props.userId ? '/profile' : '#'}
                  >
                    <ListItemIcon>
                      <Avatar
                        src={member.imageUrl}
                        className={classes.bigAvatar}
                      />
                    </ListItemIcon>
                    <ListItemText>
                      <Typography variant="h6" component="h6">
                        {member.firstName} {member.lastName}
                      </Typography>
                      <Typography variant="subtitle1" component="p">
                        {member.email}
                      </Typography>
                    </ListItemText>
                  </ListItem>
                </div>
              ))
            : ''}
        </List>
      </div>
    )
  }
}

const StyledClubMembers = withStyles(styles)(ClubMembers)
const mapState = state => ({
  members: state.clubMembers,
  userId: state.user.id
})

const mapDispatch = dispatch => ({
  fetchClubMembers: clubId => dispatch(fetchClubMembers(clubId))
})

export default connect(mapState, mapDispatch)(StyledClubMembers)
