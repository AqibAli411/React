import { applyMiddleware, combineReducers, createStore } from "redux";
import { thunk } from "redux-thunk";
import accountReducer from "./features/accounts/AccountSlice";
import customerReducer from "./features/customers/CustomerSlice";
import { composeWithDevTools } from "@redux-devtools/extension";
//names provided to the reducers are the named by which the respective states would be accessed
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

const store = createStore(
  rootReducer,
  composeWithDevTools(applyMiddleware(thunk))
);

export default store;

//by passing the thunk to applyMiddleware we inform redux that a middleware is required
//to include the dev tools provided by redux we use composeWithDevTools