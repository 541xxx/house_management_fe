import React, { Component } from 'react';
import UserLayout from '@/layouts/user-layout/user-layout';
import styles from './register.scss';
import { Form, Button, Row, Col, Input, message } from 'antd';
import { Link } from 'react-router-dom';
import { PASSWORD, V_CODE, MOBILE_CN } from '@/utils/regexp';
import { getSignUpCode, postSignUp } from '@/api/user.js';
import Cookies from 'js-cookie';
import history from '@/history';

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleGetCode = this.handleGetCode.bind(this);
  }
  componentDidMount() {
    console.log(process.env);
  }
  state = {
    count: 0
  }
  handleGetCode() {
    // console.log(getSignUpCode, 222);
    const keyName = 'mobile';
    this.props.form.validateFields([keyName], (err, values) => {
      if (!err) {
        getSignUpCode({ mobile: values[keyName]}).then(() => {
          let count = 59;
          this.setState({ count });
          this.interval = setInterval(() => {
            count -= 1;
            this.setState({ count });
            if (count === 0) {
              clearInterval(this.interval);
            }
          }, 1000);
        });
      }
    });
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        postSignUp(values).then(() => {
          message.success('注册成功');
          Cookies.set('user_mobile', values.mobile);
          history.push('/user/login');
        });
      }
    });
  }
  render() {
    const FormItem = Form.Item;
    const { count } = this.state;
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const validatorPassword = (rule, value, callback) => {
      if (value && value !== getFieldValue('password')) {
        callback('两次输入不一致');
      } else {
        callback();
      }
    };
    return (
      <UserLayout>
        <div className={styles.register}>
          <h3 className={styles.title}>注册</h3>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('username', {
                  rules: [{ required: true, message: '请输入用户名' }],
              })(
                <Input size="large" placeholder="用户名" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }, { pattern: PASSWORD, message: '请输入6到16位数字加字母的密码' }],
              })(
                <Input size="large" type="password" placeholder="密码" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('repassword', {	
                rules: [{ required: true, message: '请输入确认密码' }, { validator: validatorPassword, message: '两次输入不一致' }],
            })(
                <Input size="large" type="password" placeholder="确认密码" />
              )}
            </FormItem>
              <FormItem>
                {getFieldDecorator('mobile', {
                rules: [{ required: true, message: '请输入手机号码' }, { pattern: MOBILE_CN, message: '请输入正确的手机号码' }],
                })(
                  <Input size="large" placeholder="手机号码" />
                )}
              </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('code', {
                    rules: [{ required: true, message: '请输入验证码' }, { pattern: V_CODE, message: '请输入正确的四位数字验证码' }],
                  })(
                    <Input size="large" placeholder="验证码" />
                  )}
                </Col>
                <Col span={8}>
                  <Button
                    disabled={count}
                    className={styles.get_code}
                    size="large"
                    onClick={this.handleGetCode}
                  >
                    {count ? `${count} s重新获取` : '获取验证码'}
                  </Button>
                </Col>
              </Row>
            </FormItem>
            <FormItem>
              <Button  size="large" className={styles.submit_btn} type="primary" htmlType="submit">注册</Button>
              <Link className={styles.link} to='/user/login'>使用已有账号登录</Link>
            </FormItem>
          </Form>
        </div>
      </UserLayout>
    )
  }
}


const WrappedHorizontalLoginForm = Form.create()(Register);

export default WrappedHorizontalLoginForm;