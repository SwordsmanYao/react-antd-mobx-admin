import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { message } from 'antd';

import DisplayTree from '@/components/DisplayTree';

@observer
export default class RoleMenuButton extends Component {

  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
    }
  }

  // StepModal 组件调用方法
  handleNextStep = (e) => {
    const { role, goNext } = this.props;

    this.setState({
      confirmLoading: true,
    });
    
    role.commitRoleMenuButton({
      UniqueID: role.selectedRowKeys[0],
      Params: [...role.roleMenuButtonCheckedKeys, ...role.roleMenuButtonHalfCheckedKeys],
    }).then(() => {
      message.success('操作成功');
      goNext();
    }).catch((e) => {
      message.error(`操作失败：${e.Message}`);
    });
    
    this.setState({
      confirmLoading: false,
    });
  }

  componentDidMount = () => {
    const { role } = this.props;
    role.fetchRoleMenuButtonTree();
  }

  onCheck = (checkedKeys, info) => {
    const { role } = this.props;

    console.log('onCheckRoleMenuButton', checkedKeys, info);
    role.setData({
      roleMenuButtonCheckedKeys: checkedKeys,
      roleMenuButtonHalfCheckedKeys: info.halfCheckedKeys,
    });
  }
  

  render() {
    const { role } = this.props;

    return (
      <DisplayTree
        checkable
        defaultExpandAll
        treeList={role.roleMenuButtonTree.slice()}
        onCheck={this.onCheck}
        checkedKeys={role.roleMenuButtonCheckedKeys.slice()}
      />
    );
  }
}