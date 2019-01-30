import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {green, lime} from '@material-ui/core/colors'
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    primary: green,
    secondary: lime
  }
})

// establishes socket connection
import './socket'

ReactDOM.render(
  <MuiThemeProvider theme={theme}>
    <Provider store={store}>
      <Router history={history}>
        <App />
      </Router>
    </Provider>
  </MuiThemeProvider>,
  document.getElementById('app')
)
