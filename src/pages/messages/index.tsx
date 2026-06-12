import React, { useState, useMemo, useRef, useEffect } from 'react';
import { View, Text, ScrollView, Input, Button } from '@tarojs/components';
import Taro from '@tarojs/taro';
import classnames from 'classnames';
import styles from './index.module.scss';
import RoleSwitcher from '@/components/RoleSwitcher';
import MessageBubble from '@/components/MessageBubble';
import { useOnboardingStore } from '@/store/onboardingStore';
import type { Conversation, Message } from '@/types/onboarding';

const MessagesPage: React.FC = () => {
  const role = useOnboardingStore((s) => s.role);
  const conversations = useOnboardingStore((s) => s.conversations);
  const allMessages = useOnboardingStore((s) => s.messages);
  const sendMessage = useOnboardingStore((s) => s.sendMessage);
  const markConversationRead = useOnboardingStore((s) => s.markConversationRead);

  const [activeConv, setActiveConv] = useState<Conversation | null>(null);
  const [inputText, setInputText] = useState('');
  const scrollRef = useRef<any>(null);

  const currentConvMessages: Message[] = useMemo(() => {
    if (!activeConv) return [];
    return allMessages.filter(m => m.conversationId === activeConv.id);
  }, [activeConv, allMessages]);

  useEffect(() => {
    if (scrollRef.current && activeConv) {
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTo({
            top: 99999,
            animated: true
          });
        }
      }, 200);
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
    markConversationRead(conv.id);
    setActiveConv(conv);
  };

  const handleBack = () => {
    setActiveConv(null);
    setInputText('');
  };

  const handleSend = () => {
    if (!inputText.trim() || !activeConv) return;
    sendMessage(activeConv.id, inputText.trim(), role);
    setInputText('');
    Taro.showToast({ title: '发送成功', icon: 'success' });
  };

  const handleQuickReply = (text: string) => {
    setInputText(text);
  };

  const totalUnread = useMemo(() => {
    return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
  }, [conversations]);

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

        <ScrollView className={styles.chatBody} scrollY ref={scrollRef} scrollIntoView={'msg_' + (currentConvMessages.length - 1)}>
          {currentConvMessages.map((msg, idx) => {
            const prevMsg = currentConvMessages[idx - 1];
            const showName = !prevMsg || prevMsg.senderId !== msg.senderId;
            return (
              <View key={msg.id} id={'msg_' + idx}>
                <MessageBubble
                  message={msg}
                  isSelf={msg.senderRole === role || msg.senderName === '我' || msg.senderName === '我（HR）'}
                  showName={showName && msg.senderRole !== role}
                />
              </View>
            );
          })}
          {currentConvMessages.length === 0 && (
            <View className={styles.emptyState}>
              <Text className={styles.emptyIcon}>💬</Text>
              <Text className={styles.emptyText}>暂无消息记录，开始聊天吧</Text>
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
            disabled={!inputText.trim()}
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
        {conversations.map(conv => (
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

        {conversations.length === 0 && (
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
