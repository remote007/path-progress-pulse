
import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'learner';
  interests?: string[];
  learningGoal?: string;
  weeklyTime?: number;
  progress?: Record<string, {
    completedSteps: string[];
    inProgressSteps: string[];
  }>;
  xp?: number;
  badges?: string[];
}

interface UserState {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

// Initialize the state from sessionStorage
const getInitialUser = (): User | null => {
  const storedUser = sessionStorage.getItem('user');
  if (storedUser) {
    try {
      return JSON.parse(storedUser);
    } catch (e) {
      console.error('Failed to parse user from session storage:', e);
      return null;
    }
  }
  return null;
};

export const useUserStore = create<UserState>((set) => ({
  user: getInitialUser(),
  login: (user) => {
    // Store in session storage
    sessionStorage.setItem('user', JSON.stringify(user));
    set({ user });
  },
  logout: () => {
    // Remove from session storage
    sessionStorage.removeItem('user');
    set({ user: null });
  },
}));
