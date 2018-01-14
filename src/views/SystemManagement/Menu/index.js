import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';


@inject('global')
@observer
class Menu extends Component {
  
  render() {

    const { global } = this.props;

    return (
      <div>
        <div>{global.number}</div>
        <button onClick={() => global.inc()}>+</button>
      </div>
    )
  }
}

export default Menu;