import queryString from 'query-string';
import history from '../history';

// 获取通过 search 传递的参数
export function getSearchParam(name) {
  return queryString.parse(history.location.search)[name];
}

// 获取通过 state 传递的参数
export function getStateParam(name) {
  return history.location.state[name];
}
