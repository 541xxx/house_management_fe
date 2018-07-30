/*
 * @Author: Hayden Woo 
 * @Date: 2018-07-22 13:32:23 
 * @Last Modified by: Hayden Woo
 * @Last Modified time: 2018-07-31 00:09:01
 */

import React, { Component } from 'react';
import BasicLayout from '@/layouts/basic-layout/basic-layout';
import styles from './houses.scss';
import { Button, Menu, Dropdown, Icon, Table, Modal, Input, Message, Pagination, Spin } from 'antd';
import { getHouses, postRepetition, releaseHouses, deleteHouses } from '@/api/houses';
class Houses extends Component {
  constructor(props) {
    super(props);
    this.handleModalCancel = this.handleModalCancel.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleModalOk = this.handleModalOk.bind(this);
    this.handleRelease = this.handleRelease.bind(this);
    this.handlePagination = this.handlePagination.bind(this);
    this.fetchHouses = this.fetchHouses.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  state = {
    visible: false,
    confirmLoading: false,
    houses: [],
    loading: false,
    inputUrl: '',
    selectedRows: [], // 当前选中的数据
    selectedRowKeys: [], //当前选中的key数组 也就是houseids
    page: 1,
    total: 0,
    pageSize: 20,
    releaseLoading: false,
    wrapperLoading: false
  }

  componentDidMount() {
    this.fetchHouses();
  }
  fetchHouses(page = this.state.page) {
    this.setState({
      loading: true
    });
    getHouses({
      page,
      page_size: 20
    }).then(res => {
      const data = res.data.data;
      this.setState({
        houses: data.data,
        total: data.total_num,
         page: data.page,
        loading: false,
        selectedRowKeys: [] // 清空选中的列
      });
    }).catch(() => {
      this.setState({
        loading: false
      });
    });
  }
  showModal = () => {
    this.setState({
      visible: true,
    });
  }
  handleModalCancel() {
    this.setState({
      visible: false,
    });
  }
  handleModalOk() {
    this.setState({
      confirmLoading: true
    });
    postRepetition({
      url: this.state.inputUrl
    }).then(() => {
      Message.success('采集成功');
      this.setState({
        visible: false,
        confirmLoading: false
      });

    }).catch(() => {
      this.setState({
        confirmLoading: false
      });
    })
  }
  handleChange(key, e) {
    this.setState({
      [key]: e.target.value
    });
  }
  /**
   *
   * @param {*String} action 取消发布 or 发布
   * @memberof Accounts
   */
  handleRelease(action) {
    if (!this.state.selectedRows.length) {
      return;
    }
    const purpose = this.state.selectedRows[0].purpose; // 房源类型
    // const houseids = this.state.selectedRows.map(v => v.houseid); // 当前选中的房源
    const every = this.state.selectedRows.every(v => v.purpose === purpose); // 所有房源类型是否相等
    const everySame = this.state.selectedRows.every(v => v.realy_push_shop !== action); // 所有房源状态是否相等
    if (!every) {
      Message.error('只能操作同类型的房源');
      return;
    }
    if (!everySame) {
      const text = action === 'True' ? '发布未发布' : '取消已发布';
      Message.error(`只能${text}状态的房源`);
      return;
    }
    const loadingKeyName = action === 'True' ? 'releaseLoading' : 'wrapperLoading';
    this.setState({
      [loadingKeyName]: true
    });
    releaseHouses({
      houseids: this.state.selectedRowKeys,
      purpose,
      action: action
    }).then(() => {
      const messages = action === 'True' ? '发布成功' : '取消发布成功';
      this.state.selectedRows.map(v => v.realy_push_shop = action);
      this.setState({
        selectedRowKeys: [],
        [loadingKeyName]: false
      });
      Message.success(messages);
    }).catch(() => {
      this.setState({
        [loadingKeyName]: false
      });
    });
  }

  handlePagination(page) {
    this.setState({
      page: page
    });
    this.fetchHouses(page);
  }

  handleDelete() {
    const _this = this;
    Modal.confirm({
      title: '提示',
      content: `确认删除选中房源？`,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        _this.setState({
          wrapperLoading: true
        })
        deleteHouses({
          houseids: _this.state.selectedRowKeys
        }).then(() => {
          _this.setState({
            wrapperLoading: false
          });
          Message.success('删除成功');
          _this.fetchHouses();
        }).catch(() => {
          _this.setState({
            wrapperLoading: false
          });
        });
      }
    });
  }

  render() {
    const { Column } = Table;
    const rowSelection = {
      selectedRowKeys: this.state.selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRows,
          selectedRowKeys
        });
      },
      getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User', // Column configuration not to be checked
        name: record.name,
      }),
    }
    const menu = (
      <Menu className={styles.dropdown_menu}>
        <Menu.Item onClick={() => this.handleRelease('False')}>
          取消发布
        </Menu.Item>
        <Menu.Item onClick={this.handleDelete}>
          删除
        </Menu.Item>
      </Menu>
    );
    return (
      <BasicLayout pathname={this.props.location.pathname}>
        <Spin tip="操作中" spinning={this.state.wrapperLoading}>
          <div className={styles.houses}>
            <div className={styles.operate}>
              <Button type="primary" loading={this.state.releaseLoading} onClick={() => this.handleRelease('True')}>发布</Button>
              <Dropdown overlay={menu} className={styles.dropdown}>
                <a href="javascript:;">
                  其他操作
                    <Icon type="down" className={styles.icon_down} />
                </a>
              </Dropdown>
              <Button className="common-fr" type="primary" onClick={this.showModal}>采集房源</Button>
            </div>
            <Table rowSelection={rowSelection} selectedRowKeys={this.state.selectedRowKeys} dataSource={this.state.houses} rowKey="houseid" loading={this.state.loading} pagination={false}>
              <Column
                title="房源标题"
                dataIndex="title"
                key="title"
              />
              <Column
                title="房源信息"
                dataIndex="projname"
                key="projname"
              />
              <Column
                title="价格"
                dataIndex="property"
                key="property"
              />
              <Column
                title="类型"
                dataIndex="purpose"
                key="purpose"
              />
              <Column
                title="状态"
                dataIndex="realy_push_shop"
                key="realy_push_shop"
                render={(text, record) => (
                  text === 'True' ? '已发布' : '未发布'
                )}
              />
              <Column
                title="发布时间"
                key="action"
                dataIndex="input_time"
                key="input_time"
              />
              {/* <Column
                title="发布时间"
                key="action"
                render={(text, record) => (
                  <span>
                    <a href="javascript:;">2018-07-25</a>
                  </span>
                )}
              /> */}
            </Table>
            <Pagination onChange={this.handlePagination} hideOnSinglePage={true} defaultPageSize={this.state.pageSize} defaultCurrent={Number(this.state.page)} total={Number(this.state.total)} className={styles.pagination} />,
            <Modal
              title="采集房源"
              visible={this.state.visible}
              onCancel={this.handleModalCancel}
              className={styles.modal}
              footer={null}

            >
              <div className={styles.modal_content}>
                <div className={styles.title}>请输入房源链接</div>
                <Input onChange={(v) => this.handleChange('inputUrl', v)} className={styles.input_url} placeholder="http://" />
                <Button onClick={this.handleModalOk} loading={this.state.confirmLoading} className={styles.collect} type="primary">采集到账户</Button>
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
        </Spin>
      </BasicLayout>
    )
  }
}

export default Houses;