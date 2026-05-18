/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { db, auth } from '../lib/firebase';
import { doc, setDoc, collection } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';

const ALL_PERMISSIONS = [
  'view_dashboard',
  'view_teachers',
  'view_attendance',
  'view_leaves',
  'view_tickets',
  'view_hierarchy',
  'view_roles',
  'view_payroll',
  'view_settings'
];

export const seedSuperAdmin = async () => {
  const adminEmail = "admin@educate.com";
  const adminPassword = "SuperSecurePassword123!";

  try {
    // 1. Create the Super Admin Role in Firestore
    const roleRef = doc(db, 'roles', 'super_admin');
    await setDoc(roleRef, {
      roleId: 'super_admin',
      name: 'Super Admin',
      description: 'Full system access',
      permissions: ALL_PERMISSIONS,
      users: 1,
      createdAt: new Date()
    });
    console.log("✅ Super Admin role created");

    // 2. Create the Auth User
    const userCredential = await createUserWithEmailAndPassword(auth, adminEmail, adminPassword);
    const uid = userCredential.user.uid;

    // 3. Create the User Profile in Firestore
    await setDoc(doc(db, 'users', uid), {
      uid: uid,
      email: adminEmail,
      name: 'Main Admin',
      role: 'Super Admin', // Must match the name in the role document
      status: 'active',
      department: 'Administration',
      createdAt: new Date(),
      avatar: ''
    });

    console.log("✅ Super Admin account created successfully!");
    console.log(`Email: ${adminEmail} | Password: ${adminPassword}`);
    
  } catch (error: any) {
    console.error("❌ Seeding failed:", error.message);
  }
};