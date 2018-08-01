import { getUserInfo } from '@/api/user';
const initState = {
  login: false,
  userInfo: null
}

const FETCH_USER_INFO = 'FETCH_USER_INFO';

export function user(state = initState, action) {
  switch (action.type) {
    // case LOGIN_STATUTS:
    //   return {...state, login: payload.login}
    case FETCH_USER_INFO:
      return { ...state, userInfo: action.payload}
    default: 
      return state;  
  }
}



export function fetchUserInfo() {
  return dispatch => {
    getUserInfo().then(res => {
      dispatch(
        { type: FETCH_USER_INFO, payload: res.data.data }
      )
    });
  }
}