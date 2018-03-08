var Mock = require('mockjs');

// 菜单管理列表
function list(req, res) {

  res.send(Mock.mock({
    Code: 200,
    TotalCount: 3,
    Data: [
      {
        UniqueID: 234234,
        Name: 'Dashboard',
        IsAvailable: 1,
        DescInfo: 'adsfasf',
      },
      {
        UniqueID: 2345,
        Name: 'Dashboard',
        IsAvailable: 1,
        DescInfo: 'adsfasf',
      },
      {
        UniqueID: 2234,
        Name: 'Dashboard',
        IsAvailable: 1,
        DescInfo: 'adsfasf',
      },
    ],
  }));
}

function detail(req, res) {
  res.send(Mock.mock({
    Code: 200,
    Data: {
      UniqueID: 234234,
      Name: 'Dashboard',
      IsAvailable: 300,
      DescInfo: 'adsfasf',
    },
  }));
}

function roleMenu(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"id":"20","name":"系统管理","path":"system-management","icon":"dashboard","hasChildren":true,"selected":true,"children":[{"id":"21","name":"菜单管理","path":"menu","hasChildren":false,"selected":true},{"id":"30","name":"系统日志","path":"log","hasChildren":true,"selected":true,"children":[{"id":"31","name":"操作日志","path":"operation-log","hasChildren":false,"selected":true},{"id":"32","name":"异常日志","path":"exception-log","hasChildren":false,"selected":true}]}]},{"id":"27","name":"组织机构","path":"org-management","icon":"dashboard","hasChildren":true,"selected":true,"children":[{"id":"29","name":"机构管理","path":"org","hasChildren":false,"selected":true},{"id":"28","name":"机构类别","path":"org-category","hasChildren":false,"selected":true},{"id":"33","name":"用户管理","path":"user","hasChildren":false,"selected":true},{"id":"34","name":"角色管理","path":"role","hasChildren":false,"selected":true}]},{"id":"3","name":"单位组织","path":"test","icon":"fa fa-coffee","hasChildren":true,"selected":true,"children":[{"id":"12","name":"机构类别","path":"test","icon":"fa fa-server","hasChildren":false,"selected":true},{"id":"9","name":"机构管理","path":"test","icon":"fa fa-sitemap","hasChildren":false,"selected":true},{"id":"10","name":"角色管理","path":"test","icon":"fa fa-paw","hasChildren":false,"selected":true},{"id":"11","name":"用户管理","path":"test","icon":"fa fa-user","hasChildren":false,"selected":true}]}]}));
}

function roleMember(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"UserID":2,"RelationType":0,"RelationID":0,"UniqueID":0,"MenuID":0},{"UserID":3,"RelationType":0,"RelationID":0,"UniqueID":0,"MenuID":0}]}));
}

function roleMemberDetail(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"LoginName":"admin","FullName":"超级管理员","IsRoleMember":false,"UniqueID":1,"MenuID":0},{"LoginName":"Mario","FullName":"玛丽娅","Gender":"女","IsRoleMember":true,"UniqueID":2,"MenuID":0},{"LoginName":"yaojian","FullName":"姚健2","Gender":"男","IsRoleMember":true,"UniqueID":3,"MenuID":0},{"LoginName":"test","FullName":"test","Gender":"男","IsRoleMember":false,"UniqueID":4,"MenuID":0},{"LoginName":"sadfasdfd","FullName":"asdfasdf","IsRoleMember":false,"UniqueID":5,"MenuID":0},{"LoginName":"asdfasdf","FullName":"asdfasdfas","IsRoleMember":false,"UniqueID":6,"MenuID":0},{"LoginName":"qwe","FullName":"qwe","IsRoleMember":false,"UniqueID":7,"MenuID":0},{"LoginName":"dsfads","FullName":"asdfasd","IsRoleMember":false,"UniqueID":14,"MenuID":0}]}));
}

function roleMenuButton(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"MenuID":33,"Buttons":[{"id":"22","name":"新建","hasChildren":false,"selected":false},{"id":"23","name":"编辑","hasChildren":false,"selected":false},{"id":"24","name":"删除","hasChildren":false,"selected":false},{"id":"25","name":"更多","hasChildren":true,"selected":true,"children":[{"id":"29","name":"角色","hasChildren":false,"selected":true},{"id":"28","name":"禁用","hasChildren":false,"selected":true},{"id":"27","name":"启用","hasChildren":false,"selected":false},{"id":"26","name":"重置密码","hasChildren":false,"selected":false}]}]},{"MenuID":21,"Buttons":[{"id":"19","name":"新建","hasChildren":false,"selected":false},{"id":"20","name":"编辑","hasChildren":false,"selected":false},{"id":"21","name":"删除","hasChildren":false,"selected":true}]},{"MenuID":41,"Buttons":[{"id":"18","name":"aasf","hasChildren":false,"selected":false},{"id":"17","name":"sadf","hasChildren":false,"selected":false},{"id":"14","name":"daafdsaf","hasChildren":false,"selected":false}]},{"MenuID":40,"Buttons":[{"id":"12","name":"dsfadfd","hasChildren":true,"selected":false,"children":[{"id":"9","name":"dsfads","hasChildren":false,"selected":false}]},{"id":"11","name":"sdfasdfasd","hasChildren":false,"selected":false}]}]}));
}

function roleMenuField(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"MenuID":33,"Fields":[{"id":"8","name":"登录名","hasChildren":false,"selected":true},{"id":"9","name":"姓名","hasChildren":false,"selected":true},{"id":"10","name":"工号","hasChildren":false,"selected":true},{"id":"11","name":"状态","hasChildren":false,"selected":true},{"id":"12","name":"手机","hasChildren":false,"selected":true},{"id":"13","name":"角色","hasChildren":false,"selected":true},{"id":"14","name":"注册日期","hasChildren":false,"selected":false}]},{"MenuID":21,"Fields":[{"id":"3","name":"名称","hasChildren":false,"selected":true},{"id":"4","name":"路径","hasChildren":false,"selected":true},{"id":"5","name":"排序","hasChildren":false,"selected":true},{"id":"6","name":"类型","hasChildren":false,"selected":true},{"id":"7","name":"显示","hasChildren":false,"selected":true}]}]}));
}

function setRoleMenu(req, res) {
  res.send(Mock.mock({"Code":200}));
}
function setRoleMenuButton(req, res) {
  res.send(Mock.mock({"Code":200}));
}
function setRoleMenuField(req, res) {
  res.send(Mock.mock({"Code":200}));
}

module.exports = {
  list,
  detail,
  roleMenu,
  roleMember,
  roleMemberDetail,
  setRoleMenu,
  setRoleMenuButton,
  setRoleMenuField,
  roleMenuButton,
  roleMenuField,
}