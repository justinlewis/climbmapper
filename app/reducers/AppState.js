import * as types from '../constants/ActionTypes';

const initialState = {
  visible : false
}

export default function featureInfo(state = initialState, action) {
  switch (action.type) {

    case types.CLOSE_MODAL:
      return {
        // Nothing to set right now
      }

    default:
      return state;
  }
}
