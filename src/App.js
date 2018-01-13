import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
 
@inject('routing')
@inject('global')
@observer
class App extends Component {
  render() {
    const { global } = this.props;
    const { location, push, goBack } = this.props.routing;
 
    return (
      <div>
        <span>Current pathname: {location.pathname}</span>
        <button onClick={() => push('/test')}>Change url</button>
        <button onClick={() => goBack()}>Go Back</button>
        <div>{global.number}</div>
        <button onClick={() => global.inc()}>+</button>
      </div>
    );
  }
}

export default App;
