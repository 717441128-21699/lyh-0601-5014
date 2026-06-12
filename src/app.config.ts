export default defineAppConfig({
  pages: [
    'pages/checklist/index',
    'pages/info/index',
    'pages/contract/index',
    'pages/progress/index',
    'pages/messages/index',
    'pages/config/index',
    'pages/employee/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#165dff',
    navigationBarTitleText: '入职办理',
    navigationBarTextStyle: 'white'
  },
  tabBar: {
    color: '#86909c',
    selectedColor: '#165dff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/checklist/index',
        text: '入职清单'
      },
      {
        pagePath: 'pages/info/index',
        text: '资料填写'
      },
      {
        pagePath: 'pages/contract/index',
        text: '合同确认'
      },
      {
        pagePath: 'pages/progress/index',
        text: '办理进度'
      },
      {
        pagePath: 'pages/messages/index',
        text: '答疑消息'
      }
    ]
  }
})
