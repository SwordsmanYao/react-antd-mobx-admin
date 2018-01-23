var express = require('express');
var demo = require('./demo');
var user = require('./user');
var menu = require('./menu');
var orgCategory = require('./orgCategory');

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

app.get('/demo/query',demo.query);
app.post('/demo/add',demo.add);
app.post('/Login/SignIn', user.signin);
app.get('/SysManagement/Menu/tree',menu.tree);
app.get('/SysManagement/Menu/list',menu.list);
app.get('OrgManagement/OrgCategory/list',orgCategory.list);




module.exports = app;