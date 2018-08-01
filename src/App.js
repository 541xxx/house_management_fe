import React from 'react';
import '@/styles/common/index.scss';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
// BrowserRouter
import { Router, Route, Redirect, Switch} from 'react-router-dom';
import reducers from './reducer';
import Accounts from '@/pages/accounts/accounts';
import Houses from '@/pages/houses/houses';
import UserInfo from '@/pages/userinfo/userinfo';
import RequireAuth from '@/components/auth-route/auth-route';
import Login from '@/pages/user/login/login';
import Register from '@/pages/user/register/register';
import history from './history';

const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));
function App() {
  return (
            // <Redirect to='/accounts'/>
    <Provider store={store}>
      <Router history={history}>
        <Switch>
          <Route path="/accounts" exact component={RequireAuth(Accounts)} />
          <Route path="/houses" exact component={RequireAuth(Houses)} />
          <Route path="/userinfo" exact component={RequireAuth(UserInfo)} />
          <Route path="/user/login" exact component={Login} />
          <Route path="/user/register" component={Register} />
          <Redirect to="/accounts" component={Register} />
          {/* {getLoginStatus() ? <Redirect to='/accounts' /> : <Redirect to='/user/login' />} */}
        </Switch>
      </Router>
    </Provider>
  )
}

export default App;