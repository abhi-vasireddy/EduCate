import { collection, doc, setDoc, updateDoc, onSnapshot, query, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { Role } from '../../types';

const COLLECTION_NAME = 'roles';

export const roleService = {
  subscribeToRoles(callback: (roles: Role[]) => void) {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(q, (snapshot) => {
      const roles: Role[] = [];
      snapshot.forEach((doc) => {
        roles.push({ 
          id: doc.id,
          roleId: doc.id,
          ...doc.data() 
        } as Role);
      });
      callback(roles);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  async addRole(role: Partial<Role>) {
    try {
      const newRef = doc(collection(db, COLLECTION_NAME));
      await setDoc(newRef, {
        roleId: newRef.id,
        ...role,
        createdAt: serverTimestamp(),
      });
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      throw error;
    }
  },

  async updateRole(id: string, role: Partial<Role>) {
    try {
      const ref = doc(db, COLLECTION_NAME, id);
      await updateDoc(ref, {
        ...role,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
      throw error;
    }
  },
  
  async deleteRole(id: string) {
    try {
      const ref = doc(db, COLLECTION_NAME, id);
      await deleteDoc(ref);
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, `${COLLECTION_NAME}/${id}`);
      throw error;
    }
  }
};
