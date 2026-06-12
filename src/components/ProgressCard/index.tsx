import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';

interface ProgressCardProps {
  title: string;
  subtitle?: string;
  percent: number;
  completed: number;
  total: number;
  pending?: number;
  rejected?: number;
}

const ProgressCard: React.FC<ProgressCardProps> = ({
  title,
  subtitle,
  percent,
  completed,
  total,
  pending = 0,
  rejected = 0
}) => {
  return (
    <View className={styles.card}>
      <View className={styles.header}>
        <View>
          <View className={styles.title}>{title}</View>
          {subtitle && <View className={styles.subtitle}>{subtitle}</View>}
        </View>
        <View className={styles.progressPercent}>{percent}%</View>
      </View>
      <View className={styles.progressBar}>
        <View className={styles.progressFill} style={{ width: `${percent}%` }} />
      </View>
      <View className={styles.stats}>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{completed}</Text>
          <Text className={styles.statLabel}>已完成</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{pending}</Text>
          <Text className={styles.statLabel}>待办理</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{rejected}</Text>
          <Text className={styles.statLabel}>已退回</Text>
        </View>
        <View className={styles.statItem}>
          <Text className={styles.statNumber}>{total}</Text>
          <Text className={styles.statLabel}>总计</Text>
        </View>
      </View>
    </View>
  );
};

export default ProgressCard;
