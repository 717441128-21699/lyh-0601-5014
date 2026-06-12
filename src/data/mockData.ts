import type {
  ChecklistItem,
  ChecklistGroup,
  PersonalInfo,
  Contract,
  ProgressStep,
  Conversation,
  Message,
  HrTask,
  EmployeeProfile
} from '@/types/onboarding';

export const mockChecklistItems: ChecklistItem[] = [
  {
    id: '1',
    title: '上传身份证正反面',
    description: '请上传清晰的身份证正反面照片',
    category: 'document',
    status: 'completed',
    completedAt: '2026-06-10 14:30'
  },
  {
    id: '2',
    title: '上传学历证书',
    description: '请上传最高学历证书扫描件',
    category: 'document',
    status: 'processing'
  },
  {
    id: '3',
    title: '上传个人证件照',
    description: '请上传一寸白底证件照',
    category: 'document',
    status: 'pending'
  },
  {
    id: '4',
    title: '填写紧急联系人',
    description: '请填写一位紧急联系人信息',
    category: 'process',
    status: 'rejected',
    rejectReason: '联系人电话格式不正确，请重新填写'
  },
  {
    id: '5',
    title: '确认到岗时间',
    description: '请确认最终到岗日期',
    category: 'process',
    status: 'completed',
    completedAt: '2026-06-09 10:00'
  },
  {
    id: '6',
    title: '银行卡信息录入',
    description: '请填写工资卡信息',
    category: 'process',
    status: 'pending'
  },
  {
    id: '7',
    title: '公司制度学习',
    description: '请阅读员工手册并完成测试',
    category: 'training',
    status: 'pending',
    deadline: '2026-06-15'
  },
  {
    id: '8',
    title: '入职培训报名',
    description: '选择新员工培训时间',
    category: 'training',
    status: 'completed',
    completedAt: '2026-06-08 16:20'
  },
  {
    id: '9',
    title: 'OA账号开通',
    description: 'HR将为您开通办公系统账号',
    category: 'system',
    status: 'processing',
    assignee: '王HR'
  },
  {
    id: '10',
    title: '工位分配',
    description: '行政部门将为您安排工位',
    category: 'system',
    status: 'pending',
    assignee: '李行政'
  }
];

export const mockChecklistGroups: ChecklistGroup[] = [
  {
    category: 'document',
    categoryName: '材料收集',
    items: mockChecklistItems.filter(i => i.category === 'document')
  },
  {
    category: 'process',
    categoryName: '信息填写',
    items: mockChecklistItems.filter(i => i.category === 'process')
  },
  {
    category: 'training',
    categoryName: '培训学习',
    items: mockChecklistItems.filter(i => i.category === 'training')
  },
  {
    category: 'system',
    categoryName: '行政安排',
    items: mockChecklistItems.filter(i => i.category === 'system')
  }
];

export const mockPersonalInfo: PersonalInfo = {
  idCardUploaded: true,
  idCardUrl: 'https://picsum.photos/id/3/300/200',
  avatarUploaded: false,
  diplomaUploaded: false,
  emergencyContact: {
    name: '张三',
    relationship: '父亲',
    phone: '13800138000'
  },
  arrivalDate: '2026-06-20',
  bankCard: '',
  address: ''
};

