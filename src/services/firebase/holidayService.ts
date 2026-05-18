/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { 
  collection, 
  doc, 
  setDoc, 
  updateDoc, 
  onSnapshot, 
  query, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Holiday } from '../../types';

const COLLECTION_NAME = 'holidays';

export const holidayService = {
  subscribeToHolidays(callback: (holidays: Holiday[]) => void) {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(q, (snapshot) => {
      const holidays: Holiday[] = [];
      snapshot.forEach((doc) => {
        holidays.push({ id: doc.id, ...doc.data() } as Holiday);
      });
      // Sort by date
      holidays.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      callback(holidays);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  async addHoliday(holiday: Partial<Holiday>) {
    const newRef = doc(collection(db, COLLECTION_NAME));
    await setDoc(newRef, {
      ...holiday,
      holidayId: newRef.id,
      createdAt: serverTimestamp(),
    });
  },

  async deleteHoliday(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};