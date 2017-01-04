import * as types from '../constants/ActionTypes';

export const clickFeature = (feature) => {
  return {
    type: types.CLICK_FEATURE,
    feature
  };
}

export const filterByRouteType = (data) => {
  return {
    type: types.TRAD_FILTER,
    data
  };
}
