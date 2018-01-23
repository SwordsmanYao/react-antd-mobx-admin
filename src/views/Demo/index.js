import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
// import { withRouter } from 'react-router-dom';

// route component 的 props 中已经绑定了路由信息，不用加 @withRouter
// @withRouter
@inject('demo')
@observer
class Demo extends Component {
  
  componentDidMount() {
    // this.props.demo.fetchData();
  }

  render() {

    // route 提供的属性：match, location, history
    const { location, history, demo } = this.props;
    // console.log('demo', match, location, history);
    return (
      <div>
        <span>Current pathname: {location.pathname}</span>		
        <button onClick={() => history.push('/basic/system-management/menu')}>Change url</button>		
        <button onClick={() => history.goBack()}>Go Back</button>
        {
          demo.data && <div>{demo.data.name}</div>
        }
        {
          demo.data && <div>{demo.message}</div>
        }
        <button onClick={ () => demo.setGlobalcollapsed() }>跨 store 调用</button>
      </div>
    )
  }
}

export default Demo;