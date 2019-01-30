import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSingleClub} from '../store/singleClub'

import {Link} from 'react-router-dom'
import {withStyles} from '@material-ui/core/styles'
import {
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  Typography
} from '@material-ui/core'

const drawerWidth = 240

const styles = theme => ({
  root: {
    display: 'flex'
  },

  drawerPaper: {
    width: drawerWidth,
    top: 64 // Navbar height
  },
  drawerHeader: {
    padding: theme.spacing.unit * 2,
    fontFamily: 'Roboto'
  }
})

class Sidebar extends Component {
  state = {}
  componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchSingleClub(clubId)
  }

  render() {
    const {classes} = this.props
    const club = this.props.singleClub

    return (
      <Drawer
        open
        variant="persistent"
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <Typography
          color="secondary"
          variant="h5"
          className={classes.drawerHeader}
        >
          {club.name}
        </Typography>
        <Divider />

        <List>
          <ListItem
            button
            component={Link}
            key="books"
            to={`/clubs/${club.id}/books`}
          >
            <ListItemText>Books</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="polls"
            to={`/clubs/${club.id}/polls`}
          >
            <ListItemText>Polls</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="messages"
            to={`/clubs/${club.id}/messages`}
          >
            <ListItemText>Messages</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="members"
            to={`/clubs/${club.id}/members`}
          >
            <ListItemText>Members</ListItemText>
          </ListItem>
        </List>
      </Drawer>
    )
  }
}
const StyledSidebar = withStyles(styles)(Sidebar)

const mapState = state => ({
  singleClub: state.singleClub
})

const mapDispatch = dispatch => ({
  fetchSingleClub: id => dispatch(fetchSingleClub(id))
})

export default connect(mapState, mapDispatch)(StyledSidebar)
