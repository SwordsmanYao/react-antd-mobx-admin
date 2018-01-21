import { observable, action } from 'mobx';

class BasicLayoutStore {
  @observable collapsed = false;

  @action
  toggle() {
    this.collapsed = !this.collapsed;
  }
}

export default new BasicLayoutStore();