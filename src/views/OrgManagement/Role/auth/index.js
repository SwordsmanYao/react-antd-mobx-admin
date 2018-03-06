import React, { Component } from 'react';
import { observer } from 'mobx-react';

import StepModal from '@/components/StepModal';
import RoleMenu from './roleMenu';
import RoleMenuButton from './roleMenuButton';
import RoleMenuField from './roleMenuField';

@observer
export default class Auth extends Component {

  

  render() {
    const { role, authModalVisible, setAuthModalVisible } = this.props;

    const steps = [{
      title: '系统功能',
      component: RoleMenu,
      // 组件被Form.create()等包裹
      isWrappedComponent: false, 
      props: {
        role,
      },
      // Modal 窗口关闭时触发
      afterClose: () => {
        const { role } = this.props;
        role.setData({
          roleMenuTree: [],
          roleMenuCheckedKeys: [],
          roleMenuHalfCheckedKeys: [],
        });
      },
    }, {
      title: '系统按钮',
      component: RoleMenuButton,
      isWrappedComponent: false,
      props: {
        role,
      },
      afterClose: () => {
        const { role } = this.props;
        role.setData({
          roleMenuButtonTree: [],
          roleMenuButtonCheckedKeys: [],
          roleMenuButtonHalfCheckedKeys: [],
        });
      },
    }, {
      title: '系统视图',
      component: RoleMenuField,
      isWrappedComponent: false,
      props: {
        role,
      },
      afterClose: () => {
        const { role } = this.props;
        role.setData({
          roleMenuFieldTree: [],
          roleMenuFieldCheckedKeys: [],
          roleMenuFieldHalfCheckedKeys: [],
        });
      },
    }];

    return (
      <StepModal
        modalVisible={authModalVisible}
        setModalVisible={setAuthModalVisible}
        title="角色授权"
        steps={steps}
      />
    );
  }
}