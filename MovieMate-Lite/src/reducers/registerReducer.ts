export interface RegisterState {
  step: 1 | 2;
  successOpen: boolean;
}

export type RegisterAction =
  | { type: "NEXT_STEP" }
  | { type: "PREV_STEP" }
  | { type: "SUBMIT_SUCCESS" }
  | { type: "CLOSE_SUCCESS" };

export const registerInitialState: RegisterState = {
  step: 1,
  successOpen: false,
};

const registerReducer = (state: RegisterState, action: RegisterAction): RegisterState => {
  switch (action.type) {
    case "NEXT_STEP":
      return { ...state, step: 2 };
    case "PREV_STEP":
      return { ...state, step: 1 };
    case "SUBMIT_SUCCESS":
      return { ...state, successOpen: true };
    case "CLOSE_SUCCESS":
      return { ...state, successOpen: false };
    default:
      return state;
  }
};

export default registerReducer;