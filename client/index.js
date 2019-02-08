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
    useNextVariants: true,
    fontFamily: ['Lato', 'Arial', 'sans-serif'].join(','),
    button: {
      fontWeight: 700,
      letterSpacing: 0.6,
      lineHeight: 1.7 // fontSize is 0.875rem
    },
    h2: {
      fontFamily: 'Cutive'
    },
    h3: {
      fontFamily: 'Cutive',
      lineHeight: '4.5rem' // fontSize is 3rem
    },
    h4: {
      fontFamily: 'Cutive',
      lineHeight: 'normal'
    },
    h6: {
      fontFamily: 'Cutive'
    },
    subtitle1: {
      fontWeight: 300,
      fontSize: '18px'
    }
  },

  zIndex: {
    appBar: 1300 // makes sure top navbar always sits above sidebar
  },
  overrides: {
    MuiTooltip: {
      tooltip: {
        fontSize: '13px',
        maxWidth: 200,
        backgroundColor: grey[900],
        textAlign: 'center'
      }
    },
    MuiListItemIcon: {
      root: {
        marginRight: 0,
        color: 'inherit',
        '&:hover': {
          color: 'inherit'
        }
      }
    },
    MuiListItemText: {
      primary: {
        color: 'inherit',
        '&:hover': {
          color: 'inherit'
        }
      }
    },
    MuiDialog: {
      paper: {
        padding: 18
      },
      paperWidthSm: {
        maxWidth: 736
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
