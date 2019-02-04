import React from 'react'
import {connect} from 'react-redux'
import {Link} from 'react-router-dom'
import PropTypes from 'prop-types'
import {auth} from '../store'
import socket from '../socket'

// Material UI
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'
import Textfield from '@material-ui/core/TextField'
import FormHelperText from '@material-ui/core/FormHelperText'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import red from '@material-ui/core/colors/red'

const styles = theme => ({
  root: {
    padding: theme.spacing.unit * 8,
    marginTop: theme.spacing.unit * 16,
    marginLeft: theme.spacing.unit * 36,
    marginRight: theme.spacing.unit * 36
  },
  form: {
    marginTop: theme.spacing.unit * 4
  },
  errorMessage: {
    marginTop: 0,
    color: red.A200,
    fontSize: '14px'
  }
})

/**
 * COMPONENT
 */
const AuthForm = props => {
  const {name, displayName, handleSubmit, error, classes} = props

  return (
    <Paper className={classes.root} elevation={2}>
      <Typography variant="h3" component="h3" gutterBottom>
        {/* Log In To Bookworms or Sign Up For Bookworms */}
        {displayName} {name === 'login' ? 'To' : 'For'} Bookworms
      </Typography>
      <form
        onSubmit={evt => handleSubmit(evt, props)}
        name={name}
        className={classes.form}
      >
        <Grid container spacing={24} justify="flex-start" alignItems="center">
          {name === 'signup' ? (
            <Grid item xs={12}>
              {' '}
              <Textfield
                name="fullName"
                label="Your Name"
                variant="filled"
                type="text"
                fullWidth
                autoFocus={name === 'signup'}
                required
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
          ) : (
            ''
          )}
          <Grid item xs={6}>
            <Textfield
              name="email"
              label="Your Email Address"
              variant="filled"
              type="text"
              fullWidth
              autoFocus={name === 'login'}
              InputLabelProps={{
                shrink: true
              }}
              required
            />
          </Grid>
          <Grid item xs={6}>
            <Textfield
              name="password"
              label="Your Password"
              variant="filled"
              type="password"
              fullWidth
              required
              autoComplete="current-password"
              InputLabelProps={{
                shrink: true
              }}
            />
          </Grid>
          <Grid item>
            <Button
              type="submit"
              color="secondary"
              variant="contained"
              size="large"
              className={classes.button}
            >
              {displayName}
            </Button>
          </Grid>
          <Grid item>
            <Button
              type="submit"
              color="primary"
              variant="contained"
              size="large"
              href="/auth/google"
              className={classes.button}
            >
              {displayName} with Google
            </Button>
          </Grid>
          <Grid item>
            <Typography variant="subtitle2" component="p" color="inherit">
              <FormHelperText component="span" className={classes.errorMessage}>
                {error && error.response && error.response.data}
              </FormHelperText>
            </Typography>
          </Grid>
        </Grid>
      </form>
    </Paper>
  )
}

const StyledAuthForm = withStyles(styles)(AuthForm)

/**
 * CONTAINER
 *   Note that we have two different sets of 'mapStateToProps' functions -
 *   one for Login, and one for Signup. However, they share the same 'mapDispatchToProps'
 *   function, and share the same Component. This is a good example of how we
 *   can stay DRY with interfaces that are very similar to each other!
 */
const mapLogin = state => {
  return {
    name: 'login',
    displayName: 'Log In',
    error: state.user.error,
    inviteLink: state.user.inviteLink
  }
}

const mapSignup = state => {
  return {
    name: 'signup',
    displayName: 'Sign Up',
    error: state.user.error,
    inviteLink: state.user.inviteLink
  }
}

const mapDispatch = dispatch => {
  return {
    handleSubmit(evt, props) {
      evt.preventDefault()
      const formName = evt.target.name
      const email = evt.target.email.value
      const password = evt.target.password.value
      let fullName
      if (evt.target.fullName) {
        fullName = evt.target.fullName.value
      }

      dispatch(auth(email, password, fullName, formName, socket))
      if (props.inviteLink) props.history.push(props.inviteLink)
      else props.history.push('/clubs')
    }
  }
}

export const Login = connect(mapLogin, mapDispatch)(StyledAuthForm)
export const Signup = connect(mapSignup, mapDispatch)(StyledAuthForm)

/**
 * PROP TYPES
 */
AuthForm.propTypes = {
  name: PropTypes.string.isRequired,
  displayName: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  error: PropTypes.object
}
