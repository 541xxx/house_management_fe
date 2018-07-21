import React from 'react';
import styles from './user-layout.scss';
import logo from '@/images/logo.png';
const UserLayout = (props) => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.top}>
          <h1 className={styles.header}>
            <img src={logo} alt="logo" />
          </h1>
          <h2 className={styles.subtitle}>房管管 中国最好用的房源管理软件</h2>
        </div>
        <div className={styles.main}>
          {props.children}
        </div>
      </div>
    </div>
  )
}


export default UserLayout;