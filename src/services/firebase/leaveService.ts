import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { LeaveRequest } from '../../types';

export const leaveService = {
  subscribeToLeaves(callback: (leaves: LeaveRequest[]) => void) {
    const q = query(collection(db, 'leaves'));
    return onSnapshot(q, (snapshot) => {
      const leaves: LeaveRequest[] = [];
      snapshot.forEach((doc) => {
        leaves.push({ 
          id: doc.id,
          leaveId: doc.id,
          ...doc.data() 
        } as LeaveRequest);
      });
      callback(leaves);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'leaves');
    });
  },

  async addLeave(leave: Partial<LeaveRequest>) {
    try {
      const newRef = doc(collection(db, 'leaves'));
      await setDoc(newRef, {
        leaveId: newRef.id,
        ...leave,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'leaves');
      throw error;
    }
  },

  async updateLeaveStatus(id: string, status: string, managerComment?: string) {
    try {
      const ref = doc(db, 'leaves', id);
      await updateDoc(ref, {
        status,
        ...(managerComment ? { managerComment } : {}),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `leaves/${id}`);
      throw error;
    }
  }
};
