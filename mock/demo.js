var Mock = require('mockjs');

function query(req, res) {

  res.send(Mock.mock({
    Code: 200,
    Data: {
      name: '小明',
      'age|1-100': 1,
    },
  }));
}

function add(req, res) {
  res.send({
    Code: 200,
  });
}

module.exports = {
  query,
  add,
}