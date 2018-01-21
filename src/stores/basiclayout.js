import { observable, action } from 'mobx';

class BasicLayoutStore {
  @observable collapsed = false; // true 折叠

  @action
  toggleCollapsed() {
    this.collapsed = !this.collapsed;
  }
  @action
  setCollapsed(collapsed) {
    this.collapsed = collapsed;
  }
}

export default new BasicLayoutStore();