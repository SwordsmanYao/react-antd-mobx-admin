import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Alert, Modal, message } from 'antd';
import moment from 'moment';

import styles from './index.less';
import ExceptionLogToolBar from './toolBar';
import CopyToClipboard from '@/components/CopyToClipboard';

const { confirm } = Modal;

@inject('exceptionLog')
@observer
export default class ExceptionLog extends Component {
  
  constructor(props) {
    super(props);

    this.cleanSelectedKeys = this.cleanSelectedKeys.bind(this);
    this.handleRemoveChecked = this.handleRemoveChecked.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
  }

  componentWillMount() {
    const { exceptionLog } = this.props;
    exceptionLog.reset();
    exceptionLog.refreshList();
  }

  componentWillUnmount() {
    const { exceptionLog } = this.props;
    exceptionLog.reset();
  }

  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { exceptionLog } = this.props;

    exceptionLog.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { exceptionLog } = this.props;

    
    confirm({
      title: `确认要删除这 ${exceptionLog.selectedRowKeys.length} 条记录吗?`,
      content: '',
      onOk: () => {
        this.handleRemove(exceptionLog.selectedRowKeys);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { exceptionLog } = this.props;

    exceptionLog.remove({
      Params,
    }).then(() => {
      message.success('删除成功');
      // 在选中条目中清除已经删除的
      exceptionLog.setData({
        selectedRowKeys: exceptionLog.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
      });
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
  }

  // 表格分页、排序等的回调函数
  handleTableChange = (pagination, filters, sorter) => {
    const { exceptionLog } = this.props;

    // 排序数据
    const sorterData = {};
    if(sorter.field) {
      sorterData.OrderField = sorter.field;
      if(sorter.order === 'descend') {
        sorterData.IsDesc = true;
      } else {
        sorterData.IsDesc = false;
      }
    }

    // 修改 store 数据
    exceptionLog.setData({
      pagination: {
        ...exceptionLog.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      orderField: sorterData.OrderField || null,
      isDesc: sorterData.IsDesc || false,
    });

    // 发起请求
    exceptionLog.fetchList({
      CurrentPage: pagination.current,
      PageSize: pagination.pageSize,
      ...exceptionLog.searchFormValues,
      ...sorterData,
    });
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    const { exceptionLog } = this.props;

    exceptionLog.setData({
      selectedRowKeys,
    });
  }

  render() {

    const { exceptionLog } = this.props;

    const columns = [
      { 
        title: '序号',
        dataIndex: 'UniqueID',
        width: 50,
        fixed: 'left',
        className:'alignCenter', 
        render: (text, row, index) =>(index + 1),
      },
      { 
        title: '操作人',
        dataIndex: 'LM_OperateUser',
        key: 'LM_OperateUser',
        width: 80,
        fixed: 'left',
      },
      { 
        title: '操作时间', 
        dataIndex: 'LM_OperateTime', 
        key: 'LM_OperateTime', 
        width: 150, 
        sorter: true, 
        sortOrder: exceptionLog.orderField === 'LM_OperateTime' && (exceptionLog.isDesc ? 'descend' : 'ascend'), 
        fixed: 'left', 
        render: (text, row, index) => { 
          return new moment(text).format('YYYY-MM-DD HH:mm:ss');
        },
      },
      { 
        title: '入口菜单', 
        dataIndex: 'LM_Menu', 
        key: 'LM_Menu', 
        width: 100,
      },
      { 
        title: '请求IP', 
        dataIndex: 'LM_IPAddress', 
        key: 'LM_IPAddress', 
        width: 100,
      },
      { 
        title: '请求的地址', 
        dataIndex: 'LM_URL', 
        key: 'LM_URL', 
        width: 600,
      },
      { 
        title: '请求的浏览器', 
        dataIndex: 'LM_Browser', 
        key: 'LM_Browser', 
        width: 200,
      },
      { 
        title: 'http方法', 
        dataIndex: 'LM_HttpMethod', 
        key: 'LM_HttpMethod', 
        width: 100,
      },
      { 
        title: '异常消息', 
        dataIndex: 'LM_Message', 
        key: 'LM_Message', 
        width: 300,
      },
      { 
        title: '异常来源', 
        dataIndex: 'LM_Source', 
        key: 'LM_Source', 
        width: 200,
      },
      { 
        title: '异常跟踪', 
        dataIndex: 'LM_StackTrace', 
        key: 'LM_StackTrace', 
        width:400,
        render: (text, row, index) => { 
          let showData = text;
          if(text && text.length > 100) {
            showData = `${text.substr(0, 100)}...`;
          }
          return (
            <CopyToClipboard text={text}>
              <span>{showData}</span>
            </CopyToClipboard>
          ); 
        },
      },
      { 
        title: '请求的数据', 
        dataIndex: 'LM_Data', 
        key: 'LM_Data', 
        width: 400,
        render: (text, row, index) => { 
          let showData = text;
          if(text && text.length > 100) {
            showData = `${text.substr(0, 100)}...`;
          }
          return (
            <CopyToClipboard text={text}>
              <span>{showData}</span>
            </CopyToClipboard>
          ); 
        },
      },

    ];

    return (
      <div className={styles.content}>
        
        <ExceptionLogToolBar exceptionLog={exceptionLog} />

        <div className={styles.toolbar}>
        </div>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{exceptionLog.selectedRowKeys.length}</a> 项
                <a onClick={this.handleRemoveChecked} style={{ marginLeft: 24 }} disabled={exceptionLog.selectedRowKeys.length <= 0}>删除</a>
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={exceptionLog.selectedRowKeys.length <= 0}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={exceptionLog.loading}
          pagination={{
            showSizeChanger: true, 
            showQuickJumper: true,
            showTotal: (total, range) => `共 ${total} 条`,
            ...exceptionLog.pagination,
          }}
          dataSource={exceptionLog.list.slice()}
          columns={columns}
          rowKey="UniqueID"
          onChange={this.handleTableChange}
          rowSelection={{
            selectedRowKeys: exceptionLog.selectedRowKeys,
            onChange: this.onSelectionChange,
          }}
          scroll={{ x: 2680, y: window.innerHeight - 290 }}
          size="small"
        />
      </div>
      
    );
  }
}
