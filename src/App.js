import React from 'react';
import '@/styles/common/index.scss';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch, HashRouter} from 'react-router-dom';
import reducers from './reducer';
import Accounts from '@/pages/accounts/accounts';
import Houses from '@/pages/houses/houses';
import UserInfo from '@/pages/userinfo/userinfo';
import RequireAuth from '@/components/auth-route/auth-route';
import Login from '@/pages/user/login/login';
import Register from '@/pages/user/register/register';
import Cookies from 'js-cookie';
const getLoginStatus = () => {
  if (Cookies.get('user_t')) {
    return true;
  }
  return false;
}
const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));
let login = false;
function App() {
  return (
            // <Redirect to='/accounts'/>
    <Provider store={store}>
      <HashRouter>
        <Switch>
          <Route path="/accounts" exact component={RequireAuth(Accounts)} />
          <Route path="/houses" exact component={RequireAuth(Houses)} />
          <Route path="/userinfo" exact component={RequireAuth(UserInfo)} />
          <Route path="/user/login" component={Login}/>
          <Route path="/user/register" component={Register}/>
          {getLoginStatus() ? <Redirect to='/accounts' /> : <Redirect to='/user/login' />}
        </Switch>
      </HashRouter>
    </Provider>
  )
}

export default App;