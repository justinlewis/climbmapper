import * as types from '../constants/ActionTypes';

export function clickFeature(feature) {  
  return {
    type: types.CLICK_FEATURE,
    feature
  };
}