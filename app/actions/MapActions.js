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

export function setGlobalTickData(ticks) {
  return {
    type: types.SET_GLOBAL_TICK_DATA,
    ticks
  }
}

export function setFeatureInfo(info) {
  return {
    type: types.SET_FEATURE_INFO,
    info
  };
}

export function clickFeatureInfo(info) {
  return {
    type: types.CLICK_FEATURE_INFO,
    info
  };
}

export function hoverFeatureInfo(info) {
  return {
    type: types.HOVER_FEATURE_INFO,
    info
  };
}
