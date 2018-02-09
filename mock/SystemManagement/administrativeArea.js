var Mock = require('mockjs');

function tree(req, res) {

  res.send(Mock.mock({"Code":200,"Data":[{"id":"110000","name":"北京","hasChildren":false,"depthlevel":1},{"id":"120000","name":"天津","hasChildren":false,"depthlevel":1},{"id":"130000","name":"河北省","hasChildren":false,"depthlevel":1},{"id":"140000","name":"山西省","hasChildren":false,"depthlevel":1},{"id":"150000","name":"内蒙古自治区","hasChildren":false,"depthlevel":1},{"id":"210000","name":"辽宁省","hasChildren":false,"depthlevel":1},{"id":"220000","name":"吉林省","hasChildren":false,"depthlevel":1},{"id":"230000","name":"黑龙江省","hasChildren":false,"depthlevel":1},{"id":"310000","name":"上海","hasChildren":false,"depthlevel":1},{"id":"320000","name":"江苏省","hasChildren":false,"depthlevel":1},{"id":"330000","name":"浙江省","hasChildren":false,"depthlevel":1},{"id":"340000","name":"安徽省","hasChildren":false,"depthlevel":1},{"id":"350000","name":"福建省","hasChildren":false,"depthlevel":1},{"id":"360000","name":"江西省","hasChildren":false,"depthlevel":1},{"id":"370000","name":"山东省","hasChildren":false,"depthlevel":1},{"id":"410000","name":"河南省","hasChildren":false,"depthlevel":1},{"id":"420000","name":"湖北省","hasChildren":false,"depthlevel":1},{"id":"430000","name":"湖南省","hasChildren":false,"depthlevel":1},{"id":"440000","name":"广东省","hasChildren":false,"depthlevel":1},{"id":"450000","name":"广西壮族自治区","hasChildren":false,"depthlevel":1},{"id":"460000","name":"海南省","hasChildren":false,"depthlevel":1},{"id":"500000","name":"重庆","hasChildren":false,"depthlevel":1},{"id":"510000","name":"四川省","hasChildren":false,"depthlevel":1},{"id":"520000","name":"贵州省","hasChildren":false,"depthlevel":1},{"id":"530000","name":"云南省","hasChildren":false,"depthlevel":1},{"id":"540000","name":"西藏自治区","hasChildren":false,"depthlevel":1},{"id":"610000","name":"陕西省","hasChildren":false,"depthlevel":1},{"id":"620000","name":"甘肃省","hasChildren":false,"depthlevel":1},{"id":"630000","name":"青海省","hasChildren":false,"depthlevel":1},{"id":"640000","name":"宁夏回族自治区","hasChildren":false,"depthlevel":1},{"id":"650000","name":"新疆维吾尔自治区","hasChildren":false,"depthlevel":1},{"id":"810000","name":"香港特别行政区","hasChildren":false,"depthlevel":1},{"id":"820000","name":"澳门特别行政区","hasChildren":false,"depthlevel":1},{"id":"830000","name":"台湾省","hasChildren":false,"depthlevel":1},{"id":"659004503","name":"test","hasChildren":false},{"id":"659004505","name":"test2","hasChildren":false}]}));
}

function list(req, res) {
  res.send(Mock.mock({"Code":200,"Data":[{"Name":"test","ParentID":0,"Category":1,"SortCode":300,"CodeValue":"2","Remark":"qwertyuiop","UniqueID":1,"CreatorID":1,"CreatedTime":"2018-02-08T14:46:13.67","LastModifiedBy":1,"LastModifiedTime":"2018-02-08T14:49:18.333","MenuID":0}],"TotalCount":1}));
}


module.exports = {
  tree,
  list,
}