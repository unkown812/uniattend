import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Subject } from '../types/database';

export const useSubjects = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSubjects = async (course?: string, semester?: number) => {
    try {
      setLoading(true);
      let query = supabase.from('subjects').select('*');

      if (course) {
        query = query.eq('course', course);
      }

      if (semester) {
        query = query.eq('semester', semester);
      }

      const { data, error } = await query.order('name', { ascending: true });

      if (error) throw error;
      setSubjects(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createSubject = async (subject: Omit<Subject, 'id' | 'created_at'>) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .insert(subject)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setSubjects(prev => [...prev, data]);
      }
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to create subject');
    }
  };

  const updateSubject = async (id: number, updates: Partial<Subject>) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      if (data) {
        setSubjects(prev => prev.map(s => s.id === id ? data : s));
      }
      
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to update subject');
    }
  };

  const deleteSubject = async (id: number) => {
    try {
      const { error } = await supabase
        .from('subjects')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setSubjects(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to delete subject');
    }
  };

  const getSubjectById = async (id: number) => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err instanceof Error ? err : new Error('Subject not found');
    }
  };

  useEffect(() => {
    fetchSubjects();
  }, []);

  return {
    subjects,
    loading,
    error,
    createSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,
    fetchSubjects,
  };
};
