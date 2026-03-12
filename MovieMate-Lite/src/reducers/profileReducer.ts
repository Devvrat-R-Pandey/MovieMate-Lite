export interface ProfileState {
  editingDetails: boolean;
  editingPassword: boolean;
  detailsStatus: "success" | "error" | null;
  passwordStatus: "success" | "wrong_password" | "error" | null;
  showOld: boolean;
  showNew: boolean;
}

export type ProfileAction =
  | { type: "EDIT_DETAILS_START" }
  | { type: "EDIT_DETAILS_CANCEL" }
  | { type: "DETAILS_SUCCESS" }
  | { type: "DETAILS_ERROR" }
  | { type: "CLEAR_DETAILS_STATUS" }
  | { type: "EDIT_PASSWORD_START" }
  | { type: "EDIT_PASSWORD_CANCEL" }
  | { type: "PASSWORD_SUCCESS" }
  | { type: "PASSWORD_WRONG" }
  | { type: "PASSWORD_ERROR" }
  | { type: "CLEAR_PASSWORD_STATUS" }
  | { type: "TOGGLE_SHOW_OLD" }
  | { type: "TOGGLE_SHOW_NEW" };

export const profileInitialState: ProfileState = {
  editingDetails: false,
  editingPassword: false,
  detailsStatus: null,
  passwordStatus: null,
  showOld: false,
  showNew: false,
};

const profileReducer = (state: ProfileState, action: ProfileAction): ProfileState => {
  switch (action.type) {
    case "EDIT_DETAILS_START":
      return { ...state, editingDetails: true, detailsStatus: null };
    case "EDIT_DETAILS_CANCEL":
      return { ...state, editingDetails: false, detailsStatus: null };
    case "DETAILS_SUCCESS":
      return { ...state, editingDetails: false, detailsStatus: "success" };
    case "DETAILS_ERROR":
      return { ...state, detailsStatus: "error" };
    case "CLEAR_DETAILS_STATUS":
      return { ...state, detailsStatus: null };
    case "EDIT_PASSWORD_START":
      return { ...state, editingPassword: true, passwordStatus: null };
    case "EDIT_PASSWORD_CANCEL":
      return { ...state, editingPassword: false, passwordStatus: null, showOld: false, showNew: false };
    case "PASSWORD_SUCCESS":
      return { ...state, editingPassword: false, passwordStatus: "success", showOld: false, showNew: false };
    case "PASSWORD_WRONG":
      return { ...state, passwordStatus: "wrong_password" };
    case "PASSWORD_ERROR":
      return { ...state, passwordStatus: "error" };
    case "CLEAR_PASSWORD_STATUS":
      return { ...state, passwordStatus: null };
    case "TOGGLE_SHOW_OLD":
      return { ...state, showOld: !state.showOld };
    case "TOGGLE_SHOW_NEW":
      return { ...state, showNew: !state.showNew };
    default:
      return state;
  }
};

export default profileReducer;