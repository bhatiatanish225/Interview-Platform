import { create } from 'zustand';
import { Profile } from '../types';
import { supabase } from '../lib/supabase';

type UserRole = 'admin' | 'user'

interface AuthState {
  isAuthenticated: boolean;
  role: UserRole | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const CREDENTIALS = {
  admin: {
    email: 'admin@example.com',
    password: 'admin123'
  },
  user: {
    email: 'user@example.com',
    password: 'user123'
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  role: null,
  login: (email: string, password: string) => {
    // Check admin credentials
    if (email === CREDENTIALS.admin.email && password === CREDENTIALS.admin.password) {
      set({ isAuthenticated: true, role: 'admin' })
      return true
    }
    // Check user credentials
    if (email === CREDENTIALS.user.email && password === CREDENTIALS.user.password) {
      set({ isAuthenticated: true, role: 'user' })
      return true
    }
    return false
  },
  logout: () => {
    set({ isAuthenticated: false, role: null })
  }
}));