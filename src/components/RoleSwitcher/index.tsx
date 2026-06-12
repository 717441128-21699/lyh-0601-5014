import React from 'react';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import { useUserRole } from '@/store/UserContext';

const RoleSwitcher: React.FC = () => {
  const { role, toggleRole } = useUserRole();

  return (
    <View className={styles.container}>
      <View
        className={classnames(styles.tab, role === 'employee' && styles.active)}
        onClick={toggleRole}
      >
        新员工
      </View>
      <View
        className={classnames(styles.tab, role === 'hr' && styles.active)}
        onClick={toggleRole}
      >
        HR
      </View>
    </View>
  );
};

export default RoleSwitcher;
