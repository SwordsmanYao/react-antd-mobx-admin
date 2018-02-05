var express = require('express');
var currentUser = require('./currentUser');
var menu = require('./SystemManagement/menu');
var orgCategory = require('./OrgManagement/orgCategory');
var org = require('./OrgManagement/org');
var role = require('./OrgManagement/role');
var operationLog = require('./SystemManagement/operationLog');
var exceptionLog = require('./SystemManagement/exceptionLog');
var user = require('./OrgManagement/user');

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
app.get('/SysManagement/Menu/tree',menu.tree);
app.get('/SysManagement/Menu/list',menu.list);
app.get('/SysManagement/Menu/detail',menu.detail);
app.get('/OrgManagement/OrgCategory/list',orgCategory.list);
app.get('/OrgManagement/OrgCategory/detail',orgCategory.detail);
app.get('/OrgManagement/OrgCategory/TextValue',orgCategory.textValue);
app.get('/OrgManagement/Org/tree',org.tree);
app.get('/OrgManagement/Org/list',org.list);
app.get('/OrgManagement/Org/detail',org.detail);
app.get('/OrgManagement/Role/list',role.list);
app.get('/OrgManagement/Role/detail',role.detail);
app.get('/OrgManagement/Role/RoleMenu',role.roleMenu);
app.get('/OrgManagement/Role/RoleMember',role.roleMember);
app.get('/SysManagement/OperationLog/List',operationLog.list);
app.get('/SysManagement/OperationLog/OperateType',operationLog.operateType);
app.get('/SysManagement/ExceptionLog/List',exceptionLog.list);
app.get('/OrgManagement/User/List',user.list);
app.get('/OrgManagement/User/MemberRole',user.role);





module.exports = app;