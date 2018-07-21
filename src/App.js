import React from 'react';
import '@/styles/common/index.scss';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { Provider } from 'react-redux';
import { BrowserRouter, Route, Redirect, Switch, HashRouter} from 'react-router-dom';
import reducers from './reducer';
import Accounts from '@/pages/accounts/accounts';
import RequireAuth from '@/components/auth-route/auth-route';
import Login from '@/pages/user/login/login';
import Register from '@/pages/user/register/register';
const store = createStore(reducers, compose(
  applyMiddleware(thunk),
  window.devToolsExtension ? window.devToolsExtension() : f => f,
));
let login = false;
function App() {
  return (
    <Provider store={store}>
      <HashRouter>
        <div>
          <Switch>
            <Route path="/" exact component={RequireAuth(Accounts)} />
            <Route path="/user/login" component={Login}/>
            <Route path="/user/register" component={Register}/>
          </Switch>
        </div>
      </HashRouter>
    </Provider>
  )
}

export default App;