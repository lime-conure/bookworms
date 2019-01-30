import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  UserHome,
  Polls,
  SinglePoll,
  CreatePoll,
  Clubs,
  SingleClub
} from './components'
import {me} from './store'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2
  }
})

/**
 * COMPONENT
 */
class Routes extends Component {
  componentDidMount() {
    this.props.loadInitialData()
  }

  render() {
    const {isLoggedIn, classes} = this.props

    return (
      <main className={classes.root}>
        <Switch>
          {/* Routes placed here are available to all visitors */}
          <Route exact path="/clubs/:clubId/polls" component={Polls} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/signup" component={Signup} />
          <Route exact path="/clubs/:clubId/polls" component={Polls} />
          <Route
            exact
            path="/clubs/:clubId/polls/create"
            component={CreatePoll}
          />

          {isLoggedIn && (
            <Switch>
              {/* Routes placed here are only available after logging in */}
              <Route exact path="/clubs" component={Clubs} />
              <Route exact path="/clubs/:clubsId" component={SingleClub} />
              <Route
                exact
                path="/clubs/:clubId/polls/:pollId"
                component={SinglePoll}
              />
            </Switch>
          )}
          {/* Displays our Login component as a fallback */}
          <Route component={Login} />
        </Switch>
      </main>
    )
  }
}

const StyledRoutes = withStyles(styles)(Routes)

/**
 * CONTAINER
 */
const mapState = state => {
  return {
    // Being 'logged in' for our purposes will be defined has having a state.user that has a truthy id.
    // Otherwise, state.user will be an empty object, and state.user.id will be falsey
    isLoggedIn: !!state.user.id
  }
}

const mapDispatch = dispatch => {
  return {
    loadInitialData() {
      dispatch(me())
    }
  }
}

// The `withRouter` wrapper makes sure that updates are not blocked
// when the url changes
export default withRouter(connect(mapState, mapDispatch)(StyledRoutes))

/**
 * PROP TYPES
 */
Routes.propTypes = {
  loadInitialData: PropTypes.func.isRequired,
  isLoggedIn: PropTypes.bool.isRequired
}
