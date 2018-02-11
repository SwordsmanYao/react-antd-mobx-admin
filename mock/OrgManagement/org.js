var Mock = require('mockjs');

function tree(req, res) {

  res.send(Mock.mock({
    Code: 200,
    Data: [
      {
        id: 1,
        name: '集团',
        hasChildren: true,
        children: [
          {
            id: 11,
            name: '门店1',
            hasChildren: false,
          },
          {
            id: 12,
            name: '门店2',
            hasChildren: false,
          },
        ],
      },
      {
        id: 2,
        name: '集团',
        hasChildren: true,
        children: [
          {
            id: 21,
            name: '门店3',
            hasChildren: false,
          },
          {
            id: 22,
            name: '门店4',
            hasChildren: false,
          },
        ],
      },
    ],
  }));
}

function list(req, res) {

  res.send(Mock.mock({
    Code: 200,
    TotalCount: 3,
    Data: [
      {
        UniqueID: 234234,
        FullName: 'Dashboard',
        SortCode: 300,
        ParentID: 0,
        CategoryID: 2,
      },
      {
        UniqueID: 334,
        FullName: 'Dashboard',
        SortCode: 200,
        ParentID: 0,
        CategoryID: 2,
      },
      {
        UniqueID: 344,
        FullName: 'Dashboard',
        SortCode: 100,
        ParentID: 0,
        CategoryID: 2,
      },
    ],
  }));
}

function detail(req, res) {

  res.send(Mock.mock({
    Code: 200,
    Data: {
      UniqueID: 344,
      FullName: 'Dashboard',
      SortCode: 100,
      ParentID: 0,
      CategoryID: 2,
      DescInfo: 'asdfasdf',
    },  
  }));
}


module.exports = {
  tree,
  list,
  detail,
}