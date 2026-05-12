import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import fallbackConfig from '../../firebase-applet-config.json';

const getFirebaseConfig = () => {
  const metaEnv = (import.meta as any).env || process.env;
  
  const envConfig = {
    apiKey: metaEnv.VITE_FIREBASE_API_KEY,
    authDomain: metaEnv.VITE_FIREBASE_AUTH_DOMAIN,
    projectId: metaEnv.VITE_FIREBASE_PROJECT_ID,
    storageBucket: metaEnv.VITE_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: metaEnv.VITE_FIREBASE_MESSAGING_SENDER_ID,
    appId: metaEnv.VITE_FIREBASE_APP_ID,
  };

  // If ANY env var is completely missing (or empty), try fallback config.
  // We prefer envConfig if the user specifically populated it.
  const config = { ...fallbackConfig };
  
  if (envConfig.apiKey && envConfig.apiKey.trim() !== '' && envConfig.apiKey !== 'YOUR_API_KEY') {
    config.apiKey = envConfig.apiKey.trim();
  }
  if (envConfig.authDomain && envConfig.authDomain.trim() !== '') config.authDomain = envConfig.authDomain;
  if (envConfig.projectId && envConfig.projectId.trim() !== '') config.projectId = envConfig.projectId;
  if (envConfig.storageBucket && envConfig.storageBucket.trim() !== '') config.storageBucket = envConfig.storageBucket;
  if (envConfig.messagingSenderId && envConfig.messagingSenderId.trim() !== '') config.messagingSenderId = envConfig.messagingSenderId;
  if (envConfig.appId && envConfig.appId.trim() !== '') config.appId = envConfig.appId;

  console.log("Firebase Init DEBUG: ", { 
    envKeyLength: envConfig.apiKey?.length,
    fallbackKeyLength: fallbackConfig.apiKey?.length,
    finalKeyLength: config.apiKey?.length,
    isFinalKeyUndefined: config.apiKey === undefined
  });

  return config;
};

const firebaseConfig = getFirebaseConfig();
const app = initializeApp(firebaseConfig);

// CRITICAL: Ensure firestoreDatabaseId is supplied to getFirestore
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || (fallbackConfig as any).firestoreDatabaseId);

export const auth = getAuth(app);
export const storage = getStorage(app);

// Error handling helper
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo:
        auth.currentUser?.providerData?.map((provider) => ({
          providerId: provider.providerId,
          email: provider.email,
        })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}
