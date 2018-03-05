import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button, Menu, Dropdown, Icon } from 'antd';

import styles from './toolBar.less';

@observer
export default class OrgToolBar extends Component {

  render() {

    const { role, handleNew, handleEdit, handleRemoveChecked, handleAuth, handleMember } = this.props;

    const menu = (
      <Menu>
        <Menu.Item>
          <a
            onClick={(e) => {
              handleAuth();
            }}
          >角色授权
          </a>
        </Menu.Item>
        <Menu.Item>
          <a
            onClick={(e) => {
              handleMember();
            }}
          >角色成员
          </a>
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
            >
              编辑
            </Button>
            <Button
              icon="delete"
              onClick={handleRemoveChecked}
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