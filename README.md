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

### 项目结构
```
|-- build  编译构建后生成的文件，可直接放到服务器上
|-- config  webpack相关配置文件
|-- mock	 接口模拟
|-- node_ modules  依赖包
|-- public  一般不会被webpack处理的静态文件
|-- scripts  执行命令的文件
|--| src  源文件目录
|--|-- assets  logo图片等资源文件
|--|-- components  公共组件目录
|--|-- layouts  布局页面
|--|-- router  路由配置
|--|-- services  接口请求
|--|-- stores  数据存储
|--|-- utils
|--|-- views  页面
|--|-- App.js  应用入口文件
|--|-- history.js
|--|-- index.js 整个项目的入口文件
|-- theme   定制主题
|-- .eslintrc  eslint配置文件
|-- package.json  项目配置文件
|-- yarn.lock  依赖包版本锁定文件
```

### mobx 使用注意事项
 * 延迟对象属性地解引用
 * 不要吝啬使用 @observer，子组件只要用到 mobx 管理的数据就要加上 @observer
 * 不要吝啬使用 @action，凡是涉及到对应用状态变量修改的函数，都应该使用 @action 修饰符。
 * 当需要修改状态时，应该调用同步函数修改或使用 transaction（此处为性能考虑，@action 修饰后只有同步函数默认使用 transaction 修改状态，可以避免重复渲染 react 组件）
 * 应用初始化时设置 mobx.useStrict(true) ，状态只能由 @action 函数修改
