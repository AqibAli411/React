const initalStateCustomer = {
  fullname: "",
  nationalId: "",
  createdAt: "",
};

export default function customerReducer(state = initalStateCustomer, action) {
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

//action creater for customer
export function createCustomer(fullname, nationalId) {
  return {
    type: "customer/createCustomer",
    payload: {
      fullname,
      nationalId,
      createdAt: new Date().toISOString(),
    },
  };
}

export function updateName(fullname) {
  return {
    type: "customer/updateName",
    payload: fullname,
  };
}
