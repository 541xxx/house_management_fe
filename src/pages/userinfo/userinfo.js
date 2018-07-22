import React, {Component} from 'react';
import styles from './userinfo.scss';
import BasicLayout from '@/layouts/basic-layout/basic-layout';
import { Button, Menu, Dropdown, Icon, Table, Modal, Input } from 'antd';

class UserInfo extends Component {
  constructor() {
    super();
  }
  state = {
    type: 1
  }
  handleTabChange(type) {
    this.setState({
      type
    });
  }
  render() {
    const { Column } = Table;
    const data = [{
      firstName: 'John',
      lastName: 'Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      address1: 'New York No. 1 Lake Park',
    }, {
      key: '2',
      firstName: 'Jim',
      lastName: 'Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      address1: 'London No. 1 Lake Park',
    }, {
      key: '3',
      firstName: 'Joe',
      lastName: 'Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
      address1: 'Sidney No. 1 Lake Park',
    }];
    return (
      <BasicLayout pathname={this.props.location.pathname}>
        <div className={styles.userinfo}>
          <div className={styles.left}>
            <img className={styles.avatar} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" className={styles.avatar}/>
            <ul className={styles.tabs}>
              <li onClick={() => this.handleTabChange(1)} className={styles.tab_pane}>帐号信息</li>
              <li onClick={() => this.handleTabChange(2)} className={styles.tab_pane}>支付记录</li>
            </ul>
          </div>
          <div className={styles.right}>
            {
              this.state.type === 1
                ? <ul className={styles.info}>
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>用户</span>
                      <span className={styles.item_text}>周杰伦</span>
                    </li>
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>手机号</span>
                      <span className={styles.item_text}>18678787878</span>
                    </li>
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>密码</span>
                      <span className={styles.item_text}>******</span>
                      <a className={styles.action} href="javascript:;">修改</a>
                    </li>
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>微信</span>
                      <span className={styles.item_text}>未绑定</span>
                      <a className={styles.action} href="javascript:;">修改</a>
                    </li>
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>余额</span>
                      <span className={styles.item_text}>￥800</span>
                      <a className={styles.action} href="javascript:;">充值</a>
                    </li>
                  </ul>
                : <Table dataSource={data}>
                  <Column
                    title="房源标题"
                    dataIndex="firstName"
                    key="firstName"
                  />
                  <Column
                    title="房源信息"
                    dataIndex="age"
                    key="age"
                  />
                  <Column
                    title="价格"
                    dataIndex="address"
                    key="address"
                  />
                  <Column
                    title="类型"
                    dataIndex="address"
                    key="address1"
                  />
                  <Column
                    title="发布时间"
                    key="action"
                    render={(text, record) => (
                      <span>
                        <a href="javascript:;">2018-07-25</a>
                      </span>
                    )}
                  />
                </Table>
            }
          </div>
        </div>
      </BasicLayout>
    )
  }
}



export default UserInfo;