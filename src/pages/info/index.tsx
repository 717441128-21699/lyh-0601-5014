import React, { useState } from 'react';
import { View, Text, Image, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import StatusBadge from '@/components/StatusBadge';
import { useUserRole } from '@/store/UserContext';
import { mockPersonalInfo, mockEmployees } from '@/data/mockData';

interface UploadDoc {
  key: string;
  label: string;
  uploaded: boolean;
  url?: string;
  status: 'completed' | 'pending' | 'rejected';
}

const InfoPage: React.FC = () => {
  const { role } = useUserRole();
  const [selectedEmployee, setSelectedEmployee] = useState(mockEmployees[0]);

  const [docs, setDocs] = useState<UploadDoc[]>([
    { key: 'idCard', label: '身份证', uploaded: mockPersonalInfo.idCardUploaded, url: mockPersonalInfo.idCardUrl, status: 'completed' },
    { key: 'diploma', label: '学历证书', uploaded: mockPersonalInfo.diplomaUploaded, status: 'pending' },
    { key: 'avatar', label: '证件照', uploaded: mockPersonalInfo.avatarUploaded, status: 'pending' }
  ]);

  const [contact, setContact] = useState({
    name: mockPersonalInfo.emergencyContact.name,
    relationship: mockPersonalInfo.emergencyContact.relationship,
    phone: mockPersonalInfo.emergencyContact.phone
  });

  const [arrivalDate, setArrivalDate] = useState(mockPersonalInfo.arrivalDate);
  const [bankCard, setBankCard] = useState(mockPersonalInfo.bankCard);
  const [address, setAddress] = useState(mockPersonalInfo.address);
  const [rejectReason, setRejectReason] = useState('');

  const handleUpload = (key: string) => {
    console.log('[Info] Upload document:', key);
    Taro.chooseImage({
      count: 1,
      success: (res) => {
        const tempFilePaths = res.tempFilePaths;
        setDocs(prev => prev.map(d =>
          d.key === key
            ? { ...d, uploaded: true, url: tempFilePaths[0], status: 'completed' as const }
            : d
        ));
        Taro.showToast({ title: '上传成功', icon: 'success' });
      },
      fail: (err) => {
        console.error('[Info] Upload failed:', err);
        Taro.showToast({ title: '上传取消', icon: 'none' });
      }
    });
  };

  const handleSubmit = () => {
    console.log('[Info] Submit info:', { contact, arrivalDate, bankCard, address });
    Taro.showToast({ title: '提交成功，等待审核', icon: 'success' });
  };

  const handleApprove = () => {
    console.log('[Info] HR approve documents');
    Taro.showToast({ title: '审核通过', icon: 'success' });
  };

  const handleReject = () => {
    if (!rejectReason.trim()) {
      Taro.showToast({ title: '请填写退回原因', icon: 'none' });
      return;
    }
    console.log('[Info] HR reject with reason:', rejectReason);
    Taro.showToast({ title: '已退回修改', icon: 'success' });
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
              <View className={styles.headerTitle}>资料审核</View>
              <View className={styles.headerSub}>检查新员工提交的资料</View>
            </View>
            <RoleSwitcher />
          </View>
        </View>
        <View className={styles.content}>
          <View className={styles.hrSelect} onClick={handleSelectEmployee}>
            <Text className={styles.hrSelectText}>当前员工：{selectedEmployee.name}</Text>
            <Text className={styles.hrSelectArrow}>▼</Text>
          </View>

          <View className={styles.section}>
            <View className={styles.sectionTitle}>
              <Text className={styles.sectionIcon}>👤</Text>
              员工基本信息
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>姓名</Text>
              <Text className={styles.infoValue}>{selectedEmployee.name}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>岗位</Text>
              <Text className={styles.infoValue}>{selectedEmployee.position}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>部门</Text>
              <Text className={styles.infoValue}>{selectedEmployee.department}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>手机号</Text>
              <Text className={styles.infoValue}>{selectedEmployee.phone}</Text>
            </View>
            <View className={styles.infoRow}>
              <Text className={styles.infoLabel}>邮箱</Text>
              <Text className={styles.infoValue}>{selectedEmployee.email}</Text>
            </View>
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
                        <StatusBadge status={doc.status} customText={doc.status === 'completed' ? '已上传' : '待上传'} />
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
        <View className={styles.rejectBox}>
          <View className={styles.rejectTitle}>⚠️ 有一项资料需要修改</View>
          <View className={styles.rejectContent}>紧急联系人电话格式不正确，请重新填写</View>
        </View>

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
                      <StatusBadge status={doc.status} customText="已上传" />
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
        <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleSubmit}>
          提交资料
        </Button>
      </View>
    </View>
  );
};

export default InfoPage;
