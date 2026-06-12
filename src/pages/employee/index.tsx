import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import ProgressCard from '@/components/ProgressCard';
import ChecklistItemComponent from '@/components/ChecklistItem';
import StatusBadge from '@/components/StatusBadge';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { TaskStatus } from '@/types/onboarding';

type FilterType = 'all' | TaskStatus;

const EmployeePage: React.FC = () => {
  const router = useRouter();
  const routeEmpId = router.params.id as string;

  const employees = useOnboardingStore((s) => s.employees);
  const setCurrentEmployeeId = useOnboardingStore((s) => s.setCurrentEmployeeId);
  const getChecklistGroups = useOnboardingStore((s) => s.getChecklistGroups);
  const getChecklistStats = useOnboardingStore((s) => s.getChecklistStats);

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    if (routeEmpId) {
      setCurrentEmployeeId(routeEmpId);
    }
  }, [routeEmpId, setCurrentEmployeeId]);

  const employee = useMemo(
    () => employees.find((e) => e.id === routeEmpId),
    [employees, routeEmpId]
  );

  const stats = useMemo(
    () => (routeEmpId ? getChecklistStats(routeEmpId) : { total: 0, completed: 0, pending: 0, processing: 0, rejected: 0, percent: 0 }),
    [getChecklistStats, routeEmpId]
  );

  const groups = useMemo(
    () => (routeEmpId ? getChecklistGroups(routeEmpId) : []),
    [getChecklistGroups, routeEmpId]
  );

  const filteredGroups = useMemo(() => {
    if (activeFilter === 'all') return groups;
    return groups
      .map((g) => ({
        ...g,
        items: g.items.filter((i) => i.status === activeFilter)
      }))
      .filter((g) => g.items.length > 0);
  }, [activeFilter, groups]);

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待办理' },
    { key: 'processing', label: '进行中' },
    { key: 'completed', label: '已完成' },
    { key: 'rejected', label: '已退回' }
  ];

  const handleBack = () => {
    Taro.navigateBack();
  };

  const handleItemClick = (itemId: string) => {
    Taro.showToast({ title: '查看详情', icon: 'none' });
  };

  if (!employee) {
    return (
      <View className={styles.page}>
        <View className={styles.emptyState}>
          <Text className={styles.emptyText}>员工信息不存在</Text>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <Text className={styles.backBtn} onClick={handleBack}>
            ← 返回
          </Text>
        </View>
        <View className={styles.empProfile}>
          <Image className={styles.avatar} src={employee.avatar} mode="aspectFill" />
          <View className={styles.empInfo}>
            <View className={styles.empName}>
              {employee.name}
              <StatusBadge status={employee.infoStatus} customText="资料" />
              <StatusBadge status={employee.contractStatus} customText="合同" />
              {employee.arrivalStatus === 'completed' && (
                <StatusBadge status="completed" customText="已到岗" />
              )}
            </View>
            <View className={styles.empPosition}>
              {employee.department} · {employee.position}
            </View>
            <View className={styles.empContact}>{employee.phone}</View>
          </View>
        </View>
      </View>

      <ScrollView className={styles.content} scrollY>
        <View className={styles.progressSection}>
          <ProgressCard
            title="入职办理进度"
            subtitle={`岗位：${employee.position}`}
            percent={stats.percent}
            completed={stats.completed}
            total={stats.total}
            pending={stats.pending}
            rejected={stats.rejected}
          />
        </View>

        <View className={styles.filterTabs}>
          {filterTabs.map((tab) => (
            <View
              key={tab.key}
              className={classnames(styles.filterTab, activeFilter === tab.key && styles.active)}
              onClick={() => setActiveFilter(tab.key)}
            >
              {tab.label}
            </View>
          ))}
        </View>

        {filteredGroups.length === 0 ? (
          <View className={styles.emptyState}>
            <Text className={styles.emptyText}>暂无相关事项</Text>
          </View>
        ) : (
          filteredGroups.map((group) => (
            <View key={group.category}>
              <View className={styles.groupHeader}>
                <Text className={styles.groupTitle}>{group.categoryName}</Text>
                <Text className={styles.groupCount}>{group.items.length} 项</Text>
              </View>
              {group.items.map((item) => (
                <ChecklistItemComponent
                  key={item.id}
                  item={item}
                  onClick={() => handleItemClick(item.id)}
                />
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
};

export default EmployeePage;
