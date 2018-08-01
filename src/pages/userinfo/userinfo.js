import React, { Component } from 'react';
import styles from './userinfo.scss';
import BasicLayout from '@/layouts/basic-layout/basic-layout';
import { Button, Table, Modal, Form, Input, Message, Pagination } from 'antd';
import classnames from 'classnames';
import { updatePassword, } from '@/api/user';
import { postRenewal, getOrders } from '@/api/order';
import { PASSWORD, POSITIVE_NUM } from '@/utils/regexp';
import { Tabs, Icon } from 'antd';





class UserInfo extends Component {
  constructor(props) {
    super(props);
    this.handlePasswordOk = this.handlePasswordOk.bind(this);
    this.handlePayTabsChange = this.handlePayTabsChange.bind(this);
    this.handleTopUpOk = this.handleTopUpOk.bind(this);
    this.getQrCode = this.getQrCode.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleConfirm = this.handleConfirm.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.fetchOrders = this.fetchOrders.bind(this);
  }
  state = {
    type: 1,
    passwordModal: false,
    passwordConfirmLoading: false,
    topUpModal: false,
    pay_type: 'alipay',
    qrCode: '',
    topUpModalFooter: null,
    payRecord: [],
    page: 1,
    page_size: 5,
    tableLoading: false
  }

  handleTabChange(type) {
    this.setState({
      type
    });
    if (type === 2) {
      this.fetchOrders();
    }
  }

  handlePasswordOk = (e) => {
    this.props.form.validateFields(['password', 'new_password', 'repassword'], (err, values) => {
      if (!err) {
        this.setState({
          passwordConfirmLoading: true
        });
        updatePassword(values).then(res => {
          Message.success('修改密码成功');
          this.handleModal('passwordModal', false);
          this.setState({
            passwordConfirmLoading: false
          });
        }).catch(() => {
          this.setState({
            passwordConfirmLoading: false
          });
        });
      }
    });
  }

  handleTopUpOk() {
    this.props.getUserInfo();
    this.handleModal('topUpModal', false); 
  }
  handlePayTabsChange(type) {
    this.setState({ pay_type: type});
    this.getQrCode(type);
  }

  handleConfirm() {
    this.props.form.validateFields(['price'], (err, values) => {
      if (!err) {
        this.getQrCode();
      }
    });
  }

  fetchOrders(page = this.state.page) {
    const { page_size } = this.state;
    this.setState({
      tableLoading: true
    });
    getOrders({
      page_size,
      page
    }).then((res) => {
      const data = res.data.data;
      this.setState({
        payRecord: data.results,
        total: data.count,
        tableLoading: false
      });
    }).catch(() => {
      this.setState({
        tableLoading: false
      });
    });
  }

   handlePagination(page) {
    this.setState({
      page: page
    });
    this.fetchOrders(page);
  }
  
