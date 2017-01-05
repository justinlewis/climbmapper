import React from 'react';
import {render} from 'react-dom';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { createStore, renderDevTools } from './utils/devTools';
const enhancers = window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()


import * as mapReducers from './reducers/MapState';
import * as feautureInfoReducers from './reducers/FeatureInfoState';
import routeType from './reducers/TypeReducer';

const allReducers = Object.assign({}, mapReducers, feautureInfoReducers, routeType);
const reducer = combineReducers(allReducers);
const store = createStore(reducer, enhancers);

import AppContainerComponent from './AppContainer.jsx';


class App extends React.Component {
  render () {
    return <AppContainerComponent/>
  }
}

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  document.getElementById('app')
);
