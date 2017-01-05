import * as types from '../constants/ActionTypes';

export default function routeType(state = {}, action) {
  switch (action.type) {
    case 'SET_FILTER':
    console.log(action)
      return Object.assign({}, state, {routeType: action.routeType})
    default:
      return state;
  }
}
