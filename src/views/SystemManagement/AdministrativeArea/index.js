import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Divider, Modal, message } from 'antd';

import DisplayTree from '@/components/DisplayTree';
import AdministrativeAreaForm from './form';
import AdministrativeAreaToolBar from './toolBar';
import styles from './index.less';


const { Sider, Content } = Layout;
const { confirm } = Modal;

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
        pagination: {
          ...administrativeArea.pagination,
          current: 1,
        },
      });
      
      administrativeArea.fetchList({
        ParentID: selectedKeys[0],
        CurrentPage: 1,
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
    
    const data = {
      ...record,
      OldUniqueID: record.UniqueID,
    };

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

  // 表格分页、排序等的回调函数
  handleTableChange = (pagination, filters, sorter) => {
    const { administrativeArea } = this.props;

    // 排序数据
    // const sorterData = {};
    // if(sorter.field) {
    //   sorterData.OrderField = sorter.field;
    //   if(sorter.order === 'descend') {
    //     sorterData.IsDesc = true;
    //   } else {
    //     sorterData.IsDesc = false;
    //   }
    // }

    // 修改 store 数据
    administrativeArea.setData({
      pagination: {
        ...administrativeArea.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      // orderField: sorterData.OrderField || null,
      // isDesc: sorterData.IsDesc || false,
    });

    // 发起请求
    administrativeArea.fetchList({
      CurrentPage: pagination.current,
      PageSize: pagination.pageSize,
      ...administrativeArea.searchFormValues,
      // ...sorterData,
    });
  }

  render() {
    const { administrativeArea } = this.props;
    const { setModalVisible } = this;
    const columns = [{
      title: '编号',
      dataIndex: 'UniqueID',
      key: 'UniqueID',
      width: 80,
    }, {
      title: '名称',
      dataIndex: 'MingCheng',
      key: 'MingCheng',
      width: 120,
    }, {
      title: '全拼',
      dataIndex: 'QuanPin',
      key: 'QuanPin',
      width: 180,
    }, {
      title: '简拼',
      dataIndex: 'JianPin',
      key: 'JianPin',
      width: 80,
    }, {
      title: '描述',
      dataIndex: 'MiaoShu',
      key: 'MiaoShu',
      width: 120,
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
        <Sider width={250} style={{ height: window.innerHeight - 110, overflowY: 'scroll', overflowX: 'auto', background: '#fff' }}>
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
        <Content style={{ paddingLeft: 30, paddingRight: 30 }}>
          <AdministrativeAreaToolBar
            administrativeArea={administrativeArea}
            handleNew={this.handleNew}
          />
          <AdministrativeAreaForm
            administrativeArea={administrativeArea}
            modalVisible={this.state.modalVisible}
            setModalVisible={setModalVisible}
          />
          <Table
            bordered
            size="small"
            loading={administrativeArea.loading}
            pagination={administrativeArea.pagination}
            dataSource={administrativeArea.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            scroll={{ y: window.innerHeight - 255 }}
          />
        </Content>
      </Layout>
    );
  }
}
