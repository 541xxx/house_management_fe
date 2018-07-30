import React, {Component} from 'react';
import styles from './userinfo.scss';
import BasicLayout from '@/layouts/basic-layout/basic-layout';
import { Button, Table } from 'antd';
import classnames from 'classnames';
import { connect } from 'react-redux';
import PropTypes from 'prop-types'



class UserInfo extends Component {
 
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
    const { userInfo } = this.props;
    return (
      <BasicLayout pathname={this.props.location.pathname}>
        <div className={styles.userinfo}>
          <div className={styles.left}>
            <img className={styles.avatar} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" className={styles.avatar} alt="avatar"/>
            <ul className={styles.tabs}>
              <li className={classnames(this.state.type === 1 ? styles.tab_pane_active : null, styles.tab_pane)} onClick={() => this.handleTabChange(1)}>帐号信息</li>
              <li className={classnames(this.state.type === 2 ? styles.tab_pane_active : null, styles.tab_pane)} onClick={() => this.handleTabChange(2)}>支付记录</li>
            </ul>
          </div>
          <div className={styles.right}>
            {
              this.state.type === 1
                ? <ul className={styles.info}>
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>用户</span>
                    <span className={styles.item_text}>{userInfo ? userInfo.username : null}</span>
                    </li>
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>手机号</span>
                    <span className={styles.item_text}>{userInfo ? userInfo.mobile : null}</span>
                    </li>
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>密码</span>
                      <span className={classnames(styles.item_text, styles.item_text_custom)}>******</span>
                      <a className={styles.action} href="javascript:;">修改</a>
                    </li>
                    {/* <li className={styles.info_item}>
                      <span className={styles.item_label}>微信</span>
                      <span className={classnames(styles.item_text, styles.item_text_custom)}>未绑定</span>
                      <a className={styles.action} href="javascript:;">绑定</a>
                    </li> */}
                    <li className={styles.info_item}>
                      <span className={styles.item_label}>余额</span>
                    <span className={classnames(styles.item_text, styles.item_text_custom, 'text-ellipsis')}>￥{userInfo ? userInfo.account_balance : null}</span>
                      <a className={styles.action} href="javascript:;">充值</a>
                    </li>
                  </ul>
                : <div className={styles.pay_record}>
                    <div className={styles.record_header}>
                      <span className={styles.header_label}>余额</span>
                      <span className={styles.header_money}>￥80.00</span>
                      <Button size="small" type="primary">充值</Button>
                    </div>
                    <Table dataSource={data}>
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
                </div>
            }
          </div>
        </div>
      </BasicLayout>
    )
  }
}



export default UserInfo;