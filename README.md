## react-antd-mobx-admin

一个基于 create-react-app、antd、react-router、mobx 的中后台管理模板

### mobx 使用注意事项
 * 延迟对象属性地解引用
 * 不要吝啬使用 @observer，子组件只要用到 mobx 管理的数据就要加上 @observer
 * 不要吝啬使用 @action，凡是涉及到对应用状态变量修改的函数，都应该使用 @action 修饰符。
 * 应用初始化时设置 mobx.useStrict(true) ，状态只能由 @action 函数修改
