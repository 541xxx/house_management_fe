/*
 * @Author: Hayden Woo 
 * @Date: 2018-07-22 13:32:23 
 * @Last Modified by: Hayden Woo
 * @Last Modified time: 2018-07-30 01:01:38
 */

import React, { Component } from 'react';
import BasicLayout from '@/layouts/basic-layout/basic-layout';
import styles from './accounts.scss';
import { Button, Table, Modal, Input, Divider, Form, Select, Message, Checkbox, Radio } from 'antd';
import { getAccounts, addAccount, deleteAccounts, updataAccount, getPlatforms} from '@/api/accounts';
import { postRenewal } from '@/api/order';
import classnames from 'classnames';
import { status, options } from '@/config';
import dayjs from 'dayjs';

class Accounts extends Component {
  constructor(props) {
    super(props);
    this.getAccountsList = this.getAccountsList.bind(this);
    this.handleModal = this.handleModal.bind(this);
    this.handleCheckChange = this.handleCheckChange.bind(this);
    this.handleUpdateOk = this.handleUpdateOk.bind(this);
    this.handleAddOk = this.handleAddOk.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.handleRenewalOk = this.handleRenewalOk.bind(this);
    this.handleRadioChange = this.handleRadioChange.bind(this);
    this.renealPriceFilter = this.renealPriceFilter.bind(this);
    this.handlePayOk = this.handlePayOk.bind(this);
    
  }
  state = {
    loading: false,
    addModalVisible: false,
    addMoDalConfirmLoading: false,
    platforms: [],
    accounts: [],
    updateModalVisible: false,
    updateModalConfirmLoading: false,
    currentData: {}, // 当前操作的账号数据
    checked: false,
    renewalModalVisible: false,
    renewalModalConfirmLoading: false,
    renealDurationValue: options.renewal[0].value,   // 续费时长
    paymethodRadio: options.payMethod[0].value, // 支付方式
    payModalVisible: false,
    qr_code: ''
  }

  componentDidMount() {
    this.getAccountsList();
    this.getPlatformList();
  }
  
