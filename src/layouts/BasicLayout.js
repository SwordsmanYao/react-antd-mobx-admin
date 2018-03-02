import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { observer, inject } from 'mobx-react';
import enquire from 'enquire.js';
import DevTools from 'mobx-react-devtools';
import DocumentTitle from 'react-document-title';

import { basic as basicRouter } from '../router';
import SiderMenu from '../components/SiderMenu';
import BasicHeader from '../components/BasicHeader';
import styles from './BasicLayout.less';

const { Content } = Layout;


@inject('global', 'currentUser')
@observer
class BasicLayout extends Component {

  constructor(props) {
    super(props);
    this.state = {
      firstShow: null,
    }
  }
  componentDidMount() {
    const { global } = this.props;

    let isPad = false;

    // 设置媒体查询，自适应屏幕
    enquire.register('screen and (max-width:50em)', {
      match : function() {
        isPad = true;
        global.setData({
          collapsed: true,
          openKeys: [],
        });
      },
      unmatch : function() {
        isPad = false;
        global.setData({
          collapsed: false,
        });
      },
    });

    // 查询菜单数据
    global.fetchMenu().then(() => {
      const { match, location } = this.props;
      const firstShow = this.getFirstShow(global.menu, match.url);
      this.setState({ firstShow });

      // 匹配：  证明是从 basic 根路径下路由过来的
      // 不匹配：刷新或直接修改 url 进入对应页面，则需要通过路径生成菜单的 openKeys 和 selectedKeys
      if(location.pathname === match.url) {
        global.setData({
          openKeys: isPad ? [] : firstShow.openKeys,
          selectedKeys: firstShow.selectedKeys,
        });
      } else {
        const pathArr = location.pathname.split('/').slice(2);
        const menuOptions = this.getMenuOptionsFromPath(global.menu, pathArr);
        global.setData({
          openKeys: isPad ? []: menuOptions.openKeys,
          selectedKeys: menuOptions.selectedKeys,
        });
      }
    });
  }

  // 根据当前 url 路径获取菜单的 openKeys 和 selectedKeys
  getMenuOptionsFromPath = (menusData, pathArr, openKeys = []) => {
    const data = menusData.filter(item => (item.path === pathArr[0]))[0];
    if(data.hasChildren && data.children && data.children.length > 0) {
      return this.getMenuOptionsFromPath(data.children, pathArr.slice(1), [...openKeys, data.id]);
    } else {
      return {
        openKeys,
        selectedKeys: [data.id],
      }
    }
  }

  // 登录后根据菜单数据 第一个要展示的路径对象
  // 此处为了性能考虑，和 Menu 的 openKeys、selectedKeys 一起计算
  getFirstShow = (menusData, parentPath = '', openKeys = []) => {
    if (menusData[0].hasChildren && menusData[0].children) {
      return this.getFirstShow(menusData[0].children, `${parentPath}/${menusData[0].path}` , [...openKeys, menusData[0].id.toString()]);
    } else {
      return {
        pathname: `${parentPath}/${menusData[0].path}`,
        openKeys,
        selectedKeys: [menusData[0].id.toString()],
      };
    }
  }

  render() {
    const { match, global, currentUser, location } = this.props;
    const { firstShow } = this.state;

    return (
      <DocumentTitle title={(global.selectedDirList && global.selectedDirList.length > 0 && global.selectedDirList[global.selectedDirList.length - 1].name) || '系统'}>
        <Layout className={styles.layout}>
          <DevTools/>
          {
            // 在没跳转到子路由之前不渲染菜单栏，避免没有 menuID 引发错误
            location.pathname !== `${match.url}` && 
            <SiderMenu global={global} />
          }
          <Layout style={{ marginLeft: global.collapsed ? 64 : 200 }}>
            {
              currentUser.currentUser && <BasicHeader global={global} currentUser={currentUser} />
            }
            {
              // 有 MenuID 再渲染 content 部分，避免请求时没有 MenuID
              global.selectedKeys && global.selectedKeys.length > 0 &&
              <Content className={styles.content}>
                <Switch>
                  {
                    basicRouter.map(item => (
                      <Route path={`${match.url}/${item.path}`} key={item.path} exact={item.exact} component={ item.component } />
                    ))
                  }
                  {
                    firstShow &&
                    <Redirect
                      from={`${match.url}`}
                      to={firstShow.pathname}
                    />
                  }
                </Switch>
              </Content>
            }
            
          </Layout>
        </Layout>
      </DocumentTitle>
    );
    
  }
}
export default BasicLayout;