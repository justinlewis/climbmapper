import * as types from '../constants/ActionTypes';

const initialState = {
  center: [0, 0]
}



export default function map(state = initialState, action) {

  switch (action.type) {
    case types.LOAD_MAP:
      const newMapCenter = [1, 1]; // TODO: this should be the extent of the data
      return {
        center: newMapCenter
      }

    default:
      return state;
  }
}
