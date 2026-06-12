import React, { useState } from 'react';
import { View, Text, ScrollView, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import StatusBadge from '@/components/StatusBadge';
import { useUserRole } from '@/store/UserContext';
import { mockContract, mockEmployees } from '@/data/mockData';

const ContractPage: React.FC = () => {
  const { role } = useUserRole();
  const [isExpanded, setIsExpanded] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [signed, setSigned] = useState(mockContract.signed);
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);

  const handleSign = () => {
    if (!agreed) {
      Taro.showToast({ title: '请先阅读并同意合同条款', icon: 'none' });
      return;
    }
    console.log('[Contract] Sign contract');
    Taro.showModal({
      title: '电子签名确认',
      content: '确认签署此劳动合同吗？签署后将具有法律效力。',
      success: (res) => {
        if (res.confirm) {
          setSigned(true);
          Taro.showToast({ title: '签署成功', icon: 'success' });
        }
      }
    });
  };

  const handleSendContract = () => {
    console.log('[Contract] HR send contract to:', selectedEmployee.name);
    Taro.showToast({ title: '合同已发送', icon: 'success' });
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
              <Text className={styles.hrValue}>{selectedEmployee.name} ▼</Text>
            </View>
            <View className={styles.hrRow}>
              <Text className={styles.hrLabel}>岗位</Text>
              <Text className={styles.hrValue}>{selectedEmployee.position}</Text>
            </View>
            <View className={styles.hrRow}>
              <Text className={styles.hrLabel}>合同状态</Text>
              <StatusBadge status={selectedEmployee.contractStatus} />
            </View>
          </View>

          <View className={styles.contractCard}>
            <View className={styles.contractHeader}>
              <View>
                <View className={styles.contractTitle}>{mockContract.title}</View>
                <View className={styles.contractMeta}>
                  合同编号：{mockContract.id} · 版本：{mockContract.version} · 发布：{mockContract.publishedAt}
                </View>
              </View>
            </View>
            <ScrollView
              className={styles.contractBodyFull}
              scrollY
              style={{ maxHeight: 400 }}
            >
              <Text>{mockContract.content}</Text>
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
            onClick={() => Taro.navigateTo({ url: '/pages/config/index' })}
          >
            配置合同模板
          </Button>
          <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleSendContract}>
            发送合同
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
                {signed ? '您已成功签署劳动合同' : '请阅读后确认签署'}
              </View>
            </View>
          </View>
          <StatusBadge status={signed ? 'completed' : 'pending'} customText={signed ? '已签署' : '待签署'} />
        </View>

        <View className={styles.contractCard}>
          <View className={styles.contractHeader}>
            <View>
              <View className={styles.contractTitle}>{mockContract.title}</View>
              <View className={styles.contractMeta}>
                编号：{mockContract.id} · 版本：{mockContract.version} · {mockContract.publishedAt}
              </View>
            </View>
          </View>

          {isExpanded ? (
            <ScrollView className={styles.contractBodyFull} scrollY style={{ maxHeight: 600 }}>
              <Text>{mockContract.content}</Text>
            </ScrollView>
          ) : (
            <View className={styles.contractBody}>
              <Text>{mockContract.content}</Text>
            </View>
          )}

          <View className={styles.expandBtn} onClick={() => setIsExpanded(!isExpanded)}>
            {isExpanded ? '收起 ↑' : '展开查看完整内容 ↓'}
          </View>
        </View>

        {signed && (
          <View className={styles.signInfo}>
            <Text className={styles.signInfoText}>
              ✅ 您已于 2026-06-11 15:30 完成电子签署
              {'\n'}签署人：李明
              {'\n'}合同电子版已发送至您的邮箱
            </Text>
          </View>
        )}

        {!signed && (
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
            (signed || !agreed) ? styles.btnDisabled : styles.btnPrimary
          )}
          onClick={handleSign}
          disabled={signed}
        >
          {signed ? '已签署' : '确认签署'}
        </Button>
      </View>
    </View>
  );
};

export default ContractPage;
