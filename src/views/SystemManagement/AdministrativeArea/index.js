import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Modal, message, Alert } from 'antd';

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
  handleEdit = () => {
    const { administrativeArea } = this.props;

    administrativeArea.fetchDetail().then(() => {
      administrativeArea.setCurrentForm({
        ...administrativeArea.currentDetail,
        OldUniqueID: administrativeArea.currentDetail.UniqueID,
      });
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { administrativeArea } = this.props;

    administrativeArea.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { administrativeArea } = this.props;

    
    confirm({
      title: `确认要删除这 ${administrativeArea.selectedRowKeys.length} 条记录吗?`,
      content: '',
      onOk: () => {
        this.handleRemove(administrativeArea.selectedRowKeys);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { administrativeArea } = this.props;

    administrativeArea.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
      // 在选中条目中清除已经删除的
      administrativeArea.setData({
        selectedRowKeys: administrativeArea.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
      });
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

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    const { administrativeArea } = this.props;

    administrativeArea.setData({
      selectedRowKeys,
    });
  }

  render() {
    const { administrativeArea } = this.props;
    const { setModalVisible } = this;
    const columns = [{ 
      title: '序号',
      dataIndex: 'NO',
      width: '7%',
      className:'alignCenter', 
      render: (text, row, index) =>(
        index + 1 + (administrativeArea.pagination.current - 1) * administrativeArea.pagination.pageSize
      ),
    }, {
      title: '编号',
      dataIndex: 'UniqueID',
      key: 'UniqueID',
      width: '20%',
    }, {
      title: '名称',
      dataIndex: 'MingCheng',
      key: 'MingCheng',
      width: '20%',
    }, {
      title: '全拼',
      dataIndex: 'QuanPin',
      key: 'QuanPin',
      width: '20%',
    }, {
      title: '简拼',
      dataIndex: 'JianPin',
      key: 'JianPin',
      width: '20%',
    }, {
      title: '描述',
      dataIndex: 'MiaoShu',
      key: 'MiaoShu',
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
        <Content style={{ paddingLeft: 24 }}>
          <AdministrativeAreaToolBar
            administrativeArea={administrativeArea}
            handleNew={this.handleNew}
            handleEdit={this.handleEdit}
            handleRemoveChecked={this.handleRemoveChecked}
          />
          <AdministrativeAreaForm
            administrativeArea={administrativeArea}
            modalVisible={this.state.modalVisible}
            setModalVisible={setModalVisible}
          />
           <div className={styles.tableAlert}>
            <Alert
              message={(
                <div>
                  已选择 <a style={{ fontWeight: 600 }}>{administrativeArea.selectedRowKeys.length}</a> 项
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={administrativeArea.selectedRowKeys.length <= 0}>清空</a>
                </div>
              )}
              type="info"
              showIcon
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
            rowSelection={{
              selectedRowKeys: administrativeArea.selectedRowKeys,
              onChange: this.onSelectionChange,
            }}
            scroll={{ y: window.innerHeight - 293 }}
          />
        </Content>
      </Layout>
    );
  }
}
