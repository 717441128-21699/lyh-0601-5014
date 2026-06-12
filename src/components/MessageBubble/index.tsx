import React from 'react';
import { View, Text } from '@tarojs/components';
import classnames from 'classnames';
import styles from './index.module.scss';
import type { Message } from '@/types/onboarding';

interface MessageBubbleProps {
  message: Message;
  isSelf: boolean;
  showName?: boolean;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ message, isSelf, showName }) => {
  return (
    <View className={classnames(styles.container, isSelf && styles.self)}>
      <View>
        {showName && !isSelf && (
          <View className={styles.senderName}>{message.senderName}</View>
        )}
        <View
          className={classnames(
            styles.bubble,
            isSelf ? styles.selfBubble : styles.otherBubble
          )}
        >
          <Text>{message.content}</Text>
          <View className={classnames(styles.meta, isSelf && styles.selfMeta)}>
            {message.createdAt}
          </View>
        </View>
      </View>
    </View>
  );
};

export default MessageBubble;
