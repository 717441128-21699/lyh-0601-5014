import React, { useMemo, useState } from 'react';
import { View, Text, ScrollView, Button, Input } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import ProgressCard from '@/components/ProgressCard';
import TimelineItem from '@/components/TimelineItem';
import StatusBadge from '@/components/StatusBadge';
import { useOnboardingStore } from '@/store/onboardingStore';

const taskTypes = [
  { type: '工位', desc: '联系行政部门安排工位位置', defaultAssignee: '李行政' },
  { type: '账号', desc: '开通OA、邮箱等办公系统账号', defaultAssignee: 'IT部小王' },
  { type: '设备', desc: '准备电脑、显示器等办公设备', defaultAssignee: 'IT部小王' },
  { type: '体检', desc: '为新员工预约入职体检', defaultAssignee: '李行政' },
  { type: '培训', desc: '安排新员工入职培训', defaultAssignee: '培训部张老师' }
];

const ProgressPage: React.FC = () => {
  const role = useOnboardingStore((s) => s.role);
  const employees = useOnboardingStore((s) => s.employees);
  const currentEmployeeId = useOnboardingStore((s) => s.currentEmployeeId);
  const setCurrentEmployeeId = useOnboardingStore((s) => s.setCurrentEmployeeId);
  const progressStepsMap = useOnboardingStore((s) => s.progressStepsMap);
  const hrTasks = useOnboardingStore((s) => s.hrTasks);
  const scheduleTask = useOnboardingStore((s) => s.scheduleTask);
  const markHrTaskDone = useOnboardingStore((s) => s.markHrTaskDone);
  const sendReminder = useOnboardingStore((s) => s.sendReminder);
  const markEmployeeArrived = useOnboardingStore((s) => s.markEmployeeArrived);

  const [selectedEmpIdx, setSelectedEmpIdx] = useState(0);
  const selectedEmployee = employees[selectedEmpIdx];

  const [showModal, setShowModal] = useState(false);
  const [currentTaskType, setCurrentTaskType] = useState('');
  const [assignee, setAssignee] = useState('');

  const progressSteps = useMemo(
    () => progressStepsMap[currentEmployeeId] || [],
    [progressStepsMap, currentEmployeeId]
  );

  const currentHrTasks = useMemo(() => {
    const emp = employees.find(e => e.id === currentEmployeeId);
    return hrTasks.filter(t => t.employeeName === emp?.name);
  }, [hrTasks, currentEmployeeId, employees]);

  const stats = useMemo(() => {
    const completed = progressSteps.filter(s => s.status === 'completed').length;
    const processing = progressSteps.filter(s => s.status === 'processing').length;
    const pending = progressSteps.filter(s => s.status === 'pending').length;
    const total = progressSteps.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { completed, processing, pending, total, percent };
  }, [progressSteps]);

  const pendingTasks = currentHrTasks.filter(t => t.status !== 'completed');
  const completedTasks = currentHrTasks.filter(t => t.status === 'completed');

  const handleSelectEmployee = () => {
    Taro.showActionSheet({
      itemList: employees.map(e => e.name),
      success: (res) => {
        setSelectedEmpIdx(res.tapIndex);
        setCurrentEmployeeId(employees[res.tapIndex].id);
      }
    });
  };

  const openScheduleModal = (taskType: string) => {
    const cfg = taskTypes.find(t => t.type === taskType);
    setCurrentTaskType(taskType);
    setAssignee(cfg?.defaultAssignee || '');
    setShowModal(true);
  };

  const handleConfirmSchedule = () => {
    if (!assignee.trim()) {
      Taro.showToast({ title: '请填写负责人', icon: 'none' });
      return;
    }
    scheduleTask(currentEmployeeId, currentTaskType, assignee.trim());
    Taro.showToast({ title: `${currentTaskType}已安排`, icon: 'success' });
    setShowModal(false);
    setAssignee('');
  };

  const handleMarkArrival = () => {
    Taro.showModal({
      title: '确认到岗',
      content: `确认员工「${selectedEmployee?.name || ''}」已正式到岗？\n将自动标记所有任务完成并更新进度。`,
      success: (res) => {
        if (res.confirm) {
          markEmployeeArrived(currentEmployeeId);
          Taro.showToast({ title: '入职流程已完成', icon: 'success' });
        }
      }
    });
  };

  const isScheduled = (taskType: string) => {
    return pendingTasks.find(pt => pt.taskType === `${taskType}安排`)
      || completedTasks.find(pt => pt.taskType === `${taskType}安排`);
  };

  const getTaskStatus = (taskType: string) => {
    const task = currentHrTasks.find(t => t.taskType === `${taskType}安排`);
    return task?.status || 'pending';
  };

  if (role === 'hr') {
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
        <ScrollView className={styles.content} scrollY>
          <View className={styles.progressSection}>
            <ProgressCard
              title="整体任务进度"
              subtitle={`当前员工：${selectedEmployee?.name || ''}`}
              percent={stats.percent}
              completed={stats.completed}
              total={stats.total}
              pending={stats.pending}
            />
          </View>

          <View className={styles.hrSelect} onClick={handleSelectEmployee}>
            <Text className={styles.hrSelectText}>查看员工：{selectedEmployee?.name}</Text>
            <Text className={styles.hrSelectArrow}>▼</Text>
          </View>

          <View className={styles.taskSection}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📋</Text>
              入职任务安排
            </View>
            {taskTypes.map(t => {
              const scheduled = isScheduled(t.type);
              const status = getTaskStatus(t.type);
              const task = currentHrTasks.find(ht => ht.taskType === `${t.type}安排`);
              return (
                <View key={t.type} className={styles.taskCard}>
                  <View className={styles.taskHeader}>
                    <Text className={styles.taskTitle}>{t.type}安排</Text>
                    {scheduled ? (
                      <StatusBadge status={status} customText={status === 'completed' ? '已完成' : '已安排'} />
                    ) : (
                      <StatusBadge status="pending" customText="待安排" />
                    )}
                  </View>
                  <Text className={styles.taskDesc}>{t.desc}</Text>
                  {task && (
                    <View className={styles.hrTaskDetail}>
                      {task.assignee && (
                        <View className={styles.detailItem}>
                          <Text className={styles.detailLabel}>负责人：</Text>
                          <Text className={styles.taskAssignee}>{task.assignee}</Text>
                        </View>
                      )}
                      {task.scheduledAt && (
                        <View className={styles.detailItem}>
                          <Text className={styles.detailLabel}>安排时间：</Text>
                          <Text className={styles.detailValue}>{task.scheduledAt}</Text>
                        </View>
                      )}
                      {task.deadline && (
                        <View className={styles.detailItem}>
                          <Text className={styles.detailLabel}>截止时间：</Text>
                          <Text className={styles.detailValue}>{task.deadline}</Text>
                        </View>
                      )}
                      {task.completedAt && (
                        <View className={styles.detailItem}>
                          <Text className={styles.detailLabel}>完成时间：</Text>
                          <Text className={styles.detailValue}>{task.completedAt}</Text>
                        </View>
                      )}
                    </View>
                  )}
                  <View className={styles.taskActions}>
                    {!scheduled && (
                      <Button
                        className={classnames(styles.btn, styles.btnPrimary)}
                        onClick={() => openScheduleModal(t.type)}
                      >
                        安排{t.type}
                      </Button>
                    )}
                    {scheduled && status === 'processing' && (
                      <Button
                        className={classnames(styles.btn, styles.btnOutline)}
                        onClick={() => task && sendReminder(task.id)}
                      >
                        发送提醒
                      </Button>
                    )}
                    {scheduled && status === 'processing' && (
                      <Button
                        className={classnames(styles.btn, styles.btnPrimary)}
                        onClick={() => task && markHrTaskDone(task.id)}
                      >
                        标记完成
                      </Button>
                    )}
                    {scheduled && status === 'completed' && (
                      <Text style={{ color: '#00B42A', fontSize: 24, fontWeight: 600 }}>
                        ✅ 已完成
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>

          <View className={styles.taskSection}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>⏰</Text>
              待办任务（{pendingTasks.length}）
            </View>
            {pendingTasks.length === 0 ? (
              <View style={{ padding: 40, textAlign: 'center', color: '#86909C', fontSize: 24 }}>
                🎉 暂无待办任务
              </View>
            ) : (
              pendingTasks.map(task => (
                <View key={task.id} className={styles.hrTaskItem}>
                  <View className={styles.hrTaskRow}>
                    <Text className={styles.hrTaskTitle}>{task.title}</Text>
                    <StatusBadge status={task.status} />
                  </View>
                  <View className={styles.hrTaskSub}>
                    {task.employeeName} · {task.position}
                  </View>
                  {task.assignee && (
                    <View className={styles.hrTaskDetail}>
                      <View className={styles.detailItem}>
                        <Text className={styles.detailLabel}>负责人：</Text>
                        <Text className={styles.taskAssignee}>{task.assignee}</Text>
                      </View>
                      {task.scheduledAt && (
                        <View className={styles.detailItem}>
                          <Text className={styles.detailLabel}>安排时间：</Text>
                          <Text className={styles.detailValue}>{task.scheduledAt}</Text>
                        </View>
                      )}
                    </View>
                  )}
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
                        onClick={() => sendReminder(task.id)}
                        style={{ backgroundColor: '#fff7e8', color: '#ff7d00' }}
                      >
                        发送提醒
                      </View>
                      <View
                        className={styles.markDoneBtn}
                        onClick={() => markHrTaskDone(task.id)}
                      >
                        标记完成
                      </View>
                    </View>
                  </View>
                </View>
              ))
            )}
          </View>

          {completedTasks.length > 0 && (
            <View className={styles.taskSection}>
              <View className={styles.sectionTitle}>
                <Text className={styles.sectionIcon}>✅</Text>
                已完成任务（{completedTasks.length}）
              </View>
              {completedTasks.map(task => (
                <View key={task.id} className={styles.hrTaskItem} style={{ opacity: 0.8 }}>
                  <View className={styles.hrTaskRow}>
                    <Text className={styles.hrTaskTitle} style={{ textDecoration: 'line-through' }}>{task.title}</Text>
                    <StatusBadge status="completed" />
                  </View>
                  <View className={styles.hrTaskSub}>
                    {task.employeeName} · {task.position}
                  </View>
                  <View className={styles.hrTaskDetail}>
                    {task.assignee && (
                      <View className={styles.detailItem}>
                        <Text className={styles.detailLabel}>负责人：</Text>
                        <Text className={styles.taskAssignee}>{task.assignee}</Text>
                      </View>
                    )}
                    {task.completedAt && (
                      <View className={styles.detailItem}>
                        <Text className={styles.detailLabel}>完成时间：</Text>
                        <Text className={styles.detailValue}>{task.completedAt}</Text>
                      </View>
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}

          <View className={styles.taskSection}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>✅</Text>
              员工到岗确认
            </View>
            {selectedEmployee?.arrivalStatus === 'completed' ? (
              <View style={{ padding: 30, backgroundColor: '#f2fff7', borderRadius: 16, textAlign: 'center' }}>
                <Text style={{ color: '#00B42A', fontSize: 28, fontWeight: 600 }}>
                  ✅ 员工已于 {selectedEmployee?.arrivedAt} 正式到岗
                </Text>
                <Text style={{ color: '#86909C', fontSize: 24, marginTop: 10 }}>
                  入职流程已全部完成
                </Text>
              </View>
            ) : (
              <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleMarkArrival}>
                标记员工已到岗
              </Button>
            )}
          </View>
        </ScrollView>

        {showModal && (
          <View className={styles.modalMask} onClick={() => setShowModal(false)}>
            <View className={styles.modal} onClick={(e: any) => e.stopPropagation && e.stopPropagation()}>
              <View className={styles.modalTitle}>安排{currentTaskType}任务</View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>任务类型</Text>
                <View className={styles.pickerField}>
                  <Text>{currentTaskType}安排</Text>
                </View>
              </View>
              <View className={styles.formItem}>
                <Text className={styles.formLabel}>
                  <Text style={{ color: '#f53f3f', marginRight: 4 }}>*</Text>负责人
                </Text>
                <Input
                  className={styles.formInput}
                  value={assignee}
                  onInput={(e) => setAssignee(e.detail.value)}
                  placeholder="请输入负责人姓名"
                />
              </View>
              <View className={styles.modalActions}>
                <Button className={classnames(styles.btn, styles.btnSecondary)} onClick={() => setShowModal(false)}>
                  取消
                </Button>
                <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleConfirmSchedule}>
                  确认安排
                </Button>
              </View>
            </View>
          </View>
        )}
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
          {progressSteps.map((step, index) => (
            <TimelineItem
              key={step.id}
              step={step}
              isLast={index === progressSteps.length - 1}
            />
          ))}
        </View>

        <View className={styles.taskSection}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📌</Text>
            当前进行中的任务
          </View>
          {progressSteps
            .filter(s => s.status === 'processing' || s.status === 'pending')
            .slice(0, 5)
            .map(step => {
              const task = currentHrTasks.find(ht => ht.title === step.title);
              return (
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
                  {task && (
                    <View className={styles.hrTaskDetail} style={{ marginTop: 10 }}>
                      {task.assignee && (
                        <View className={styles.detailItem}>
                          <Text className={styles.detailLabel}>负责人：</Text>
                          <Text className={styles.taskAssignee}>{task.assignee}</Text>
                        </View>
                      )}
                      {task.scheduledAt && (
                        <View className={styles.detailItem}>
                          <Text className={styles.detailLabel}>安排时间：</Text>
                          <Text className={styles.detailValue}>{task.scheduledAt}</Text>
                        </View>
                      )}
                    </View>
                  )}
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default ProgressPage;
