import React, {Component} from 'react'
import {connect} from 'react-redux'

//Material UI
import {withStyles} from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Typography from '@material-ui/core/Typography'
import Grid from '@material-ui/core/Grid'
import Avatar from '@material-ui/core/Avatar'
import Button from '@material-ui/core/Button'

export default class AboutUs extends Component {
  render() {
    return (
      <div>
        <Paper>
          <Typography variant="caption" component="h6">
            "Our goal is to help you organize your reading life"
          </Typography>
        </Paper>
      </div>
    )
  }
}
