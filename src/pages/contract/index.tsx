import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import StatusBadge from '@/components/StatusBadge';
import { useOnboardingStore } from '@/store/onboardingStore';

const ContractPage: React.FC = () => {
  const role = useOnboardingStore((s) => s.role);
  const employees = useOnboardingStore((s) => s.employees);
  const currentEmployeeId = useOnboardingStore((s) => s.currentEmployeeId);
  const setCurrentEmployeeId = useOnboardingStore((s) => s.setCurrentEmployeeId);
  const contracts = useOnboardingStore((s) => s.contracts);
  const getEmployeeContract = useOnboardingStore((s) => s.getEmployeeContract);
  const sendContractToEmployee = useOnboardingStore((s) => s.sendContractToEmployee);
  const signContract = useOnboardingStore((s) => s.signContract);

  const [isExpanded, setIsExpanded] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const viewEmployeeId = useMemo(() => {
    return role === 'employee' ? 'emp1' : currentEmployeeId;
  }, [role, currentEmployeeId]);

  const selectedEmployee = useMemo(
    () => employees.find((e) => e.id === viewEmployeeId) || employees[0],
    [employees, viewEmployeeId]
  );

  const empContract = useMemo(
    () => getEmployeeContract(viewEmployeeId),
    [getEmployeeContract, viewEmployeeId]
  );

  const contract = empContract.contract || contracts[0];
  const signed = empContract.signed;

  const handleSign = () => {
    if (!agreed) {
      Taro.showToast({ title: '请先阅读并同意合同条款', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '电子签名确认',
      content: '确认签署此劳动合同吗？签署后将具有法律效力。',
      success: (res) => {
        if (res.confirm) {
          signContract(viewEmployeeId, contract.id);
          Taro.showToast({ title: '签署成功', icon: 'success' });
          setAgreed(false);
        }
      }
    });
  };

  const handleSendContract = () => {
    sendContractToEmployee(selectedEmployee.id, contract.id);
    Taro.showToast({ title: '合同已发送', icon: 'success' });
  };

  const handleSelectEmployee = () => {
    const names = employees.map((e) => e.name);
    Taro.showActionSheet({
      itemList: names,
      success: (res) => {
        const selected = employees[res.tapIndex];
        if (selected) {
          setCurrentEmployeeId(selected.id);
        }
      }
    });
  };

  if (!contract) {
    return (
      <View className={styles.page}>
        <View className={styles.content} style={{ paddingTop: 200, textAlign: 'center' }}>
          <Text style={{ color: '#86909C', fontSize: 28 }}>暂无合同模板</Text>
        </View>
      </View>
    );
  }

  if (role === 'hr') {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.headerTop}>
            <View>
              <View className={styles.headerTitle}>合同管理</View>
              <View className={styles.headerSub}>向新员工发送并管理合同</View>
            </View>
            <RoleSwitcher />
          </View>
        </View>
        <View className={styles.content}>
          <View className={styles.hrSection}>
            <View className={styles.sectionTitle} style={{ fontSize: 32, fontWeight: 600, marginBottom: 24, color: '#1d2129' }}>
              选择员工
            </View>
            <View className={styles.hrRow} onClick={handleSelectEmployee}>
              <Text className={styles.hrLabel}>当前员工</Text>
              <Text className={styles.hrValue}>{selectedEmployee?.name || '-'} ▼</Text>
            </View>
            <View className={styles.hrRow}>
              <Text className={styles.hrLabel}>岗位</Text>
              <Text className={styles.hrValue}>{selectedEmployee?.position || '-'}</Text>
            </View>
            <View className={styles.hrRow}>
              <Text className={styles.hrLabel}>合同状态</Text>
              <StatusBadge status={signed ? 'completed' : selectedEmployee?.contractStatus || 'pending'} customText={signed ? '已签署' : empContract.sentAt ? '已发送' : '未发送'} />
            </View>
            {empContract.sentAt && (
              <View className={styles.hrRow}>
                <Text className={styles.hrLabel}>发送时间</Text>
                <Text className={styles.hrValue}>{empContract.sentAt}</Text>
              </View>
            )}
            {signed && empContract.signedAt && (
              <View className={styles.hrRow}>
                <Text className={styles.hrLabel}>签署时间</Text>
                <Text className={styles.hrValue}>{empContract.signedAt}</Text>
              </View>
            )}
          </View>

          <View className={styles.contractCard}>
            <View className={styles.contractHeader}>
              <View>
                <View className={styles.contractTitle}>{contract.title}</View>
                <View className={styles.contractMeta}>
                  合同编号：{contract.id} · 版本：{contract.version} · 发布：{contract.publishedAt}
                </View>
              </View>
            </View>
            <ScrollView
              className={styles.contractBodyFull}
              scrollY
              style={{ maxHeight: 400 }}
            >
              <Text>{contract.content}</Text>
            </ScrollView>
          </View>

          <View className={styles.hrSection}>
            <View className={styles.hrRow}>
              <Text className={styles.hrLabel}>合同类型</Text>
              <Text className={styles.hrValue}>固定期限劳动合同</Text>
            </View>
            <View className={styles.hrRow}>
              <Text className={styles.hrLabel}>合同期限</Text>
              <Text className={styles.hrValue}>3年（含试用期6个月）</Text>
            </View>
            <View className={styles.hrRow}>
              <Text className={styles.hrLabel}>试用期薪资</Text>
              <Text className={styles.hrValue}>¥12,000/月</Text>
            </View>
            <View className={styles.hrRow}>
              <Text className={styles.hrLabel}>转正薪资</Text>
              <Text className={styles.hrValue}>¥15,000/月</Text>
            </View>
          </View>
        </View>

        <View className={styles.bottomBar}>
          <Button
            className={classnames(styles.btn, styles.btnOutline)}
            onClick={() => Taro.showToast({ title: '配置功能开发中', icon: 'none' })}
          >
            配置合同模板
          </Button>
          <Button
            className={classnames(styles.btn, styles.btnPrimary)}
            onClick={handleSendContract}
            disabled={signed}
          >
            {signed ? '已签署' : '发送合同'}
          </Button>
        </View>
      </View>
    );
  }

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerTop}>
          <View>
            <View className={styles.headerTitle}>合同确认</View>
            <View className={styles.headerSub}>请仔细阅读并签署劳动合同</View>
          </View>
          <RoleSwitcher />
        </View>
      </View>
      <View className={styles.content}>
        <View className={styles.statusCard}>
          <View className={styles.statusLeft}>
            <View className={classnames(styles.statusIcon, signed && styles.signed)}>
              {signed ? '✅' : '📝'}
            </View>
            <View>
              <View className={styles.statusText}>
                {signed ? '合同已签署' : '待签署合同'}
              </View>
              <View className={styles.statusDesc}>
                {signed ? '您已成功签署劳动合同' : empContract.sentAt ? '请阅读后确认签署' : '合同尚未发送，请联系HR'}
              </View>
            </View>
          </View>
          <StatusBadge status={signed ? 'completed' : 'pending'} customText={signed ? '已签署' : '待签署'} />
        </View>

        <View className={styles.contractCard}>
          <View className={styles.contractHeader}>
            <View>
              <View className={styles.contractTitle}>{contract.title}</View>
              <View className={styles.contractMeta}>
                编号：{contract.id} · 版本：{contract.version} · {contract.publishedAt}
              </View>
            </View>
          </View>

          {isExpanded ? (
            <ScrollView className={styles.contractBodyFull} scrollY style={{ maxHeight: 600 }}>
              <Text>{contract.content}</Text>
            </ScrollView>
          ) : (
            <View className={styles.contractBody}>
              <Text>{contract.content}</Text>
            </View>
          )}

          <View className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '收起 ↑' : '展开查看完整内容 ↓'}
          </View>
        </View>

        {signed && empContract.signedAt && (
          <View className={styles.signInfo}>
            <Text className={styles.signInfoText}>
              ✅ 您已于 {empContract.signedAt} 完成电子签署
              {'\n'}签署人：{selectedEmployee?.name || '李明'}
              {'\n'}合同电子版已发送至您的邮箱
            </Text>
          </View>
        )}

        {!signed && empContract.sentAt && (
          <View className={styles.checkboxRow} onClick={() => setAgreed(!agreed)}>
            <View className={classnames(styles.checkbox, agreed && styles.checked)}>
              {agreed && <Text className={styles.checkIcon}>✓</Text>}
            </View>
            <Text className={styles.checkboxLabel}>
              我已仔细阅读并理解以上《劳动合同》的全部内容，同意遵守合同中的各项条款。
            </Text>
          </View>
        )}
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.btn, styles.btnOutline)}
          onClick={() => Taro.showToast({ title: '联系HR', icon: 'none' })}
        >
          咨询HR
        </Button>
        <Button
          className={classnames(
            styles.btn,
            (signed || !agreed || !empContract.sentAt) ? styles.btnDisabled : styles.btnPrimary
          )}
          onClick={handleSign}
          disabled={signed || !empContract.sentAt}
        >
          {signed ? '已签署' : !empContract.sentAt ? '等待HR发送' : '确认签署'}
        </Button>
      </View>
    </View>
  );
};

export default ContractPage;
