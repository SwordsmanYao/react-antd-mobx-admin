var Mock = require('mockjs');

function signin(req, res) {

  res.send(Mock.mock({
    Code: 200,
    Data: {
      Logo: '',
      Token: '279600085CE0799E5905FE156A52315ECEDEC7B3C59228DC70E5C1EC07E4D31698748F9EEA93AF56CB4F876BC91DA0293620E66A2E76DE816709E07BCF0CC048C41758A487A3ECFF4933E9A1890D2E2B3F9CBFA5A2CC35DDA25B433EDD95AF67BE69A261121A95440727852837739A11',
      UserName: '超级管理员',
    },
  }));
}

// 菜单树
function menutree(req, res) {

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
          {
            id: 13,
            name: '代码管理',
            path: 'code',
            hasChildren: false,
          },
          {
            id: 14,
            name: '行政地区',
            path: 'administrative-area',
            hasChildren: false,
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
            name: '角色管理',
            path: 'role',
            hasChildren: false,
          },
          {
            id: 24,
            name: '用户管理',
            path: 'user',
            hasChildren: false,
          },
        ],
      },
    ],
  }));
}

module.exports = {
  signin,
  menutree,
}