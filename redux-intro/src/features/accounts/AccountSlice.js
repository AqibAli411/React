import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
  isLoading: false,
};
//return any data from the promise callback and it will go into the fullfiled case
export const deposit = createAsyncThunk(
  "account/changeCurrencyRequest",
  async ({ currency, depositAmount }) => {
    if (currency === "USD") return depositAmount;

    const res = await fetch(
      `https://api.frankfurter.app/latest?amount=${depositAmount}&from=${currency}&to=USD`
    );
    const data = await res.json();

    return data.rates["USD"].toFixed(2);
  }
);

const accountSlice = createSlice({
  name: "account",
  initialState,
  reducers: {
    withdraw(state, action) {
      state.balance -= action.payload;
    },
    requestLoan: {
      //perpare method take arrguments of action creator function and convert them into a
      //payload object which further can be used by the reducer method to manage logic
      //this way we don't have to pass the data as object
      //this behavior is due to the fact that the action creator functions desgined by
      //RTK can only accept one arrgument..

      prepare(loanAmount, loanPurpose) {
        return {
          payload: { loanAmount, loanPurpose },
        };
      },

      reducer(state, action) {
        if (state.loan > 0) return;
        state.loan = action.payload.loanAmount;
        state.loanPurpose = action.payload.loanPurpose;
        state.balance += action.payload.loanAmount;
      },
    },
    payLoan(state) {
      state.balance -= state.loan;
      state.loan = 0;
      state.loanPurpose = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(deposit.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deposit.fulfilled, (state, action) => {
        state.balance += action.payload;
        state.isLoading = false;
      });
  },
});

export const { withdraw, requestLoan, payLoan } = accountSlice.actions;

//define thunk seperated form the render ui part

export default accountSlice.reducer;
