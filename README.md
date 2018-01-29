## react-antd-mobx-admin

一个基于 create-react-app、antd、react-router、mobx 的中后台管理模板

### 步骤
 ```
 git clone https://github.com/SwordsmanYao/react-antd-mobx-admin.git
 ``` 
 ```
 cd react-antd-mobx-admin
 yarn (or npm i)
 ```
 ```
 yarn mock (or npm run mock)
 yarn start (or npm run start)
 ```

### mobx 使用注意事项
 * 延迟对象属性地解引用
 * 不要吝啬使用 @observer，子组件只要用到 mobx 管理的数据就要加上 @observer
 * 不要吝啬使用 @action，凡是涉及到对应用状态变量修改的函数，都应该使用 @action 修饰符。
 * 当需要修改状态时，应该调用同步函数修改或使用 transaction（此处为性能考虑，@action 修饰后只有同步函数默认使用 transaction 修改状态，可以避免重复渲染 react 组件）
 * 应用初始化时设置 mobx.useStrict(true) ，状态只能由 @action 函数修改
 * 页面路由类组件的 state 全部由 store 管理，这条主要是为了可维护
