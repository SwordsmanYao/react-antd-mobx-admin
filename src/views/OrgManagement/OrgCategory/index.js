import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Modal, message } from 'antd';

import OrgCategoryForm from './form';
import styles from './index.less';


const { Content } = Layout;
const { confirm } = Modal;

@inject('orgCategory')
@observer
export default class OrgCategory extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modalVisible: false,
    }
  }

  componentWillMount() {
    const { orgCategory } = this.props;
    orgCategory.reset();
    orgCategory.refreshList();
  }

  componentWillUnmount() {
    const { orgCategory } = this.props;
    orgCategory.refreshList();
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
    const { orgCategory } = this.props;
    console.log('record' ,record);

    orgCategory.fetchDetail({
      UniqueID: record.UniqueID,
    }).then(() => {
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }
  // 删除
  handleRemove = (record) => {
    const { orgCategory } = this.props;

    orgCategory.remove({
      UniqueID: record.UniqueID,
    }).then(() => {
      message.success('删除成功');
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
  }

  render() {
    const { orgCategory } = this.props;

    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: 120,
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
      width: 120,
    },  {
      title: '描述',
      dataIndex: 'DescInfo',
      key: 'DescInfo',
      width: 120,
    },{
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
          <Divider type="vertical" />
            <a
              onClick={(e) => {
                confirm({
                  title: "确认要删除这条记录吗？",
                  content: '',
                  onOk: () => {
                    this.handleRemove(record);
                  },
                });
              }}
            >删除
            </a>
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
              loading={orgCategory.newBtnLoading}
            >新建</Button>
            <OrgCategoryForm
              orgCategory={orgCategory}
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible}
            />
          </div>
          <Table
            bordered
            size="small"
            loading={orgCategory.loading}
            pagination={false}
            dataSource={orgCategory.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            scroll={{ y: window.innerHeight - 220 }}
          />
        </Content>
      </Layout>
    );
  }
}
