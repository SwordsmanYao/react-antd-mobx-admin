import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { Button } from 'antd';

import styles from './toolBar.less';

@observer
export default class OrgCategoryToolBar extends Component {

  render() {

    const { orgCategory, handleNew, handleEdit, handleRemoveChecked } = this.props;

    return (
      <div className={styles.toolBar}>
        <div className={styles.buttonGroups}>
          <Button.Group>
            <Button
              icon="plus"
              onClick={handleNew}
              loading={orgCategory.newBtnLoading}
            >
              新建
            </Button>
            <Button
              icon="edit"
              onClick={handleEdit}
              disabled={orgCategory.selectedRowKeys.length !== 1}
            >
              编辑
            </Button>
            <Button
              icon="delete"
              onClick={handleRemoveChecked}
              disabled={orgCategory.selectedRowKeys.length < 1}
            >
              删除
            </Button>
          </Button.Group>
        </div>
      </div>
    );
  }
}