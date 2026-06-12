import React from 'react';
import { View, Text } from '@tarojs/components';
import styles from './index.module.scss';
import StatusBadge from '@/components/StatusBadge';
import type { ChecklistItem as ChecklistItemType } from '@/types/onboarding';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onClick?: () => void;
}

const ChecklistItemComponent: React.FC<ChecklistItemProps> = ({ item, onClick }) => {
  return (
    <View className={styles.item} onClick={onClick}>
      <View className={styles.header}>
        <Text className={styles.title}>{item.title}</Text>
        <StatusBadge status={item.status} />
      </View>
      <Text className={styles.description}>{item.description}</Text>
      {item.rejectReason && (
        <View className={styles.rejectReason}>
          退回原因：{item.rejectReason}
        </View>
      )}
      <View className={styles.meta}>
        <View>
          {item.completedAt && <Text>完成时间：{item.completedAt}</Text>}
          {item.deadline && !item.completedAt && <Text>截止：{item.deadline}</Text>}
        </View>
        {item.assignee && (
          <View className={styles.assignee}>
            负责人：{item.assignee}
          </View>
        )}
      </View>
    </View>
  );
};

export default ChecklistItemComponent;
