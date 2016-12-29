import * as types from '../constants/ActionTypes';

const initialState = {
  heading : "",
  body : ""
}



export default function map(state = initialState, action) {
  switch (action.type) {

    case types.SET_FEATURE_INFO:
      const newHeading = state.heading;
      const newBody = state.body;

      return {
        heading : newHeading,
        body : newBody
      }
    case types.HOVER_FEATURE_INFO:
      const test = state.heading;

      return {
        heading : test
      }

    default:
      return state;
  }
}
