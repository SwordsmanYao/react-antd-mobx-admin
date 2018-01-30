import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Alert, Modal, Badge } from 'antd';
import moment from 'moment';

import styles from './index.less';
import OperationLogSearch from './search';

const { confirm } = Modal;

@inject('operationLog')
@observer
export default class OperationLog extends Component {
  
  constructor(props) {
    super(props);

    this.cleanSelectedKeys = this.cleanSelectedKeys.bind(this);
    this.handleRemoveChecked = this.handleRemoveChecked.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.handleTableChange = this.handleTableChange.bind(this);
    this.onSelectionChange = this.onSelectionChange.bind(this);
    this.getCheckboxProps = this.getCheckboxProps.bind(this);
  }

  componentWillMount() {
    const { operationLog } = this.props;
    operationLog.fetchList({
      CurrentPage: operationLog.pagination.current,
      PageSize: operationLog.pagination.pageSize,
    });
    operationLog.fetchOperateTypeTextValue();
  }

  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const { operationLog } = this.props;

    operationLog.setData({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const { operationLog } = this.props;

    this.handleRemove(operationLog.selectedRowKeys);
  }

  // 删除
  handleRemove = (Params) => {
    const { operationLog } = this.props;

    confirm({
      title: `确认要删除这 ${Params.length} 条记录吗?`,
      content: '',
      onOk: () => {
        operationLog.remove({
          Params,
        }).then(result => {
          if(result) {
            // 在选中条目中清除已经删除的
            operationLog.setData({
              selectedRowKeys: operationLog.selectedRowKeys.filter(item => (Params.indexOf(item) === -1)),
            });
          }
        });
      },
    });
  }

  // 表格分页、排序等的回调函数
  handleTableChange = (pagination, filters, sorter) => {
    const { operationLog } = this.props;

    // 排序
    const sorterData = {};
    if(sorter.field) {
      sorterData.OrderField = sorter.field;
      if(sorter.order === 'descend') {
        sorterData.IsDesc = true;
      } else {
        sorterData.IsDesc = false;
      }
    }

    operationLog.setData({
      pagination: {
        ...operationLog.pagination,
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      orderField: sorterData.OrderField || null,
      isDesc: sorterData.IsDesc || false,
    });

    operationLog.fetchList({
      CurrentPage: pagination.current,
      PageSize: pagination.pageSize,
      ...operationLog.searchFormValues,
      ...sorterData,
    });
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    const { operationLog } = this.props;

    operationLog.setData({
      selectedRowKeys,
    });
  }
  // 指定哪些不可被勾选
  getCheckboxProps = record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
  }) 

  render() {

    const { operationLog } = this.props;

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
        width: 100,
        fixed: 'left',
      },
      { 
        title: '操作时间', 
        dataIndex: 'LM_OperateTime', 
        key: 'LM_OperateTime', 
        width: 160, 
        sorter: true, 
        sortOrder: operationLog.orderField === 'LM_OperateTime' && (operationLog.isDesc ? 'descend' : 'ascend'), 
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
        title: '操作类型', 
        dataIndex: 'LM_OperateType', 
        key: 'LM_OperateType', 
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
        title: 'http方法', 
        dataIndex: 'LM_HttpMethod', 
        key: 'LM_HttpMethod', 
        width: 100,
      },
      { 
        title: '操作结果', 
        dataIndex: 'LM_Result', 
        key: 'LM_Result', 
        width: 100, 
        render: (result) => {
          if(result) {
            return <Badge status="success" text="成功" />;
          } else {
            return <Badge status="error" text="失败" />;
          }
        },
      },
      { 
        title: '操作描述', 
        dataIndex: 'LM_Description', 
        key: 'LM_Description', 
        width: 160,
      },
    ];

    return (
      <div className={styles.content}>
        
        <OperationLogSearch operationLog={operationLog} />

        <div className={styles.toolbar}>
        </div>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{operationLog.selectedRowKeys.length}</a> 项
                <a onClick={this.handleRemoveChecked} style={{ marginLeft: 24 }} disabled={operationLog.selectedRowKeys.length <= 0}>删除</a>
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={operationLog.selectedRowKeys.length <= 0}>清空</a>
              </div>
            )}
            type="info"
            showIcon
          />
        </div>
        <Table
          loading={operationLog.loading}
          pagination={{
            showSizeChanger: true, 
            showQuickJumper: true,
            showTotal: (total, range) => `共 ${total} 条`,
            ...operationLog.pagination,
          }}
          dataSource={operationLog.list.slice()}
          columns={columns}
          rowKey="UniqueID"
          onChange={this.handleTableChange}
          rowSelection={{
            selectedRowKeys: operationLog.selectedRowKeys,
            onChange: this.onSelectionChange,
            getCheckboxProps: this.getCheckboxProps,
          }}
          scroll={{ x: 1600, y: window.innerHeight - 310 }}
          size="small"
        />
      </div>
      
    );
  }
}