import { create } from 'zustand';
import Taro from '@tarojs/taro';
import type {
  UserRole,
  TaskStatus,
  TaskCategory,
  ChecklistItem,
  ChecklistGroup,
  Position,
  PositionChecklistTemplate,
  ChecklistTemplateItem,
  PersonalInfo,
  ProgressStep,
  HrTask,
  EmployeeProfile,
  Conversation,
  Message,
  EmergencyContact
} from '@/types/onboarding';

const categoryNames: Record<TaskCategory, string> = {
  document: '材料收集',
  process: '信息填写',
  system: '行政安排',
  training: '培训学习'
};

const defaultPositions: Position[] = [
  { id: 'pos1', name: '前端开发工程师', department: '研发部' },
  { id: 'pos2', name: '后端开发工程师', department: '研发部' },
  { id: 'pos3', name: '产品经理', department: '产品部' },
  { id: 'pos4', name: 'UI设计师', department: '设计部' }
];

const defaultEmployeeChecklist: ChecklistItem[] = [
  { id: '1', title: '上传身份证正反面', description: '请上传清晰的身份证正反面照片', category: 'document', status: 'completed', completedAt: '2026-06-10 14:30', positionId: 'pos1' },
  { id: '2', title: '上传学历证书', description: '请上传最高学历证书扫描件', category: 'document', status: 'processing', positionId: 'pos1' },
  { id: '3', title: '上传个人证件照', description: '请上传一寸白底证件照', category: 'document', status: 'pending', positionId: 'pos1' },
  { id: '4', title: '填写紧急联系人', description: '请填写一位紧急联系人信息', category: 'process', status: 'rejected', rejectReason: '联系人电话格式不正确，请重新填写', positionId: 'pos1' },
  { id: '5', title: '确认到岗时间', description: '请确认最终到岗日期', category: 'process', status: 'completed', completedAt: '2026-06-09 10:00', positionId: 'pos1' },
  { id: '6', title: '银行卡信息录入', description: '请填写工资卡信息', category: 'process', status: 'pending', positionId: 'pos1' },
  { id: '7', title: '公司制度学习', description: '请阅读员工手册并完成测试', category: 'training', status: 'pending', deadline: '2026-06-15', positionId: 'pos1' },
  { id: '8', title: '入职培训报名', description: '选择新员工培训时间', category: 'training', status: 'completed', completedAt: '2026-06-08 16:20', positionId: 'pos1' },
  { id: '9', title: 'OA账号开通', description: 'HR将为您开通办公系统账号', category: 'system', status: 'processing', assignee: '王HR', positionId: 'pos1' },
  { id: '10', title: '工位分配', description: '行政部门将为您安排工位', category: 'system', status: 'pending', assignee: '李行政', positionId: 'pos1' }
];

const defaultTemplates: PositionChecklistTemplate[] = [
  {
    positionId: 'pos1',
    positionName: '前端开发工程师',
    items: [
      { id: 't1', title: '上传身份证正反面', description: '请上传清晰的身份证正反面照片', category: 'document' },
      { id: 't2', title: '上传学历证书', description: '请上传最高学历证书扫描件', category: 'document' },
      { id: 't3', title: '上传个人证件照', description: '请上传一寸白底证件照', category: 'document' },
      { id: 't4', title: '填写紧急联系人', description: '请填写一位紧急联系人信息', category: 'process' },
      { id: 't5', title: '确认到岗时间', description: '请确认最终到岗日期', category: 'process' },
      { id: 't6', title: '银行卡信息录入', description: '请填写工资卡信息', category: 'process' },
      { id: 't7', title: '公司制度学习', description: '请阅读员工手册并完成测试', category: 'training' },
      { id: 't8', title: '入职培训报名', description: '选择新员工培训时间', category: 'training' },
      { id: 't9', title: 'OA账号开通', description: 'HR将为您开通办公系统账号', category: 'system' },
      { id: 't10', title: '工位分配', description: '行政部门将为您安排工位', category: 'system' },
      { id: 't11', title: '开发环境准备', description: 'IT部门准备开发机和相关账号权限', category: 'system' }
    ]
  },
  {
    positionId: 'pos3',
    positionName: '产品经理',
    items: [
      { id: 't1', title: '上传身份证正反面', description: '请上传清晰的身份证正反面照片', category: 'document' },
      { id: 't2', title: '上传学历证书', description: '请上传最高学历证书扫描件', category: 'document' },
      { id: 't3', title: '上传个人证件照', description: '请上传一寸白底证件照', category: 'document' },
      { id: 't4', title: '填写紧急联系人', description: '请填写一位紧急联系人信息', category: 'process' },
      { id: 't5', title: '确认到岗时间', description: '请确认最终到岗日期', category: 'process' },
      { id: 't6', title: '银行卡信息录入', description: '请填写工资卡信息', category: 'process' },
      { id: 't7', title: '公司制度学习', description: '请阅读员工手册并完成测试', category: 'training' },
      { id: 't8', title: '产品方法论培训', description: '参加产品经理专项培训', category: 'training' },
      { id: 't9', title: 'OA账号开通', description: 'HR将为您开通办公系统账号', category: 'system' },
      { id: 't10', title: '工位分配', description: '行政部门将为您安排工位', category: 'system' },
      { id: 't12', title: '产品原型工具账号', description: '开通Axure、Figma等产品工具账号', category: 'system' }
    ]
  }
];

