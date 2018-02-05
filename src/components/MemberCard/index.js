import React from 'react';
import { Icon, Avatar } from 'antd';

import styles from './index.less';

export default (props) => {

  const { active, loginName, name, department } = props;

  return (
    <div className={active ? styles.memberCardActive : styles.memberCard}>
      {
        active && <span class={styles.icon}><Icon type="check" /></span>
      }
      <Avatar className={styles.avatar} style={{ backgroundColor: '#7265e6', verticalAlign: 'middle' }} size="large">
        {name.substr(0, 1)}
      </Avatar>
      <div className={styles.content}>
        <div className={styles.title}>
          账户：{loginName}
        </div>
        <div className={styles.detail}>
          <div className={styles.name}>姓名：{name}</div>
          <div className={styles.department}>部门：{department}</div>
        </div>
      </div>
    </div>
  );
};
