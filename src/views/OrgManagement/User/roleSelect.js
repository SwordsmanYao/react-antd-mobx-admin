import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Modal, Table, message } from 'antd';

@observer
export default class RoleSelect extends Component {

  // 表单提交
  handleSubmit = () => {
    const { user, setRoleModalVisible } = this.props;

    user.setMemberRole({
      UniqueID: user.selectedRowKeys[0],
      Params: user.roleSelectedRowKeys,
    }).then(() => {
      message.success('操作成功');
      setRoleModalVisible(false);
     }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
     });
  }

  // 勾选
  onSelectionChange = (selectedRowKeys, selectedRows) => {

    const { user } = this.props;
    user.setData({
      roleSelectedRowKeys: selectedRowKeys,
    });
  }

  // 关闭时重置状态
  afterClose = () => {
    const { user } = this.props;

    user.setData({
      roleSelectedRowKeys: [],
    });
  }
  

  render() {
    const { user, roleModalVisible, setRoleModalVisible } = this.props;
    const columns = [{
      title: '角色',
      dataIndex: 'Name',
      key: 'Name',
    }, {
      title: '描述',
      dataIndex: 'DescInfo',
      key: 'DescInfo',
    }];
    return (
      
        <Modal
          title="成员角色"
          visible={roleModalVisible}
          onOk={this.handleSubmit}
          onCancel={() => setRoleModalVisible(false)}
          afterClose={this.afterClose}
        >
          {
            user.memberRole &&
            <Table
              dataSource={user.memberRole.slice()}
              columns={columns}
              rowSelection={{
                selectedRowKeys: user.roleSelectedRowKeys,
                onChange: this.onSelectionChange,
              }}
              rowKey="UniqueID"
              pagination={false}
              showHeader={false}
              size="small"
              bordered
            />
          }
        </Modal>
    );
  }
}