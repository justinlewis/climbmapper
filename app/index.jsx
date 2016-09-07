import React from 'react';
import {render} from 'react-dom';
import { combineReducers } from 'redux';
import { Provider } from 'react-redux';

import { createStore, renderDevTools } from './utils/devTools';

import * as mapReducers from './reducers/MapState';
import * as feautureInfoReducers from './reducers/FeatureInfoState';

const allReducers = Object.assign({}, mapReducers, feautureInfoReducers);
const reducer = combineReducers(allReducers);
const store = createStore(reducer);

import AppContainerComponent from './AppContainer.jsx';


class App extends React.Component {
  render () {
    return <AppContainerComponent/>
  }
}

render(<App/>, document.getElementById('app'));
