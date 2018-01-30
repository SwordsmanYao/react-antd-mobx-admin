var express = require('express');
var user = require('./user');
var menu = require('./SystemManagement/menu');
var orgCategory = require('./OrgManagement/orgCategory');
var org = require('./OrgManagement/org');
var operationLog = require('./SystemManagement/operationLog');
var exceptionLog = require('./SystemManagement/exceptionLog');

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


app.post('/Login/SignIn', user.signin);
app.get('/SysManagement/Menu/tree',menu.tree);
app.get('/SysManagement/Menu/list',menu.list);
app.get('/SysManagement/Menu/detail',menu.detail);
app.get('/OrgManagement/OrgCategory/list',orgCategory.list);
app.get('/OrgManagement/OrgCategory/detail',orgCategory.detail);
app.get('/OrgManagement/OrgCategory/TextValue',orgCategory.textValue);
app.get('/OrgManagement/Org/tree',org.tree);
app.get('/OrgManagement/Org/list',org.list);
app.get('/OrgManagement/Org/detail',org.detail);
app.get('/SysManagement/OperationLog/List',operationLog.list);
app.get('/SysManagement/OperationLog/OperateType',operationLog.operateType);
app.get('/SysManagement/ExceptionLog/List',exceptionLog.list);





module.exports = app;