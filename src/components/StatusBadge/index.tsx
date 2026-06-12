import React from 'react';
import { View } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { TaskStatus } from '@/types/onboarding';

interface StatusBadgeProps {
  status: TaskStatus;
  customText?: string;
}

const statusTextMap: Record<TaskStatus, string> = {
  pending: '待办理',
  processing: '进行中',
  completed: '已完成',
  rejected: '已退回'
};

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, customText }) => {
  return (
    <View className={classnames(styles.badge, styles[status])}>
      {customText || statusTextMap[status]}
    </View>
  );
};

export default StatusBadge;
