import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Student, Teacher } from '../types/database';
import { StorageService } from '../utils/storage';

interface AuthContextType {
  user: Student | Teacher | null;
  userType: 'student' | 'teacher' | null;
  loading: boolean;
  isFirstLaunch: boolean;
  signIn: (type: 'student' | 'teacher', credentials: any) => Promise<void>;
  signOut: () => Promise<void>;
  setFirstLaunchComplete: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  loading: true,
  isFirstLaunch: true,
  signIn: async () => {},
  signOut: async () => {},
  setFirstLaunchComplete: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Student | Teacher | null>(null);
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFirstLaunch, setIsFirstLaunch] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    try {
      const firstLaunch = await StorageService.isFirstLaunch();
      setIsFirstLaunch(firstLaunch);

      // Check for existing user session
      const savedUserType = await StorageService.getUserType();
      const savedUserData = await StorageService.getUserData();
      
      if (savedUserType && savedUserData) {
        setUser(savedUserData);
        setUserType(savedUserType);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Error initializing auth:', error);
      setLoading(false);
    }
  };

  const signIn = async (type: 'student' | 'teacher', credentials: any) => {
    setLoading(true);
    try {
      if (type === 'student') {
        const { data: student, error } = await supabase
          .from('students')
          .select('*')
          .eq('roll', credentials.roll)
          .eq('course', credentials.course)
          .single();
        
        if (error || !student) {
          throw new Error('Student not found');
        }
        
        setUser(student);
        setUserType('student');
        await StorageService.saveUserData('student', student);
      } else {
        const { data: teacher, error } = await supabase
          .from('teachers')
          .select('*')
          .eq('username', credentials.username)
          .eq('password', credentials.password)
          .single();
        
        if (error || !teacher) {
          throw new Error('Invalid credentials');
        }
        
        setUser(teacher);
        setUserType('teacher');
        await StorageService.saveUserData('teacher', teacher);
      }

      if (isFirstLaunch) {
        await StorageService.setFirstLaunchComplete();
        setIsFirstLaunch(false);
      }
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setUser(null);
    setUserType(null);
    await StorageService.clearUserData();
  };

  const setFirstLaunchComplete = async () => {
    await StorageService.setFirstLaunchComplete();
    setIsFirstLaunch(false);
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      loading,
      isFirstLaunch,
      signIn,
      signOut,
      setFirstLaunchComplete,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
