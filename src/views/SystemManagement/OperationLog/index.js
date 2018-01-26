import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Table, Popconfirm } from 'antd';
import moment from 'moment';

import styles from './index.less';


@inject('operationLog')
@observer
class OperationLog extends Component {
  

  componentWillMount() {
    const { operationLog } = this.props;

    operationLog.fetchList({
      PageSize: operationLog.pagination.pageSize,
      CurrentPage: operationLog.pagination.current,
    });
  }

  // 删除
  handleRemove = (Params) => {
    const { operationLog } = this.props;

    operationLog.remove({
      Params,
    });
  }

  render() {

    const { operationLog } = this.props;

    const columns = [
      { title: '操作人', dataIndex: 'LM_OperateUser', key: 'LM_OperateUser', width: 100, fixed: 'left'  },
      { title: '操作时间', dataIndex: 'LM_OperateTime', key: 'LM_OperateTime', width: 160, render: (text, row, index) => { return new moment(text).format('YYYY-MM-DD HH:mm:ss') }},
      { title: '入口菜单', dataIndex: 'LM_Menu', key: 'LM_Menu', width: 100},
      { title: '操作类型', dataIndex: 'LM_OperateType', key: 'LM_OperateType', width: 100 },
      { title: '请求IP', dataIndex: 'LM_IPAddress', key: 'LM_IPAddress', width: 100 },
      { title: '请求的地址', dataIndex: 'LM_URL', key: 'LM_URL', width: 600 },
      { title: 'http方法', dataIndex: 'LM_HttpMethod', key: 'LM_HttpMethod', width: 100 },
      { title: '操作结果', dataIndex: 'LM_Result', key: 'LM_Result', width: 100 },
      { title: '操作描述', dataIndex: 'LM_Description', key: 'LM_Description', width: 100 },
      {
        title: '操作',
        key: 'operation',
        fixed: 'right',
        width: 60,
        render: (text, record) => (
          <span>
            <Popconfirm
              placement="bottom" 
              title="确认要删除这条记录吗？" 
              onConfirm={() => { this.handleRemove([record.UniqueID]); }} 
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
      },
    ];

    return (
      <div className={styles.content}>
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
          scroll={{ x: 1600, y: document.body.scrollHeight - 190 }}
          size="small"
        />
      </div>
      
    );
  }
}

export default OperationLog;