const defaultPersonalInfo: PersonalInfo = {
  idCardUploaded: true,
  idCardUrl: 'https://picsum.photos/id/3/300/200',
  avatarUploaded: false,
  diplomaUploaded: false,
  emergencyContact: { name: '张三', relationship: '父亲', phone: '13800138000' },
  arrivalDate: '2026-06-20',
  bankCard: '',
  address: '',
  auditStatus: 'rejected',
  auditRejectReason: '紧急联系人电话格式不正确，请重新填写11位手机号',
  submittedAt: '2026-06-11 09:30'
};

const defaultProgressSteps: ProgressStep[] = [
  { id: 'ps1', title: 'Offer发放', description: '已发送入职Offer并确认接收', status: 'completed', expectedDate: '2026-06-05', actualDate: '2026-06-05', assignee: '王HR' },
  { id: 'ps2', title: '材料收集', description: '身份证、学历证书、证件照等', status: 'processing', expectedDate: '2026-06-12', assignee: '新员工本人' },
  { id: 'ps3', title: '资料审核', description: 'HR审核提交材料的完整性和真实性', status: 'pending', expectedDate: '2026-06-14', assignee: '王HR' },
  { id: 'ps4', title: '合同签订', description: '签署劳动合同及相关协议', status: 'pending', expectedDate: '2026-06-16', assignee: '王HR' },
  { id: 'ps5', title: '工位分配', description: '分配办公工位', status: 'pending', expectedDate: '2026-06-18', taskType: '工位' },
  { id: 'ps6', title: '账号开通', description: '开通OA、邮箱等办公账号', status: 'pending', expectedDate: '2026-06-18', taskType: '账号' },
  { id: 'ps7', title: '体检安排', description: '预约入职体检', status: 'pending', expectedDate: '2026-06-18', assignee: '李行政', taskType: '体检' },
  { id: 'ps8', title: '培训安排', description: '新员工入职培训', status: 'pending', expectedDate: '2026-06-21', assignee: '培训部张老师', taskType: '培训' },
  { id: 'ps9', title: '正式到岗', description: '完成入职，正式开始工作', status: 'pending', expectedDate: '2026-06-20', assignee: '部门主管' }
];

const defaultHrTasks: HrTask[] = [
  { id: 'ht1', title: '审核身份证材料', employeeName: '李明', position: '前端开发工程师', taskType: '资料审核', status: 'pending', deadline: '2026-06-13' },
  { id: 'ht2', title: '审核学历证书', employeeName: '王芳', position: '产品经理', taskType: '资料审核', status: 'processing', deadline: '2026-06-13' },
  { id: 'ht3', title: '预约入职体检', employeeName: '张伟', position: 'UI设计师', taskType: '体检安排', status: 'completed', deadline: '2026-06-15', assignee: '李行政', completedAt: '2026-06-10 14:00' },
  { id: 'ht4', title: '退回紧急联系人修改', employeeName: '李明', position: '前端开发工程师', taskType: '资料审核', status: 'rejected', deadline: '2026-06-12' }
];