export const mockContract: Contract = {
  id: 'C20260601001',
  title: '劳动合同',
  content: `劳动合同

甲方（用人单位）：XX科技有限公司
法定代表人：XXX
地址：XX市XX区XX路XX号

乙方（劳动者）：[姓名]
身份证号码：[身份证号]
住址：[住址]

根据《中华人民共和国劳动法》、《中华人民共和国劳动合同法》等法律法规的规定，甲乙双方本着平等自愿、协商一致、合法公平、诚实信用的原则，签订本劳动合同，共同遵守本合同所列条款。

第一条 合同期限
本合同为固定期限劳动合同。合同期从[入职日期]起至[结束日期]止。其中试用期从[入职日期]起至[试用期结束日期]止。

第二条 工作内容和工作地点
1. 乙方同意根据甲方工作需要，从事 [岗位名称] 岗位工作。
2. 乙方的工作地点为：XX市XX区XX路XX号。
3. 乙方应按照甲方的合法要求，按时完成规定的工作数量，达到规定的质量标准。

第三条 工作时间和休息休假
1. 甲方实行每日工作不超过8小时，每周工作不超过40小时的标准工时制度。
2. 甲方保证乙方每周至少休息一日。甲方由于工作需要，经与工会和乙方协商后可以延长工作时间，一般每日不得超过1小时。
3. 乙方依法享有国家法定节假日、年休假、婚假、产假等假期。

第四条 劳动报酬
1. 乙方试用期的工资标准为：[试用期工资]元/月。
2. 乙方转正后的工资标准为：[转正工资]元/月。
3. 甲方应以货币形式按月支付乙方工资，发薪日为每月15日。

第五条 社会保险和福利待遇
1. 甲乙双方依法参加社会保险，按时缴纳各项社会保险费。
2. 甲方为乙方提供以下福利待遇：五险一金、带薪年假、年度体检、节日福利等。

第六条 劳动保护、劳动条件和职业危害防护
1. 甲方应严格执行国家和地方有关劳动保护的法律、法规和规章，为乙方提供必要的劳动条件和劳动工具。
2. 甲方负责对乙方进行职业道德、业务技术、劳动安全卫生及有关规章制度的教育和培训。

第七条 劳动合同的解除和终止
1. 本合同的解除、终止、续订依照《中华人民共和国劳动合同法》等法律法规执行。
2. 解除、终止本合同时，甲方应当出具解除、终止劳动合同的证明书。

第八条 其他
1. 本合同未尽事宜，双方可另行协商解决。
2. 本合同一式两份，甲乙双方各执一份，自双方签字盖章之日起生效。`,
  version: 'v2.1',
  publishedAt: '2026-06-01',
  signed: false
};

export const mockProgressSteps: ProgressStep[] = [
  {
    id: 'ps1',
    title: 'Offer发放',
    description: '已发送入职Offer并确认接收',
    status: 'completed',
    expectedDate: '2026-06-05',
    actualDate: '2026-06-05',
    assignee: '王HR'
  },
  {
    id: 'ps2',
    title: '材料收集',
    description: '身份证、学历证书、证件照等',
    status: 'processing',
    expectedDate: '2026-06-12',
    assignee: '新员工本人'
  },
  {
    id: 'ps3',
    title: '资料审核',
    description: 'HR审核提交材料的完整性和真实性',
    status: 'pending',
    expectedDate: '2026-06-14',
    assignee: '王HR'
  },
  {
    id: 'ps4',
    title: '合同签订',
    description: '签署劳动合同及相关协议',
    status: 'pending',
    expectedDate: '2026-06-16',
    assignee: '王HR'
  },
  {
    id: 'ps5',
    title: '行政准备',
    description: '工位分配、账号开通、设备准备',
    status: 'pending',
    expectedDate: '2026-06-18',
    assignee: '李行政',
    taskType: '工位/账号/设备'
  },
  {
    id: 'ps6',
    title: '体检安排',
    description: '预约入职体检',
    status: 'pending',
    expectedDate: '2026-06-18',
    assignee: '李行政',
    taskType: '体检'
  },
  {
    id: 'ps7',
    title: '培训安排',
    description: '新员工入职培训',
    status: 'pending',
    expectedDate: '2026-06-21',
    assignee: '培训部张老师',
    taskType: '培训'
  },
  {
    id: 'ps8',
    title: '正式到岗',
    description: '完成入职，正式开始工作',
    status: 'pending',
    expectedDate: '2026-06-20',
    assignee: '部门主管'
  }
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv1',
    participantName: '王HR',
    participantRole: 'hr',
    lastMessage: '好的，材料已收到，我会尽快审核',
    lastMessageTime: '2026-06-12 10:30',
    unreadCount: 1
  },
  {
    id: 'conv2',
    participantName: '李行政',
    participantRole: 'hr',
    lastMessage: '工位已初步安排在A区3排5号',
    lastMessageTime: '2026-06-11 16:45',
    unreadCount: 0
  },
  {
    id: 'conv3',
    participantName: '培训部张老师',
    participantRole: 'hr',
    lastMessage: '培训时间定在6月21日上午9点',
    lastMessageTime: '2026-06-10 09:15',
    unreadCount: 2
  }
];

