import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  fullname: "",
  nationalId: "",
  createdAt: "",
};

// name acts as domain name
// function's identifier as event name
// therefore type: name/functions_identifier
// logic is handled by the action creator functions
// each action creator function acts as new reducer..
const customerSlice = createSlice({
  name: "customer",
  initialState,
  reducers: {
    createCustomer(state, action) {
      state.fullname = action.payload.fullName;
      state.nationalId = action.payload.nationalId;
      state.createdAt = action.payload.createdAt;
    },
    updateName(state, action) {
      state.fullname = action.payload;
    },
  },
});

export const { createCustomer, updateName } = customerSlice.actions;
export default customerSlice.reducer;
