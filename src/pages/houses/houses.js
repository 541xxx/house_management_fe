/*
 * @Author: Hayden Woo 
 * @Date: 2018-07-22 13:32:23 
 * @Last Modified by: Hayden Woo
 * @Last Modified time: 2018-07-22 17:32:25
 */

import React, { Component } from 'react';
import BasicLayout from '@/layouts/basic-layout/basic-layout';
import styles from './houses.scss';
import { Button, Menu, Dropdown, Icon, Table, Modal, Input } from 'antd';
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
    const { Column } = Table;
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    }
    const data = [{
      key: '1',
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
    const menu = (
      <Menu className={styles.dropdown_menu}>
        <Menu.Item>
          取消发布
        </Menu.Item>
        <Menu.Item>
          删除
        </Menu.Item>
      </Menu>
    );
    return (
      <BasicLayout pathname={this.props.location.pathname}>
        <div className={styles.houses}>
          <div className={styles.operate}>
            <Button type="primary">发布</Button>
            <Dropdown overlay={menu} className={styles.dropdown}>
              <a href="javascript:;">
                其他操作
                  <Icon type="down" className={styles.icon_down} />
              </a>
            </Dropdown>
            <Button className="common-fr" type="primary" onClick={this.showModal}>采集房源</Button>
          </div>
          <Table rowSelection={rowSelection}  dataSource={data}>
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
              <Button className={styles.collect} type="primary">采集到账户</Button>
              <div className={styles.instructions}>
                <div className={styles.subtitle}>采集说明</div>
                <p className={styles.desc}>
                  1、打开房天下二手房找房源链接：http://esf.fang.com/ <br />
                  2、当前默认账号非包月复制一毛一条，当前默认账号包月免费复制 <br />
                  3、复制房源带视频的，有其他用处可以自己下载到电脑 <br />
                  4、支持以下8种房源类型链接 <br />
                  住宅出售：http://esf.sh.fang.com/chushou/3_888888888.htm <br />
                  别墅出售：http://esf.sh.fang.com/chushou/10_888888888.htm <br />
                  商铺出售：http://shop.sh.fang.com/shou/3_888888888.html <br />
                  写字楼出售：http://office.sh.fang.com/shou/3_888888888.html <br />
                  住宅整租：http://zu.sh.fang.com/chuzu/3_888888888_1.htm <br />
                  别墅出租：http://zu.sh.fang.com/chuzu/10_888888888_1.htm <br />
                  商铺出租：http://shop.sh.fang.com/zu/3_888888888.html <br />
                  写字楼出租：http://office.sh.fang.com/zu/3_888888888.html <br />
                </p>
              </div>
            </div>
          </Modal>
        </div>
      </BasicLayout>
    )
  }
}

export default Accounts;