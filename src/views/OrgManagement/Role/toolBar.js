import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Menu, Dropdown, Icon } from 'antd';

import styles from './toolBar.less';

@observer
export default class OrgToolBar extends Component {

  onMenuClick = ({ key }) => {
    const { handleAuth, handleMember } = this.props;

    switch(key)
    {
      case 'auth':
        handleAuth();
        break;
      case 'member':
        handleMember();
        break;
      default:
        return;
    }
  }

  render() {

    const { role, handleNew, handleEdit, handleRemoveChecked } = this.props;

    const menu = (
      <Menu onClick={this.onMenuClick}>
        <Menu.Item key="auth" disabled={role.selectedRowKeys.length !== 1}>
          <Icon type="setting" />角色授权
        </Menu.Item>
        <Menu.Item key="member" disabled={role.selectedRowKeys.length !== 1}>
          <Icon type="user" />角色成员
        </Menu.Item>
      </Menu>
    );

    return (
      <div className={styles.toolBar}>
        <div className={styles.buttonGroups}>
          <Button.Group>
            <Button
              icon="plus"
              onClick={handleNew}
              loading={role.newBtnLoading}
            >
              新建
            </Button>
            <Button
              icon="edit"
              onClick={handleEdit}
              disabled={role.selectedRowKeys.length !== 1}
            >
              编辑
            </Button>
            <Button
              icon="delete"
              onClick={handleRemoveChecked}
              disabled={role.selectedRowKeys.length < 1}
            >
              删除
            </Button>
            <Dropdown overlay={menu}>
                <Button>
                  更多<Icon type="down" />
                </Button>
              </Dropdown>
          </Button.Group>
        </div>
      </div>
    );
  }
}