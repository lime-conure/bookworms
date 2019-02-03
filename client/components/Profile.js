import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import UserBooks from './UserBooks'

import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Divider from '@material-ui/core/Divider'
import Button from '@material-ui/core/Button'
import Typography from '@material-ui/core/Typography'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import Icon from '@material-ui/core/Icon'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    padding: theme.spacing.unit * 4,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 24,
    marginRight: theme.spacing.unit * 24
  },
  button: {
    marginTop: theme.spacing.unit * 4
  }
})

class Profile extends Component {
  render() {
    const {classes} = this.props
    const user = this.props.user
    return (
      <Paper className={classes.root} elevation={2}>
        <div>
          <img src={user.imageUrl} alt={user.fullName} />
          <Typography variant="h3" component="h3" gutterBottom>
            {user.fullName}
          </Typography>
          <Divider />
          <UserBooks />
        </div>
      </Paper>
    )
  }
}

const StyledProfile = withStyles(styles)(Profile)

const mapState = state => ({
  user: state.user
})

export default connect(mapState)(StyledProfile)
