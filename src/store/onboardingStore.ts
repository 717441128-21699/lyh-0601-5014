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

const defaultEmployees: EmployeeProfile[] = [
  { id: 'emp1', name: '李明', position: '前端开发工程师', positionId: 'pos1', department: '研发部', avatar: 'https://picsum.photos/id/64/200/200', phone: '13800138001', email: 'liming@example.com', overallProgress: 45, infoStatus: 'rejected', contractStatus: 'pending', arrivalStatus: 'pending' },
  { id: 'emp2', name: '王芳', position: '产品经理', positionId: 'pos3', department: '产品部', avatar: 'https://picsum.photos/id/338/200/200', phone: '13800138002', email: 'wangfang@example.com', overallProgress: 72, infoStatus: 'completed', contractStatus: 'processing', arrivalStatus: 'pending' },
  { id: 'emp3', name: '张伟', position: 'UI设计师', positionId: 'pos4', department: '设计部', avatar: 'https://picsum.photos/id/177/200/200', phone: '13800138003', email: 'zhangwei@example.com', overallProgress: 90, infoStatus: 'completed', contractStatus: 'completed', arrivalStatus: 'pending' },
  { id: 'emp4', name: '刘洋', position: '后端开发工程师', positionId: 'pos2', department: '研发部', avatar: 'https://picsum.photos/id/1027/200/200', phone: '13800138004', email: 'liuyang@example.com', overallProgress: 20, infoStatus: 'pending', contractStatus: 'pending', arrivalStatus: 'pending' }
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
  },
  {
    positionId: 'pos2',
    positionName: '后端开发工程师',
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
      { id: 't13', title: '服务器权限申请', description: '申请开发服务器和数据库访问权限', category: 'system' },
      { id: 't14', title: '代码仓库开通', description: '开通GitLab代码仓库权限', category: 'system' }
    ]
  },
  {
    positionId: 'pos4',
    positionName: 'UI设计师',
    items: [
      { id: 't1', title: '上传身份证正反面', description: '请上传清晰的身份证正反面照片', category: 'document' },
      { id: 't2', title: '上传学历证书', description: '请上传最高学历证书扫描件', category: 'document' },
      { id: 't3', title: '上传个人证件照', description: '请上传一寸白底证件照', category: 'document' },
      { id: 't4', title: '填写紧急联系人', description: '请填写一位紧急联系人信息', category: 'process' },
      { id: 't5', title: '确认到岗时间', description: '请确认最终到岗日期', category: 'process' },
      { id: 't6', title: '银行卡信息录入', description: '请填写工资卡信息', category: 'process' },
      { id: 't7', title: '公司制度学习', description: '请阅读员工手册并完成测试', category: 'training' },
      { id: 't15', title: '设计规范培训', description: '学习公司设计规范和组件库', category: 'training' },
      { id: 't9', title: 'OA账号开通', description: 'HR将为您开通办公系统账号', category: 'system' },
      { id: 't10', title: '工位分配', description: '行政部门将为您安排工位', category: 'system' },
      { id: 't16', title: '设计软件授权', description: '申请Figma/Sketch等设计软件授权', category: 'system' }
    ]
  }
];

const createDefaultChecklist = (positionId: string): ChecklistItem[] => {
  const tpl = defaultTemplates.find(t => t.positionId === positionId);
  if (!tpl) return [];
  const statusMap: Record<number, TaskStatus> = {
    0: 'completed', 1: 'processing', 2: 'pending', 3: 'rejected'
  };
  return tpl.items.map((tplItem, idx) => ({
    id: `ci_${positionId}_${idx}`,
    title: tplItem.title,
    description: tplItem.description,
    category: tplItem.category,
    status: idx < 2 ? 'completed' : idx < 4 ? 'processing' : idx < 5 ? 'rejected' : 'pending',
    completedAt: idx < 2 ? '2026-06-10 14:30' : undefined,
    rejectReason: idx === 4 ? '联系人电话格式不正确，请重新填写' : undefined,
    assignee: tplItem.category === 'system' ? '王HR' : undefined,
    positionId
  }));
};

