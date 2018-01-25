import React, { Component } from 'react';
// import { inject, observer } from 'mobx-react';
import { Table } from 'antd';

const data = [{
  key: '1',
  name: 'John Brown',
  age: 32,
  address: 'New York Park',
}, {
  key: '2',
  name: 'Jim Green',
  age: 40,
  address: 'London Park',
},{
  key: '3',
  name: 'John Brown',
  age: 32,
  address: 'New York Park',
}, {
  key: '4',
  name: 'Jim Green',
  age: 40,
  address: 'London Park',
},{
  key: '5',
  name: 'John Brown',
  age: 32,
  address: 'New York Park',
}, {
  key: '6',
  name: 'Jim Green',
  age: 40,
  address: 'London Park',
}];

// @inject('demo')
// @observer
class OperationLog extends Component {
  
  render() {

    const columns = [
      { title: '', width: 50, dataIndex: 'key', key:'key', fixed: 'left'},
      { title: 'Full Name', width: 100, dataIndex: 'name', key: 'name', fixed: 'left' },
      { title: 'Age', width: 100, dataIndex: 'age', key: 'age' },
      { title: 'Column 1', dataIndex: 'address', key: '1' },
      { title: 'Column 2', dataIndex: 'address', key: '2' },
      { title: 'Column 3', dataIndex: 'address', key: '3' },
      { title: 'Column 4', dataIndex: 'address', key: '4' },
      { title: 'Column 5', dataIndex: 'address', key: '5' },
      { title: 'Column 6', dataIndex: 'address', key: '6' },
      { title: 'Column 7', dataIndex: 'address', key: '7' },
      { title: 'Column 8', dataIndex: 'address', key: '8' },
      {
        title: 'Action',
        key: 'operation',
        fixed: 'right',
        width: 100,
        render: () => <a>action</a>,
      },
    ];

    return (
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ x: 1300, y: 1000 }}
        size="small"
        locale={{
          filterTitle: '筛选',
          filterConfirm: '确定',
          filterReset: '重置',
          emptyText: '暂无数据',
        }}
      />
    );
  }
}

export default OperationLog;