import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { signInWithEmailAndPassword, signOut, onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { User } from '../../types';

export const authService = {
  async loginUser(email: string, password: string): Promise<{ user: FirebaseUser; profile: User | null }> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // Check if user profile exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      let profile: User | null = null;
      if (userDoc.exists()) {
        profile = { id: userDoc.id, ...userDoc.data() } as User;
      } else {
        throw new Error('User profile not found in database. Contact administrator.');
      }

      return { user, profile };
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'users');
      throw error;
    }
  },

  async logoutUser() {
    await signOut(auth);
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  listenToAuthChanges(callback: (user: FirebaseUser | null, profile: User | null) => void) {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          let profile: User | null = null;
          if (userDoc.exists()) {
            profile = { id: userDoc.id, ...userDoc.data() } as User;
          }
          callback(user, profile);
        } catch (error) {
          console.error("Error fetching user profile", error);
          callback(user, null);
        }
      } else {
        callback(null, null);
      }
    });
  }
};
