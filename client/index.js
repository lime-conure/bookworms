import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {lime} from '@material-ui/core/colors'
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: lime
  },
  typography: {
    fontFamily: ['Lato', 'Arial', 'sans-serif'].join(','),
    // button: {
    //   fontFamily: 'Roboto',
    //   fontWeight: 500
    // },
    h2: {
      fontFamily: 'Cutive'
    },
    h3: {
      fontFamily: 'Cutive'
    },
    h5: {
      fontFamily: 'Cutive',
      lineHeight: 'normal'
    },
    h6: {
      fontFamily: 'Cutive'
    }
  },

  zIndex: {
    appBar: 1300 // makes sure top navbar always sits above sidebar
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontFamily: 'Roboto',
        fontSize: '12px',
        maxWidth: 200
      }
    }
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
