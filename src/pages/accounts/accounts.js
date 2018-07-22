/*
 * @Author: Hayden Woo 
 * @Date: 2018-07-22 13:32:23 
 * @Last Modified by: Hayden Woo
 * @Last Modified time: 2018-07-22 17:05:10
 */

import React, { Component } from 'react';
import BasicLayout from '@/layouts/basic-layout/basic-layout';
import styles from './accounts.scss';
import { Button, Menu, Dropdown, Icon, Table, Modal, Input, Divider } from 'antd';
class Accounts extends Component {
  state = {
    visible: false
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    const { Column, ColumnGroup } = Table;
    const data = [
      {
        website: '58同城',
        name: 'Brown',
        username: 'Jack',
        type: '包月',
        expire_date: '2018-08-02',
        status: '正常'
      },
      {
        website: '58同城1',
        name: 'Brown',
        username: 'Jack',
        type: '包月',
        expire_date: '2018-08-02',
        status: '正常'
      }
  ];
    return (
      <BasicLayout pathname={this.props.location.pathname}>
        <div className={styles.accounts}>
          <div className={styles.operate}>
            <Button icon="plus" type="primary" onClick={this.showModal}>新增账号</Button>
          </div>
          <Table dataSource={data}>
            <Column
              title="序号"
              key="action"
              render={(text, record, index) => (
              <span>{index + 1}</span>
              )}
            />
            <Column
              title="网站"
              dataIndex="website"
            />
            <Column
              title="姓名"
              dataIndex="name"
            />
            <Column
              title="用户名"
              dataIndex="username"
            />
            <Column
              title="类型"
              dataIndex="type"
            />
            <Column
              title="到期日期"
              dataIndex="expire_date"
            />
            <Column
              title="登录状态"
              dataIndex="status"
            />
            <Column
              title="操作"
              render={(text, record) => (
                <span>
                  <a href="javascript:;">续费</a>
                  <Divider type="vertical" />
                  <a href="javascript:;">改密</a>
                  <Divider type="vertical" />
                  <a href="javascript:;">删除</a>
                </span>
              )}
            />
          </Table>
          <Modal
            title="采集房源"
            visible={this.state.visible}
            onCancel={this.handleCancel}
            className={styles.modal}
            footer={null}
          >
            <div className={styles.modal_content}>
              <div className={styles.title}>请输入房源链接</div>
              <Input className={styles.input_url} placeholder="http://" />
            </div>
          </Modal>
        </div>
      </BasicLayout>
    )
  }
}

export default Accounts;