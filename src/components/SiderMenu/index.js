import React, { Component } from 'react';
import { Menu, Icon, Layout } from 'antd';
import { observer } from 'mobx-react';
import { Link, withRouter } from 'react-router-dom';

import styles from './index.less';

const { Sider } = Layout;
const { SubMenu } = Menu;

@withRouter
@observer
class SiderMenu extends Component {
/*
[
      {
        id: 245345,
        name: '系统管理',
        icon: 'dashboard',
        path: 'system-management',
        children: [
          {
            id: 131245,
            name: '菜单管理',
            path: 'menu',
          },
          {
            id: 25345,
            name: 'Form',
            path: 'menuForm',
          }
        ],
      },
      {
        id: 234234,
        name: 'Dashboard',
        icon: 'dashboard',
        path: 'table-list',
      },
    ]
*/
  // 获得当前path的数组 eg： pathname:"/system-management/menu" ==> ["system-management", "menu"]
  getCurrentMenuSelectedKeys() {
    const { location: { pathname } } = this.props;
    const keys = pathname.split('/').slice(1);
    console.log(keys);
    if (keys.length === 1 && keys[0] === '') {
      return [this.menus[0].path];
    }
    return keys;
  }
  getMenuItems(menusData, parentPath = '/basic') {
    return menusData.map(item => {

      const itemPath = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');

      if(item.children && item.children.length > 0) {
        return (
          <SubMenu
            key={item.path}
            title={
              item.icon ? (
                <span>
                  <Icon type={item.icon} />
                  <span>{item.name}</span>
                </span>
              ) : item.name
            }
          >
            {
              this.getMenuItems(item.children, itemPath)
            }
          </SubMenu>
        );
      } else {
        return (
          <Menu.Item key={item.path}>
            <Link
              to={{
                pathname: itemPath,
                search: `?menuID=${item.id}`,
              }}
              replace={itemPath === this.props.location.pathname}
            >
              {
                item.icon && <Icon type={item.icon} />
              }
              <span>{item.name}</span>
            </Link>
          </Menu.Item>
        )
      }
    });
  }

  render() {
    const { global } = this.props;

    return (
      <Sider
        trigger={null}
        collapsible
        collapsed={global.collapsed}
        collapsedWidth={64}
        className={styles.sider}
      >
        <div className={styles.logo} />
        {
          global.menu && global.menu.length > 0 &&
          <Menu
            selectedKeys={this.getCurrentMenuSelectedKeys()}
            openKeys={global.openKeys.slice()}
            mode="inline"
            theme="dark"
            inlineCollapsed={global.collapsed}
            onOpenChange={(openKeys) => {
              global.setOpenKeys(openKeys);
            }}
            onSelect={({ item, key, selectedKeys }) => {
              console.log('onSelect', item, key, selectedKeys);
            }}
          >
            {this.getMenuItems(global.menu)}
          </Menu>
        }
        
      </Sider>
    );
  }
}

export default SiderMenu;