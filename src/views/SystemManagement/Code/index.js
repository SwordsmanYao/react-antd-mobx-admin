import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Divider, Modal, message } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import CodeForm from './form';
import CodeToolBar from './toolBar';
import styles from './index.less';


const { Sider, Content } = Layout;
const { confirm } = Modal;

@inject('code')
@observer
export default class Code extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      modalVisible: false,
    }
  }

  componentWillMount() {
    const { code } = this.props;
    code.reset();
    code.fetchTree();
    code.refreshList();
  }

  componentWillUnmount() {
    const { code } = this.props;
    code.reset();
  }

  handleTableChange = (pagination, filters, sorter) => {
    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);
  }

  // 点击树节点时触发
  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { code } = this.props;

    if(selectedKeys.length > 0) {
      code.setData({
        selectedKeys: selectedKeys,
      });
      
      code.fetchList({
        ParentID: selectedKeys[0],
        CurrentPage: code.pagination.current,
        PageSize: code.pagination.pageSize,
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
    const { code } = this.props;
    console.log('record' ,record);
    
    const data = {...record};

    code.setCurrentNode(data);
    this.setModalVisible(true); 
  }
  // 删除
  handleRemove = (record) => {
    const { code } = this.props;

    code.remove({
      UniqueID: record.UniqueID,
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
    const { code } = this.props;
    const { setModalVisible } = this;
    const columns = [{
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: 120,
    }, {
      title: '代码值',
      dataIndex: 'CodeValue',
      key: 'CodeValue',
      width: 80,
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
      width: 80,
    }, {
      title: '类型',
      dataIndex: 'Category',
      key: 'Category',
      width: 80,
      render: (text, record) => (
        text === 1 ? '分类' : '代码'
      ),
    }, {
      title: '描述',
      dataIndex: 'Remark',
      key: 'Remark',
      width: 160,
    }, {
      title: '操作',
      key: 'Action',
      width: 100,
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
              name: '代码管理',
              children: code.treeList.slice(),
            }]}
            defaultExpandedKeys={['0']}
            onSelect={this.onSelect}
            selectedKeys={code.selectedKeys.slice()}
          />
        </Sider>
        <Content style={{ paddingLeft: 30, paddingRight: 30 }}>
          <CodeToolBar
            code={code}
            handleNew={this.handleNew}
          />
          <CodeForm
            code={code}
            modalVisible={this.state.modalVisible}
            setModalVisible={setModalVisible}
          />
          <Table
            bordered
            size="small"
            loading={code.loading}
            pagination={false}
            dataSource={code.list.slice()}
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
