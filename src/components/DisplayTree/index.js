import React from 'react';
import { Tree, Spin } from 'antd';

const { TreeNode } = Tree;

export default (props) => {
  const { treeList } = props;

  function renderTreeNodes(data) {
    return data.map(item => (
      <TreeNode title={item.name} key={item.id} dataRef={item}>
        {
          item.children && item.children.length &&
            renderTreeNodes(item.children)
        }
      </TreeNode>
    ));
  }

  return (
    treeList && treeList.length > 0 ?
    <Tree
      {...props}
    >
      {
        renderTreeNodes(treeList)
      }
    </Tree> :
    <Spin />
  );
};
