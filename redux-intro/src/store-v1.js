import { combineReducers, createStore } from "redux";

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };
    
    default:
      return state;
  }
}


const initalStateCustomer = {
  fullname: "",
  nationalId: "",
  createdAt: "",
};
  
function customerReducer(state = initalStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullname: action.payload.fullname,
        nationalId: action.payload.nationalId,
        createdAt: action.payload.createdAt,
      };

    case "customer/updateName":
      return {
        ...state,
        fullname: action.payload,
      };
    default:
      return state;
  }
}


//names provided to the reducers are the named by which the respective states would be accessed
const rootReducer = combineReducers({
  account:accountReducer,
  customer: customerReducer,
});

//same as const[state, dispatch] = useReducer(reducer,initalState);
const store = createStore(rootReducer);


//works same as useReducer dispatch method
// store.dispatch({ type: "account/deposit", payload: 500 });
// store.dispatch({ type: "account/withdraw", payload: 200 });
// store.dispatch({
//   type: "account/requestLoan",
//   payload: { amount: 1000, purpose: "Buy a house" },
// });

// store.dispatch({type:"account/payLoad"});

//generates action object (just another standered)
//one action creater for one possible action

function deposit(amt) {
  return { type: "account/deposit", payload: amt };
}
function withdraw(amt) {
  return { type: "account/withdraw", payload: amt };
}
function requestLoan(amt, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount: amt, purpose: purpose },
  };
}
function payLoan() {
  return { type: "account/payLoad" };
}

store.dispatch(deposit(600));
store.dispatch(withdraw(200));
store.dispatch(requestLoan(1000, "buy a cheap car"));
store.dispatch(payLoan());


//action creater for customer
function createCustomer(fullname, nationalId) {
  return {
    type: "customer/createCustomer",
    payload: {
      fullname,
      nationalId,
      createdAt: new Date().toISOString(),
    },
  };
}

function updateName(fullname) {
  return {
    type: "customer/updateName",
    payload: fullname,
  };
}

//store basically is i think searching in both the reducers to match the action type
store.dispatch(createCustomer('Aqib Ali','3242134'));
store.dispatch(updateName('Alok Kumar'));



console.log(store.getState());

