import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {withStyles} from '@material-ui/core/styles'
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core'
import {white} from '@material-ui/core/colors'

const styles = {
  root: {
    flexGrow: 1
  },
  grow: {
    flexGrow: 1,
    color: white
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  }
}

function Navbar({handleClick, isLoggedIn, userId, classes}) {
  return (
    <div className={classes.root}>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" className={classes.grow}>
            Bookworms &nbsp;&nbsp; 📖 🐛
          </Typography>
          {isLoggedIn ? (
            <div>
              {/* The navbar will show these links after you log in */}
              <Button component={Link} to="/clubs">
                Clubs
              </Button>
              <Button component={Link} to="/profile">
                Profile
              </Button>
              <Button onClick={() => handleClick(userId)}>Logout</Button>
            </div>
          ) : (
            <div>
              {/* The navbar will show these links before you log in */}
              <Button component={Link} to="/login">
                Log In
              </Button>
              <Button component={Link} to="/signup">
                Sign Up
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
    </div>
  )
}

const materialNavbar = withStyles(styles)(Navbar)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    isLoggedIn: !!state.user.id,
    userId: state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    handleClick(userId) {
      dispatch(logout(userId))
    }
  }
}

export default connect(mapState, mapDispatch)(materialNavbar)

/**
 * PROP TYPES
 */
Navbar.propTypes = {
  handleClick: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
