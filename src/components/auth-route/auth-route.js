import React from 'react';
import { connect } from 'react-redux';
import Proptypes from 'prop-types';
import Cookies from 'js-cookie';
// import { connect }   from 'react-redux';
import { fetchUserInfo } from '@/redux/user.redux';


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
      if (!this.props.userInfo) {
        this.props.getUserInfo();
      }
    }

    componentWillReceiveProps(nextProps) {
      this.checkAuth();
    }

    checkAuth() {
      const token = Cookies.get('user_token');
      if (!token) {
        let redirect = this.props.location.pathname + this.props.location.search;
        console.log(redirect, '11');
        this.context.router.history.push('/user/login?message=401&redirect_uri=' + encodeURIComponent(redirect));
        this.setState({
          login: false
        })
        return;
      }
      this.setState({
        login: true
      });
    }

    render() {
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
      userInfo: state.user.userInfo
    };
  }

  function mapDispatchToProps(dispatch) {
    return {
      getUserInfo: () => {
        dispatch(fetchUserInfo())
      }
    };
  }

  Component.AuthenticatedComponent = connect(mapStateToProps, mapDispatchToProps)(AuthenticatedComponent);
  return Component.AuthenticatedComponent;
}


export default requireAuth;