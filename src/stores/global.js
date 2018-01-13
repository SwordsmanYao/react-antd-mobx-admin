import { observable, action } from "mobx";

class GlobalStore {
  @observable number = 10;

  @action
  inc() {
    this.number ++;
  }
}

export default new GlobalStore();