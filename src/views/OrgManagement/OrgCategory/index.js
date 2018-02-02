import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Popconfirm, message } from 'antd';

import OrgCategoryForm from './form';
import styles from './index.less';


const { Content } = Layout;

@inject('orgCategory')
@observer
export default class OrgCategory extends Component {
  constructor(props) {
    super(props);

    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentWillMount() {
    const { orgCategory } = this.props;
    orgCategory.refreshList();
  }


  // 设置模态框显示/隐藏
  setModalVisible(modalVisible) {
    const { orgCategory } = this.props;

    orgCategory.setData({
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
    const { setModalVisible } = this;
    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
    },  {
      title: '描述',
      dataIndex: 'DescInfo',
      key: 'DescInfo',
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
          <Popconfirm
            placement="bottom" 
            title="确认要删除这条记录吗？" 
            onConfirm={() => { this.handleRemove(record); }} 
            okText="是" 
            cancelText="否"
          >
            <a
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >删除
            </a>
          </Popconfirm>

        </span>
      ),
    }];

    return (
      <Layout className={styles.layout}>
        <Content style={{ background: '#fff', padding: 30 }}>
          <div className={styles.toolbar}>
            <Button
              icon="plus"
              onClick={this.handleNew}
              loading={orgCategory.newBtnLoading}
            >新建</Button>
            <OrgCategoryForm
              orgCategory={orgCategory}
              modalVisible={orgCategory.modalVisible}
              setModalVisible={setModalVisible}
            />
          </div>
          <Table
            size="small"
            loading={orgCategory.loading}
            pagination={orgCategory.pagination}
            dataSource={orgCategory.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            locale={{
              filterTitle: '筛选',
              filterConfirm: '确定',
              filterReset: '重置',
              emptyText: '暂无数据',
            }}
          />
        </Content>
      </Layout>
    );
  }
}
