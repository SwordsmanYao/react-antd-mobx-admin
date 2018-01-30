import React from 'react';
import { Tooltip, message } from 'antd';
import {CopyToClipboard} from 'react-copy-to-clipboard';

/**
 * 复制到剪切板
 */
export default (props) => {
  return (
    <Tooltip title="点击复制">
      <CopyToClipboard text={props.text}
        onCopy={() => {
          message.success('复制成功！');
        }}>
        {props.children}
      </CopyToClipboard>
    </Tooltip>
  );
}