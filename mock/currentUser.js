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

module.exports = {
  signin,
}