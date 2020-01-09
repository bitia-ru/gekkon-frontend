import { acts } from './actions';


const usersReducer = (
  state = {
    store: {},
  },
  action,
) => {
  switch (action.type) {
  case acts.LOAD_USER_SUCCESS:
    return {
      store: {
        ...state.store,
        [action.user.id]: action.user,
      },
    };
  default:
    return state;
  }
};

export default usersReducer;
