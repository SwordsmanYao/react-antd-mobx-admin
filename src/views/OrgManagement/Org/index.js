import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Modal, message } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import OrgForm from './form';
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
  handleEdit = (record) => {
    const { org } = this.props;
    console.log('record' ,record);

    org.fetchDetail({
      UniqueID: record.UniqueID,
    }).then(() => {
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }
  // 删除
  handleRemove = (record) => {
    const { org } = this.props;

    org.remove({
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
            <a
              onClick={(e) => {
                confirm({
                  title: "如果有子节点会一同删除，确认要删除这条记录吗？",
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
          <div className={styles.toolbar}>
            <Button
              icon="plus"
              onClick={this.handleNew} 
              loading={org.newBtnLoading}
            >新建</Button>
            <OrgForm
              org={org}
              modalVisible={this.state.modalVisible}
              setModalVisible={this.setModalVisible}
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
            scroll={{ y: window.innerHeight - 220 }}
          />
        </Content>
      </Layout>
    );
  }
}
