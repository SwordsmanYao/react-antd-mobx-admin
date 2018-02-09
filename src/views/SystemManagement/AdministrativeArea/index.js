import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Button, Table, Divider, Popconfirm, message } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import AdministrativeAreaForm from './form';
import styles from './index.less';


const { Sider, Content } = Layout;

@inject('administrativeArea')
@observer
export default class AdministrativeArea extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      modalVisible: false,
    }
  }

  componentWillMount() {
    const { administrativeArea } = this.props;
    administrativeArea.reset();
    administrativeArea.fetchTree({
      ParentID: 0,
    });
    administrativeArea.refreshList();
  }

  componentWillUnmount() {
    const { administrativeArea } = this.props;
    administrativeArea.reset();
  }

  // 点击树节点时触发
  onSelect = (selectedKeys, info) => {
    console.log('selected', selectedKeys, info);
    const { administrativeArea } = this.props;

    if(selectedKeys.length > 0) {
      administrativeArea.setData({
        selectedKeys: selectedKeys,
        selectedInfo: info.node.props.dataRef,
      });
      
      administrativeArea.fetchList({
        ParentID: selectedKeys[0],
        CurrentPage: administrativeArea.pagination.current,
        PageSize: administrativeArea.pagination.pageSize,
      });
    }
  }
  // 树异步加载
  onLoadData = (treeNode) => {
    const { administrativeArea } = this.props;
    return new Promise((resolve) => {
      if (treeNode.props.children) {
        resolve();
        return;
      }
      console.log('onLoadData', treeNode.props.dataRef);
      administrativeArea.fetchTreeNode({
        ParentID: treeNode.props.dataRef.id,
      }).then(data => {
        treeNode.props.dataRef.children = data;

        administrativeArea.setData({
          treeList: [...administrativeArea.treeList],
        })
        resolve();
      });
    });
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
    const { administrativeArea } = this.props;
    console.log('record' ,record);
    
    const data = {...record};

    administrativeArea.setCurrentNode(data);
    this.setModalVisible(true); 
  }
  // 删除
  handleRemove = (record) => {
    const { administrativeArea } = this.props;

    administrativeArea.remove({
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
    const { administrativeArea } = this.props;
    const { setModalVisible } = this;
    const columns = [{
      title: '编号',
      dataIndex: 'PaiXuMa',
      key: 'PaiXuMa',
    }, {
      title: '名称',
      dataIndex: 'MingCheng',
      key: 'MingCheng',
    }, {
      title: '全拼',
      dataIndex: 'QuanPin',
      key: 'QuanPin',
    }, {
      title: '简拼',
      dataIndex: 'JianPin',
      key: 'JianPin',
    }, {
      title: '描述',
      dataIndex: 'MiaoShu',
      key: 'MiaoShu',
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
        <Sider width={250} style={{ background: '#fff' }}>
          <DisplayTree
            treeList={[{
              id: '0',
              name: '行政地区',
              depthlevel: 0,
              children: administrativeArea.treeList.slice(),
            }]}
            defaultExpandedKeys={['0']}
            onSelect={this.onSelect}
            selectedKeys={administrativeArea.selectedKeys.slice()}
            loadData={this.onLoadData}
          />
        </Sider>
        <Content style={{ background: '#fff', marginLeft: 10, padding: 30 }}>
          <div className={styles.toolbar}>
            <Button
              icon="plus"
              onClick={this.handleNew}
              loading={administrativeArea.newBtnLoading}
            >新建</Button>
            <AdministrativeAreaForm
              administrativeArea={administrativeArea}
              modalVisible={this.state.modalVisible}
              setModalVisible={setModalVisible}
            />
          </div>
          <Table
            bordered
            size="small"
            loading={administrativeArea.loading}
            pagination={administrativeArea.pagination}
            dataSource={administrativeArea.list.slice()}
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
