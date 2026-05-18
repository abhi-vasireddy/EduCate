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
import { Role } from '../../types';

const COLLECTION_NAME = 'roles';

export const roleService = {
  /**
   * Listens to real-time updates from the 'roles' collection.
   */
  subscribeToRoles(callback: (roles: Role[]) => void) {
    const q = query(collection(db, COLLECTION_NAME));
    
    return onSnapshot(q, (snapshot) => {
      const roles: Role[] = [];
      snapshot.forEach((doc) => {
        const data = doc.data();
        roles.push({ 
          ...data,
          id: doc.id, // CRITICAL: This is the Firestore Document ID used for updates/deletes
          roleId: data.roleId || doc.id, 
        } as Role);
      });
      callback(roles);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, COLLECTION_NAME);
    });
  },

  /**
   * Adds a new role to Firestore.
   */
  async addRole(role: Partial<Role>) {
    try {
      // Create a new document reference with an auto-generated ID
      const newRef = doc(collection(db, COLLECTION_NAME));
      
      const roleData = {
        ...role,
        roleId: newRef.id, 
        designation: role.designation || '',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        users: role.users || 0,
        permissions: role.permissions || [] 
      };

      await setDoc(newRef, roleData);
      return newRef.id;
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, COLLECTION_NAME);
      throw error;
    }
  },

  /**
   * Updates an existing role (Name, Description, Designation, or Permissions).
   * @param id - The Firestore document ID (role.id)
   * @param role - The partial data to update
   */
  async updateRole(id: string, role: Partial<Role>) {
    try {
      // Create a reference to the EXISTING document using its ID
      const ref = doc(db, COLLECTION_NAME, id);
      
      // updateDoc only modifies the fields provided in the 'role' object
      await updateDoc(ref, {
        ...role,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `${COLLECTION_NAME}/${id}`);
      throw error;
    }
  },
  
  /**
   * Deletes a role from Firestore.
   */
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