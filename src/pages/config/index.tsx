import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, Input, Textarea, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import StatusBadge from '@/components/StatusBadge';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { TaskCategory } from '@/types/onboarding';

const categoryOptions: { value: TaskCategory; label: string; icon: string }[] = [
  { value: 'document', label: '材料收集', icon: '📄' },
  { value: 'process', label: '信息填写', icon: '📝' },
  { value: 'training', label: '培训学习', icon: '🎓' },
  { value: 'system', label: '行政安排', icon: '🖥️' }
];

const ConfigPage: React.FC = () => {
  const positions = useOnboardingStore((s) => s.positions);
  const templates = useOnboardingStore((s) => s.checklistTemplates);
  const employees = useOnboardingStore((s) => s.employees);
  const currentEmployeeId = useOnboardingStore((s) => s.currentEmployeeId);
  const addChecklistItem = useOnboardingStore((s) => s.addChecklistItem);
  const updateChecklistItem = useOnboardingStore((s) => s.updateChecklistItem);
  const deleteChecklistItem = useOnboardingStore((s) => s.deleteChecklistItem);
  const applyChecklistToEmployee = useOnboardingStore((s) => s.applyChecklistToEmployee);

  const [selectedPosIdx, setSelectedPosIdx] = useState(0);
  const selectedPos = positions[selectedPosIdx];

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('document');

  const currentItems = useMemo(() => {
    const tpl = templates.find(t => t.positionId === selectedPos?.id);
    return tpl?.items || [];
  }, [templates, selectedPos]);

  const groupedItems = useMemo(() => {
    return categoryOptions.map(cat => ({
      ...cat,
      items: currentItems.filter(i => i.category === cat.value)
    })).filter(g => g.items.length > 0);
  }, [currentItems]);

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setCategory('document');
    setEditingId(null);
    setShowAddForm(false);
  };

  const handleSelectPosition = () => {
    Taro.showActionSheet({
      itemList: positions.map(p => `${p.name}（${p.department}）`),
      success: (res) => {
        setSelectedPosIdx(res.tapIndex);
      }
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowAddForm(true);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDescription(item.description);
    setCategory(item.category);
    setShowAddForm(true);
  };

  const handleDelete = (itemId: string) => {
    Taro.showModal({
      title: '确认删除',
      content: '确定要删除此清单项吗？',
      success: (res) => {
        if (res.confirm) {
          deleteChecklistItem(selectedPos.id, itemId);
          Taro.showToast({ title: '已删除', icon: 'success' });
        }
      }
    });
  };

  const handleSave = () => {
    if (!title.trim()) {
      Taro.showToast({ title: '请输入清单项标题', icon: 'none' });
      return;
    }
    if (editingId) {
      updateChecklistItem(selectedPos.id, editingId, {
        title: title.trim(),
        description: description.trim(),
        category
      });
      Taro.showToast({ title: '修改成功', icon: 'success' });
    } else {
      addChecklistItem(selectedPos.id, {
        title: title.trim(),
        description: description.trim() || `${title.trim()}相关事项`,
        category
      });
      Taro.showToast({ title: '添加成功', icon: 'success' });
    }
    resetForm();
  };

  const handleApplyToEmployee = () => {
    const emp = employees.find(e => e.id === currentEmployeeId);
    Taro.showModal({
      title: '应用到员工',
      content: `将「${selectedPos.name}」的最新清单模板应用给员工「${emp?.name || '当前选中的员工'}」？\n已完成的项会保留进度。`,
      success: (res) => {
        if (res.confirm) {
          applyChecklistToEmployee(selectedPos.id, currentEmployeeId);
          Taro.showToast({ title: '已应用，返回清单查看', icon: 'success' });
          setTimeout(() => Taro.navigateBack(), 800);
        }
      }
    });
  };

  const handleSelectCategory = () => {
    Taro.showActionSheet({
      itemList: categoryOptions.map(c => `${c.icon} ${c.label}`),
      success: (res) => {
        setCategory(categoryOptions[res.tapIndex].value);
      }
    });
  };

  const currentCatLabel = categoryOptions.find(c => c.value === category);

  return (
    <View className={styles.page}>
      <View className={styles.header}>
        <View className={styles.headerRow}>
          <Text className={styles.backBtn} onClick={() => Taro.navigateBack()}>←</Text>
          <View className={styles.headerTitle}>岗位入职清单配置</View>
          <View style={{ width: 40 }} />
        </View>
        <View className={styles.headerSub}>为不同岗位定制专属入职清单</View>
      </View>

      <ScrollView className={styles.content} scrollY>
        <View className={styles.positionCard} onClick={handleSelectPosition}>
          <View>
            <View className={styles.posLabel}>当前配置岗位</View>
            <View className={styles.posName}>{selectedPos?.name || '-'}</View>
            <View className={styles.posDept}>{selectedPos?.department}</View>
          </View>
          <Text className={styles.posArrow}>▼ 切换</Text>
        </View>

        <View className={styles.statsBar}>
          <View className={styles.statsItem}>
            <Text className={styles.statsNum}>{currentItems.length}</Text>
            <Text className={styles.statsLabel}>总项数</Text>
          </View>
          {categoryOptions.map(cat => (
            <View key={cat.value} className={styles.statsItem}>
              <Text className={styles.statsNum}>{currentItems.filter(i => i.category === cat.value).length}</Text>
              <Text className={styles.statsLabel}>{cat.label}</Text>
            </View>
          ))}
        </View>

        <View className={styles.actionRow}>
          <Button className={classnames(styles.btn, styles.btnOutline)} onClick={handleOpenAdd}>
            + 新增清单项
          </Button>
          <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleApplyToEmployee}>
            应用到员工
          </Button>
        </View>

        {groupedItems.map(group => (
          <View key={group.value} className={styles.groupBlock}>
            <View className={styles.groupHeader}>
              <Text className={styles.groupIcon}>{group.icon}</Text>
              <Text className={styles.groupTitle}>{group.label}</Text>
              <Text className={styles.groupCount}>{group.items.length}项</Text>
            </View>
            {group.items.map(item => (
              <View key={item.id} className={styles.itemCard}>
                <View className={styles.itemMain}>
                  <View className={styles.itemTitle}>{item.title}</View>
                  <View className={styles.itemDesc}>{item.description}</View>
                </View>
                <View className={styles.itemActions}>
                  <View
                    className={styles.itemActionBtn}
                    style={{ backgroundColor: '#e8f0ff', color: '#165DFF' }}
                    onClick={() => handleEdit(item)}
                  >
                    编辑
                  </View>
                  <View
                    className={styles.itemActionBtn}
                    style={{ backgroundColor: '#fff0f0', color: '#f53f3f' }}
                    onClick={() => handleDelete(item.id)}
                  >
                    删除
                  </View>
                </View>
              </View>
            ))}
          </View>
        ))}

        {currentItems.length === 0 && (
          <View className={styles.empty}>
            <Text className={styles.emptyIcon}>📋</Text>
            <Text className={styles.emptyText}>该岗位暂无清单项，请先添加</Text>
          </View>
        )}
      </ScrollView>

      {showAddForm && (
        <View className={styles.modalMask} onClick={resetForm}>
          <View className={styles.modal} onClick={(e: any) => e.stopPropagation && e.stopPropagation()}>
            <View className={styles.modalTitle}>{editingId ? '编辑清单项' : '新增清单项'}</View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>所属分类</Text>
              <View className={styles.pickerField} onClick={handleSelectCategory}>
                <Text>{currentCatLabel?.icon} {currentCatLabel?.label}</Text>
                <Text className={styles.pickerArrow}>▼</Text>
              </View>
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>
                <Text className={styles.required}>*</Text>事项标题
              </Text>
              <Input
                className={styles.formInput}
                value={title}
                onInput={(e) => setTitle(e.detail.value)}
                placeholder="例如：上传身份证正反面"
              />
            </View>

            <View className={styles.formItem}>
              <Text className={styles.formLabel}>事项描述</Text>
              <Textarea
                className={styles.formTextarea}
                value={description}
                onInput={(e) => setDescription(e.detail.value)}
                placeholder="详细说明（选填）"
                style={{ height: 140, width: '100%' }}
              />
            </View>

            <View className={styles.modalActions}>
              <Button className={classnames(styles.btn, styles.btnSecondary)} onClick={resetForm}>
                取消
              </Button>
              <Button className={classnames(styles.btn, styles.btnPrimary)} onClick={handleSave}>
                {editingId ? '保存修改' : '确认添加'}
              </Button>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default ConfigPage;
