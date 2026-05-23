/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import { AttendanceRecord } from '../../types';

const COLLECTION_NAME = 'attendance';

export const attendanceService = {
  /**
   * Listens to real-time updates from the 'attendance' collection, sorted by date descending.
   */
  subscribeToAttendance(callback: (records: AttendanceRecord[]) => void) {
    // Optimized query to fetch logs with the latest entries arriving first
    const q = query(
      collection(db, COLLECTION_NAME), 
      orderBy('date', 'desc')
    );
    
    return onSnapshot(q, (snapshot) => {
      const records: AttendanceRecord[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        records.push({ 
          ...data,
          id: doc.id, // The Firestore Document ID
          attendanceId: data.attendanceId || doc.id, // Fallback safety
        } as AttendanceRecord);
      });
      callback(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  /**
   * Creates a new attendance log record.
   */
  async addRecord(record: Partial<AttendanceRecord>) {
    try {
      const newRef = doc(collection(db, COLLECTION_NAME));
      await setDoc(newRef, {
        ...record,
        attendanceId: newRef.id,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      throw error;
    }
  },

  /**
   * Updates an existing attendance record (e.g., adding check-out times or updating status).
   */
  async updateRecord(id: string, updates: Partial<AttendanceRecord>) {
    try {
      const ref = doc(db, COLLECTION_NAME, id);
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
      throw error;
    }
  }
};