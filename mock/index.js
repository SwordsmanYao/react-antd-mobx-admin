var express = require('express');
var currentUser = require('./currentUser');
var menu = require('./SystemManagement/menu');
var menuButton = require('./SystemManagement/menuButton');
var menuList = require('./SystemManagement/menuList');
var orgCategory = require('./OrgManagement/orgCategory');
var org = require('./OrgManagement/org');
var role = require('./OrgManagement/role');
var operationLog = require('./SystemManagement/operationLog');
var exceptionLog = require('./SystemManagement/exceptionLog');
var user = require('./OrgManagement/user');
var code = require('./SystemManagement/code');
var administrativeArea = require('./SystemManagement/administrativeArea');

var app = express();

// 设置跨域
var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
};

app.use(allowCrossDomain);


app.post('/Login/SignIn', currentUser.signin);
app.get('/SysManagement/Authentication/MenuTree', currentUser.menutree);
app.get('/SysManagement/Menu/tree', menu.tree);
app.get('/SysManagement/Menu/list',  menu.list);
app.get('/SysManagement/Menu/detail', menu.detail);
app.post('/SysManagement/Menu/update', menu.update);
app.get('/SysManagement/MenuButton/tree', menuButton.tree);
app.get('/SysManagement/MenuButton/list',  menuButton.list);
app.get('/SysManagement/MenuButton/detail', menuButton.detail);
app.get('/SysManagement/MenuList/list',  menuList.list);
app.get('/SysManagement/MenuList/detail', menuList.detail);
app.get('/OrgManagement/OrgCategory/list', orgCategory.list);
app.get('/OrgManagement/OrgCategory/detail', orgCategory.detail);
app.get('/OrgManagement/OrgCategory/TextValue', orgCategory.textValue);
app.get('/OrgManagement/Org/tree', org.tree);
app.get('/OrgManagement/Org/list',  org.list);
app.get('/OrgManagement/Org/detail', org.detail);
app.get('/OrgManagement/Role/list', role.list);
app.get('/OrgManagement/Role/detail', role.detail);
app.get('/OrgManagement/Role/RoleMenu', role.roleMenu);
app.get('/OrgManagement/Role/RoleMember', role.roleMember);
app.get('/OrgManagement/Role/RoleMemberDetail', role.roleMemberDetail);
app.post('/OrgManagement/Role/SetRoleMenu', role.setRoleMenu);
app.post('/OrgManagement/Role/SetRoleMenuButton', role.setRoleMenuButton);
app.post('/OrgManagement/Role/SetRoleMenuField', role.setRoleMenuField);
app.get('/OrgManagement/Role/RoleMenuButton', role.roleMenuButton);
app.get('/OrgManagement/Role/RoleMenuField', role.roleMenuField);
app.get('/SysManagement/OperationLog/List', operationLog.list);
app.get('/SysManagement/OperationLog/OperateType', operationLog.operateType);
app.get('/SysManagement/ExceptionLog/List', exceptionLog.list);
app.get('/OrgManagement/User/List', user.list);
app.get('/OrgManagement/User/Detail', user.detail);
app.get('/OrgManagement/User/MemberRole', user.role);
app.get('/SysManagement/Code/ClassificationTree', code.tree);
app.get('/SysManagement/Code/List', code.list);
app.get('/SysManagement/Code/Detail', code.detail);
app.get('/SysManagement/AdministrativeArea/Tree', administrativeArea.tree);
app.get('/SysManagement/AdministrativeArea/List', administrativeArea.list);
app.get('/SysManagement/AdministrativeArea/Detail', administrativeArea.detail);




module.exports = app;