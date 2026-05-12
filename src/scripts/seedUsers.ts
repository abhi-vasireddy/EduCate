import { auth, db } from '../lib/firebase';
import { createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { Role } from '../types';

export const TEST_USERS = [
  {
    email: 'superadmin@school.com',
    password: 'SuperAdmin@123',
    profile: {
      name: 'Super Admin',
      role: 'super_admin' as Role,
      department: 'Management',
      status: 'Active',
      employeeId: 'SA-001',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=SuperAdmin'
    }
  },
  {
    email: 'admin@school.com',
    password: 'Admin@123',
    profile: {
      name: 'Admin User',
      role: 'admin' as Role,
      department: 'Administration',
      status: 'Active',
      employeeId: 'AD-001',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Admin'
    }
  },
  {
    email: 'hr@school.com',
    password: 'HR@123',
    profile: {
      name: 'HR Manager',
      role: 'hr' as Role,
      department: 'Human Resources',
      status: 'Active',
      employeeId: 'HR-001',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=HR'
    }
  },
  {
    email: 'manager@school.com',
    password: 'Manager@123',
    profile: {
      name: 'Department Manager',
      role: 'manager' as Role,
      department: 'Science',
      status: 'Active',
      employeeId: 'MG-001',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Manager'
    }
  },
  {
    email: 'teacher1@school.com',
    password: 'Teacher@123',
    profile: {
      name: 'Teacher One',
      role: 'teacher' as Role,
      department: 'Science',
      status: 'Active',
      employeeId: 'TC-001',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Teacher1'
    }
  },
  {
    email: 'teacher2@school.com',
    password: 'Teacher@123',
    profile: {
      name: 'Teacher Two',
      role: 'teacher' as Role,
      department: 'Mathematics',
      status: 'Active',
      employeeId: 'TC-002',
      avatar: 'https://api.dicebear.com/7.x/notionists/svg?seed=Teacher2'
    }
  }
];

export async function seedTestUsers() {
  console.log('Starting to seed test users...');
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const testUser of TEST_USERS) {
    try {
      // Create auth user
      const userCredential = await createUserWithEmailAndPassword(auth, testUser.email, testUser.password);
      const uid = userCredential.user.uid;

      // Create firestore profile
      const userRef = doc(db, 'users', uid);
      const userDoc = await getDoc(userRef);

      if (!userDoc.exists()) {
        await setDoc(userRef, {
          uid,
          ...testUser.profile,
          email: testUser.email,
          createdAt: serverTimestamp()
        });
      }
      console.log(`✅ Created user: ${testUser.email}`);
      successCount++;
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        console.log(`ℹ️ Skipped (already exists): ${testUser.email}`);
        skipCount++;
      } else {
        console.error(`❌ Error creating ${testUser.email}:`, error);
        errorCount++;
      }
    }
  }

  // Ensure everyone gets logged out after seeding
  try {
    await signOut(auth);
  } catch (e) {
    // Ignore sign out error
  }

  console.log(`Seeding complete. Success: ${successCount}, Skipped: ${skipCount}, Errors: ${errorCount}`);
  return { successCount, skipCount, errorCount };
}