  getQrCode(type = this.state.pay_type) {
    const amount = this.props.form.getFieldValue('price');
    postRenewal({
      name: '充值',
      months: 0,
      pay_type: type,
      account_id: 0,
      price: amount
    }).then(res => {
      this.setState({
        qrCode: res.data.data.qr_img
      });
      // this.handleModal('toUpModal', true);
    });
  }
  handleModal(key, val) {
    if (!val) {
      this.props.form.resetFields();
    }
    this.setState({
      [key]: val,
      qrCode: ''
    });
  }
  render() {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const FormItem = Form.Item;
    const { Column } = Table;
    const validatorPassword = (rule, value, callback) => {
      if (value && value !== getFieldValue('password')) {
        callback('两次输入不一致');
      } else {
        callback();
      }
    };
    const { userInfo } = this.props;
    const TabPane = Tabs.TabPane;

    return (
      <BasicLayout pathname={this.props.location.pathname}>
        <div className={styles.userinfo}>
          <div className={styles.left}>
            <img className={styles.avatar} src="https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png" className={styles.avatar} alt="avatar" />
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
                    <a className={styles.action} href="javascript:;" onClick={() => this.handleModal('passwordModal', true)}>修改</a>
                  </li>
                  {/* <li className={styles.info_item}>
                      <span className={styles.item_label}>微信</span>
                      <span className={classnames(styles.item_text, styles.item_text_custom)}>未绑定</span>
                      <a className={styles.action} href="javascript:;">绑定</a>
                    </li> */}
                  <li className={styles.info_item}>
                    <span className={styles.item_label}>余额</span>
                    <span className={classnames(styles.item_text, styles.item_text_custom, 'text-ellipsis')}>￥{userInfo ? userInfo.account_balance : null}</span>
                    <a className={styles.action} href="javascript:;" onClick={() => this.handleModal('topUpModal', true)}>充值</a>
                  </li>
                </ul>
                : <div className={styles.pay_record}>
                  <div className={styles.record_header}>
                    <span className={styles.header_label}>余额</span>
                    <span className={styles.header_money}>￥{userInfo ? userInfo.account_balance : null}</span>
                    <Button size="small" type="primary" onClick={() => this.handleModal('topUpModal', true)}>充值</Button>
                  </div>
                  <Table dataSource={this.state.payRecord} rowKey="order_no" loading={this.state.tableLoading} pagination={false}>
                    <Column
                      title="订单号"
                      dataIndex="order_no"
                      key="order_no"
                    />
                    <Column
                      title="用途"
                      dataIndex="type"
                      key="type"
                    />
                    <Column
                      title="金额"
                      dataIndex="money"
                      key="money"
                    />
                    <Column
                      title="余额"
                      dataIndex="account_balance"
                      key="account_balance"
                    />
                    <Column
                      title="时间"
                      key="created"
                      dataIndex="created"
                    />
                  </Table>
                  <Pagination onChange={this.handlePagination} hideOnSinglePage={true} defaultPageSize={this.state.page_size} defaultCurrent={Number(this.state.page)} total={Number(this.state.total)} className={styles.pagination} />

                </div>
            }
          </div>
          <Modal
            title="修改密码"
            visible={this.state.passwordModal}
            onOk={this.handlePasswordOk}
            onCancel={() => this.handleModal('passwordModal', false)}
            okText="确认"
            cancelText="取消"
            width={400}
            confirmLoading={this.state.passwordConfirmLoading}
          >
            <Form onSubmit={this.handlePasswordOk} className="login-form">
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入原密码' }, { pattern: PASSWORD, message: '请输入6到16位数字加字母的密码' }],
                })(
                  <Input type="password" placeholder="请输入原密码" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('new_password', {
                  rules: [{ required: true, message: '请输入新密码' }, { pattern: PASSWORD, message: '请输入6到16位数字加字母的密码' }],
                })(
                  <Input type="password" placeholder="请输入新密码" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('repassword', {
                  rules: [{ required: true, message: '请再次输入新密码' }, { validator: validatorPassword, message: '两次输入不一致' }],
                })(
                  <Input type="password" placeholder="请再次输入新密码" />
                )}
              </FormItem>
            </Form>
          </Modal>
          <Modal
            layout="inline"
            title="充值"
            visible={this.state.topUpModal}
            onCancel={() => this.handleModal('topUpModal', false)}
            width={340}
            className={styles.top_up_modal}
            footer={
              this.state.qrCode
                ?  <div>
                    <Button onClick={() => this.handleModal('topUpModal', false)}>取消</Button>
                    <Button onClick={this.handleTopUpOk} type="primary">确认充值</Button>
                  </div>
                : null  
            }
          >
            <Form layout="inline" onSubmit={this.handleTopUpOk} className="login-form">
              <FormItem>
                {getFieldDecorator('price', {
                  rules: [{ pattern: POSITIVE_NUM, message: '请输入正确的数字' }],
                })(
                  <Input className={styles.top_up_input} type="price" placeholder="请输入充值金额"/>
                )}
              </FormItem>
              <FormItem>
                <Button className={styles.top_up_btn} type="primary" disabled={!getFieldValue('price')} onClick={this.handleConfirm}>确认</Button>
              </FormItem>
            </Form>
            {
              this.state.qrCode
               ?  <Tabs defaultActiveKey="alipay" onChange={this.handlePayTabsChange}>
                    <TabPane tab={<span><Icon type="alipay-circle" />支付宝</span>} key="alipay">
                      <img src={this.state.qrCode} alt="qrcode"/>
                    </TabPane>
                    <TabPane tab={<span><Icon type="wechata" />微信</span>} key="wechat">
                      <img src={this.state.qrCode} alt="qrcode" />
                    </TabPane>
                  </Tabs>
                : null  
                
            }
          </Modal>
        </div>
      </BasicLayout>
    )
  }
}



const WrappedNormalForm = Form.create()(UserInfo);

export default WrappedNormalForm;