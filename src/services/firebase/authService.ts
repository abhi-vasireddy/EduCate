import { auth, db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, // Added this import
  User as FirebaseUser 
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'; // Added setDoc and serverTimestamp
import { User } from '../../types';

export const authService = {
  /**
   * Logs in an existing user and retrieves their Firestore profile
   */
  async loginUser(email: string, password: string): Promise<{ user: FirebaseUser; profile: User | null }> {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;

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

  /**
   * Creates a new Authentication account and a corresponding Firestore profile
   */
  async registerUser(email: string, password: string, profileData: Partial<User>): Promise<{ user: FirebaseUser }> {
    try {
      // 1. Create the user in Firebase Authentication
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // 2. Create the profile document in Firestore 'users' collection
      const userDocRef = doc(db, 'users', user.uid);
      await setDoc(userDocRef, {
        uid: user.uid,
        email: email,
        ...profileData,
        createdAt: serverTimestamp(), // Uses Firebase server time for consistency
      });

      return { user };
    } catch (error) {
      // Handle errors like 'email-already-in-use' or 'weak-password'
      handleFirestoreError(error, OperationType.CREATE, 'users');
      throw error;
    }
  },

  async logoutUser() {
    await signOut(auth);
  },

  getCurrentUser() {
    return auth.currentUser;
  },

  /**
   * Observer for login state changes
   */
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