export const mockMessages: Message[] = [
  {
    id: 'm1',
    conversationId: 'conv1',
    senderId: 'hr1',
    senderName: '王HR',
    senderRole: 'hr',
    content: '您好，欢迎加入XX科技！我是负责您入职办理的HR小王。',
    createdAt: '2026-06-08 09:00',
    isRead: true
  },
  {
    id: 'm2',
    conversationId: 'conv1',
    senderId: 'hr1',
    senderName: '王HR',
    senderRole: 'hr',
    content: '请您在入职清单页面查看需要准备的材料，并按时提交。如有任何问题可以随时在这里问我。',
    createdAt: '2026-06-08 09:01',
    isRead: true
  },
  {
    id: 'm3',
    conversationId: 'conv1',
    senderId: 'emp1',
    senderName: '我',
    senderRole: 'employee',
    content: '好的，谢谢！请问学历证书需要原件吗？',
    createdAt: '2026-06-08 10:20',
    isRead: true
  },
  {
    id: 'm4',
    conversationId: 'conv1',
    senderId: 'hr1',
    senderName: '王HR',
    senderRole: 'hr',
    content: '不需要原件，上传清晰的扫描件或照片即可。入职当天请携带原件备查。',
    createdAt: '2026-06-08 10:35',
    isRead: true
  },
  {
    id: 'm5',
    conversationId: 'conv1',
    senderId: 'emp1',
    senderName: '我',
    senderRole: 'employee',
    content: '好的，明白了。我已经上传了身份证，请查收。',
    createdAt: '2026-06-10 14:25',
    isRead: true
  },
  {
    id: 'm6',
    conversationId: 'conv1',
    senderId: 'hr1',
    senderName: '王HR',
    senderRole: 'hr',
    content: '好的，材料已收到，我会尽快审核',
    createdAt: '2026-06-12 10:30',
    isRead: false
  }
];

export const mockHrTasks: HrTask[] = [
  {
    id: 'ht1',
    title: '审核身份证材料',
    employeeName: '李明',
    position: '前端开发工程师',
    taskType: '资料审核',
    status: 'pending',
    deadline: '2026-06-13'
  },
  {
    id: 'ht2',
    title: '安排工位',
    employeeName: '李明',
    position: '前端开发工程师',
    taskType: '工位分配',
    status: 'pending',
    deadline: '2026-06-18',
    assignee: '李行政'
  },
  {
    id: 'ht3',
    title: '审核学历证书',
    employeeName: '王芳',
    position: '产品经理',
    taskType: '资料审核',
    status: 'processing',
    deadline: '2026-06-13'
  },
  {
    id: 'ht4',
    title: '开通OA账号',
    employeeName: '王芳',
    position: '产品经理',
    taskType: '账号开通',
    status: 'pending',
    deadline: '2026-06-17',
    assignee: 'IT部门'
  },
  {
    id: 'ht5',
    title: '预约入职体检',
    employeeName: '张伟',
    position: 'UI设计师',
    taskType: '体检安排',
    status: 'completed',
    deadline: '2026-06-15',
    assignee: '李行政'
  },
  {
    id: 'ht6',
    title: '退回紧急联系人修改',
    employeeName: '李明',
    position: '前端开发工程师',
    taskType: '资料审核',
    status: 'rejected',
    deadline: '2026-06-12'
  }
];

export const mockEmployees: EmployeeProfile[] = [
  {
    id: 'emp1',
    name: '李明',
    position: '前端开发工程师',
    department: '研发部',
    avatar: 'https://picsum.photos/id/64/200/200',
    phone: '13800138001',
    email: 'liming@example.com',
    overallProgress: 45,
    infoStatus: 'processing',
    contractStatus: 'pending'
  },
  {
    id: 'emp2',
    name: '王芳',
    position: '产品经理',
    department: '产品部',
    avatar: 'https://picsum.photos/id/338/200/200',
    phone: '13800138002',
    email: 'wangfang@example.com',
    overallProgress: 72,
    infoStatus: 'completed',
    contractStatus: 'processing'
  },
  {
    id: 'emp3',
    name: '张伟',
    position: 'UI设计师',
    department: '设计部',
    avatar: 'https://picsum.photos/id/177/200/200',
    phone: '13800138003',
    email: 'zhangwei@example.com',
    overallProgress: 90,
    infoStatus: 'completed',
    contractStatus: 'completed'
  },
  {
    id: 'emp4',
    name: '刘洋',
    position: '后端开发工程师',
    department: '研发部',
    avatar: 'https://picsum.photos/id/1027/200/200',
    phone: '13800138004',
    email: 'liuyang@example.com',
    overallProgress: 20,
    infoStatus: 'pending',
    contractStatus: 'pending'
  }
];
