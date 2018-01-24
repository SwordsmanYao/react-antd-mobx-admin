
const context = require.context('./', false, /\.js$/);
const keys = context.keys().filter(item => item !== './index.js');

let stores = {};

keys.forEach(key => {
  const name = key.replace('./' , '').replace('.js', '');
  stores[name] = context(key).default;
});

export default stores;