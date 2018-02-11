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
        SortCode: 300,
        DescInfo: 'adsfasf',
      },
      {
        UniqueID: 2345,
        Name: 'Dashboard',
        SortCode: 300,
        DescInfo: 'adsfasf',
      },
      {
        UniqueID: 2234,
        Name: 'Dashboard',
        SortCode: 300,
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
      SortCode: 300,
      DescInfo: 'adsfasf',
    },
  }));
}

function textValue(req, res) {
  res.send(Mock.mock({
    Code: 200,
    Data: [
      {"text":"集团","value":"1"},
      {"text":"子公司","value":"2"},
      {"text":"门店","value":"3"},
      {"text":"部门","value":"4"}
    ],
  }));
}

module.exports = {
  list,
  detail,
  textValue
}