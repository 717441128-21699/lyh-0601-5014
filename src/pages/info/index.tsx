import React, { useState, useEffect } from 'react';
import { View, Text, Image, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import StatusBadge from '@/components/StatusBadge';
import { useOnboardingStore } from '@/store/onboardingStore';

interface UploadDoc {
  key: string;
  label: string;
  uploaded: boolean;
  url?: string;
}

const InfoPage: React.FC = () => {
  const role = useOnboardingStore((s) => s.role);
  const personalInfo = useOnboardingStore((s) => s.personalInfo);
  const employees = useOnboardingStore((s) => s.employees);
  const submitPersonalInfo = useOnboardingStore((s) => s.submitPersonalInfo);
  const approvePersonalInfo = useOnboardingStore((s) => s.approvePersonalInfo);
  const rejectPersonalInfo = useOnboardingStore((s) => s.rejectPersonalInfo);
  const currentEmployeeId = useOnboardingStore((s) => s.currentEmployeeId);

  const [selectedEmpIdx, setSelectedEmpIdx] = useState(0);
  const selectedEmployee = employees[selectedEmpIdx];

  const [docs, setDocs] = useState<UploadDoc[]>([
    { key: 'idCard', label: '身份证', uploaded: personalInfo.idCardUploaded, url: personalInfo.idCardUrl },
    { key: 'diploma', label: '学历证书', uploaded: personalInfo.diplomaUploaded, url: personalInfo.diplomaUrl },
    { key: 'avatar', label: '证件照', uploaded: personalInfo.avatarUploaded, url: personalInfo.avatarUrl }
  ]);

  const [contact, setContact] = useState({
    name: personalInfo.emergencyContact.name,
    relationship: personalInfo.emergencyContact.relationship,
    phone: personalInfo.emergencyContact.phone
  });

  const [arrivalDate, setArrivalDate] = useState(personalInfo.arrivalDate);
  const [bankCard, setBankCard] = useState(personalInfo.bankCard);
  const [address, setAddress] = useState(personalInfo.address);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    setDocs([
      { key: 'idCard', label: '身份证', uploaded: personalInfo.idCardUploaded, url: personalInfo.idCardUrl },
      { key: 'diploma', label: '学历证书', uploaded: personalInfo.diplomaUploaded, url: personalInfo.diplomaUrl },
      { key: 'avatar', label: '证件照', uploaded: personalInfo.avatarUploaded, url: personalInfo.avatarUrl }
    ]);
    setContact({
      name: personalInfo.emergencyContact.name,
      relationship: personalInfo.emergencyContact.relationship,
      phone: personalInfo.emergencyContact.phone
    });
    setArrivalDate(personalInfo.arrivalDate);
    setBankCard(personalInfo.bankCard);
    setAddress(personalInfo.address);
  }, [personalInfo]);

  const handleUpload = (key: string) => {
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        setDocs(prev => prev.map(d =>
          d.key === key
            ? { ...d, uploaded: true, url: tempFilePaths[0] }
            : d
        ));
        Taro.showToast({ title: '上传成功', icon: 'success' });
      },
      fail: () => {
        Taro.showToast({ title: '上传取消', icon: 'none' });
      }
    });
  };

  const handleSubmit = () => {
    if (!contact.name || !contact.relationship || !contact.phone) {
      Taro.showToast({ title: '请填写完整的紧急联系人信息', icon: 'none' });
      return;
    }
    const idCardUploaded = docs.find(d => d.key === 'idCard')?.uploaded || false;
    const avatarUploaded = docs.find(d => d.key === 'avatar')?.uploaded || false;
    const diplomaUploaded = docs.find(d => d.key === 'diploma')?.uploaded || false;
    const idCardUrl = docs.find(d => d.key === 'idCard')?.url;
    const avatarUrl = docs.find(d => d.key === 'avatar')?.url;
    const diplomaUrl = docs.find(d => d.key === 'diploma')?.url;

    submitPersonalInfo({
      idCardUploaded,
      idCardUrl,
      avatarUploaded,
      avatarUrl,
      diplomaUploaded,
      diplomaUrl,
      emergencyContact: contact,
      arrivalDate,
      bankCard,
      address
    });
    Taro.showToast({ title: '提交成功，等待审核', icon: 'success' });
  };

  const handleApprove = () => {
    Taro.showModal({
      title: '确认审核通过',
      content: `确认员工「${selectedEmployee?.name || ''}」的资料审核通过？`,
      success: (res) => {
        if (res.confirm) {
          approvePersonalInfo();
          Taro.showToast({ title: '已通过审核', icon: 'success' });
        }
      }
    });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      Taro.showToast({ title: '请填写退回原因', icon: 'none' });
      return;
    }
    Taro.showModal({
      title: '确认退回修改',
      content: `将退回员工「${selectedEmployee?.name || ''}」的资料？\n原因：${rejectReason}`,
      success: (res) => {
        if (res.confirm) {
          rejectPersonalInfo(rejectReason.trim());
          Taro.showToast({ title: '已退回修改', icon: 'success' });
          setRejectReason('');
        }
      }
    });
  };

  const handleSelectEmployee = () => {
    const names = employees.map(e => e.name);
    Taro.showActionSheet({
      itemList: names,
      success: (res) => {
        setSelectedEmpIdx(res.tapIndex);
      }
    });
  };

  const getDocStatus = (key: string): 'completed' | 'pending' | 'rejected' => {
    const d = docs.find(x => x.key === key);
    if (!d?.uploaded) return 'pending';
    if (personalInfo.auditStatus === 'rejected' && key === 'diploma') return 'rejected';
    return 'completed';
  };

  const auditStatusMap: Record<string, { text: string; status: any }> = {
    pending: { text: '待审核', status: 'pending' },
    processing: { text: '审核中', status: 'processing' },
    completed: { text: '已通过', status: 'completed' },
    rejected: { text: '已退回', status: 'rejected' }
  };

  if (role === 'hr') {
    return (
      <View className={styles.page}>
        <View className={styles.header}>
          <View className={styles.headerTop}>
            <View>
              <View className={styles.headerTitle}>资料审核</View>
              <View className={styles.headerSub}>检查新员工提交的资料</View>
            </View>
            <RoleSwitcher />
          </View>
        </View>
        <View className={styles.content}>
          <View className={styles.hrSelect} onClick={handleSelectEmployee}>
            <Text className={styles.hrSelectText}>当前员工：{selectedEmployee?.name || '-'}</Text>
            <Text className={styles.hrSelectArrow}>▼</Text>
          </View>

          {personalInfo.auditStatus !== 'pending' && (
            <View className={styles.auditResultBox}>
              <View className={styles.auditResultRow}>
                <Text className={styles.auditResultLabel}>当前审核状态</Text>
                <StatusBadge status={auditStatusMap[personalInfo.auditStatus]?.status || 'pending'} customText={auditStatusMap[personalInfo.auditStatus]?.text || '待审核'} />
              </View>
              {personalInfo.auditedAt && (
                <View className={styles.auditResultRow}>
                  <Text className={styles.auditResultLabel}>审核时间</Text>
                  <Text className={styles.auditResultValue}>{personalInfo.auditedAt}</Text>
                </View>
              )}
              {personalInfo.auditRejectReason && (
                <View className={styles.auditResultRow}>
                  <Text className={styles.auditResultLabel}>上次退回原因</Text>
                  <Text className={styles.auditRejectText}>{personalInfo.auditRejectReason}</Text>
                </View>
              )}
            </View>
          )}

          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>👤</Text>
              员工基本信息
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>姓名</Text>
              <Text className={styles.infoValue}>{selectedEmployee?.name}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>岗位</Text>
              <Text className={styles.infoValue}>{selectedEmployee?.position}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>部门</Text>
              <Text className={styles.infoValue}>{selectedEmployee?.department}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>手机号</Text>
              <Text className={styles.infoValue}>{selectedEmployee?.phone}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>邮箱</Text>
              <Text className={styles.infoValue}>{selectedEmployee?.email}</Text>
            </View>
            {personalInfo.submittedAt && (
              <View className={styles.infoRow}>
                <Text className={styles.infoLabel}>提交时间</Text>
                <Text className={styles.infoValue}>{personalInfo.submittedAt}</Text>
              </View>
            )}
          </View>

          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📄</Text>
              证件材料
            </View>
            <View className={styles.uploadGrid}>
              {docs.map(doc => (
                <View key={doc.key} className={styles.uploadItem}>
                  {doc.uploaded && doc.url ? (
                    <>
                      <Image className={styles.uploadImage} src={doc.url} mode="aspectFill" />
                      <View className={styles.uploadLabel}>{doc.label}</View>
                      <View className={styles.statusTag}>
                        <StatusBadge status="completed" customText="已上传" />
                      </View>
                    </>
                  ) : (
                    <>
                      <Text className={styles.uploadIcon}>📷</Text>
                      <Text className={styles.uploadText}>{doc.label}</Text>
                      <View className={styles.statusTag}>
                        <StatusBadge status="pending" customText="未上传" />
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>

          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>📝</Text>
              填写信息
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>紧急联系人</Text>
              <Text className={styles.infoValue}>{contact.name}（{contact.relationship}）</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>联系电话</Text>
              <Text className={styles.infoValue}>{contact.phone}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>到岗时间</Text>
              <Text className={styles.infoValue}>{arrivalDate}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>银行卡号</Text>
              <Text className={styles.infoValue}>{bankCard || '未填写'}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>居住地址</Text>
              <Text className={styles.infoValue}>{address || '未填写'}</Text>
            </View>
          </View>

          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>✏️</Text>
              审核操作
            </View>
            <View className={styles.formItem}>
              <Text className={styles.formLabel}>退回原因（如退回请填写）</Text>
              <Textarea
                className={classnames(styles.formInput)}
                value={rejectReason}
                onInput={(e) => setRejectReason(e.detail.value)}
                placeholder="请填写需要修改的内容..."
                style={{ height: 160, width: '100%' }}
              />
            </View>
            <View className={styles.auditSection}>
              <Button className={classnames(styles.btn, styles.btnSecondary)} onClick={handleReject}>
                退回修改
              </Button>
              <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleApprove}>
                审核通过
              </Button>
            </View>
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
            <View className={styles.headerTitle}>资料填写</View>
            <View className={styles.headerSub}>请完善您的个人信息与材料</View>
          </View>
          <RoleSwitcher />
        </View>
      </View>
      <View className={styles.content}>
        {personalInfo.auditStatus === 'rejected' && personalInfo.auditRejectReason && (
          <View className={styles.rejectBox}>
            <View className={styles.rejectTitle}>⚠️ 资料审核未通过，请修改后重新提交</View>
            <View className={styles.rejectReasonLabel}>退回原因：</View>
            <View className={styles.rejectContent}>{personalInfo.auditRejectReason}</View>
          </View>
        )}
        {personalInfo.auditStatus === 'pending' && personalInfo.submittedAt && (
          <View className={styles.pendingBox}>
            <View className={styles.pendingTitle}>⏳ 资料审核中</View>
            <View className={styles.pendingContent}>您于 {personalInfo.submittedAt} 提交的资料正在审核中，请耐心等待</View>
          </View>
        )}
        {personalInfo.auditStatus === 'completed' && (
          <View className={styles.successBox}>
            <View className={styles.successTitle}>✅ 资料审核已通过</View>
            <View className={styles.successContent}>所有资料已通过审核，请继续完成其他入职事项</View>
          </View>
        )}

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📄</Text>
            证件上传
          </View>
          <View className={styles.uploadGrid}>
            {docs.map(doc => (
              <View key={doc.key} className={styles.uploadItem} onClick={() => handleUpload(doc.key)}>
                {doc.uploaded && doc.url ? (
                  <>
                    <Image className={styles.uploadImage} src={doc.url} mode="aspectFill" />
                    <View className={styles.uploadLabel}>{doc.label}</View>
                    <View className={styles.statusTag}>
                      <StatusBadge status={getDocStatus(doc.key)} customText={getDocStatus(doc.key) === 'rejected' ? '需重传' : '已上传'} />
                    </View>
                  </>
                ) : (
                  <>
                    <Text className={styles.uploadIcon}>+</Text>
                    <Text className={styles.uploadText}>上传{doc.label}</Text>
                  </>
                )}
              </View>
            ))}
          </View>
          <Text className={styles.formHint}>请上传清晰的证件照片，支持JPG/PNG格式</Text>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>👨‍👩‍👧</Text>
            紧急联系人
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>联系人姓名
            </Text>
            <Input
              className={styles.formInput}
              value={contact.name}
              onInput={(e) => setContact({ ...contact, name: e.detail.value })}
              placeholder="请输入联系人姓名"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>与本人关系
            </Text>
            <Input
              className={styles.formInput}
              value={contact.relationship}
              onInput={(e) => setContact({ ...contact, relationship: e.detail.value })}
              placeholder="如：父母、配偶、子女"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>联系电话
            </Text>
            <Input
              className={styles.formInput}
              value={contact.phone}
              onInput={(e) => setContact({ ...contact, phone: e.detail.value })}
              placeholder="请输入手机号码"
              type="number"
            />
          </View>
        </View>

        <View className={styles.section}>
          <View className={styles.sectionTitle}>
            <Text className={styles.sectionIcon}>📅</Text>
            到岗与其他信息
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>
              <Text className={styles.required}>*</Text>确认到岗时间
            </Text>
            <Input
              className={styles.formInput}
              value={arrivalDate}
              onInput={(e) => setArrivalDate(e.detail.value)}
              placeholder="请选择到岗日期"
            />
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>银行卡号</Text>
            <Input
              className={styles.formInput}
              value={bankCard}
              onInput={(e) => setBankCard(e.detail.value)}
              placeholder="请输入工资卡卡号"
              type="number"
            />
            <Text className={styles.formHint}>用于工资发放，请确保信息准确</Text>
          </View>
          <View className={styles.formItem}>
            <Text className={styles.formLabel}>居住地址</Text>
            <Textarea
              className={styles.formInput}
              value={address}
              onInput={(e) => setAddress(e.detail.value)}
              placeholder="请输入详细居住地址"
              style={{ height: 120, width: '100%' }}
            />
          </View>
        </View>
      </View>

      <View className={styles.bottomBar}>
        <Button
          className={classnames(styles.btn, styles.btnPrimary)}
          onClick={handleSubmit}
          disabled={personalInfo.auditStatus === 'pending'}
        >
          {personalInfo.auditStatus === 'pending' ? '审核中...' : personalInfo.auditStatus === 'completed' ? '已审核通过' : personalInfo.auditStatus === 'rejected' ? '重新提交' : '提交资料'}
        </Button>
      </View>
    </View>
  );
};

export default InfoPage;
