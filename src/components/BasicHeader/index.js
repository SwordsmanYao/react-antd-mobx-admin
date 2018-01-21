import React, { Component } from 'react';
import { Layout, Icon, Avatar, Dropdown, Menu } from 'antd';
import { observer } from 'mobx-react';

import styles from './index.less';

const { Header } = Layout;


@observer
class BasicHeader extends Component {

  onMenuClick = ({ key }) => {
    if (key === 'logout') {
      // this.props.dispatch({
      //   type: 'user/logout',
      // });
    }
  }

  render() {
    const { layout } = this.props;

    const menu = (
      <Menu selectedKeys={[]} onClick={this.onMenuClick}>
        <Menu.Item disabled><Icon type="user" />个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting" />设置</Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout"><Icon type="logout" />退出登录</Menu.Item>
      </Menu>
    );

    return (
      <Header className={styles.header}>
        <Icon
          className={styles.trigger}
          type={layout.collapsed ? 'menu-unfold' : 'menu-fold'}
          onClick={() => layout.toggle()}
        />
        <div className={styles.right}>
          <Dropdown overlay={menu} placement="bottomRight">
            <div className={`${styles.user} ${styles.action}`}>
              <Avatar className={styles.avatar} icon="user" />
              <span>yao</span>
            </div>
          </Dropdown>
          
        </div>
      </Header>
    );
  }
}

export default BasicHeader;