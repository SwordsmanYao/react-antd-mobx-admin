import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Modal, message } from 'antd';

import MenuButtonForm from './form';
import styles from './index.less';


const { Content } = Layout;
const { confirm } = Modal;

@inject('menuButton', 'menu')
@observer
export default class MenuButton extends Component {
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
    const { menuButton } = this.props;
    menuButton.reset();
    menuButton.refreshList();
  }

  componentWillUnmount() {
    const { menuButton } = this.props;
    menuButton.reset();
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
    const { menuButton, menu } = this.props;
    menuButton.fetchMenuButtonTree({
      Menu_ID: menu.currentForm.UniqueID.value,
    });
  }

  // 修改
  handleEdit = (record) => {
    const { menuButton, menu } = this.props;

    menuButton.fetchMenuButtonTree({
      Menu_ID: menu.currentForm.UniqueID.value,
    }).then(() => {
      menuButton.fetchDetail({
        UniqueID: record.id,
      }).then(() => {
        this.setModalVisible(true);
      }).catch((e) => {
        message.error(`操作失败：${e.Message}`);
      });
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { menuButton } = this.props;

    menuButton.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  render() {
    const { menuButton, menu } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: 'name',
      key: 'name',
      width: 120,
    }, {
      title: '编号',
      dataIndex: 'path',
      key: 'path',
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
                      this.handleRemove([record.id]);
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
              loading={menuButton.newBtnLoading}
            >新建</Button>
            <MenuButtonForm
              menuButton={menuButton}
              menu={menu}
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible}
            />
          </div>
          <Table
            bordered
            size="small"
            loading={menuButton.loading}
            pagination={false}
            dataSource={menuButton.list.slice()}
            columns={columns}
            rowKey="id"
            onChange={this.handleTableChange}
            scroll={{ y: 206 }}
          />
        </Content>
      </Layout>
    );
  }
}
