import React, { Component } from 'react';
import logo from '@/images/logo_light.png';
import { globalNav } from  '@/config';
import styles from './global-header.scss';
import { Link, NavLink } from 'react-router-dom';
import { Icon, Menu, Dropdown } from 'antd';
import Cookies from 'js-cookie';
import Proptypes from 'prop-types';



class GlobalHeader extends Component {
  static contextTypes = {
    router: Proptypes.object.isRequired
  }
  handleLogout = () => {
    Cookies.set('user_t', '');
    this.context.router.history.push('/user/login');
  }
  render() {
    const menu = (
      <Menu className={styles.dropdown_menu}>
        <Menu.Item>
          <Link to="/userinfo">
            <Icon className={styles.menu_item_icon} type="user"></Icon>
            个人中心
          </Link>
        </Menu.Item>
        <Menu.Item onClick={this.handleLogout}>
          <span>
            <Icon className={styles.menu_item_icon} type="logout" />
            退出登录
          </span>
        </Menu.Item>
      </Menu>
    );
    return (
      <header className={styles.header}>
        <img className={styles.logo} src={logo} alt="logo"/>
        <nav className={styles.nav}>
          {
            globalNav.map(item => {
              return (
                item.hidden
                  ? null
                  : <NavLink key={item.path} className={styles.nav_link} to={item.path} activeClassName={styles.activeNavLink}>{item.label}</NavLink>
              )
            })
          }
        </nav>
        <div className={styles.right}>
          <Icon type="bell" className={styles.bell_icon}></Icon>
          <Dropdown overlay={menu} className={styles.dropdown}>
            <a href="javascript:;">
              <img className={styles.avatar} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" className={styles.avatar} alt="avatar"></img>
              <span className={styles.username} href="javascript:;">
                Hayden
              </span>
            </a>
          </Dropdown>
        </div>
      </header>
    )
  }
}

export default GlobalHeader;

