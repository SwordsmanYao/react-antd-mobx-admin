import { observable, action, computed } from 'mobx';
import { query } from "../services/demo";
import global from './global';

class DemoStore {
  @observable data;

  /**
   * 含有接口请求等异步操作的 action
   */
  @action
  async fetchData() {
    const response = await query();
    if(response.Code === 200) {
      this.setData({data: response.Data});
    }
  }

  /**
   * 不含异步操作的 action
   */

  @action
  setGlobalcollapsed(){
    global.toggleCollapsed();
  }

  // 
  @action
  setData(data) {
    const keys = Object.keys(data);
    keys.forEach((item) => {
      this[item] = data[item];
    });
  }

  @computed
  get message() {
    return this.data.name + this.data.age;
  }
}

export default new DemoStore();

