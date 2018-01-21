import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { Layout } from 'antd';
import { observer, inject } from 'mobx-react';
import enquire from 'enquire.js';

import { basic as basicRouter } from '../router';
import SiderMenu from '../components/SiderMenu';
import BasicHeader from '../components/BasicHeader';
import styles from './BasicLayout.less';

const { Content } = Layout;


@inject('global')
@observer
class BasicLayout extends Component {

  componentDidMount() {
    const { global } = this.props;

    // 设置媒体查询
    // http://wicky.nillia.ms/enquire.js/
    enquire.register('screen and (max-width:50em)', {

      // OPTIONAL
      // If supplied, triggered when a media query matches.
      match : function() {
        global.setCollapsed(true);
      },
    
      // OPTIONAL
      // If supplied, triggered when the media query transitions
      // *from a matched state to an unmatched state*.
      unmatch : function() {
        global.setCollapsed(false);
      },
    });

    // 查询菜单数据
    global.fetchMenu();

  }

  render() {
    const { match, global } = this.props;

    return (
      <Layout>
        <SiderMenu global={global} />
        <Layout>
          <BasicHeader global={global} />
          <Content className={styles.content}>
            <Switch>
              {
                basicRouter.map(item => (
                  <Route path={`${match.url}/${item.path}`} key={item.path} exact={item.exact} component={ item.component } />
                ))
              }
              <Redirect from={`${match.url}/`} to={`${match.url}/demo`} />
            </Switch>
          </Content>
        </Layout>
      </Layout>
    );
    
  }
}
export default BasicLayout;