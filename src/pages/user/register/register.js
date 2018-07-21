import React, { Component } from 'react';
import UserLayout from '@/layouts/user-layout/user-layout';
import styles from './register.scss';
import { Form, Button, Row, Col, Input, Icon, Checkbox } from 'antd';
import { Link } from 'react-router-dom';

class Register extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
  state = {
    count: 0
  }
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const FormItem = Form.Item;
    const { count } = this.state;
    const { getFieldDecorator } = this.props.form;
    return (
      <UserLayout>
        <div className={styles.register}>
          <h3 className={styles.title}>注册</h3>
          <Form onSubmit={this.handleSubmit}>
            <FormItem>
              {getFieldDecorator('邮箱', {
                  rules: [{ required: true, message: '请输入邮箱' }],
              })(
                <Input size="large" placeholder="邮箱" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [{ required: true, message: '请输入密码' }],
              })(
                <Input size="large" type="password" placeholder="密码" />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('confirm_password', {
                rules: [{ required: true, message: '请输入确认密码' }],
              })(
                <Input size="large" type="password" placeholder="确认密码" />
              )}
            </FormItem>
              <FormItem>
                {getFieldDecorator('mobile', {
                  rules: [{ required: true, message: '请输入手机号码' }],
                })(
                  <Input size="large" placeholder="手机号码" />
                )}
              </FormItem>
            <FormItem>
              <Row gutter={8}>
                <Col span={16}>
                  {getFieldDecorator('vcode', {
                    rules: [{ required: true, message: '请输入验证码' }],
                  })(
                    <Input size="large" placeholder="验证码" />
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
            <FormItem>
              <Button size="large" className={styles.submit_btn} type="primary" htmlType="submit">注册</Button>
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