const defaultEmployees: EmployeeProfile[] = [
  { id: 'emp1', name: '李明', position: '前端开发工程师', positionId: 'pos1', department: '研发部', avatar: 'https://picsum.photos/id/64/200/200', phone: '13800138001', email: 'liming@example.com', overallProgress: 45, infoStatus: 'rejected', contractStatus: 'pending', arrivalStatus: 'pending' },
  { id: 'emp2', name: '王芳', position: '产品经理', positionId: 'pos3', department: '产品部', avatar: 'https://picsum.photos/id/338/200/200', phone: '13800138002', email: 'wangfang@example.com', overallProgress: 72, infoStatus: 'completed', contractStatus: 'processing', arrivalStatus: 'pending' },
  { id: 'emp3', name: '张伟', position: 'UI设计师', positionId: 'pos4', department: '设计部', avatar: 'https://picsum.photos/id/177/200/200', phone: '13800138003', email: 'zhangwei@example.com', overallProgress: 90, infoStatus: 'completed', contractStatus: 'completed', arrivalStatus: 'pending' },
  { id: 'emp4', name: '刘洋', position: '后端开发工程师', positionId: 'pos2', department: '研发部', avatar: 'https://picsum.photos/id/1027/200/200', phone: '13800138004', email: 'liuyang@example.com', overallProgress: 20, infoStatus: 'pending', contractStatus: 'pending', arrivalStatus: 'pending' }
];

const defaultConversations: Conversation[] = [
  { id: 'conv1', participantName: '王HR', participantRole: 'hr', lastMessage: '好的，材料已收到，我会尽快审核', lastMessageTime: '2026-06-12 10:30', unreadCount: 1 },
  { id: 'conv2', participantName: '李行政', participantRole: 'hr', lastMessage: '工位已初步安排在A区3排5号', lastMessageTime: '2026-06-11 16:45', unreadCount: 0 },
  { id: 'conv3', participantName: '培训部张老师', participantRole: 'hr', lastMessage: '培训时间定在6月21日上午9点', lastMessageTime: '2026-06-10 09:15', unreadCount: 2 }
];

const defaultMessages: Message[] = [
  { id: 'm1', conversationId: 'conv1', senderId: 'hr1', senderName: '王HR', senderRole: 'hr', content: '您好，欢迎加入XX科技！我是负责您入职办理的HR小王。', createdAt: '2026-06-08 09:00', isRead: true },
  { id: 'm2', conversationId: 'conv1', senderId: 'hr1', senderName: '王HR', senderRole: 'hr', content: '请您在入职清单页面查看需要准备的材料，并按时提交。如有任何问题可以随时在这里问我。', createdAt: '2026-06-08 09:01', isRead: true },
  { id: 'm3', conversationId: 'conv1', senderId: 'emp1', senderName: '我', senderRole: 'employee', content: '好的，谢谢！请问学历证书需要原件吗？', createdAt: '2026-06-08 10:20', isRead: true },
  { id: 'm4', conversationId: 'conv1', senderId: 'hr1', senderName: '王HR', senderRole: 'hr', content: '不需要原件，上传清晰的扫描件或照片即可。入职当天请携带原件备查。', createdAt: '2026-06-08 10:35', isRead: true },
  { id: 'm5', conversationId: 'conv1', senderId: 'emp1', senderName: '我', senderRole: 'employee', content: '好的，明白了。我已经上传了身份证，请查收。', createdAt: '2026-06-10 14:25', isRead: true },
  { id: 'm6', conversationId: 'conv1', senderId: 'hr1', senderName: '王HR', senderRole: 'hr', content: '好的，材料已收到，我会尽快审核', createdAt: '2026-06-12 10:30', isRead: false },
  { id: 'm7', conversationId: 'conv3', senderId: 'hr3', senderName: '培训部张老师', senderRole: 'hr', content: '您好，我是培训部的张老师，负责您的入职培训安排。', createdAt: '2026-06-09 14:00', isRead: true },
  { id: 'm8', conversationId: 'conv3', senderId: 'emp1', senderName: '我', senderRole: 'employee', content: '您好张老师，请问培训是什么时候？', createdAt: '2026-06-09 14:30', isRead: true },
  { id: 'm9', conversationId: 'conv3', senderId: 'hr3', senderName: '培训部张老师', senderRole: 'hr', content: '培训时间定在6月21日上午9点', createdAt: '2026-06-10 09:15', isRead: false }
];

