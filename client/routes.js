import React, {Component} from 'react'
import {connect} from 'react-redux'
import {withRouter, Route, Switch} from 'react-router-dom'
import PropTypes from 'prop-types'
import {
  Login,
  Signup,
  Polls,
  SinglePoll,
  CreatePoll,
  Clubs,
  SingleClub,
  JoinClub,
  Sidebar,
  Messages,
  ClubMembers,
  ClubBooks,
  CreateClub,
  Meetings
} from './components'

import {me} from './store'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    paddingTop: 96, // Navbar height + 32
    paddingBottom: theme.spacing.unit * 4,
    paddingLeft: 272, // Sidebar width + 32,
    paddingRight: theme.spacing.unit * 4
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
    const {isLoggedIn, invitePending, classes} = this.props

    return (
      <div>
        {isLoggedIn && !invitePending ? (
          <Switch>
            <Route exact path="/createclub" component={CreateClub} />
            <Route exact path="/clubs" component={Clubs} />
            {/* Sidebar is scoped to a single club */}
            <Route path="/clubs/:clubId" component={Sidebar} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route
              exact
              path="/clubs/:clubId/join/:hash"
              component={JoinClub}
            />
          </Switch>
        )}
        <main className={classes.root}>
          <Switch>
            {/* Routes placed here are available to all visitors */}

            {isLoggedIn && (
              <Switch>
                {/* Routes placed here are only available after logging in */}
                <Route
                  exact
                  path="/clubs/:clubId/messages"
                  component={Messages}
                />
                <Route exact path="/clubs/:clubId" component={SingleClub} />
                <Route
                  exact
                  path="/clubs/:clubId/books"
                  component={ClubBooks}
                />
                <Route exact path="/clubs/:clubId/polls" component={Polls} />
                <Route
                  exact
                  path="/clubs/:clubId/members"
                  component={ClubMembers}
                />
                <Route
                  exact
                  path="/clubs/:clubId/polls/create"
                  component={CreatePoll}
                />
                <Route
                  exact
                  path="/clubs/:clubId/polls/:pollId"
                  component={SinglePoll}
                />
                <Route
                  exact
                  path="/clubs/:clubId/meetings"
                  component={Meetings}
                />
              </Switch>
            )}
            {/* Displays our Login component as a fallback */}
            {/* <Route component={Login} /> */}
          </Switch>
        </main>
      </div>
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
    isLoggedIn: !!state.user.id,
    invitePending: !!state.user.inviteLink
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
