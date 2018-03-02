var Mock = require('mockjs');


function list(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"id":"7","name":"dsfadsf","hasChildren":false},{"id":"6","name":"adsfasdfasdf","hasChildren":false},{"id":"1","name":"编辑","hasChildren":true,"children":[{"id":"2","name":"asdf","hasChildren":true,"children":[{"id":"5","name":"adfdsaf","hasChildren":false},{"id":"4","name":"sdafasdf","hasChildren":false},{"id":"3","name":"dafasdfa","hasChildren":false}]}]}]}));
}

function detail(req, res) {
  res.send(Mock.mock({"Code":200,"Data":{"Menu_ID":0,"ParentID":1,"Name":"asdf","Number":"sdaf","Category":1,"SortCode":0,"UniqueID":2,"MenuID":0}}));
}

function tree(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"id":"7","name":"dsfadsf","hasChildren":false},{"id":"6","name":"adsfasdfasdf","hasChildren":false},{"id":"1","name":"编辑","hasChildren":true,"children":[{"id":"2","name":"asdf","hasChildren":true,"children":[{"id":"5","name":"adfdsaf","hasChildren":false},{"id":"4","name":"sdafasdf","hasChildren":false},{"id":"3","name":"dafasdfa","hasChildren":false}]}]}]}));
}

module.exports = {
  list,
  detail,
  tree,
}