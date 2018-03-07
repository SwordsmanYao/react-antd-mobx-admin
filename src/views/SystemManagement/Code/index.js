import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Layout, Table, Modal, message, Alert } from 'antd';

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

  // 点击树节点时触发
  onSelect = (selectedKeys) => {
    console.log('selected', selectedKeys);
    const { code } = this.props;

    if(selectedKeys.length > 0) {
      code.setData({
        selectedKeys: selectedKeys,
        selectedRowKeys: [],
        pagination: {
          ...code.pagination,
          current: 1,
        },
      });
      
      code.fetchList({
        ParentID: selectedKeys[0],
        CurrentPage: 1,
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
  handleEdit = () => {
    const { code } = this.props;

    code.fetchDetail().then(() => {
      code.setCurrentForm(code.currentDetail);
      this.setModalVisible(true);
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }
  
  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { code } = this.props;

    code.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { code } = this.props;

    
    confirm({
      title: `确认要删除这 ${code.selectedRowKeys.length} 条记录吗?`,
      content: '',
      onOk: () => {
        this.handleRemove(code.selectedRowKeys);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { code } = this.props;

    code.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
      // 在选中条目中清除已经删除的
      code.setData({
        selectedRowKeys: code.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
      });
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 表格分页、排序等的回调函数
  handleTableChange = (pagination, filters, sorter) => {
    const { code } = this.props;

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
    code.setData({
      pagination: {
        ...code.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      // orderField: sorterData.OrderField || null,
      // isDesc: sorterData.IsDesc || false,
    });

    // 发起请求
    code.fetchList({
      CurrentPage: pagination.current,
      PageSize: pagination.pageSize,
      ...code.searchFormValues,
      // ...sorterData,
    });
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    const { code } = this.props;

    code.setData({
      selectedRowKeys,
    });
  }

  render() {
    const { code } = this.props;
    const { setModalVisible } = this;
    const columns = [{ 
      title: '序号',
      dataIndex: 'NO',
      width: '7%',
      className:'alignCenter', 
      render: (text, row, index) =>(
        index + 1 + (code.pagination.current - 1) * code.pagination.pageSize
      ),
    }, {
      title: '名称',
      dataIndex: 'Name',
      key: 'Name',
      width: '20%',
    }, {
      title: '代码值',
      dataIndex: 'CodeValue',
      key: 'CodeValue',
      width: '20%',
    }, {
      title: '排序',
      dataIndex: 'SortCode',
      key: 'SortCode',
      width: '15%',
    }, {
      title: '类型',
      dataIndex: 'Category',
      key: 'Category',
      width: '15%',
      render: (text, record) => (
        text === 1 ? '分类' : '代码'
      ),
    }, {
      title: '描述',
      dataIndex: 'Remark',
      key: 'Remark',
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
        <Content style={{ paddingLeft: 24 }}>
          <CodeToolBar
            code={code}
            handleNew={this.handleNew}
            handleEdit={this.handleEdit}
            handleRemoveChecked={this.handleRemoveChecked}
          />
          <CodeForm
            code={code}
            modalVisible={this.state.modalVisible}
            setModalVisible={setModalVisible}
          />
          <div className={styles.tableAlert}>
            <Alert
              message={(
                <div>
                  已选择 <a style={{ fontWeight: 600 }}>{code.selectedRowKeys.length}</a> 项
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={code.selectedRowKeys.length <= 0}>清空</a>
                </div>
              )}
              type="info"
              showIcon
            />
          </div>
          <Table
            bordered
            size="small"
            loading={code.loading}
            pagination={code.pagination}
            dataSource={code.list.slice()}
            columns={columns}
            rowKey="UniqueID"
            onChange={this.handleTableChange}
            rowSelection={{
              selectedRowKeys: code.selectedRowKeys,
              onChange: this.onSelectionChange,
            }}
            scroll={{ y: window.innerHeight - 293 }}
          />
        </Content>
      </Layout>
    );
  }
}
