import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSingleClub} from '../store/singleClub'
import {Link} from 'react-router-dom'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'
import TextField from '@material-ui/core/TextField'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

const drawerWidth = 290

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
    marginTop: theme.spacing.unit * 4,
    fontSize: 24
  }
})

class Sidebar extends Component {
  state = {
    open: true
  }
  componentDidMount() {
    const clubId = Number(this.props.match.params.clubId)
    this.props.fetchSingleClub(clubId)
  }

  componentDidUpdate(prevProps, prevState) {
    const prevClubId = prevProps.match.params.clubId
    const clubId = this.props.match.params.clubId
    if (prevClubId !== clubId) this.props.fetchSingleClub(clubId)
  }

  handleClick = () => {
    this.setState(state => ({open: !state.open}))
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
          variant="subtitle1"
          className={classes.drawerHeader}
        >
          {club.name}
        </Typography>

        <List className={classes.drawerList}>
          <ListItem
            button
            component={Link}
            key="books"
            to={`/clubs/${club.id}/books`}
          >
            <ListItemIcon>
              <Icon>book</Icon>
            </ListItemIcon>
            <ListItemText>Books</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="meetings"
            to={`/clubs/${club.id}/meetings`}
          >
            <ListItemIcon>
              <Icon>event</Icon>
            </ListItemIcon>
            <ListItemText>Meetings</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="polls"
            to={`/clubs/${club.id}/polls`}
          >
            <ListItemIcon>
              <Icon>poll</Icon>
            </ListItemIcon>
            <ListItemText>Polls</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="messages"
            to={`/clubs/${club.id}/messages`}
          >
            <ListItemIcon>
              <Icon>message</Icon>
            </ListItemIcon>
            <ListItemText>Messages</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="members"
            to={`/clubs/${club.id}/members`}
          >
            <ListItemIcon>
              <Icon>group</Icon>
            </ListItemIcon>
            <ListItemText>Members</ListItemText>
          </ListItem>

          <ListItem button onClick={this.handleClick}>
            <ListItemIcon>
              <Icon>group_add</Icon>
            </ListItemIcon>
            <ListItemText>Invite Link</ListItemText>
            {this.state.open ? <ExpandLess /> : <ExpandMore />}
          </ListItem>
          <Collapse in={!this.state.open} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              <ListItem button className={classes.nested}>
                <TextField
                  id="outlined-bare"
                  className={classes.textField}
                  defaultValue={club.inviteLink}
                  margin="normal"
                  variant="outlined"
                />
              </ListItem>
            </List>
          </Collapse>
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
