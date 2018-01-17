import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import { withRouter } from 'react-router-dom';

// route component 的 props 中已经绑定了路由信息，不用加 @withRouter
// @withRouter
@inject('global')
@observer
class Menu extends Component {
  
  render() {

    // route 提供的属性：match, location, history
    const { global, match, location, history } = this.props;
    console.log('menu', global, match, location, history);
    return (
      <div>
        <span>Current pathname: {location.pathname}</span>		
        <button onClick={() => history.push('/basic')}>Change url</button>		
        <button onClick={() => history.goBack()}>Go Back</button>
        <div>{global.number}</div>
        <button onClick={() => global.inc()}>+</button>
      </div>
    )
  }
}

export default Menu;