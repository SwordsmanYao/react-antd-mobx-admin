
function query(req, res) {
  res.status(200).json({
    name: '小明',
    age: 12,
  });
}

module.exports = {
  query,
}