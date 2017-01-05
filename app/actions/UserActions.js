import * as types from '../constants/ActionTypes';

export const clickFeature = (feature) => {
  return {
    type: types.CLICK_FEATURE,
    feature
  };
}

export const filterByRouteType = (routeTypeFilterText) => {
  return {
    type: types.SET_FILTER,
    routeType: routeTypeFilterText,
  };
}
