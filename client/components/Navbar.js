import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import {logout} from '../store'
import {withStyles} from '@material-ui/core/styles'
import {AppBar, Toolbar, Typography, Button} from '@material-ui/core'
import {white} from '@material-ui/core/colors'
import DropDownClubs from './Clubs/DropDownClubs'
import socket from '../socket'

const styles = theme => ({
  root: {
    flexGrow: 1
  },
  navBar: {
    paddingTop: theme.spacing.unit,
    paddingBottom: theme.spacing.unit
  },
  logo: {
    color: '#fff',
    paddingLeft: theme.spacing.unit,
    paddingRight: theme.spacing.unit,
    // 960px or smaller
    [theme.breakpoints.down('md')]: {
      fontSize: '1.5rem'
    },
    '&:hover': {
      textDecoration: 'none'
    }
  },
  grow: {
    flexGrow: 1,
    color: white
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  desktopNav: {
    display: 'flex'
  }
})

function Navbar({handleClick, isLoggedIn, userId, classes}) {
  return (
    <div className={classes.root}>
      <AppBar className={classes.navBar}>
        <Toolbar>
          <Typography variant="h4" component="h4" className={classes.grow}>
            <span style={{transform: 'scale (1, -1)'}}>🐛</span>
            <Link to="/" className={classes.logo}>
              Bookworms
            </Link>
            🐛
          </Typography>
          {isLoggedIn ? (
            <div className={classes.desktopNav}>
              <Button component={Link} to="/about">
                About
              </Button>
              <Button component={Link} to="/profile">
                Profile
              </Button>
              <DropDownClubs />
              <Button onClick={() => handleClick(userId)}>Logout</Button>
            </div>
          ) : (
            <div>
              <Button component={Link} to="/about">
                About
              </Button>
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
      dispatch(logout(userId, socket))
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
