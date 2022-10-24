export default function reducer(state, action) {
  switch (action.type) {
    case "JOINED":
      return {
        ...state,
        joined: true,
        isLoading: false,
        roomId: action.payload.roomId,
        userName: action.payload.userName,
      };
    case "IS_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "SET_USERS":
      return {
        ...state,
        users: action.payload,
      };
    case "NEW_MESSAGE":
      return {
        ...state,
        messages: [...state.messages, action.payload],
      };
    default:
      return state;
  }
}
