import 'babel-polyfill'
import { fetchTagsIfNeeded } from './actions/groups'
import { Provider } from 'react-redux'
import configureStore from './store/configureStore'

// import createBrowserHistory from 'history/lib/createBrowserHistory'
import { createBrowserHistory } from 'react-router'

import createRoutes from './routes'
import DeviceProvider from './components/DeviceProvider'
import MobileDetect from 'mobile-detect'
import React from 'react'
import ReactDOM from 'react-dom'

/* global __REDUX_STATE__ */
// const history = createBrowserHistory()
const history = createBrowserHistory

let reduxState
if (window.__REDUX_STATE__) {
  try {
    reduxState = JSON.parse(unescape(__REDUX_STATE__))
  } catch (e) {
    reduxState = ''
  }
  let md = new MobileDetect(window.navigator.userAgent)
  if (md.tablet()) {
    reduxState.device = 'tablet'
  } else if (md.mobile()) {
    reduxState.device = 'mobile'
  } else {
    reduxState.device = 'desktop'
  }
}

const store = configureStore(reduxState)

// preload the tag ids by tag names
const tags = [ 'hp-projects', 'review', 'feature' ]
store.dispatch(fetchTagsIfNeeded(tags))

const device = store.getState().device
ReactDOM.render((
  <Provider store={store}>
    <DeviceProvider device={device}>
      { createRoutes(history) }
    </DeviceProvider>
  </Provider>
), document.getElementById('root'))