const createDefaultPersonalInfo = (empId: string): PersonalInfo => {
  const isCompleted = empId === 'emp2' || empId === 'emp3';
  const isRejected = empId === 'emp1';
  return {
    idCardUploaded: true,
    idCardUrl: `https://picsum.photos/id/${parseInt(empId.replace('emp', '')) * 10 + 3}/300/200`,
    avatarUploaded: empId !== 'emp4',
    avatarUrl: empId !== 'emp4' ? `https://picsum.photos/id/${parseInt(empId.replace('emp', '')) * 10 + 5}/300/200` : undefined,
    diplomaUploaded: empId !== 'emp4',
    diplomaUrl: empId !== 'emp4' ? `https://picsum.photos/id/${parseInt(empId.replace('emp', '')) * 10 + 7}/300/200` : undefined,
    emergencyContact: { name: '张' + empId.slice(-1), relationship: '父亲', phone: '1380013800' + empId.slice(-1) },
    arrivalDate: '2026-06-20',
    bankCard: empId === 'emp1' ? '' : '6222021234567890123',
    address: empId === 'emp4' ? '' : '北京市朝阳区建国路88号',
    auditStatus: isCompleted ? 'completed' : isRejected ? 'rejected' : 'pending',
    auditRejectReason: isRejected ? '紧急联系人电话格式不正确，请重新填写11位手机号' : undefined,
    submittedAt: '2026-06-11 09:30',
    auditedAt: isCompleted ? '2026-06-12 10:00' : isRejected ? '2026-06-12 10:00' : undefined
  };
};

