import React from 'react';
import styles from './basic-layout.scss';
import GlobalHeader from '@/components/global-header/global-header';
import { globalNav } from '@/config';

const BasicLayout  = (props) => {
  const title = globalNav.find(item => item.path === props.pathname).label;
  return (
    <div className={styles.container}>
      <GlobalHeader></GlobalHeader>
      <section className={styles.content}>
        <div className={styles.title}>
          <h1 className={styles.header}>{title}</h1>
          <p className={styles.desc}>这里是补充说明</p>
        </div>
        <div className={styles.main}>
          {props.children}
        </div>
      </section>
    </div>
  )
}

export default BasicLayout;