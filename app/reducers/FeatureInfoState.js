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

    default:
      return state;
  }
}
