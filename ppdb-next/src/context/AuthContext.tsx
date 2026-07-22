'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';

interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string; role?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: async () => ({ success: false, role: '' }),
  register: async () => ({ success: false }),
  logout: () => {},
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (auth.currentUser?.uid === firebaseUser.uid && userDoc.exists()) {
          const data = userDoc.data();
          setUser({ id: firebaseUser.uid, name: data.name, email: firebaseUser.email!, role: data.role });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    return unsub;
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const userDoc = await getDoc(doc(db, 'users', cred.user.uid));
      const role = userDoc.exists() ? userDoc.data().role : 'pendaftar';
      setUser({ id: cred.user.uid, name: cred.user.displayName || '', email: cred.user.email!, role });
      return { success: true, role };
    } catch (err: any) {
      const msg =
        err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password' || err.code === 'auth/invalid-credential'
          ? 'Email atau password salah'
          : err.code === 'auth/too-many-requests'
          ? 'Terlalu banyak percobaan. Coba lagi nanti'
          : 'Gagal masuk. Periksa koneksi Anda';
      return { success: false, message: msg };
    }
  }, []);

  const register = useCallback(async (name: string, email: string, password: string) => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, 'users', cred.user.uid), {
        name,
        email,
        role: 'pendaftar',
        createdAt: serverTimestamp(),
      });
      await signOut(auth);
      setUser(null);
      return { success: true };
    } catch (err: any) {
      const msg =
        err.code === 'auth/email-already-in-use'
          ? 'Email sudah terdaftar'
          : err.code === 'auth/weak-password'
          ? 'Password minimal 6 karakter'
          : 'Gagal mendaftar. Periksa koneksi Anda';
      return { success: false, message: msg };
    }
  }, []);

  const logout = useCallback(() => {
    signOut(auth);
    setUser(null);
    window.location.href = '/';
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
