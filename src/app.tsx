import React, { useEffect } from 'react';
import { useDidShow, useDidHide } from '@tarojs/taro';
import { UserProvider } from '@/store/UserContext';
import './app.scss';

function App(props) {
  useEffect(() => {
    console.log('[App] App initialized');
  }, []);

  useDidShow(() => {
    console.log('[App] App shown');
  });

  useDidHide(() => {
    console.log('[App] App hidden');
  });

  return (
    <UserProvider>
      {props.children}
    </UserProvider>
  );
}

export default App;
