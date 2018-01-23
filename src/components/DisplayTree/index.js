import React from 'react';
import { Tree } from 'antd';

const { TreeNode } = Tree;

export default (props) => {
  const { treeList } = props;

  function renderTreeNodes(data) {
    return data.map(item => (
      <TreeNode title={item.name} key={item.id}>
        {
          item.children && item.children.length &&
            renderTreeNodes(item.children)
        }
      </TreeNode>
    ));
  }

  return (
    <Tree
      {...props}
    >
      {
        renderTreeNodes(treeList)
      }
    </Tree>
  );
};
