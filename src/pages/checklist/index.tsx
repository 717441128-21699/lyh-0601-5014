import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Image } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import ProgressCard from '@/components/ProgressCard';
import ChecklistItemComponent from '@/components/ChecklistItem';
import StatusBadge from '@/components/StatusBadge';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { TaskStatus } from '@/types/onboarding';

type FilterType = 'all' | TaskStatus;

const ChecklistPage: React.FC = () => {
  const role = useOnboardingStore((s) => s.role);
  const employees = useOnboardingStore((s) => s.employees);
  const currentPositionId = useOnboardingStore((s) => s.currentPositionId);
  const positions = useOnboardingStore((s) => s.positions);
  const getChecklistGroups = useOnboardingStore((s) => s.getChecklistGroups);
  const getChecklistStats = useOnboardingStore((s) => s.getChecklistStats);
  const applyChecklistToEmployee = useOnboardingStore((s) => s.applyChecklistToEmployee);

  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  const filterTabs: { key: FilterType; label: string }[] = [
    { key: 'all', label: '全部' },
    { key: 'pending', label: '待办理' },
    { key: 'processing', label: '进行中' },
    { key: 'completed', label: '已完成' },
    { key: 'rejected', label: '已退回' }
  ];

  const stats = useMemo(() => getChecklistStats(), [getChecklistStats]);
  const groups = useMemo(() => getChecklistGroups(), [getChecklistGroups]);

  const filteredGroups = useMemo(() => {
    if (activeFilter === 'all') return groups;
    return groups
      .map(g => ({
        ...g,
        items: g.items.filter(i => i.status === activeFilter)
      }))
      .filter(g => g.items.length > 0);
  }, [activeFilter, groups]);

  const handleItemClick = (itemId: string) => {
    Taro.showToast({ title: '查看详情', icon: 'none' });
  };

  const handleGuideClick = (guideType: string) => {
    Taro.showToast({ title: '查看公司指引', icon: 'none' });
  };

  const handleEmployeeClick = (empId: string) => {
    Taro.navigateTo({ url: '/pages/employee/index?id=' + empId });
  };

  const handleGoConfig = () => {
    Taro.navigateTo({ url: '/pages/config/index' });
  };

  const handleApplyTemplate = () => {
    const pos = positions.find(p => p.id === currentPositionId);
    Taro.showModal({
      title: '确认应用模板',
      content: `将「${pos?.name || '当前岗位'}」的入职清单模板应用给当前员工？`,
      success: (res) => {
        if (res.confirm) {
          applyChecklistToEmployee(currentPositionId, 'emp1');
          Taro.showToast({ title: '已应用最新清单', icon: 'success' });
        }
      }
    });
  };

  const hrStats = useMemo(() => {
    return {
      total: employees.length,
      pending: employees.filter(e => e.overallProgress < 50).length,
      completed: employees.filter(e => e.overallProgress >= 90 || e.arrivalStatus === 'completed').length
    };
  }, [employees]);

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
              percent={hrStats.total > 0 ? Math.round((hrStats.completed / hrStats.total) * 100) : 0}
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
              <Text className={styles.hrStatLabel}>已完成</Text>
            </View>
          </View>

          <View className={styles.quickActionRow}>
            <View className={styles.quickActionBtn} onClick={handleGoConfig}>
              <Text className={styles.quickActionIcon}>⚙️</Text>
              <Text className={styles.quickActionText}>岗位清单配置</Text>
            </View>
            <View className={styles.quickActionBtn} onClick={handleApplyTemplate}>
              <Text className={styles.quickActionIcon}>📋</Text>
              <Text className={styles.quickActionText}>应用清单模板</Text>
            </View>
          </View>

          <View className={styles.sectionTitle}>新员工列表</View>
          {employees.map(emp => (
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
                  {emp.arrivalStatus === 'completed' && (
                    <Text style={{ marginLeft: 8 }}>
                      <StatusBadge status="completed" customText="已到岗" />
                    </Text>
                  )}
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
