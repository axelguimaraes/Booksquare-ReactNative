import { Notification } from '../Models/Notification';
import DummyNotifications from '../DummyData/Notifications';

export const getAllNotifications = (): Promise<Notification[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(DummyNotifications);
    }, 1000);
  });
};

export const markNotificationAsRead = (id: number): Promise<void> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const notificationIndex = DummyNotifications.findIndex(notification => notification.id === id);
      if (notificationIndex !== -1) {
        DummyNotifications[notificationIndex].isRead = true;
        resolve();
      } else {
        reject(new Error('Notification not found'));
      }
    }, 500);
  });
};

export const deleteAllNotifications = (): Promise<void> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      DummyNotifications.splice(0, DummyNotifications.length);
      resolve();
    }, 1000);
  });
};