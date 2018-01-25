import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Popconfirm } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import OrgForm from './form';
import styles from './index.less';


const { Sider, Content } = Layout;

@inject('org')
@observer
export default class Org extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false, // 新建的模态框是否显示
    };
    
    this.onSelect = this.onSelect.bind(this);
    this.setModalVisible = this.setModalVisible.bind(this);
    this.handleNew = this.handleNew.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
  }

  componentWillMount() {
    const { org } = this.props;

    org.fetchTree();
    org.fetchList({
      ParentID: org.selectedKeys[0],
      PageSize: org.pagination.pageSize,
      CurrentPage: org.pagination.current,
    });
  }

  // 点击树节点时触发
  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { org } = this.props;

    org.setData({
      selectedKeys: selectedKeys,
    });

    org.fetchList({
      ParentID: selectedKeys[0],
    });
  }

  // 设置模态框显示/隐藏
  setModalVisible(modalVisible) {
    this.setState({ modalVisible });
  }

  // 新建
  handleNew = () => {
    this.setModalVisible(true);
  }

  // 修改
  handleEdit = (record) => {
    const { org } = this.props;
    console.log('record' ,record);

    org.fetchDetail({
      UniqueID: record.UniqueID,
    }).then(() => {
      this.setModalVisible(true);
    });

    
  }
  // 删除
  handleRemove = (record) => {
    const { org } = this.props;

    org.remove({
      UniqueID: record.UniqueID,
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
  }

  render() {
    const { org } = this.props;
    const { modalVisible } = this.state;
    const { setModalVisible } = this;
    const columns = [{
      title: '名称',
      dataIndex: 'FullName',
      key: 'Name',
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
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
          <Divider type="vertical" />
          <Popconfirm 
            placement="bottom" 
            title="如果有子节点会一同删除，确认要删除这条记录吗？" 
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
        <Sider width={230} style={{ background: '#fff' }}>
          {
            org.treeList && org.treeList.length > 0 &&
              <DisplayTree
                treeList={[{
                  id: '0',
                  name: '组织机构',
                  children: org.treeList.slice(),
                }]}
                defaultExpandedKeys={['0']}
                onSelect={this.onSelect}
                selectedKeys={org.selectedKeys.slice()}
              />
          }
        </Sider>
        <Content style={{ background: '#fff', marginLeft: 10, padding: 30 }}>
          <div className={styles.toolbar}>
            <Button 
              onClick={this.handleNew} 
              loading={org.newBtnLoading}
            >新建</Button>
            <OrgForm
              org={org}
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
            />
          </div>
          <Table
            bordered
            loading={org.loading}
            pagination={org.pagination}
            dataSource={org.list.slice()}
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
