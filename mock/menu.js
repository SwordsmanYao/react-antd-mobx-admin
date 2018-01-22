var Mock = require('mockjs');

// 菜单树
function tree(req, res) {

  res.send(Mock.mock({
    Code: 200,
    Data: [
      {
        id: 245345,
        name: '系统管理',
        icon: 'dashboard',
        path: 'system-management',
        hasChildren: true,
        children: [
          {
            id: 131245,
            name: '菜单管理',
            path: 'menu',
            hasChildren: false,
          },
          {
            id: 25345,
            name: 'Form',
            path: 'menuForm',
            hasChildren: false,
          }
        ],
      },
      {
        id: 234234,
        name: 'demo',
        icon: 'dashboard',
        path: 'demo',
        hasChildren: false,
      },
    ],
  }));
}

// 菜单管理列表
function list(req, res) {

  res.send(Mock.mock({
    Code: 200,
    Data: [
      {
        UniqueID: 234234,
        Name: 'Dashboard',
        Path: 'table-list',
        SortCode: 300,
        ParentID: 0,
        MenuID: 0,
        IsDisplayed: 1,
        Category: 1,
      },
      {
        UniqueID: 2345,
        Name: 'Dashboard',
        Path: 'table-list',
        SortCode: 200,
        ParentID: 0,
        MenuID: 0,
        IsDisplayed: 1,
        Category: 1,
      },
      {
        UniqueID: 2234,
        Name: 'Dashboard',
        Path: 'table-list',
        SortCode: 100,
        ParentID: 0,
        MenuID: 0,
        IsDisplayed: 1,
        Category: 1,
      },
    ],
  }));
}

module.exports = {
  tree,
  list
}