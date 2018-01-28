import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Alert, Modal } from 'antd';
import moment from 'moment';

import styles from './index.less';
import OperationLogSearch from './search';

const { confirm } = Modal;

@inject('operationLog')
@observer
export default class OperationLog extends Component {
  
  constructor(props) {
    super(props);

    this.state = {
      selectedRowKeys: [],
      selectedRows: [],
      formValues: {},
    }

    this.handleSearch = this.handleSearch.bind(this);
    this.resetFormValues = this.resetFormValues.bind(this);
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
      PageSize: operationLog.pagination.pageSize,
      CurrentPage: operationLog.pagination.current,
    });
  }

  // 查询
  handleSearch = (data) => {

    console.log('handleSearch', data);

    const { operationLog } = this.props;

    this.setState({
      formValues: data,
    });

    operationLog.fetchList({
      PageSize: operationLog.pagination.pageSize,
      CurrentPage: 1,
      ...data,
    });
  }

  resetFormValues = () => {
    this.setState({
      formValues: {},
    });
  }

  // 清空选中条目
  cleanSelectedKeys = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    this.setState({
      selectedRowKeys: [],
    });
  }

  // 批量删除选中条目
  handleRemoveChecked = (e) => {

    e.preventDefault();
    e.stopPropagation();

    const { selectedRows } = this.state;

    confirm({
      title: `确认要删除这 ${selectedRows.length} 条记录吗?`,
      content: '',
      onOk: () => {
        let ids = '';
        selectedRows.forEach(item => {
          ids += `,${item.UniqueID}`;
        });
        ids = ids.substr(1);
        this.handleRemove(ids);
      },
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { operationLog } = this.props;

    operationLog.remove({
      Params,
    });
  }

  // 表格分页、排序等的回调函数
  handleTableChange = (pagination, filters, sorter) => {

    const { operationLog } = this.props;

    console.log('pagination', pagination);
    console.log('filters', filters);
    console.log('sorter', sorter);

    operationLog.fetchList({
      CurrentPage: pagination.current,
      PageSize: pagination.pageSize,
      ...this.state.formValues,
    });
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    this.setState({
      selectedRowKeys,
      selectedRows,
    });
  }
  // 指定哪些不可被勾选
  getCheckboxProps = record => ({
    disabled: record.name === 'Disabled User', // Column configuration not to be checked
  })

  render() {

    const { operationLog } = this.props;

    const { selectedRowKeys } = this.state;

    const columns = [
      { title: '序号', dataIndex: 'UniqueID', width: 50, fixed: 'left', className:'alignCenter', render: (text, row, index) =>(index + 1) },
      { title: '操作人', dataIndex: 'LM_OperateUser', key: 'LM_OperateUser', width: 100, fixed: 'left' },
      { title: '操作时间', dataIndex: 'LM_OperateTime', key: 'LM_OperateTime', width: 160, sorter: true, fixed: 'left', render: (text, row, index) => { return new moment(text).format('YYYY-MM-DD HH:mm:ss') }},
      { title: '入口菜单', dataIndex: 'LM_Menu', key: 'LM_Menu', width: 100},
      { title: '操作类型', dataIndex: 'LM_OperateType', key: 'LM_OperateType', width: 100 },
      { title: '请求IP', dataIndex: 'LM_IPAddress', key: 'LM_IPAddress', width: 100 },
      { title: '请求的地址', dataIndex: 'LM_URL', key: 'LM_URL', width: 600 },
      { title: 'http方法', dataIndex: 'LM_HttpMethod', key: 'LM_HttpMethod', width: 100 },
      { title: '操作结果', dataIndex: 'LM_Result', key: 'LM_Result', width: 100 },
      { title: '操作描述', dataIndex: 'LM_Description', key: 'LM_Description', width: 160 },
    ];

    return (
      <div className={styles.content}>
        
        <OperationLogSearch
          handleSearch={this.handleSearch}
          resetFormValues={this.resetFormValues}
        />

        <div className={styles.toolbar}>
        </div>
        <div className={styles.tableAlert}>
          <Alert
            message={(
              <div>
                已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项
                <a onClick={this.handleRemoveChecked} style={{ marginLeft: 24 }} disabled={selectedRowKeys.length <= 0}>删除</a>
                <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }} disabled={selectedRowKeys.length <= 0}>清空</a>
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
            selectedRowKeys: selectedRowKeys,
            onChange: this.onSelectionChange,
            getCheckboxProps: this.getCheckboxProps,
          }}
          scroll={{ x: 1600, y: document.body.scrollHeight - 190 }}
          size="small"
        />
      </div>
      
    );
  }
}
