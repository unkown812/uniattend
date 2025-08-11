import { Share } from 'react-native';
import * as FileSystem from 'expo-file-system';
import { supabase } from './supabase';

interface AttendanceRecord {
  student_roll: string;
  student_name: string;
  date: string;
  status: string;
  subject_name?: string;
}

export class CSVExportService {
  static async exportLectureAttendance(subjectId: string, lectureDate: string) {
    try {
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students!inner(username, roll),
          subjects!inner(name)
        `)
        .eq('date', lectureDate)
        .eq('subject', subjectId)
        .order('students(roll)', { ascending: true });

      if (error) throw error;

      const records = data.map(record => ({
        student_roll: record.students.roll,
        student_name: record.students.username,
        date: record.date,
        status: record.status === 'present' ? 'Present' : 'Absent',
        subject_name: record.subjects.name
      }));

      return this.generateCSV(records, `Lecture_${lectureDate}`);
    } catch (error) {
      console.error('Error exporting lecture attendance:', error);
      throw error;
    }
  }

  static async exportMonthlyAttendance(subjectId: string, month: string, year: string) {
    try {
      const startDate = `${year}-${month}-01`;
      const endDate = `${year}-${month}-31`;
      
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students!inner(username, roll),
          subjects!inner(name)
        `)
        .eq('subject', subjectId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('students(roll)', { ascending: true });

      if (error) throw error;

      const records = data.map(record => ({
        student_roll: record.students.roll,
        student_name: record.students.username,
        date: record.date,
        status: record.status === 'present' ? 'Present' : 'Absent',
        subject_name: record.subjects.name
      }));

      return this.generateCSV(records, `Monthly_${year}_${month}`);
    } catch (error) {
      console.error('Error exporting monthly attendance:', error);
      throw error;
    }
  }

  static async exportYearlyAttendance(subjectId: string, year: string) {
    try {
      const startDate = `${year}-01-01`;
      const endDate = `${year}-12-31`;
      
      const { data, error } = await supabase
        .from('attendance')
        .select(`
          *,
          students!inner(username, roll),
          subjects!inner(name)
        `)
        .eq('subject_id', subjectId)
        .gte('date', startDate)
        .lte('date', endDate)
        .order('date', { ascending: true })
        .order('students(roll)', { ascending: true });

      if (error) throw error;

      const records = data.map(record => ({
        student_roll: record.students.roll,
        student_name: record.students.username,
        date: record.date,
        status: record.status === 'present' ? 'Present' : 'Absent',
        subject_name: record.subjects.name
      }));

      return this.generateCSV(records, `Yearly_${year}`);
    } catch (error) {
      console.error('Error exporting yearly attendance:', error);
      throw error;
    }
  }

  private static generateCSV(records: AttendanceRecord[], filename: string): string {
    if (records.length === 0) {
      throw new Error('No attendance records found');
    }

    const headers = ['Roll Number', 'Student Name', 'Date', 'Status', 'Subject'];
    const csvContent = [
      headers.join(','),
      ...records.map(record => [
        record.student_roll,
        `"${record.student_name}"`,
        record.date,
        record.status,
        `"${record.subject_name || 'N/A'}"`
      ].join(','))
    ].join('\n');

    return csvContent;
  }

  static async shareCSV(csvContent: string, filename: string) {
    try {
      const fileName = `${filename}_attendance.csv`;
      const filePath = `${FileSystem.documentDirectory}${fileName}`;
      
      await FileSystem.writeAsStringAsync(filePath, csvContent);
      
      await Share.share({
        title: 'Attendance Report',
        message: `Attendance report for ${filename}`,
        url: filePath,
      });
    } catch (error) {
      console.error('Error sharing CSV:', error);
      throw error;
    }
  }
}