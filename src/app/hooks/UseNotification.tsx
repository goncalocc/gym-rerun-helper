import { useState } from 'react';

export interface NotificationParams {
  message: string;
  type: string;
  visible: boolean;
}

const useNotification = () => {
  const [notification, setNotification] = useState<NotificationParams>({
    message: '',
    type: '',
    visible: false,
  });

  const closeNotification = () => {
    setNotification({ message: '', type: '', visible: false });
  };

  return { notification, setNotification, closeNotification };
};

export default useNotification;
