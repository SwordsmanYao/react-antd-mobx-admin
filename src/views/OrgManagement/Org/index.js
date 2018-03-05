import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Modal, message, Alert } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import OrgForm from './form';
import OrgToolBar from './toolBar'
import styles from './index.less';


const { Sider, Content } = Layout;
const { confirm } = Modal;

@inject('org')
@observer
export default class Org extends Component {
  constructor(props) {
    super(props);

    this.state = {
      // 新建的模态框是否显示
      modalVisible: false,
    }
  }

  componentWillMount() {
    const { org } = this.props;
    org.reset();
    org.fetchTree();
    org.refreshList();
  }

  componentWillUnmount() {
    const { org } = this.props;
    org.reset();
  }

  // 点击树节点时触发
  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { org } = this.props;

    if(selectedKeys.length > 0) {
      org.setData({
        selectedKeys: selectedKeys,
      });
      
      org.fetchList({
        ParentID: selectedKeys[0],
        // CurrentPage: org.pagination.current,
        // PageSize: org.pagination.pageSize,
      });
    }
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
  handleEdit = () => {
    const { org } = this.props;

    org.fetchDetail().then(() => {
      org.setCurrentForm(org.currentDetail);
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }
  
  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { org } = this.props;

    org.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { org } = this.props;

    
    confirm({
      title: `确认要删除这 ${org.selectedRowKeys.length} 条记录吗?`,
      content: '',
      onOk: () => {
        this.handleRemove(org.selectedRowKeys);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { org } = this.props;

    org.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
      // 在选中条目中清除已经删除的
      org.setData({
        selectedRowKeys: org.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
      });
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    const { org } = this.props;

    org.setData({
      selectedRowKeys,
    });
  }

  render() {
    const { org } = this.props;
    const columns = [{
      title: '名称',
      dataIndex: 'FullName',
      key: 'FullName',
      width: 120,
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
      width: 120,
    }];

    return (
      <Layout className={styles.layout}>
        <Sider width={220} style={{ height: window.innerHeight - 110, overflowY: 'scroll', overflowX: 'auto', background: '#fff' }}>
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
        </Sider>
        <Content style={{ paddingLeft: 24 }}>
          <OrgToolBar 
            org={org}
            handleNew={this.handleNew}
            handleEdit={this.handleEdit}
            handleRemoveChecked={this.handleRemoveChecked}
          />
          <OrgForm
            org={org}
            modalVisible={this.state.modalVisible}
            setModalVisible={this.setModalVisible}
          />
          <div className={styles.tableAlert}>
            <Alert
              message={(
                <div>
                  已选择 <a style={{ fontWeight: 600 }}>{org.selectedRowKeys.length}</a> 项
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={org.selectedRowKeys.length <= 0}>清空</a>
                </div>
              )}
              type="info"
              showIcon
            />
          </div>
          <Table 
            bordered
            size="small"
            loading={org.loading}
            pagination={false}
            dataSource={org.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            rowSelection={{
              selectedRowKeys: org.selectedRowKeys,
              onChange: this.onSelectionChange,
            }}
            scroll={{ y: window.innerHeight - 220 }}
          />
        </Content>
      </Layout>
    );
  }
}
