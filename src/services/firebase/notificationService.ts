import { collection, doc, setDoc, updateDoc, onSnapshot, query, serverTimestamp, deleteDoc } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Notification } from '../../types';

export const notificationService = {
  subscribeToNotifications(callback: (notifications: Notification[]) => void) {
    const q = query(collection(db, 'notifications'));
    return onSnapshot(q, (snapshot) => {
      const notifications: Notification[] = [];
      snapshot.forEach((doc) => {
        notifications.push({ 
          id: doc.id,
          notificationId: doc.id,
          ...doc.data() 
        } as Notification);
      });
      callback(notifications);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'notifications');
    });
  },

  async addNotification(notification: Partial<Notification>) {
    try {
      const newRef = doc(collection(db, 'notifications'));
      await setDoc(newRef, {
        notificationId: newRef.id,
        isRead: false,
        ...notification,
        createdAt: serverTimestamp(),
      });
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'notifications');
      throw error;
    }
  },

  async markAsRead(id: string) {
    try {
      const ref = doc(db, 'notifications', id);
      await updateDoc(ref, {
        isRead: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `notifications/${id}`);
      throw error;
    }
  },
  
  async deleteNotification(id: string) {
    try {
      const ref = doc(db, 'notifications', id);
      await deleteDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `notifications/${id}`);
      throw error;
    }
  }
};
