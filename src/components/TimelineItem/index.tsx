import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusBadge from '@/components/StatusBadge';
import type { ProgressStep } from '@/types/onboarding';

interface TimelineItemProps {
  step: ProgressStep;
  isLast?: boolean;
}

const TimelineItem: React.FC<TimelineItemProps> = ({ step, isLast }) => {
  const connectorClass = step.status === 'completed' ? 'completed' : '';

  return (
    <View className={styles.item}>
      <View className={styles.left}>
        <View className={classnames(styles.dot, styles[step.status])} />
        {!isLast && <View className={classnames(styles.connector, styles[connectorClass])} />}
      </View>
      <View className={styles.right}>
        <View className={styles.header}>
          <Text className={styles.title}>{step.title}</Text>
          <StatusBadge status={step.status} />
        </View>
        <Text className={styles.description}>{step.description}</Text>
        <View className={styles.meta}>
          {step.taskType && (
            <View className={styles.taskTypeTag}>{step.taskType}</View>
          )}
          {step.expectedDate && (
            <View className={styles.metaItem}>预计：{step.expectedDate}</View>
          )}
          {step.actualDate && (
            <View className={styles.metaItem}>实际：{step.actualDate}</View>
          )}
          {step.assignee && (
            <View className={styles.metaItem}>负责人：{step.assignee}</View>
          )}
        </View>
      </View>
    </View>
  );
};

export default TimelineItem;
