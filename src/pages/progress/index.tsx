import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import ProgressCard from '@/components/ProgressCard';
import TimelineItem from '@/components/TimelineItem';
import StatusBadge from '@/components/StatusBadge';
import { useUserRole } from '@/store/UserContext';
import { mockProgressSteps, mockHrTasks, mockEmployees } from '@/data/mockData';

const ProgressPage: React.FC = () => {
  const { role } = useUserRole();
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);
  const [hrTasks, setHrTasks] = useState(mockHrTasks);

  const stats = useMemo(() => {
    const completed = mockProgressSteps.filter(s => s.status === 'completed').length;
    const processing = mockProgressSteps.filter(s => s.status === 'processing').length;
    const pending = mockProgressSteps.filter(s => s.status === 'pending').length;
    const total = mockProgressSteps.length;
    const percent = Math.round((completed / total) * 100);
    return { completed, processing, pending, total, percent };
  }, []);

  const handleTaskAssign = (taskType: string) => {
    console.log('[Progress] Assign task:', taskType);
    Taro.showActionSheet({
      itemList: ['工位分配', '账号开通', '设备准备', '体检安排', '培训安排'],
      success: () => {
        Taro.showToast({ title: '已安排任务', icon: 'success' });
      }
    });
  };

  const handleSendReminder = (taskId: string) => {
    console.log('[Progress] Send reminder for task:', taskId);
    Taro.showToast({ title: '提醒已发送', icon: 'success' });
  };

  const handleMarkDone = (taskId: string) => {
    console.log('[Progress] Mark task done:', taskId);
    setHrTasks(prev => prev.map(t =>
      t.id === taskId ? { ...t, status: 'completed' as const } : t
    ));
    Taro.showToast({ title: '已标记完成', icon: 'success' });
  };

  const handleMarkArrival = () => {
    console.log('[Progress] Mark employee arrived');
    Taro.showModal({
      title: '确认到岗',
      content: '确认该员工已正式到岗吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '入职流程已完成', icon: 'success' });
        }
      }
    });
  };

  const handleSelectEmployee = () => {
    const names = mockEmployees.map(e => e.name);
    Taro.showActionSheet({
      itemList: names,
      success: (res) => {
        setSelectedEmployee(mockEmployees[res.tapIndex]);
      }
    });
  };

  if (role === 'hr') {
    const pendingTasks = hrTasks.filter(t => t.status !== 'completed');
    const completedTasks = hrTasks.filter(t => t.status === 'completed');

    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.headerTop}>
            <View>
              <View className={styles.headerTitle}>任务进度</View>
              <View className={styles.headerSub}>管理入职任务安排与进度</View>
            </View>
            <RoleSwitcher />
          </View>
        </View>
        <View className={styles.content}>
          <View className={styles.progressSection}>
            <ProgressCard
              title="整体任务进度"
              subtitle="今日待办跟进"
              percent={Math.round((completedTasks.length / hrTasks.length) * 100)}
              completed={completedTasks.length}
              total={hrTasks.length}
              pending={pendingTasks.length}
            />
          </View>

          <View className={styles.hrSelect} onClick={handleSelectEmployee}>
            <Text className={styles.hrSelectText}>查看员工：{selectedEmployee.name}</Text>
            <Text className={styles.hrSelectArrow}>▼</Text>
          </View>

          <View className={styles.taskSection}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📋</Text>
              入职任务安排
            </View>
            <View className={styles.taskCard}>
              <View className={styles.taskHeader}>
                <Text className={styles.taskTitle}>工位、账号、设备</Text>
                <StatusBadge status="pending" />
              </View>
              <Text className={styles.taskDesc}>联系行政部门安排工位、开通OA和邮箱账号、准备办公设备</Text>
              <View className={styles.taskActions}>
                <Button className={classnames(styles.btn, styles.btnOutline)} onClick={() => handleTaskAssign('工位')}>
                  分配工位
                </Button>
                <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={() => handleTaskAssign('账号')}>
                  开通账号
                </Button>
              </View>
            </View>
            <View style={{ height: 16 }} />
            <View className={styles.taskCard}>
              <View className={styles.taskHeader}>
                <Text className={styles.taskTitle}>体检安排</Text>
                <StatusBadge status="pending" />
              </View>
              <Text className={styles.taskDesc}>为新员工预约入职体检</Text>
              <View className={styles.taskActions}>
                <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={() => handleTaskAssign('体检')}>
                  预约体检
                </Button>
              </View>
            </View>
            <View style={{ height: 16 }} />
            <View className={styles.taskCard}>
              <View className={styles.taskHeader}>
                <Text className={styles.taskTitle}>培训安排</Text>
                <StatusBadge status="pending" />
              </View>
              <Text className={styles.taskDesc}>安排新员工入职培训</Text>
              <View className={styles.taskActions}>
                <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={() => handleTaskAssign('培训')}>
                  安排培训
                </Button>
              </View>
            </View>
          </View>

          <View className={styles.taskSection}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>⏰</Text>
              待办任务（{pendingTasks.length}）
            </View>
            {pendingTasks.map(task => (
              <View key={task.id} className={styles.hrTaskItem}>
                <View className={styles.hrTaskRow}>
                  <Text className={styles.hrTaskTitle}>{task.title}</Text>
                  <StatusBadge status={task.status} />
                </View>
                <View className={styles.hrTaskSub}>
                  {task.employeeName} · {task.position}
                </View>
                <View className={styles.hrTaskMeta}>
                  <View>
                    截止：{task.deadline}
                    {task.deadline && new Date(task.deadline).getTime() - Date.now() < 86400000 * 2 && (
                      <Text className={styles.reminderBadge}>即将到期</Text>
                    )}
                  </View>
                  <View style={{ display: 'flex', gap: 16 }}>
                    <View
                      className={styles.markDoneBtn}
                      onClick={() => handleSendReminder(task.id)}
                      style={{ backgroundColor: '#fff7e8', color: '#ff7d00' }}
                    >
                      发送提醒
                    </View>
                    <View
                      className={styles.markDoneBtn}
                      onClick={() => handleMarkDone(task.id)}
                    >
                      标记完成
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className={styles.taskSection}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>✅</Text>
              员工到岗确认
            </View>
            <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleMarkArrival}>
              标记员工已到岗
            </Button>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View>
            <View className={styles.headerTitle}>办理进度</View>
            <View className={styles.headerSub}>查看入职流程完成情况</View>
          </View>
          <RoleSwitcher />
        </View>
      </View>
      <ScrollView className={styles.content} scrollY>
        <View className={styles.progressSection}>
          <ProgressCard
            title="入职总进度"
            subtitle="预计完成：2026年6月20日"
            percent={stats.percent}
            completed={stats.completed}
            total={stats.total}
            pending={stats.pending}
          />
        </View>

        <View className={styles.statsRow}>
          <View className={styles.statCard}>
            <Text className={classnames(styles.statNum, styles.statCompleted)}>{stats.completed}</Text>
            <Text className={styles.statLabel}>已完成</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={classnames(styles.statNum, styles.statProcessing)}>{stats.processing}</Text>
            <Text className={styles.statLabel}>进行中</Text>
          </View>
          <View className={styles.statCard}>
            <Text className={classnames(styles.statNum, styles.statPending)}>{stats.pending}</Text>
            <Text className={styles.statLabel}>待办理</Text>
          </View>
        </View>

        <View className={styles.timelineSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>🕐</Text>
            入职流程时间线
          </View>
          {mockProgressSteps.map((step, index) => (
            <TimelineItem
              key={step.id}
              step={step}
              isLast={index === mockProgressSteps.length - 1}
            />
          ))}
        </View>

        <View className={styles.taskSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📌</Text>
            当前进行中的任务
          </View>
          {mockProgressSteps
            .filter(s => s.status === 'processing' || s.status === 'pending')
            .slice(0, 3)
            .map(step => (
              <View key={step.id} className={styles.taskCard}>
                <View className={styles.taskHeader}>
                  <Text className={styles.taskTitle}>{step.title}</Text>
                  <StatusBadge status={step.status} />
                </View>
                <Text className={styles.taskDesc}>{step.description}</Text>
                <View className={styles.taskMeta}>
                  <Text>负责人：{step.assignee || '-'}</Text>
                  <Text>预计：{step.expectedDate}</Text>
                </View>
              </View>
            ))}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProgressPage;
