// src/redux/reducers.js
const initialState = {
    auth: false
    // Define your initial state here
  };
  
  const Reducer = (state = initialState, action) => {
    switch (action.type) {
      // Define your action types and corresponding state changes here
      case "Auth":
        return{...state, auth: true}
      default:
        return state;
    }
  };
  
  export default Reducer;
  