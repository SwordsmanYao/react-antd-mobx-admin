var Mock = require('mockjs');

// 菜单树
function tree(req, res) {

  res.send(Mock.mock({
    Code: 200,
    Data: [
      {
        id: 1,
        name: '系统管理',
        icon: 'dashboard',
        path: 'system-management',
        hasChildren: true,
        children: [
          {
            id: 11,
            name: '菜单管理',
            path: 'menu',
            hasChildren: false,
          },
          {
            id: 12,
            name: '系统日志',
            path: 'log',
            hasChildren: true,
            children: [
              {
                id: 121,
                name: '操作日志',
                path: 'operation-log',
                hasChildren: false,
              },
              {
                id: 122,
                name: '异常日志',
                path: 'exception-log',
                hasChildren: false,
              },
            ]
          },
        ],
      },
      {
        id: 2,
        name: '组织管理',
        icon: 'dashboard',
        path: 'org-management',
        hasChildren: true,
        children: [
          {
            id: 21,
            name: '机构类别',
            path: 'org-category',
            hasChildren: false,
          },
          {
            id: 22,
            name: '机构管理',
            path: 'org',
            hasChildren: false,
          },
          {
            id: 23,
            name: '用户管理',
            path: 'user',
            hasChildren: false,
          },
        ],
      },
      {
        id: 3,
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

function detail(req, res) {

  res.send(Mock.mock({
    Code: 200,
    Data: {
      UniqueID: 234234,
      Name: 'Dashboard',
      Path: 'table-list',
      SortCode: 300,
      ParentID: 0,
      MenuID: 0,
      IsDisplayed: 1,
      Category: 1,
    },  
  }));
}

module.exports = {
  tree,
  list,
  detail,
}