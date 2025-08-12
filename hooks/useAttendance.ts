import { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Attendance } from '../types/database';

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAttendance = async (filters?: {
    subjectId?: string;
    course?: string;
    semester?: number;
    date?: string;
  }) => {
    try {
      setLoading(true);
      let query = supabase.from('attendance').select('*');

      if (filters?.subjectId) {
        query = query.eq('subject_id', filters.subjectId);
      }

      if (filters?.course) {
        query = query.eq('course', filters.course);
      }

      if (filters?.semester) {
        query = query.eq('semester', filters.semester);
      }

      if (filters?.date) {
        query = query.eq('created_at', filters.date);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setAttendance(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const markAttendance = async (attendanceData: Omit<Attendance, 'id'>) => {
    try {
      // Check if attendance already exists for this student/subject/date
      const { data: existing, error: checkError } = await supabase
        .from('attendance')
        .select('*')
        .eq('subject_code', attendanceData.subject_code)
        .eq('created_at', attendanceData.created_at)
        .single();

      if (existing) {
        const { data, error } = await supabase
          .from('attendance')
          .update({ status: attendanceData.status })
          .eq('id', existing.id)
          .select()
          .single();

        if (error) throw error;
        
        if (data) {
          setAttendance(prev => prev.map(a => a.id === data.id ? data : a));
        }
        
        return data;
      } else {
        // Create new record
        const { data, error } = await supabase
          .from('attendance')
          .insert(attendanceData)
          .select()
          .single();

        if (error) throw error;
        
        if (data) {
          setAttendance(prev => [data, ...prev]);
        }
        
        return data;
      }
    } catch (err) {
      throw err instanceof Error ? err : new Error('Failed to mark attendance');
    }
  };

  const getAttendanceStats = async (subjectId: number, course: string, semester: number) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('subject_code', subjectId)
        .eq('course', course)
        .eq('semester', semester);

      if (error) throw error;

      const stats = {
        total: data?.length || 0,
        present: data?.filter(a => a.status === 'present').length || 0,
        absent: data?.filter(a => a.status === 'absent').length || 0,
        late: data?.filter(a => a.status === 'late').length || 0,
      };

      return stats;
    } catch (err) {
      throw err instanceof Error ? err.message : 'An error occurred';
    }
  };

  const exportAttendance = async (subjectId: number, course: string, semester: number) => {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('subject_code', subjectId)
        .eq('course', course)
        .eq('semester', semester)
        .order('date', { ascending: true });

      if (error) throw error;
      return data || [];
    } catch (err) {
      throw err instanceof Error ? err.message : 'An error occurred';
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  return {
    attendance,
    loading,
    error,
    markAttendance,
    getAttendanceStats,
    exportAttendance,
    fetchAttendance,
  };
};
