import * as types from '../constants/ActionTypes';

export function loadMap() {
  return {
    type: types.LOAD_MAP
  };
}

export function loadData() {
  return {
    type: types.LOAD_DATA
  };
}

export function setFeatureInfo(info) {
  return {
    type: types.SET_FEATURE_INFO,
    info
  };
}
