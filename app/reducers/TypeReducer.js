import * as types from '../constants/ActionTypes';

export default function routeType(state = {}}, action) {
  switch (action.type) {
    case 'TRAD':
      return Object.assign({}, state, routeType: 'TRAD')
    case 'SPORT':
      return Object.assign({}, state, routeType: 'SPORT')
    case 'ALPINE':
      return Object.assign({}, state, routeType: 'ALPINE')
    case 'BOULDER':
      return Object.assign({}, state, routeType: 'BOULDER')
    default:
      return state;
  }
}