interface OnboardingState {
  role: UserRole;
  currentEmployeeId: string;
  currentPositionId: string;
  positions: Position[];
  checklistTemplates: PositionChecklistTemplate[];
  checklistItems: ChecklistItem[];
  personalInfo: PersonalInfo;
  progressSteps: ProgressStep[];
  hrTasks: HrTask[];
  employees: EmployeeProfile[];
  conversations: Conversation[];
  messages: Message[];

  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  setCurrentPositionId: (id: string) => void;

  addChecklistItem: (positionId: string, item: Omit<ChecklistTemplateItem, 'id'>) => void;
  updateChecklistItem: (positionId: string, itemId: string, updates: Partial<ChecklistTemplateItem>) => void;
  deleteChecklistItem: (positionId: string, itemId: string) => void;
  getChecklistForPosition: (positionId: string) => ChecklistTemplateItem[];
  applyChecklistToEmployee: (positionId: string, employeeId: string) => void;

  submitPersonalInfo: (info: Partial<PersonalInfo>) => void;
  approvePersonalInfo: () => void;
  rejectPersonalInfo: (reason: string) => void;

  scheduleTask: (taskType: string, assignee: string) => void;
  markHrTaskDone: (taskId: string) => void;
  sendReminder: (taskId: string) => void;
  markEmployeeArrived: (employeeId: string) => void;

  sendMessage: (conversationId: string, content: string, senderRole: UserRole) => void;
  markConversationRead: (conversationId: string) => void;

  getChecklistGroups: () => ChecklistGroup[];
  getChecklistStats: () => { total: number; completed: number; pending: number; processing: number; rejected: number; percent: number };
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  role: 'employee',
  currentEmployeeId: 'emp1',
  currentPositionId: 'pos1',
  positions: defaultPositions,
  checklistTemplates: defaultTemplates,
  checklistItems: defaultEmployeeChecklist,
  personalInfo: defaultPersonalInfo,
  progressSteps: defaultProgressSteps,
  hrTasks: defaultHrTasks,
  employees: defaultEmployees,
  conversations: defaultConversations,
  messages: defaultMessages,

  setRole: (role) => set({ role }),
  toggleRole: () => set((s) => ({ role: s.role === 'employee' ? 'hr' : 'employee' })),
  setCurrentPositionId: (id) => set({ currentPositionId: id }),

  addChecklistItem: (positionId, item) => set((state) => {
    const newItem: ChecklistTemplateItem = {
      ...item,
      id: 't' + Date.now()
    };
    const updatedTemplates = state.checklistTemplates.map(tpl => {
      if (tpl.positionId === positionId) {
        return { ...tpl, items: [...tpl.items, newItem] };
      }
      return tpl;
    });
    if (!updatedTemplates.find(t => t.positionId === positionId)) {
      const pos = state.positions.find(p => p.id === positionId);
      updatedTemplates.push({
        positionId,
        positionName: pos?.name || '未知岗位',
        items: [newItem]
      });
    }
    console.log('[Store] addChecklistItem, positionId:', positionId, 'item:', newItem);
    return { checklistTemplates: updatedTemplates };
  }),

  updateChecklistItem: (positionId, itemId, updates) => set((state) => ({
    checklistTemplates: state.checklistTemplates.map(tpl => {
      if (tpl.positionId === positionId) {
        return {
          ...tpl,
          items: tpl.items.map(item => item.id === itemId ? { ...item, ...updates } : item)
        };
      }
      return tpl;
    })
  })),

  deleteChecklistItem: (positionId, itemId) => set((state) => ({
    checklistTemplates: state.checklistTemplates.map(tpl => {
      if (tpl.positionId === positionId) {
        return { ...tpl, items: tpl.items.filter(item => item.id !== itemId) };
      }
      return tpl;
    })
  })),

  getChecklistForPosition: (positionId) => {
    const state = get();
    const tpl = state.checklistTemplates.find(t => t.positionId === positionId);
    return tpl?.items || [];
  },

  applyChecklistToEmployee: (positionId, employeeId) => set((state) => {
    const tpl = state.checklistTemplates.find(t => t.positionId === positionId);
    if (!tpl) return {};
    const newItems: ChecklistItem[] = tpl.items.map((tplItem, idx) => {
      const existing = state.checklistItems.find(i => i.positionId === positionId && i.title === tplItem.title);
      return existing || {
        id: 'ci_' + positionId + '_' + idx,
        title: tplItem.title,
        description: tplItem.description,
        category: tplItem.category,
        status: 'pending',
        positionId
      };
    });
    const keepItems = state.checklistItems.filter(i => i.positionId !== positionId);
    console.log('[Store] applyChecklistToEmployee, newItems count:', newItems.length);
    return { checklistItems: [...keepItems, ...newItems] };
  }),

