import * as types from '../constants/ActionTypes';

const initialState = {
  heading : "",
  body : ""
}

export default function featureInfo(state = initialState, action) {
  switch (action.type) {

    // TODO: I think SET_FEATURE_INFO and HOVER_FEATURE_INFO do the same thing. check and consolidate if possible
    case types.SET_FEATURE_INFO:
      const newHeading = state.heading;
      const newBody = state.body;

      return {
        heading : newHeading,
        body : newBody
      }
    case types.HOVER_FEATURE_INFO:
      var info = "";
      var areaInfo = {};
      if(action.info){
        info = action.info.feature.properties.area;
        areaInfo = action.info.feature.properties;
      }

      return {
        heading : info,
        areaInfo : areaInfo
      }
    case types.CLICK_FEATURE_INFO:
      var layers = [];
      if(action.info){
        layers = action.info;
      }

      return {
        layers : layers
      }

    default:
      return state;
  }
}
