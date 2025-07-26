const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};

export default function accountReducer(state = initialStateAccount, action) {
  switch (action.type) {
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload, isLoading:false };
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

    case "account/convertingCurrency":
      return{
        ...state,
        isLoading:true,
      }

    default:
      return state;
  }
}

//generates action object (just another standered)
//one action creater for one possible action
export function deposit(amount, currency) {
  if (currency === "USD") return { type: "account/deposit", payload: amount };

  //if we return a function then redux knows that we want this function to run async
  //therefore we are dispatching a function instead of an object
  //this function would be called internally by react with two arrguments
  //dispatch function and currentState
  return function (dispatch, getState) {
    //api call
    dispatch({ type: "account/convertingCurrency" });
    fetch(
      `https://api.frankfurter.app/latest?amount=${amount}&from=${currency}&to=USD`
    )
      .then((resp) => resp.json())
      .then((data) => {
        const convertedAmount = data.rates["USD"].toFixed(2);
        //return the action
        dispatch({ type: "account/deposit", payload: convertedAmount });
      })
      .catch((err) => console.error(err));
  };
}
export function withdraw(amt) {
  return { type: "account/withdraw", payload: amt };
}
export function requestLoan(amt, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount: amt, purpose: purpose },
  };
}
export function payLoan() {
  return { type: "account/payLoan" };
}
