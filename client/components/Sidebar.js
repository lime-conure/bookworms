import React, {Component} from 'react'
import {connect} from 'react-redux'
import {fetchSingleClub} from '../store/singleClub'
import {Link} from 'react-router-dom'
import {CopyToClipboard} from 'react-copy-to-clipboard'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Typography from '@material-ui/core/Typography'
import Drawer from '@material-ui/core/Drawer'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'
import Button from '@material-ui/core/Button'
import Collapse from '@material-ui/core/Collapse'
import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'
import Tooltip from '@material-ui/core/Tooltip'

const drawerWidth = 290

const styles = theme => ({
  root: {
    display: 'flex'
  },
  drawerPaper: {
    width: drawerWidth,
    top: 80 // Navbar height
  },
  drawerHeader: {
    padding: theme.spacing.unit * 2,
    marginTop: theme.spacing.unit * 4,
    textTransform: 'uppercase',
    fontWeight: 700,
    letterSpacing: '0.6px',
    fontSize: '1.25rem',
    lineHeight: '1.875rem',
    '&:hover': {
      color: '#c6ff00'
    }
  },
  navItem: {
    color: '#fff',
    '&:hover': {
      color: '#c6ff00'
    }
  },
  inviteLink: {
    color: '#fff'
  },
  inviteButton: {
    padding: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 3
  },
  inviteLinkText: {
    wordBreak: 'break-word',
    marginLeft: 0,
    marginRight: theme.spacing.unit * 2,
    textTransform: 'initial',
    textAlign: 'left',
    lineHeight: 1.25,
    letterSpacing: 'normal',
    '&:hover': {
      color: '#c6ff00'
    }
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
        <Link to={`/clubs/${club.id}`}>
          <Typography
            variant="h5"
            component="h5"
            className={classes.drawerHeader}
          >
            {club.name}
          </Typography>
        </Link>

        <List className={classes.drawerList}>
          <ListItem
            button
            component={Link}
            key="books"
            to={`/clubs/${club.id}/books`}
            className={classes.navItem}
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
            className={classes.navItem}
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
            className={classes.navItem}
          >
            <ListItemIcon>
              <Icon>poll</Icon>
            </ListItemIcon>
            <ListItemText>Meeting Polls</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="messages"
            to={`/clubs/${club.id}/messages`}
            className={classes.navItem}
          >
            <ListItemIcon>
              <Icon>message</Icon>
            </ListItemIcon>
            <ListItemText>Messages</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="progress"
            to={`/clubs/${club.id}/progress`}
            className={classes.navItem}
          >
            <ListItemIcon>
              <Icon>timeline</Icon>
            </ListItemIcon>
            <ListItemText>Progress</ListItemText>
          </ListItem>
          <ListItem
            button
            component={Link}
            key="members"
            to={`/clubs/${club.id}/members`}
            className={classes.navItem}
          >
            <ListItemIcon>
              <Icon>group</Icon>
            </ListItemIcon>
            <ListItemText>Members</ListItemText>
          </ListItem>

          <ListItem
            button
            key="inviteLink"
            onClick={this.handleClick}
            className={classes.navItem}
          >
            <ListItemIcon>
              <Icon>group_add</Icon>
            </ListItemIcon>
            <ListItemText>Invite Link</ListItemText>
            {this.state.open ? (
              <ExpandMore className={classes.inviteLink} />
            ) : (
              <ExpandLess className={classes.inviteLink} />
            )}
          </ListItem>
          <Collapse in={!this.state.open} timeout="auto" unmountOnExit>
            <CopyToClipboard text={club.inviteLink} className={classes.navItem}>
              <Tooltip placement="right" title="Copy Link to Clipboard">
                <Button className={classes.inviteButton}>
                  <Typography
                    variant="body2"
                    className={classes.inviteLinkText}
                  >
                    {club.inviteLink}
                  </Typography>
                  <Icon fontSize="small">file_copy</Icon>
                </Button>
              </Tooltip>
            </CopyToClipboard>
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
