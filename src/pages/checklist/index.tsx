import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import ProgressCard from '@/components/ProgressCard';
import ChecklistItemComponent from '@/components/ChecklistItem';
import StatusBadge from '@/components/StatusBadge';
import { useUserRole } from '@/store/UserContext';
import { mockChecklistItems, mockChecklistGroups, mockEmployees } from '@/data/mockData';
import type { TaskStatus } from '@/types/onboarding';

type FilterType = 'all' | TaskStatus;

const ChecklistPage: React.FC = () => {
  const { role } = useUserRole();
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待办理' },
    { key: 'processing', label: '进行中' },
    { key: 'completed', label: '已完成' },
    { key: 'rejected', label: '已退回' }
  ];

  const stats = useMemo(() => {
    const total = mockChecklistItems.length;
    const completed = mockChecklistItems.filter(i => i.status === 'completed').length;
    const pending = mockChecklistItems.filter(i => i.status === 'pending').length;
    const processing = mockChecklistItems.filter(i => i.status === 'processing').length;
    const rejected = mockChecklistItems.filter(i => i.status === 'rejected').length;
    const percent = Math.round((completed / total) * 100);
    return { total, completed, pending, processing, rejected, percent };
  }, []);

  const filteredGroups = useMemo(() => {
    if (activeFilter === 'all') return mockChecklistGroups;
    return mockChecklistGroups
      .map(g => ({
        ...g,
        items: g.items.filter(i => i.status === activeFilter)
      }))
      .filter(g => g.items.length > 0);
  }, [activeFilter]);

  const handleItemClick = (itemId: string) => {
    console.log('[Checklist] Click item:', itemId);
    Taro.showToast({ title: '查看详情', icon: 'none' });
  };

  const handleGuideClick = (guideType: string) => {
    console.log('[Checklist] Click guide:', guideType);
    Taro.showToast({ title: '查看公司指引', icon: 'none' });
  };

  const handleEmployeeClick = (empId: string) => {
    console.log('[Checklist] Click employee:', empId);
    Taro.navigateTo({ url: '/pages/employee/index?id=' + empId });
  };

  const hrStats = useMemo(() => {
    return {
      total: mockEmployees.length,
      pending: mockEmployees.filter(e => e.overallProgress < 50).length,
      completed: mockEmployees.filter(e => e.overallProgress >= 90).length
    };
  }, []);

  if (role === 'hr') {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.headerTop}>
            <View className={styles.greeting}>
              <View className={styles.greetingTitle}>您好，HR管理员</View>
              <View className={styles.greetingSub}>管理新员工入职流程</View>
            </View>
            <RoleSwitcher />
          </View>
        </View>
        <ScrollView className={styles.content} scrollY>
          <View className={styles.progressSection}>
            <ProgressCard
              title="入职办理总览"
              subtitle="当前在办新员工"
              percent={Math.round((hrStats.completed / hrStats.total) * 100)}
              completed={hrStats.completed}
              total={hrStats.total}
              pending={hrStats.pending}
            />
          </View>

          <View className={styles.hrStatRow}>
            <View className={styles.hrStatCard}>
              <Text className={styles.hrStatNum}>{hrStats.total}</Text>
              <Text className={styles.hrStatLabel}>在办员工</Text>
            </View>
            <View className={styles.hrStatCard}>
              <Text className={styles.hrStatNum}>{hrStats.pending}</Text>
              <Text className={styles.hrStatLabel}>待跟进</Text>
            </View>
            <View className={styles.hrStatCard}>
              <Text className={styles.hrStatNum}>{hrStats.completed}</Text>
              <Text className={styles.hrStatLabel}>即将完成</Text>
            </View>
          </View>

          <View className={styles.sectionTitle}>新员工列表</View>
          {mockEmployees.map(emp => (
            <View
              key={emp.id}
              className={styles.employeeCard}
              onClick={() => handleEmployeeClick(emp.id)}
            >
              <Image className={styles.avatar} src={emp.avatar} mode="aspectFill" />
              <View className={styles.empInfo}>
                <View className={styles.empName}>
                  {emp.name}
                  <Text style={{ marginLeft: 16 }}>
                    <StatusBadge status={emp.infoStatus} customText="资料" />
                  </Text>
                  <Text style={{ marginLeft: 8 }}>
                    <StatusBadge status={emp.contractStatus} customText="合同" />
                  </Text>
                </View>
                <View className={styles.empPosition}>{emp.department} · {emp.position}</View>
                <View className={styles.empProgress}>
                  <View className={styles.miniProgress}>
                    <View
                      className={styles.miniFill}
                      style={{ width: `${emp.overallProgress}%` }}
                    />
                  </View>
                  <Text className={styles.progressText}>{emp.overallProgress}%</Text>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View className={styles.greeting}>
            <View className={styles.greetingTitle}>您好，李明</View>
            <View className={styles.greetingSub}>欢迎加入XX科技，开启您的入职之旅</View>
          </View>
          <RoleSwitcher />
        </View>
      </View>
      <ScrollView className={styles.content} scrollY>
        <View className={styles.progressSection}>
          <ProgressCard
            title="入职办理进度"
            subtitle="预计到岗日期：2026年6月20日"
            percent={stats.percent}
            completed={stats.completed}
            total={stats.total}
            pending={stats.pending}
            rejected={stats.rejected}
          />
        </View>

        <View
          className={styles.guideCard}
          onClick={() => handleGuideClick('handbook')}
        >
          <View className={styles.guideIcon}>📖</View>
          <View className={styles.guideContent}>
            <View className={styles.guideTitle}>新员工指引</View>
            <View className={styles.guideDesc}>公司介绍、规章制度、福利待遇一览</View>
          </View>
        </View>

        <View className={styles.filterTabs}>
          {filterTabs.map(tab => (
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
          filteredGroups.map(group => (
            <View key={group.category}>
              <View className={styles.groupHeader}>
                <Text className={styles.groupTitle}>{group.categoryName}</Text>
                <Text className={styles.groupCount}>{group.items.length} 项</Text>
              </View>
              {group.items.map(item => (
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

export default ChecklistPage;
