import React from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import Cookies from 'js-cookie';


function requireAuth(Component) {
  // 组件已登录模块直接返回 防止重新渲染
  if (Component.AuthenticatedComponent) {
    return Component.AuthenticatedComponent;
  }

  // 创建验证组件

  class AuthenticatedComponent extends Component {
    static contextTypes = {
      router: Proptypes.object.isRequired
    }

    state = {
      login: false
    }

    componentWillMount() {
      this.checkAuth();
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }

    checkAuth() {
      const token = Cookies.get('user_t');
      if (!token) {
        console.log(this.context)
        this.context.router.history.push('/user/login');
        return;
      }
      this.setState({
        login: true
      })
    }

    render() {
      console.log(this.state);
      if (this.state.login) {
        return <Component {...this.props}></Component>
      }
      return <div>opps</div>;
    }
  }
  //  Component.AuthenticatedComponent = AuthenticatedComponent
  // return Component.AuthenticatedComponent
  function mapStateToProps(state) {
    return {
      token: state.token
    };
  }

  function mapDispatchToProps(dispatch) {
    return {};
  }

  Component.AuthenticatedComponent = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
  return Component.AuthenticatedComponent;
}


export default requireAuth;