  getAccountsList() {
    this.setState({
      loading: true
    });
    getAccounts().then(res => {
      this.setState({
        accounts: res.data.data,
        loading: false
      });
    }).catch(() => {
      this.setState({
        loading: false
      });
    });
  }
  getPlatformList() {
    getPlatforms().then(res => {
      this.setState({
        platforms: res.data.data
      });
    })
  }
  handleCheckChange(e) {
    this.setState({
      checked: e.target.checked
    })
  }
  /**
   * 通用操作模态框
   * @param {*String} name // 模态框visible name
   * @param {*Boolean} visible
   * @param {*Object} data // 当前操作的数据
   * @memberof Accounts
   */
  handleModal(name, visible, data) {
    if (data) {
      this.setState({
        currentData: data
      })
    };
    if (!visible) {
        this.props.form.resetFields();
    }
    this.setState({
      [name]: visible,
    });
  }
  handleAddOk () {
    const fields = ['platform_id', 'username', 'password'];
    this.props.form.validateFields(fields, (err, values) => {
      if (!err) {
        this.setState({
          addMoDalConfirmLoading: true
        });
        values.platform_id = Number(values.platform_id);
        addAccount(values).then(() => {
          this.handleModal('addModalVisible', false);
          Message.success('添加成功');
          this.getAccountsList();
          this.setState({
            addMoDalConfirmLoading: false
          });
        }).catch(() => {
          this.setState({
            addMoDalConfirmLoading: false
          });
          this.handleModal('addModalVisible', false);
        });
      }
    });
  }
  handleUpdateOk (){
    const password = this.props.form.getFieldValue('new_password');
    const id = this.state.currentData.id;
    const is_default = this.state.checked;
    this.setState({
      updateModalConfirmLoading: true
    });
    updataAccount(id, { password, is_default}).then(() => {
      Message.success('修改成功');
      this.handleModal('updateModalVisible', false);
      this.setState({
        updateModalConfirmLoading: false
      });
    }).catch(() => {
      this.setState({
        updateModalConfirmLoading: false
      });
    });
  }
  handleDelete(data, index) {
    const _this = this;
    Modal.confirm({
      title: '提示',
      content: `确认删除用户名为：「${data.username}」的账户吗？`,
      okText: 'Yes',
      okType: '删除',
      cancelText: '取消',
      onOk() {
        deleteAccounts(data.id).then(() => {
          Message.success('删除成功');
          const accounts = _this.state.accounts.slice(0).splice(index, 1);
          _this.setState({
            accounts
          });
        });
      }
    });
  }
  handleRenewalOk() {
    const data = {
      account_id: this.state.currentData.id,
      pay_type: this.state.paymethodRadio,
      price: this.renealPriceFilter(),
      months: this.state.renealDurationValue,
      name: '包月'
    }
    postRenewal(data).then(res => {
      this.setState({
        qr_code: res.data.data.qr_img
      });
      this.setState({
        payModalVisible: true
      });
    });
  }
  handleRadioChange(e, name) {
    this.setState({
      [name]: e.target.value
    });
  }
  renealPriceFilter() {
    return options.renewal.find(v => v.value === this.state.renealDurationValue).fee
  }
  handlePayOk() {
    this.getAccountsList();
    this.handleModal('payModalVisible', false);
    this.handleModal('renewalModalVisible', false);
  }
  render() {
    const { Column } = Table;
    const data = this.state.accounts;
    const { getFieldDecorator } = this.props.form;
    const Option = Select.Option;
    const FormItem = Form.Item;
    const RadioGroup = Radio.Group;

    const formItemLayout = {
      labelCol: {
        sm: { span:   6},
      },
      wrapperCol: {
        sm: { span: 18},
      },
    };
    return (
      <BasicLayout pathname={this.props.location.pathname}>
        <div className={styles.accounts}>
          <div className={styles.operate}>
            <Button icon="plus" type="primary" onClick={() => this.handleModal('addModalVisible', true)}>新增账号</Button>
          </div>
          <Table dataSource={data} rowKey="id" className={styles.table} loading={this.state.loading}>
            <Column
              title="序号"
              key="action"
              render={(text, record, index) => (
              <span>{index + 1}</span>
              )}
            />
            <Column
              title="网站"
              dataIndex="platform_name"
              key="platform_name"
            />
            <Column
              title="姓名"
              dataIndex="name"
              key="name"
            />
            <Column
              title="用户名"
              dataIndex="username"
              key="username"
            />
            <Column
              title="类型"
              dataIndex="type"
              key="type"
              render={(text) => (
                options.accountType.find(v => v.value === text).label
              )}
            />
            <Column
              title="到期时间"
              dataIndex="deadline"
              key="deadline"
              render={(text) => (
                text || '无'
              )}
            />
            <Column
              title="登录状态"
              dataIndex="status"
              key="status"
              render={(text) => (
                <span className={classnames(styles.status,text ? styles.normalStatus : styles.invlidStatus)}>
                  {status.loginStatus.find(v => v.value === text).label}
                </span>
              )}
            />
            <Column
              title="操作"
              key="action2"
              render={(text, record, index) => (
                <span>
                  <a href="javascript:;" onClick={() => this.handleModal('renewalModalVisible', true, record)}>续费</a>
                  <Divider type="vertical" />
                  <a href="javascript:;" onClick={() => this.handleModal('updateModalVisible', true, record)}>改密</a>
                  <Divider type="vertical" />
                  <a href="javascript:;" onClick={() => this.handleDelete(record, index)}>删除</a>
                </span>
              )}
            />
          </Table>
          <Modal
            title="新增账号"
            visible={this.state.addModalVisible}
            onCancel={() => this.handleModal('addModalVisible', false)}
            className={styles.modal}
            confirmLoading={this.state.addMoDalConfirmLoading}
            onOk={this.handleAddOk}
            okText="确认"
            cancelText="取消"
          >
            <Form onSubmit={this.handleAddOk} className={styles.form}>
              <FormItem {...formItemLayout} label="网站名称">
                {getFieldDecorator('platform_id', {
                  rules: [{ required: true, message: '请选择网站名' }],
                })(
              <Select
                showSearch
                placeholder="请选择网站名"
                optionFilterProp="children"
                >
                {
                    this.state.platforms.map(v => <Option key={v.id} value={v.id}>{v.platform_name}</Option>)
                }
                  {/* <Option value="1">房天下</Option> */}
                </Select>
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="用户名">
                {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名' }],
                })(
                  <Input placeholder="用户名" />
                )}
              </FormItem>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: '请输入密码' }],
                })(
                  <Input type="password" placeholder="密码" />
                )}
              </FormItem>
            </Form>
          </Modal>
          <Modal 
            title="修改密码"
            visible={this.state.updateModalVisible}
            className={styles.modal}
            onOk={this.handleUpdate}
            footer={
              <div className={styles.modal_foter}>
                  <Checkbox
                    className='common-fl'
                    checked={this.state.checked}
                    onChange={this.handleCheckChange}
                  >
                  设为默认
                  </Checkbox>
                  <Button key="back" onClick={() => this.handleModal('updateModalVisible', false)}>取消</Button>
                  <Button key="submit" type="primary" loading={this.state.updateModalConfirmLoading} onClick={this.handleUpdateOk}>
                    确认
                </Button>
              </div>
            }
          >
            <Form className={styles.form}>
              <FormItem label="网站名称" {...formItemLayout}>
                <span>{this.state.currentData.platform_name}</span>
              </FormItem>
              <FormItem label="用户名" {...formItemLayout}>
                <span>{this.state.currentData.username}</span>
              </FormItem>
              <FormItem {...formItemLayout} label="密码">
                {getFieldDecorator('new_password', {
                  rules: [{ required: false, message: '请输入新密码' }],
                })(
                  <Input type="password" placeholder="新密码" />
                )}
              </FormItem>  
            </Form>
          </Modal>
          <Modal 
            title="包月续费"
            visible={this.state.renewalModalVisible}
            className={styles.modal}
            onOk={this.handleRenewalOk}
            onCancel={() => this.handleModal('renewalModalVisible', false)}
            confirmLoading={this.state.renewalModalConfirmLoading}
            okText="确认"
            cancelText="取消"
          >
            <Form className={styles.form}>
              <FormItem label="用户名" {...formItemLayout}>
                <span>{this.state.currentData.username}</span>
              </FormItem>
              <FormItem {...formItemLayout} label="续费时长">
                <RadioGroup onChange={(e) => this.handleRadioChange(e,'renealDurationValue')} value={this.state.renealDurationValue}>
                  {options.renewal.map(v => <Radio key={v.value} value={v.value}>{v.label}</Radio>)}
                </RadioGroup>
              </FormItem>
              {
               this.state.currentData.deadline 
               ?  <FormItem label="到期时间" {...formItemLayout}>
                    <span>{dayjs(this.state.currentData.deadline).add(this.state.renealDurationValue * 30, 'day').format('YYYY-MM-DD')}</span>
                  </FormItem>
               : null   
              }
              <FormItem {...formItemLayout} label="支付方式">
                <RadioGroup onChange={(e) => this.handleRadioChange(e, 'paymethodRadio')} value={this.state.paymethodRadio}>
                  {options.payMethod.map(v => <Radio key={v.value} value={v.value}>{v.label}</Radio>)}
                </RadioGroup>
              </FormItem>  
              <FormItem label="支付金额" {...formItemLayout}>
                <span className={styles.fee}>{this.renealPriceFilter()}</span>
              </FormItem>
            </Form>
          </Modal>
          <Modal
            width={300}
            title={'请使用' + options.payMethod.find(v => v.value === this.state.paymethodRadio).label + '扫码付款'}
            visible={this.state.payModalVisible}
            onOk={this.handlePayOk}
            className={styles.pay_modal}
            okText="完成支付"
            cancelText="关闭"
            onCancel={() => this.handleModal('payModalVisible', false)}
          >
            <img src={this.state.qr_code}/>
          </Modal>
        </div>
      </BasicLayout>
    )
  }
}
const WrappedRegistrationForm = Form.create()(Accounts);


export default WrappedRegistrationForm;