  submitPersonalInfo: (info) => set((state) => {
    console.log('[Store] submitPersonalInfo:', info);
    return {
      personalInfo: {
        ...state.personalInfo,
        ...info,
        auditStatus: 'pending' as TaskStatus,
        auditRejectReason: undefined,
        submittedAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-')
      }
    };
  }),

  approvePersonalInfo: () => set((state) => {
    console.log('[Store] approvePersonalInfo');
    const updatedInfo = {
      ...state.personalInfo,
      auditStatus: 'completed' as TaskStatus,
      auditRejectReason: undefined,
      auditedAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-')
    };
    const updatedSteps = state.progressSteps.map(s =>
      s.id === 'ps3' ? { ...s, status: 'completed' as TaskStatus, actualDate: new Date().toISOString().split('T')[0], assignee: '王HR' } : s
    );
    const updatedEmployees = state.employees.map(e =>
      e.id === state.currentEmployeeId ? { ...e, infoStatus: 'completed' as TaskStatus } : e
    );
    return { personalInfo: updatedInfo, progressSteps: updatedSteps, employees: updatedEmployees };
  }),

  rejectPersonalInfo: (reason) => set((state) => {
    console.log('[Store] rejectPersonalInfo, reason:', reason);
    const updatedInfo = {
      ...state.personalInfo,
      auditStatus: 'rejected' as TaskStatus,
      auditRejectReason: reason,
      auditedAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-')
    };
    const updatedItems = state.checklistItems.map(item =>
      item.category === 'process' && item.title.includes('紧急联系人')
        ? { ...item, status: 'rejected' as TaskStatus, rejectReason: reason }
        : item
    );
    const updatedEmployees = state.employees.map(e =>
      e.id === state.currentEmployeeId ? { ...e, infoStatus: 'rejected' as TaskStatus } : e
    );
    return { personalInfo: updatedInfo, checklistItems: updatedItems, employees: updatedEmployees };
  }),

