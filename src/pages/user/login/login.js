import React, {Component} from 'react';
import UserLayout from '@/layouts/user-layout/user-layout';
import styles from './login.scss';
import { Form, Tabs, Button, Row, Col, Input, Icon, Checkbox } from 'antd';
import { Link } from 'react-router-dom';



class Login extends Component {
  constructor(props) {
    super(props);
    this.handleTabsChange = this.handleTabsChange.bind(this);
    this.haddleGetCode = this.haddleGetCode.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  state = {
    type: 1,
    autoLogin: false,
    count: 0
  }
  handleSubmit (e) {
    e.preventDefault();
    let fieldNames = this.state.type === 1 ? ['username', 'password'] : ['mobile', 'vcode'];
    this.props.form.validateFields(fieldNames, (err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const TabPane = Tabs.TabPane;
    const FormItem = Form.Item;
    const { count } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <UserLayout>
        <div className={styles.login}>
          <Form onSubmit={this.handleSubmit}>
            <Tabs defaultActiveKey="1" onChange={this.handleTabsChange} className={styles.tabs}>
              <TabPane tab="账号密码登录" key="1">
                <FormItem>
                  {getFieldDecorator('username', {
                    rules: [{ required: true, message: '请输入用户名' }],
                  })(
                    <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                  )}
                </FormItem>
                <FormItem>
                  {getFieldDecorator('password', {
                    rules: [{ required: true, message: '请输入密码'}],
                  })(
                    <Input size="large" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="密码" />
                  )}
                </FormItem>
              </TabPane>
              <TabPane tab="手机号登录" key="2">
                <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [{ required: true, message: '请输入手机号码' }],
                })(
                  <Input size="large" prefix={<Icon type="mobile" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="手机号码" />
                )}
                </FormItem>
                <FormItem>
                <Row gutter={8}>
                  <Col span={16}>
                      {getFieldDecorator('vcode', {
                        rules: [{ required: true, message: '请输入验证码' }],
                      })(
                        <Input size="large" prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="验证码" />
                      )}
                  </Col>
                  <Col span={8}>
                      <Button
                        disabled={count}
                        className={styles.get_code}
                        size="large"
                        onClick={this.haddleGetCode}
                      >
                        {count ? `${count} s` : '获取验证码'}
                      </Button>
                  </Col>
                </Row>
                </FormItem>
              </TabPane>
            </Tabs>
            <div>
            <Checkbox checked={this.state.autoLogin} onChange={this.changeAutoLogin}>自动登录</Checkbox>
            <a style={{ float: 'right' }} href="">忘记密码</a>
            </div>
            <Button size="large" className={styles.submit_btn} type="primary" htmlType="submit">登录</Button>
            <div className={styles.other}>
              其他登录方式
            <Icon className={styles.icon} type="alipay-circle" />
              <Icon className={styles.icon} type="taobao-circle" />
              <Icon className={styles.icon} type="weibo-circle" />
              <Link className={styles.register} to="/user/register">注册账户</Link>
            </div>
          </Form>
        </div>
      </UserLayout>
    )
  }
  handleTabsChange(type) {
    this.setState({type});
  }
  haddleGetCode() {
    let count = 59;
    this.setState({count});
    this.interval = setInterval(() => {
      count -= 1;
      this.setState({count});
      if (count === 0) {
        clearInterval(this.interval);
      }
    }, 1000);
  }
}

const WrappedHorizontalLoginForm = Form.create()(Login);

export default WrappedHorizontalLoginForm;