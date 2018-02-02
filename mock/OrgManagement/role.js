var Mock = require('mockjs');

// 菜单管理列表
function list(req, res) {

  res.send(Mock.mock({
    Code: 200,
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

module.exports = {
  list,
  detail,
}