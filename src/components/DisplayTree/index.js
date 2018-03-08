import React from 'react';
import { Tree, Spin, Icon } from 'antd';

const { TreeNode } = Tree;

export default (props) => {
  const { treeList, selectable = true, showIcons = false } = props;

  function renderTreeNodes(data) {
    return data.map(item => (
      <TreeNode title={<span>{showIcons && <span><Icon type={item.icon} />&nbsp;&nbsp;</span>}{item.name}</span>} key={item.id} dataRef={item} selectable={item.selectable || selectable}>
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
