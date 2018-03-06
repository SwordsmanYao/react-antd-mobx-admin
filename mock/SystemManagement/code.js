var Mock = require('mockjs');

function tree(req, res) {

  res.send(Mock.mock({"Code":200,"Data":[{"id":"1","name":"test","hasChildren":true,"children":[{"id":"3","name":"asd","hasChildren":false}]}]}));
}

function list(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"Name":"test","ParentID":0,"Category":1,"SortCode":300,"CodeValue":"2","Remark":"qwertyuiop","UniqueID":1,"CreatorID":1,"CreatedTime":"2018-02-08T14:46:13.67","LastModifiedBy":1,"LastModifiedTime":"2018-02-08T14:49:18.333","MenuID":0}],"TotalCount":1}));
}

function detail(req, res) {
  res.send(Mock.mock(
    {"Code":200,"Data":{"Name":"test","ParentID":0,"Category":1,"SortCode":300,"CodeValue":"2","Remark":"qwertyuiop","UniqueID":1,"MenuID":0}}
  ))
}

module.exports = {
  tree,
  list,
  detail,
}