import accountReducer from "./features/accounts/AccountSlice";
import customerReducer from "./features/customers/CustomerSlice";

//wraps the createStore adding special functionalities
//adds thunk, reducers and developers tools  
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer : {
    account: accountReducer,
    customer: customerReducer
  }
});


export default store;

//by passing the thunk to applyMiddleware we inform redux that a middleware is required
//to include the dev tools provided by redux we use composeWithDevTools
