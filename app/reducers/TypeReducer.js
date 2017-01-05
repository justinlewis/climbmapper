import * as types from '../constants/ActionTypes';

export default function routeType(state = {}, action) {
  switch (action.type) {
    case 'TRAD_FILTER':
      return Object.assign({}, state, routeType: 'TRAD')
    case 'SPORT_FILTER':
      return Object.assign({}, state, routeType: 'SPORT')
    case 'ALPINE_FILTER':
      return Object.assign({}, state, routeType: 'ALPINE')
    case 'BOULDER_FILTER':
      return Object.assign({}, state, routeType: 'BOULDER')
    default:
      return state;
  }
}
