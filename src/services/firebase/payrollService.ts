import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, doc, setDoc, updateDoc, onSnapshot, query, serverTimestamp } from 'firebase/firestore';
import { PayrollRecord } from '../../types';

export const payrollService = {
  subscribeToPayroll(callback: (records: PayrollRecord[]) => void) {
    const q = query(collection(db, 'payroll'));
    return onSnapshot(q, (snapshot) => {
      const records: PayrollRecord[] = [];
      snapshot.forEach((doc) => {
        records.push({ 
          id: doc.id,
          payrollId: doc.id,
          ...doc.data() 
        } as PayrollRecord);
      });
      callback(records);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'payroll');
    });
  },

  async addRecord(record: Partial<PayrollRecord>) {
    try {
      const newRef = doc(collection(db, 'payroll'));
      await setDoc(newRef, {
        payrollId: newRef.id,
        ...record,
        generatedAt: serverTimestamp(),
      });
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'payroll');
      throw error;
    }
  },

  async updateRecordStatus(id: string, status: string, paidOn?: string) {
    try {
      const ref = doc(db, 'payroll', id);
      await updateDoc(ref, {
        status,
        ...(paidOn ? { paidOn } : {}),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `payroll/${id}`);
      throw error;
    }
  }
};
