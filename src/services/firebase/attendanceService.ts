import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { AttendanceRecord } from '../../types';

export const attendanceService = {
  subscribeToAttendance(callback: (records: AttendanceRecord[]) => void) {
    const q = query(collection(db, 'attendance'));
    return onSnapshot(q, (snapshot) => {
      const records: AttendanceRecord[] = [];
      snapshot.forEach((doc) => {
        records.push({ 
          id: doc.id,
          attendanceId: doc.id,
          ...doc.data() 
        } as AttendanceRecord);
      });
      callback(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'attendance');
    });
  },

  async addRecord(record: Partial<AttendanceRecord>) {
    try {
      const newRef = doc(collection(db, 'attendance'));
      await setDoc(newRef, {
        attendanceId: newRef.id,
        ...record,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'attendance');
      throw error;
    }
  },

  async updateRecord(id: string, updates: Partial<AttendanceRecord>) {
    try {
      const ref = doc(db, 'attendance', id);
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `attendance/${id}`);
      throw error;
    }
  }
};
