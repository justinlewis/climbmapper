import * as types from '../constants/ActionTypes';

const initialState = {
  heading : "",
  body : ""
}

export default function featureInfo(state = initialState, action) {
  switch (action.type) {

    case types.SET_FEATURE_INFO:
      const newHeading = state.heading;
      const newBody = state.body;

      return {
        heading : newHeading,
        body : newBody
      }
    case types.HOVER_FEATURE_INFO:
      return {
        heading : action.info.feature.properties.area,
        areaInfo : action.info.feature.properties
      }

    default:
      return state;
  }
}