const createDefaultProgressSteps = (empId: string): ProgressStep[] => {
  const steps: ProgressStep[] = [
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

  if (empId === 'emp3') {
    steps.forEach((s, i) => { if (i < 5) { s.status = 'completed'; s.actualDate = '2026-06-' + (10 + i); } });
  } else if (empId === 'emp2') {
    steps.forEach((s, i) => { if (i < 3) { s.status = 'completed'; s.actualDate = '2026-06-' + (10 + i); } });
    steps[3].status = 'processing';
  }
  return steps;
};

const createDefaultHrTasks = (empId: string, empName: string, position: string): HrTask[] => {
  if (empId === 'emp1') {
    return [
      { id: `ht_${empId}_1`, title: '审核身份证材料', employeeName: empName, position, taskType: '资料审核', status: 'pending', deadline: '2026-06-13' },
      { id: `ht_${empId}_2`, title: '退回紧急联系人修改', employeeName: empName, position, taskType: '资料审核', status: 'rejected', deadline: '2026-06-12' }
    ];
  }
  if (empId === 'emp2') {
    return [
      { id: `ht_${empId}_1`, title: '审核学历证书', employeeName: empName, position, taskType: '资料审核', status: 'completed', deadline: '2026-06-10', assignee: '王HR', completedAt: '2026-06-10 14:00', scheduledAt: '2026-06-08 09:00' },
      { id: `ht_${empId}_2`, title: '合同发送', employeeName: empName, position, taskType: '合同签订', status: 'processing', deadline: '2026-06-14', assignee: '王HR', scheduledAt: '2026-06-11 10:00' }
    ];
  }
  if (empId === 'emp3') {
    return [
      { id: `ht_${empId}_1`, title: '预约入职体检', employeeName: empName, position, taskType: '体检安排', status: 'completed', deadline: '2026-06-15', assignee: '李行政', completedAt: '2026-06-10 14:00', scheduledAt: '2026-06-09 09:00' },
      { id: `ht_${empId}_2`, title: '工位分配', employeeName: empName, position, taskType: '工位安排', status: 'completed', deadline: '2026-06-16', assignee: '李行政', completedAt: '2026-06-11 10:00', scheduledAt: '2026-06-09 09:00' }
    ];
  }
  return [
    { id: `ht_${empId}_1`, title: '入职材料收集', employeeName: empName, position, taskType: '资料审核', status: 'pending', deadline: '2026-06-15' }
  ];
};

const initPersonalInfos = (): Record<string, PersonalInfo> => {
  const result: Record<string, PersonalInfo> = {};
  defaultEmployees.forEach(emp => { result[emp.id] = createDefaultPersonalInfo(emp.id); });
  return result;
};

const initProgressSteps = (): Record<string, ProgressStep[]> => {
  const result: Record<string, ProgressStep[]> = {};
  defaultEmployees.forEach(emp => { result[emp.id] = createDefaultProgressSteps(emp.id); });
  return result;
};

const initHrTasks = (): HrTask[] => {
  const all: HrTask[] = [];
  defaultEmployees.forEach(emp => {
    all.push(...createDefaultHrTasks(emp.id, emp.name, emp.position));
  });
  return all;
};

const initChecklistItems = (): ChecklistItem[] => {
  const all: ChecklistItem[] = [];
  defaultEmployees.forEach(emp => {
    all.push(...createDefaultChecklist(emp.positionId));
  });
  return all;
};

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
  personalInfos: Record<string, PersonalInfo>;
  progressStepsMap: Record<string, ProgressStep[]>;
  hrTasks: HrTask[];
  employees: EmployeeProfile[];
  conversations: Conversation[];
  messages: Message[];

  setRole: (role: UserRole) => void;
  toggleRole: () => void;
  setCurrentEmployeeId: (id: string) => void;
  setCurrentPositionId: (id: string) => void;

  getCurrentPersonalInfo: () => PersonalInfo;
  getCurrentProgressSteps: () => ProgressStep[];
  getCurrentHrTasks: () => HrTask[];

  addChecklistItem: (positionId: string, item: Omit<ChecklistTemplateItem, 'id'>) => void;
  updateChecklistItem: (positionId: string, itemId: string, updates: Partial<ChecklistTemplateItem>) => void;
  deleteChecklistItem: (positionId: string, itemId: string) => void;
  getChecklistForPosition: (positionId: string) => ChecklistTemplateItem[];
  applyChecklistToEmployee: (positionId: string, employeeId: string) => void;

  submitPersonalInfo: (employeeId: string, info: Partial<PersonalInfo>) => void;
  approvePersonalInfo: (employeeId: string) => void;
  rejectPersonalInfo: (employeeId: string, reason: string) => void;

  scheduleTask: (employeeId: string, taskType: string, assignee: string) => void;
  markHrTaskDone: (taskId: string) => void;
  sendReminder: (taskId: string) => void;
  markEmployeeArrived: (employeeId: string) => void;

  sendMessage: (conversationId: string, content: string, senderRole: UserRole) => void;
  markConversationRead: (conversationId: string) => void;

  getChecklistGroups: (positionId: string) => ChecklistGroup[];
  getChecklistStats: (positionId: string) => { total: number; completed: number; pending: number; processing: number; rejected: number; percent: number };
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  role: 'employee',
  currentEmployeeId: 'emp1',
  currentPositionId: 'pos1',
  positions: defaultPositions,
  checklistTemplates: defaultTemplates,
  checklistItems: initChecklistItems(),
  personalInfos: initPersonalInfos(),
  progressStepsMap: initProgressSteps(),
  hrTasks: initHrTasks(),
  employees: defaultEmployees,
  conversations: defaultConversations,
  messages: defaultMessages,

  setRole: (role) => set({ role }),
  toggleRole: () => set((s) => ({ role: s.role === 'employee' ? 'hr' : 'employee' })),
  setCurrentEmployeeId: (id) => {
    const emp = defaultEmployees.find(e => e.id === id);
    set({ currentEmployeeId: id, currentPositionId: emp?.positionId || 'pos1' });
  },
  setCurrentPositionId: (id) => set({ currentPositionId: id }),

  getCurrentPersonalInfo: () => {
    const state = get();
    return state.personalInfos[state.currentEmployeeId] || createDefaultPersonalInfo(state.currentEmployeeId);
  },

  getCurrentProgressSteps: () => {
    const state = get();
    return state.progressStepsMap[state.currentEmployeeId] || [];
  },

  getCurrentHrTasks: () => {
    const state = get();
    return state.hrTasks.filter(t => {
      const emp = state.employees.find(e => e.id === state.currentEmployeeId);
      return t.employeeName === emp?.name;
    });
  },

  addChecklistItem: (positionId, item) => set((state) => {
    const newItem: ChecklistTemplateItem = {
      ...item,
      id: 't' + Date.now()
    };
    let updatedTemplates = state.checklistTemplates.map(tpl => {
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

    const existingItems = state.checklistItems.filter(i => i.positionId === positionId);
    const newItems: ChecklistItem[] = tpl.items.map((tplItem) => {
      const existing = existingItems.find(ei => ei.title === tplItem.title);
      return existing || {
        id: 'ci_' + positionId + '_' + tplItem.id,
        title: tplItem.title,
        description: tplItem.description,
        category: tplItem.category,
        status: 'pending',
        positionId
      };
    });

    const keepItems = state.checklistItems.filter(i => i.positionId !== positionId);
    return { checklistItems: [...keepItems, ...newItems] };
  }),

  submitPersonalInfo: (employeeId, info) => set((state) => {
    const current = state.personalInfos[employeeId] || createDefaultPersonalInfo(employeeId);
    return {
      personalInfos: {
        ...state.personalInfos,
        [employeeId]: {
          ...current,
          ...info,
          auditStatus: 'pending' as TaskStatus,
          auditRejectReason: undefined,
          submittedAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-')
        }
      },
      employees: state.employees.map(e =>
        e.id === employeeId ? { ...e, infoStatus: 'pending' as TaskStatus } : e
      )
    };
  }),

  approvePersonalInfo: (employeeId) => set((state) => {
    const current = state.personalInfos[employeeId] || createDefaultPersonalInfo(employeeId);
    const updatedInfo = {
      ...current,
      auditStatus: 'completed' as TaskStatus,
      auditRejectReason: undefined,
      auditedAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-')
    };

    const updatedSteps = state.progressStepsMap[employeeId]?.map(s =>
      s.id === 'ps3' ? { ...s, status: 'completed' as TaskStatus, actualDate: new Date().toISOString().split('T')[0], assignee: '王HR' } : s
    ) || state.progressStepsMap[employeeId];

    return {
      personalInfos: { ...state.personalInfos, [employeeId]: updatedInfo },
      progressStepsMap: { ...state.progressStepsMap, [employeeId]: updatedSteps },
      employees: state.employees.map(e =>
        e.id === employeeId ? { ...e, infoStatus: 'completed' as TaskStatus } : e
      )
    };
  }),

  rejectPersonalInfo: (employeeId, reason) => set((state) => {
    const current = state.personalInfos[employeeId] || createDefaultPersonalInfo(employeeId);
    const updatedInfo = {
      ...current,
      auditStatus: 'rejected' as TaskStatus,
      auditRejectReason: reason,
      auditedAt: new Date().toLocaleString('zh-CN').replace(/\//g, '-')
    };

    const updatedItems = state.checklistItems.map(item =>
      item.category === 'process' && item.title.includes('紧急联系人') && item.positionId === (state.employees.find(e => e.id === employeeId)?.positionId)
        ? { ...item, status: 'rejected' as TaskStatus, rejectReason: reason }
        : item
    );

    return {
      personalInfos: { ...state.personalInfos, [employeeId]: updatedInfo },
      checklistItems: updatedItems,
      employees: state.employees.map(e =>
        e.id === employeeId ? { ...e, infoStatus: 'rejected' as TaskStatus } : e
      )
    };
  }),

  scheduleTask: (employeeId, taskType, assignee) => set((state) => {
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

    const emp = state.employees.find(e => e.id === employeeId);

    const updatedSteps = (state.progressStepsMap[employeeId] || []).map(s =>
      s.id === mapping.stepId
        ? { ...s, status: 'processing' as TaskStatus, assignee, scheduledAt }
        : s
    );

    const newHrTask: HrTask = {
      id: taskId,
      title: mapping.title,
      employeeName: emp?.name || '未知员工',
      position: emp?.position || '',
      taskType: taskType + '安排',
      status: 'processing',
      deadline: expectedDate,
      assignee,
      scheduledAt
    };

    return {
      progressStepsMap: { ...state.progressStepsMap, [employeeId]: updatedSteps },
      hrTasks: [...state.hrTasks, newHrTask]
    };
  }),

  markHrTaskDone: (taskId) => set((state) => {
    const task = state.hrTasks.find(t => t.id === taskId);
    if (!task) return {};

    const now = new Date().toLocaleString('zh-CN').replace(/\//g, '-');
    const updatedTasks = state.hrTasks.map(t =>
      t.id === taskId ? { ...t, status: 'completed' as TaskStatus, completedAt: now } : t
    );

    const typeStepMap: Record<string, string> = {
      '工位分配': 'ps5', '账号开通': 'ps6', '办公设备准备': 'ps6',
      '体检安排': 'ps7', '入职培训安排': 'ps8'
    };
    const stepId = typeStepMap[task.title];

    let updatedProgressMap = state.progressStepsMap;
    if (stepId) {
      const emp = state.employees.find(e => e.name === task.employeeName);
      if (emp) {
        const empId = emp.id;
        const updatedSteps = (state.progressStepsMap[empId] || []).map(s =>
          s.id === stepId ? { ...s, status: 'completed' as TaskStatus, actualDate: new Date().toISOString().split('T')[0] } : s
        );
        updatedProgressMap = { ...state.progressStepsMap, [empId]: updatedSteps };

        const completed = updatedSteps.filter(s => s.status === 'completed').length;
        const total = updatedSteps.length;
        const newProgress = total > 0 ? Math.round((completed / total) * 100) : 0;
        const updatedEmployees = state.employees.map(e =>
          e.id === empId ? { ...e, overallProgress: Math.max(e.overallProgress, newProgress) } : e
        );
        return {
          hrTasks: updatedTasks,
          progressStepsMap: updatedProgressMap,
          employees: updatedEmployees
        };
      }
    }

    return { hrTasks: updatedTasks, progressStepsMap: updatedProgressMap };
  }),

  sendReminder: (taskId) => {
    Taro.showToast({ title: '提醒已发送给负责人', icon: 'success' });
  },

  markEmployeeArrived: (employeeId) => set((state) => {
    const now = new Date();
    const nowStr = now.toISOString().split('T')[0];
    const nowFull = now.toLocaleString('zh-CN').replace(/\//g, '-');

    const updatedSteps = (state.progressStepsMap[employeeId] || []).map(s => {
      if (s.id === 'ps9') return { ...s, status: 'completed' as TaskStatus, actualDate: nowStr };
      if (s.status !== 'completed') return { ...s, status: 'completed' as TaskStatus, actualDate: nowStr };
      return s;
    });

    const emp = state.employees.find(e => e.id === employeeId);
    const updatedItems = state.checklistItems.map(i => {
      if (i.positionId === emp?.positionId && i.status !== 'completed') {
        return { ...i, status: 'completed' as TaskStatus, completedAt: nowFull };
      }
      return i;
    });

    const completedSteps = updatedSteps.filter(s => s.status === 'completed').length;
    const overallProgress = updatedSteps.length > 0 ? Math.round((completedSteps / updatedSteps.length) * 100) : 0;

    const updatedTasks = state.hrTasks.map(t => {
      if (t.employeeName === emp?.name && t.status !== 'completed') {
        return { ...t, status: 'completed' as TaskStatus, completedAt: nowFull };
      }
      return t;
    });

    const updatedEmployees = state.employees.map(e =>
      e.id === employeeId
        ? { ...e, overallProgress, arrivalStatus: 'completed' as TaskStatus, infoStatus: 'completed' as TaskStatus, contractStatus: 'completed' as TaskStatus, arrivedAt: nowStr }
        : e
    );

    return {
      progressStepsMap: { ...state.progressStepsMap, [employeeId]: updatedSteps },
      checklistItems: updatedItems,
      hrTasks: updatedTasks,
      employees: updatedEmployees
    };
  }),

  sendMessage: (conversationId, content, senderRole) => set((state) => {
    const now = new Date().toLocaleString('zh-CN', {
      month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit'
    }).replace(/\//g, '-');

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
        ? { ...c, lastMessage: content, lastMessageTime: now }
        : c
    );

    return { messages: [...state.messages, newMsg], conversations: updatedConversations };
  }),

  markConversationRead: (conversationId) => set((state) => ({
    conversations: state.conversations.map(c =>
      c.id === conversationId ? { ...c, unreadCount: 0 } : c
    ),
    messages: state.messages.map(m =>
      m.conversationId === conversationId ? { ...m, isRead: true } : m
    )
  })),

  getChecklistGroups: (positionId) => {
    const state = get();
    const items = state.checklistItems.filter(i => i.positionId === positionId);
    const groups: ChecklistGroup[] = (['document', 'process', 'training', 'system'] as TaskCategory[]).map(cat => ({
      category: cat,
      categoryName: categoryNames[cat],
      items: items.filter(i => i.category === cat)
    })).filter(g => g.items.length > 0);
    return groups;
  },

  getChecklistStats: (positionId) => {
    const state = get();
    const items = state.checklistItems.filter(i => i.positionId === positionId);
    const total = items.length;
    const completed = items.filter(i => i.status === 'completed').length;
    const pending = items.filter(i => i.status === 'pending').length;
    const processing = items.filter(i => i.status === 'processing').length;
    const rejected = items.filter(i => i.status === 'rejected').length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, processing, rejected, percent };
  }
}));
