var Mock = require('mockjs');


function list(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"Menu_ID":38,"Name":"234234","Number":"234234234","IsSortFields":true,"DefaultSortingMethod":2,"SortCode":23423,"DescInfo":"234234","UniqueID":2,"MenuID":0},{"Menu_ID":38,"Name":"dsfadsf","Number":"sdafsadf","IsSortFields":false,"DefaultSortingMethod":1,"SortCode":200,"DescInfo":"asdfsdafsdf","UniqueID":1,"MenuID":0}]}));
}

function detail(req, res) {
  res.send(Mock.mock({"Code":200,"Data":{"Menu_ID":38,"Name":"234234","Number":"234234234","IsSortFields":true,"DefaultSortingMethod":2,"SortCode":23423,"DescInfo":"234234","UniqueID":2,"MenuID":0}}));
}


module.exports = {
  list,
  detail,
}