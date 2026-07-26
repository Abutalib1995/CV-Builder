import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile,
  User
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  getDocs, 
  deleteDoc, 
  collection, 
  query, 
  orderBy, 
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { CVData } from '../types';

// Initialize Firebase App
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Google Auth Provider
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Ensure user record created in Firestore (swallow firestore error if rules not set up yet)
    if (result.user) {
      try {
        await setDoc(doc(db, 'users', result.user.uid), {
          email: result.user.email,
          displayName: result.user.displayName || 'User',
          photoURL: result.user.photoURL || '',
          lastLogin: serverTimestamp()
        }, { merge: true });
      } catch (dbErr) {
        console.warn("Firestore profile creation warning:", dbErr);
      }
    }
    return { user: result.user, error: null };
  } catch (error: any) {
    console.error("Google Auth error:", error);
    let msg = error.message || 'Google sign in failed.';
    if (error.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      msg = `এই ডোমেইনটি (${currentHost}) আপনার Firebase Console-এ Authorized Domain হিসেবে যুক্ত নেই। Firebase Console > Authentication > Settings > Authorized domains এ ডোমেইনটি যোগ করুন।`;
    }
    return { user: null, error: msg };
  }
};

// Sign up with Email and Password
export const registerWithEmail = async (name: string, email: string, pass: string) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, pass);
    if (res.user) {
      await updateProfile(res.user, { displayName: name });
      await setDoc(doc(db, 'users', res.user.uid), {
        email,
        displayName: name,
        createdAt: serverTimestamp()
      }, { merge: true });
    }
    return { user: res.user, error: null };
  } catch (error: any) {
    let msg = error.message;
    if (error.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      msg = `এই ডোমেইনটি (${currentHost}) আপনার Firebase Console-এ Authorized Domain হিসেবে যুক্ত নেই। Firebase Console > Authentication > Settings > Authorized domains এ ডোমেইনটি যোগ করুন।`;
    } else if (error.code === 'auth/email-already-in-use') {
      msg = 'এই ইমেইলটি ইতিমধ্যেই ব্যবহার করা হয়েছে (Email already in use).';
    } else if (error.code === 'auth/weak-password') {
      msg = 'পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে (Password should be at least 6 characters).';
    } else if (error.code === 'auth/invalid-email') {
      msg = 'সঠিক ইমেইল ঠিকানা দিন (Invalid email format).';
    }
    return { user: null, error: msg };
  }
};

// Login with Email and Password
export const loginWithEmail = async (email: string, pass: string) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, pass);
    return { user: res.user, error: null };
  } catch (error: any) {
    let msg = error.message;
    if (error.code === 'auth/unauthorized-domain') {
      const currentHost = typeof window !== 'undefined' ? window.location.hostname : '';
      msg = `এই ডোমেইনটি (${currentHost}) আপনার Firebase Console-এ Authorized Domain হিসেবে যুক্ত নেই। Firebase Console > Authentication > Settings > Authorized domains এ ডোমেইনটি যোগ করুন।`;
    } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      msg = 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে (Invalid email or password).';
    }
    return { user: null, error: msg };
  }
};

// Logout
export const logoutUser = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

// Save current CV to Cloud (Firestore NoSQL)
export const saveCVToCloud = async (userId: string, cvData: CVData, title: string = 'My CV') => {
  try {
    const cvDocRef = doc(db, 'users', userId, 'cvs', 'current_cv');
    await setDoc(cvDocRef, {
      title,
      data: cvData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Cloud save failed:", error);
    let errMsg = error.message || 'Unknown error';
    if (error.code === 'permission-denied' || errMsg.includes('insufficient permissions')) {
      errMsg = 'Firebase Console-এ Firestore Security Rules এর কারণে অনুমতি পাওয়া যাচ্ছে না (Permission Denied)। Firebase Console > Firestore Database > Rules-এ গিয়ে রুলস আপডেট করুন।';
    }
    return { success: false, error: errMsg };
  }
};

// Load CV from Cloud
export const loadCVFromCloud = async (userId: string): Promise<CVData | null> => {
  try {
    const cvDocRef = doc(db, 'users', userId, 'cvs', 'current_cv');
    const docSnap = await getDoc(cvDocRef);
    if (docSnap.exists()) {
      return docSnap.data().data as CVData;
    }
    return null;
  } catch (error: any) {
    console.error("Cloud load failed:", error);
    return null;
  }
};

export interface SavedCVItem {
  id: string;
  title: string;
  data: CVData;
  updatedAt?: any;
  createdAt?: any;
}

// Get all saved CV versions for a user
export const getUserCVs = async (userId: string): Promise<SavedCVItem[]> => {
  try {
    const cvsRef = collection(db, 'users', userId, 'cvs');
    const q = query(cvsRef, orderBy('updatedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const cvList: SavedCVItem[] = [];
    querySnapshot.forEach((docSnap) => {
      const d = docSnap.data();
      cvList.push({
        id: docSnap.id,
        title: d.title || 'Untitled CV',
        data: d.data,
        updatedAt: d.updatedAt,
        createdAt: d.createdAt
      });
    });
    return cvList;
  } catch (error: any) {
    console.error("Failed to fetch user CVs:", error);
    return [];
  }
};

// Save or Update a specific CV version document
export const saveCVVersion = async (userId: string, cvId: string, title: string, cvData: CVData) => {
  try {
    const cvDocRef = doc(db, 'users', userId, 'cvs', cvId);
    await setDoc(cvDocRef, {
      title,
      data: cvData,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Save CV version failed:", error);
    return { success: false, error: error.message };
  }
};

// Delete a CV version document
export const deleteCVVersion = async (userId: string, cvId: string) => {
  try {
    const cvDocRef = doc(db, 'users', userId, 'cvs', cvId);
    await deleteDoc(cvDocRef);
    return { success: true, error: null };
  } catch (error: any) {
    console.error("Delete CV version failed:", error);
    return { success: false, error: error.message };
  }
};

export { onAuthStateChanged };
export type { User };
