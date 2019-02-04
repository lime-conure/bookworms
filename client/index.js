import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux'
import {Router} from 'react-router-dom'
import history from './history'
import store from './store'
import App from './app'
import {MuiThemeProvider, createMuiTheme} from '@material-ui/core/styles'
import {lime, grey} from '@material-ui/core/colors'
const theme = createMuiTheme({
  palette: {
    type: 'dark',
    secondary: lime
  },
  typography: {
    fontFamily: ['Lato', 'Arial', 'sans-serif'].join(','),
    button: {
      fontWeight: 700,
      letterSpacing: 0.6,
      lineHeight: 1.7
    },
    h2: {
      // fontWeight: 300,
      // letterSpacing: 0.6,
      // textTransform: 'uppercase',
      // lineHeight: '5.625rem'
      fontFamily: 'Cutive'
    },
    h3: {
      fontFamily: 'Cutive'
    },
    h4: {
      fontFamily: 'Cutive',
      lineHeight: 'normal'
    },
    h5: {
      // fontFamily: 'Cutive'
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
        maxWidth: 200,
        backgroundColor: grey[900]
      }
    },
    MuiListItemIcon: {
      root: {
        marginRight: 0
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
