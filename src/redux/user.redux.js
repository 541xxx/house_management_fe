const initState = {
  login: false
}

const LOGIN_STATUTS = 'LOGIN_STATUS';

export function handleLoginStatus(state = initState, action) {
  switch (action.type) {
    case LOGIN_STATUTS:
      return {...state, login: payload.login}
  }
}

function loginStatus() {
}