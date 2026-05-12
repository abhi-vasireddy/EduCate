import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { User } from '../../types';

const COLLECTION_NAME = 'users';

export const userService = {
  async getUser(uid: string): Promise<User | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, uid: docSnap.id, ...docSnap.data() } as User;
      }
      return null;
    } catch (error) {
      handleFirestoreError(error, OperationType.GET, COLLECTION_NAME);
      throw error;
    }
  },

  async getAllUsers(): Promise<User[]> {
    try {
      const q = query(collection(db, COLLECTION_NAME));
      const querySnapshot = await getDocs(q);
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, uid: doc.id, ...doc.data() } as User);
      });
      return users;
    } catch (error) {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
      throw error;
    }
  },

  async createUser(uid: string, data: Omit<User, 'id' | 'uid'>): Promise<void> {
    try {
      await setDoc(doc(db, COLLECTION_NAME, uid), {
        uid,
        ...data,
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      throw error;
    }
  },

  async updateUser(uid: string, data: Partial<User>): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, uid);
      await updateDoc(docRef, data);
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, COLLECTION_NAME);
      throw error;
    }
  },

  async deleteUser(uid: string): Promise<void> {
    try {
      await deleteDoc(doc(db, COLLECTION_NAME, uid));
    } catch (error) {
      handleFirestoreError(error, OperationType.DELETE, COLLECTION_NAME);
      throw error;
    }
  },
  
  subscribeToUsers(callback: (users: User[]) => void) {
    const q = query(collection(db, COLLECTION_NAME));
    return onSnapshot(q, (querySnapshot) => {
      const users: User[] = [];
      querySnapshot.forEach((doc) => {
        users.push({ id: doc.id, uid: doc.id, ...doc.data() } as User);
      });
      callback(users);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  }
};
