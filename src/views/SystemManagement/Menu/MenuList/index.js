import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Modal, message } from 'antd';

import MenuListForm from './form';
import styles from './index.less';


const { Content } = Layout;
const { confirm } = Modal;

@inject('menuList', 'menu')
@observer
export default class MenuList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    }
  }

  // StepModal 组件调用方法
  handleNextStep = (callback) => {
    callback();
  }

  componentWillMount() {
    const { menuList } = this.props;
    menuList.reset();
    menuList.refreshList();
  }

  componentWillUnmount() {
    const { menuList } = this.props;
    menuList.reset();
  }


  // 设置模态框显示/隐藏
  setModalVisible = (modalVisible) => {
    this.setState({
      modalVisible,
    });
  }

  // 新建
  handleNew = () => {
    this.setModalVisible(true);
  }

  // 修改
  handleEdit = (record) => {
    const { menuList } = this.props;

    menuList.fetchDetail({
      UniqueID: record.UniqueID,
    }).then(() => {
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });

  }

  // 删除
  handleRemove = (Params) => {
    const { menuList } = this.props;

    menuList.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  render() {
    const { menuList, menu } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: 120,
    }, {
      title: '编号',
      dataIndex: 'Number',
      key: 'Number',
      width: 120,
    }, {
      title: '排序代码',
      dataIndex: 'SortCode',
      key: 'SortCode',
      width: 120,
    }, {
      title: '操作',
      key: 'Action',
      width: 120,
      render: (text, record) => (
        <span>
          <a
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              this.handleEdit(record);
            }}
          >编辑
          </a>
          {
            !(record.hasChildren && record.children && record.children.length > 0) &&
            <span>
              <Divider type="vertical" />
              <a
                onClick={(e) => {
                  confirm({
                    title: "确认要删除这条记录吗？",
                    content: '',
                    onOk: () => {
                      this.handleRemove([record.UniqueID]);
                    },
                  });
                }}
              >删除
              </a>
            </span>
          }
          
        </span>
      ),
    }];

    return (
      <Layout className={styles.layout}>
        <Content style={{ paddingLeft: 30, paddingRight: 30 }}>
          <div className={styles.toolbar}>
            <Button
              icon="plus"
              onClick={this.handleNew}
              loading={menuList.newBtnLoading}
            >新建</Button>
            <MenuListForm
              menuButton={menuList}
              menu={menu}
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible}
            />
          </div>
          <Table
            bordered
            size="small"
            loading={menuList.loading}
            pagination={false}
            dataSource={menuList.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            scroll={{ y: 206 }}
          />
        </Content>
      </Layout>
    );
  }
}
