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
  UserProfile,
  Meetings,
  CreateMeeting,
  ClubProgress,
  AboutUs
} from './components'

import {me} from './store'
import socket from './socket'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  root: {
    paddingTop: 128, // Navbar height (80) + 48
    paddingBottom: theme.spacing.unit * 4,
    paddingLeft: 322, // Sidebar width + 32,
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
            <Route exact path="/about" component={AboutUs} />
            <Route exact path="/createclub" component={CreateClub} />
            <Route exact path="/profile" component={UserProfile} />
            <Route exact path="/clubs" component={Clubs} />
            {/* Sidebar is scoped to a single club */}
            <Route path="/clubs/:clubId" component={Sidebar} />
            {/* Display Clubs component as a fallback for any other logged in routes*/}
            <Route component={Clubs} />
          </Switch>
        ) : (
          <Switch>
            <Route exact path="/about" component={AboutUs} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/signup" component={Signup} />
            <Route
              exact
              path="/clubs/:clubId/join/:hash"
              component={JoinClub}
            />
            {/* Display Login component as a fallback for any other looged out routes */}
            <Route component={Login} />
          </Switch>
        )}

        <Switch>
          {isLoggedIn && (
            <div>
              <Switch>
                {/* Logged in routes that have sidebar */}
                <main className={classes.root}>
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
                    path="/clubs/:clubId/createpoll"
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
                  <Route
                    exact
                    path="/clubs/:clubId/createmeeting"
                    component={CreateMeeting}
                  />
                  <Route
                    exact
                    path="/clubs/:clubId/progress"
                    component={ClubProgress}
                  />
                </main>
              </Switch>
            </div>
          )}
        </Switch>
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
      dispatch(me(socket))
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
