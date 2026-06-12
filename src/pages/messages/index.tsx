import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import MessageBubble from '@/components/MessageBubble';
import { useUserRole } from '@/store/UserContext';
import { mockConversations, mockMessages } from '@/data/mockData';
import type { Conversation, Message } from '@/types/onboarding';

const MessagesPage: React.FC = () => {
  const { role } = useUserRole();
  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const scrollRef = useRef<any>(null);

  const currentConvMessages = useMemo(() => {
    if (!activeConv) return [];
    return messages.filter(m => m.conversationId === activeConv.id);
  }, [activeConv, messages]);

  useEffect(() => {
    if (scrollRef.current && activeConv) {
      setTimeout(() => {
        // scroll to bottom
      }, 100);
    }
  }, [currentConvMessages.length, activeConv]);

  const quickReplies = [
    '材料已收到，正在审核',
    '请补充身份证照片',
    '合同已发送，请查收',
    '工位已安排A区3排5号',
    '体检已预约成功'
  ];

  const handleConvClick = (conv: Conversation) => {
    console.log('[Messages] Open conversation:', conv.id);
    setActiveConv(conv);
    setMessages(prev => prev.map(m =>
      m.conversationId === conv.id ? { ...m, isRead: true } : m
    ));
  };

  const handleBack = () => {
    setActiveConv(null);
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    console.log('[Messages] Send message:', inputText);

    const newMsg: Message = {
      id: 'm' + Date.now(),
      conversationId: activeConv.id,
      senderId: role === 'hr' ? 'hr1' : 'emp1',
      senderName: role === 'hr' ? '我（HR）' : '我',
      senderRole: role,
      content: inputText.trim(),
      createdAt: new Date().toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      }).replace(/\//g, '-'),
      isRead: true
    };

    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    Taro.showToast({ title: '发送成功', icon: 'success' });
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  const totalUnread = useMemo(() => {
    return mockConversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }, []);

  if (activeConv) {
    return (
      <View className={styles.chatView}>
        <View className={styles.chatHeader}>
          <Text className={styles.backBtn} onClick={handleBack}>←</Text>
          <Text className={styles.chatTitle}>{activeConv.participantName}</Text>
        </View>

        {role === 'hr' && (
          <View className={styles.hrMessageTip}>
            💡 提示：您正在与新员工沟通入职事宜
          </View>
        )}

        <ScrollView className={styles.chatBody} scrollY ref={scrollRef}>
          {currentConvMessages.map((msg, idx) => {
            const prevMsg = currentConvMessages[idx - 1];
            const showName = !prevMsg || prevMsg.senderId !== msg.senderId;
            return (
              <MessageBubble
                key={msg.id}
                message={msg}
                isSelf={msg.senderRole === role}
                showName={showName && msg.senderRole !== role}
              />
            );
          })}
          {currentConvMessages.length === 0 && (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>💬</Text>
              <Text className={styles.emptyText}>暂无消息记录</Text>
            </View>
          )}
        </ScrollView>

        {role === 'hr' && (
          <ScrollView className={styles.hrQuickBar} scrollX enableFlex>
            {quickReplies.map((text, i) => (
              <View key={i} className={styles.quickBtn} onClick={() => handleQuickReply(text)}>
                {text}
              </View>
            ))}
          </ScrollView>
        )}

        <View className={styles.inputBar}>
          <View className={styles.inputWrap}>
            <Input
              className={styles.inputField}
              value={inputText}
              onInput={(e) => setInputText(e.detail.value)}
              placeholder={role === 'hr' ? '输入回复内容...' : '输入您的问题...'}
              confirmType="send"
              onConfirm={handleSend}
            />
          </View>
          <Button
            className={classnames(styles.sendBtn, !inputText.trim() && styles.disabled)}
            onClick={handleSend}
          >
            发送
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
            <View className={styles.headerTitle}>答疑消息</View>
            <View className={styles.headerSub}>
              {role === 'hr' ? '与新员工沟通入职事宜' : '有问题随时咨询HR'}
              {totalUnread > 0 && ` · ${totalUnread}条未读`}
            </View>
          </View>
          <RoleSwitcher />
        </View>
      </View>

      <ScrollView className={styles.listView} scrollY>
        {mockConversations.map(conv => (
          <View
            key={conv.id}
            className={styles.convItem}
            onClick={() => handleConvClick(conv)}
          >
            <View className={styles.avatar}>
              {conv.participantName.charAt(0)}
            </View>
            <View className={styles.convContent}>
              <View className={styles.convHeader}>
                <Text className={styles.convName}>{conv.participantName}</Text>
                <Text className={styles.convTime}>{conv.lastMessageTime}</Text>
              </View>
              <View className={styles.convPreview}>
                <Text className={styles.previewText}>{conv.lastMessage}</Text>
                {conv.unreadCount > 0 && (
                  <View className={styles.unreadBadge}>
                    {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}

        {mockConversations.length === 0 && (
          <View className={styles.emptyState}>
            <Text className={styles.emptyIcon}>📭</Text>
            <Text className={styles.emptyText}>暂无消息</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

export default MessagesPage;
