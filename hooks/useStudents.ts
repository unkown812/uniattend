import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Student } from '../types/database';

export const useStudents = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('roll', { ascending: true });

      if (error) throw error;
      setStudents(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createStudent = async (student: Omit<Student, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .insert(student)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setStudents(prev => [...prev, data]);
      }
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create student');
    }
  };

  const updateStudent = async (id: number, updates: Partial<Student>) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setStudents(prev => prev.map(s => s.id === id ? data : s));
      }
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update student');
    }
  };

  const deleteStudent = async (id: number) => {
    try {
      const { error } = await supabase
        .from('students')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setStudents(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete student');
    }
  };

  const getStudentByRoll = async (roll: number, course: string) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('roll', roll)
        .eq('course', course)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Student not found');
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  return {
    students,
    loading,
    error,
    createStudent,
    updateStudent,
    deleteStudent,
    getStudentByRoll,
    refetch: fetchStudents,
  };
};
