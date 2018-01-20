import { observable, action, computed } from 'mobx';
import { query } from "../services/demo";

class DemoStore {
  @observable data;

  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async fetchData() {
    const response = await query();
    if(response.Code === 200) {
      this.setData(response.Data);
    }
  }

  /**
   * 不含异步操作的 action
   */
  @action
  setData(data) {
    this.data = data;
  }

  @computed
  get message() {
    return this.data.name + this.data.age;
  }
}

export default new DemoStore();