  scheduleTask: (taskType, assignee) => set((state) => {
    const now = new Date();
    const taskId = 'ht_' + Date.now();
    const typeMap: Record<string, { stepId: string; title: string }> = {
      '工位': { stepId: 'ps5', title: '工位分配' },
      '账号': { stepId: 'ps6', title: '账号开通' },
      '设备': { stepId: 'ps6', title: '办公设备准备' },
      '体检': { stepId: 'ps7', title: '体检安排' },
      '培训': { stepId: 'ps8', title: '入职培训安排' }
    };
    const mapping = typeMap[taskType] || { stepId: '', title: taskType + '任务' };
    const expectedDate = new Date(now.getTime() + 3 * 86400000).toISOString().split('T')[0];
    const scheduledAt = now.toLocaleString('zh-CN').replace(/\//g, '-');

    const updatedSteps = state.progressSteps.map(s =>
      s.id === mapping.stepId
        ? { ...s, status: 'processing' as TaskStatus, assignee, scheduledAt }
        : s
    );

    const newHrTask: HrTask = {
      id: taskId,
      title: mapping.title,
      employeeName: '李明',
      position: '前端开发工程师',
      taskType: taskType + '安排',
      status: 'processing',
      deadline: expectedDate,
      assignee,
      scheduledAt
    };

    console.log('[Store] scheduleTask:', newHrTask);
    return { progressSteps: updatedSteps, hrTasks: [...state.hrTasks, newHrTask] };
  }),

  markHrTaskDone: (taskId) => set((state) => {
    console.log('[Store] markHrTaskDone:', taskId);
    const now = new Date().toLocaleString('zh-CN').replace(/\//g, '-');
    const updatedTasks = state.hrTasks.map(t =>
      t.id === taskId ? { ...t, status: 'completed' as TaskStatus, completedAt: now } : t
    );
    const task = state.hrTasks.find(t => t.id === taskId);
    let updatedSteps = state.progressSteps;
    if (task) {
      const typeStepMap: Record<string, string> = {
        '工位分配': 'ps5', '账号开通': 'ps6', '办公设备准备': 'ps6',
        '体检安排': 'ps7', '入职培训安排': 'ps8'
      };
      const stepId = typeStepMap[task.title];
      if (stepId) {
        updatedSteps = state.progressSteps.map(s =>
          s.id === stepId ? { ...s, status: 'completed' as TaskStatus, actualDate: new Date().toISOString().split('T')[0] } : s
        );
      }
    }
    return { hrTasks: updatedTasks, progressSteps: updatedSteps };
  }),

  sendReminder: (taskId) => {
    console.log('[Store] sendReminder:', taskId);
    Taro.showToast({ title: '提醒已发送给负责人', icon: 'success' });
  },

  markEmployeeArrived: (employeeId) => set((state) => {
    console.log('[Store] markEmployeeArrived:', employeeId);
    const now = new Date();
    const nowStr = now.toISOString().split('T')[0];
    const nowFull = now.toLocaleString('zh-CN').replace(/\//g, '-');

    const updatedSteps = state.progressSteps.map(s => {
      if (s.id === 'ps9') return { ...s, status: 'completed' as TaskStatus, actualDate: nowStr };
      if (s.status !== 'completed') return { ...s, status: 'completed' as TaskStatus, actualDate: nowStr };
      return s;
    });

    const updatedItems = state.checklistItems.map(i =>
      i.status !== 'completed' ? { ...i, status: 'completed' as TaskStatus, completedAt: nowFull } : i
    );

    const completedSteps = updatedSteps.filter(s => s.status === 'completed').length;
    const overallProgress = Math.round((completedSteps / updatedSteps.length) * 100);

    const updatedEmployees = state.employees.map(e =>
      e.id === employeeId
        ? { ...e, overallProgress, arrivalStatus: 'completed' as TaskStatus, infoStatus: 'completed' as TaskStatus, contractStatus: 'completed' as TaskStatus, arrivedAt: nowStr }
        : e
    );

    return { progressSteps: updatedSteps, checklistItems: updatedItems, employees: updatedEmployees };
  }),

  sendMessage: (conversationId, content, senderRole) => set((state) => {
    const now = new Date().toLocaleString('zh-CN', {
      month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    }).replace(/\//g, '-');

    const conv = state.conversations.find(c => c.id === conversationId);
    const senderName = senderRole === 'hr' ? '我（HR）' : '我';
    const senderId = senderRole === 'hr' ? 'hr_me' : 'emp_me';

    const newMsg: Message = {
      id: 'm_' + Date.now(),
      conversationId,
      senderId,
      senderName,
      senderRole,
      content,
      createdAt: now,
      isRead: true
    };

    const updatedConversations = state.conversations.map(c =>
      c.id === conversationId
        ? { ...c, lastMessage: content, lastMessageTime: now, unreadCount: senderRole === 'hr' ? c.unreadCount : c.unreadCount }
        : c
    );

    console.log('[Store] sendMessage, conversationId:', conversationId);
    return { messages: [...state.messages, newMsg], conversations: updatedConversations };
  }),

  markConversationRead: (conversationId) => set((state) => {
    console.log('[Store] markConversationRead:', conversationId);
    return {
      conversations: state.conversations.map(c =>
        c.id === conversationId ? { ...c, unreadCount: 0 } : c
      ),
      messages: state.messages.map(m =>
        m.conversationId === conversationId ? { ...m, isRead: true } : m
      )
    };
  }),

  getChecklistGroups: () => {
    const state = get();
    const currentEmp = state.employees.find(e => e.id === state.currentEmployeeId);
    const posId = currentEmp?.positionId || state.currentPositionId;
    const items = state.checklistItems.filter(i => !i.positionId || i.positionId === posId);
    const groups: ChecklistGroup[] = (['document', 'process', 'training', 'system'] as TaskCategory[]).map(cat => ({
      category: cat,
      categoryName: categoryNames[cat],
      items: items.filter(i => i.category === cat)
    })).filter(g => g.items.length > 0);
    return groups;
  },

  getChecklistStats: () => {
    const state = get();
    const groups = state.getChecklistGroups();
    const items = groups.flatMap(g => g.items);
    const total = items.length;
    const completed = items.filter(i => i.status === 'completed').length;
    const pending = items.filter(i => i.status === 'pending').length;
    const processing = items.filter(i => i.status === 'processing').length;
    const rejected = items.filter(i => i.status === 'rejected').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, processing, rejected, percent };
  }
}));
