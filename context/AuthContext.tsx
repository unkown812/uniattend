import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../utils/supabase';
import { Student, Teacher } from '../types/database';

interface AuthContextType {
  user: Student | Teacher | null;
  userType: 'student' | 'teacher' | null;
  loading: boolean;
  signIn: (type: 'student' | 'teacher', credentials: any) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  userType: null,
  loading: true,
  signIn: async () => {},
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<Student | Teacher | null>(null);
  const [userType, setUserType] = useState<'student' | 'teacher' | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      setLoading(false);
    } catch (error) {
      console.error('Error checking user:', error);
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
  };

  return (
    <AuthContext.Provider value={{
      user,
      userType,
      loading,
      signIn,
      signOut,
    }}>
      {children}
    </AuthContext.Provider>
  );
};
