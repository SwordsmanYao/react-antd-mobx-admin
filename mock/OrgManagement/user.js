var Mock = require('mockjs');

function list(req, res) {

  res.send(Mock.mock(
    {"Code":200,"Data":[{"EmployeeID":11,"LoginName":"qwe","UserStatus":"正常","FullName":"qwe","MobilePhone":"13499883322","OrganizationID":1,"OrganizationName":"马上汽车","UniqueID":7,"CreatedTime":"2018-01-31T15:51:25.3","MenuID":0},{"EmployeeID":10,"LoginName":"asdfasdf","UserStatus":"正常","FullName":"asdfasdfas","MobilePhone":"13288772211","OrganizationID":1,"OrganizationName":"马上汽车","UniqueID":6,"CreatedTime":"2018-01-31T15:48:49.523","MenuID":0},{"EmployeeID":9,"LoginName":"sadfasdfd","UserStatus":"正常","FullName":"asdfasdf","MobilePhone":"13299882211","OrganizationID":1,"OrganizationName":"马上汽车","UniqueID":5,"CreatedTime":"2018-01-31T15:37:45.8","MenuID":0},{"EmployeeID":8,"LoginName":"test","UserStatus":"正常","FullName":"test","JobNumber":"234","MobilePhone":"14322334422","Email":"111@qq.com","Gender":"男","DateOfBirth":"1991-01-25T00:00:00","OrganizationID":1,"OrganizationName":"马上汽车","Remarks":"备注123","UniqueID":4,"CreatedTime":"2018-01-31T15:17:35.02","MenuID":0},{"EmployeeID":7,"LoginName":"yaojian","UserStatus":"正常","FullName":"姚健","JobNumber":"","MobilePhone":"13371755552","OrganizationID":1,"OrganizationName":"马上汽车","UniqueID":3,"CreatedTime":"2018-01-31T15:04:57.617","MenuID":0},{"EmployeeID":6,"LoginName":"Mario","FullName":"玛丽娅","Gender":"女","OrganizationID":1,"OrganizationName":"马上汽车","UniqueID":2,"CreatedTime":"2017-11-21T17:59:03.567","MenuID":0},{"EmployeeID":5,"LoginName":"admin","UserStatus":"正常","FullName":"超级管理员","JobNumber":"10086","MobilePhone":"13599996666","OrganizationID":1,"OrganizationName":"马上汽车","UniqueID":1,"MenuID":0}],"TotalCount":7}
  ));
}

function detail(req, res) {
  res.send(Mock.mock(
    {"Code":200,"Data":{"EmployeeID":7,"LoginName":"yaojian","Employee":{"FullName":"姚健2","JobNumber":"2131231112222","MobilePhone":"13371755552","Gender":"男","DateOfBirth":"2018-03-22T00:00:00","OrganizationID":1,"Remarks":"2233311222","UniqueID":7,"MenuID":0},"UniqueID":3,"MenuID":0}}
  ))
}

function role(req, res) {
  res.send(Mock.mock(
    {"Code":200,"Data":[{"Name":"超级管理员","IsMemberRole":true,"UniqueID":1,"MenuID":0},{"Name":"aa","DescInfo":"aa","IsMemberRole":false,"UniqueID":2,"MenuID":0}]}
  ));
}

module.exports = {
  list,
  detail,
  role,
}