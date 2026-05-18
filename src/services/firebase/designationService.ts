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

const COLLECTION_NAME = 'designations';

export interface Designation {
  id?: string;
  name: string;
  description: string;
  createdAt?: any;
}

export const designationService = {
  subscribeToDesignations(callback: (data: Designation[]) => void) {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(q, (snapshot) => {
      const items: Designation[] = [];
      snapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() } as Designation);
      });
      callback(items);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  async addDesignation(data: Partial<Designation>) {
    const newRef = doc(collection(db, COLLECTION_NAME));
    await setDoc(newRef, {
      ...data,
      createdAt: serverTimestamp(),
    });
  },

  async updateDesignation(id: string, data: Partial<Designation>) {
    const ref = doc(db, COLLECTION_NAME, id);
    await updateDoc(ref, data);
  },

  async deleteDesignation(id: string) {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  }
};