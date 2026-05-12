import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, doc, setDoc, updateDoc, deleteDoc, onSnapshot, query, serverTimestamp, getDoc } from 'firebase/firestore';
import { Teacher } from '../../types';

export const teacherService = {
  subscribeToTeachers(callback: (teachers: Teacher[]) => void) {
    const q = query(collection(db, 'teachers'));
    return onSnapshot(q, (snapshot) => {
      const teachers: Teacher[] = [];
      snapshot.forEach((doc) => {
        teachers.push({ 
          id: doc.id,
          teacherId: doc.id,
          ...doc.data() 
        } as Teacher);
      });
      callback(teachers);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'teachers');
    });
  },

  async addTeacher(teacher: Partial<Teacher>) {
    try {
      const newRef = doc(collection(db, 'teachers'));
      const teacherData = {
        teacherId: newRef.id,
        ...teacher,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      await setDoc(newRef, teacherData);
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'teachers');
      throw error;
    }
  },

  async updateTeacher(id: string, updates: Partial<Teacher>) {
    try {
      const ref = doc(db, 'teachers', id);
      await updateDoc(ref, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `teachers/${id}`);
      throw error;
    }
  },

  async deleteTeacher(id: string) {
    try {
      const ref = doc(db, 'teachers', id);
      await deleteDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `teachers/${id}`);
      throw error;
    }
  }
};
