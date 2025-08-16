import { useRouter,router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image,BackHandler } from 'react-native';
import { supabase } from '../utils/supabase';
import { Subject, Student } from '../types/database';

export default function SubjectMarkAttendanceScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const { subjectName } = useLocalSearchParams<{ subjectName: string }>();
  const { studentName } = useLocalSearchParams<{ studentName: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAttendance, setMarkingAttendance] = useState(false);
  const [students, setStudents] = useState<Student[]>([]);

  const router=useRouter();
  useEffect(() => {
    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  useEffect(() => {
    if (subject) {
      fetchStudents();
    }
  }, [subject]);


  const fetchSubject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('name', subjectName)
        .single();

      if (error) {
        throw error;
      }

      setSubject(data);
    } catch (err) {
      console.error('Error fetching subject:', err);
      setError('Failed to load subject details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('username', studentName);

      if (error) {
        throw error;
      }

      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    }
  };

  const handleMarkAttendance = async () => {
    if (!subject) return;

    setMarkingAttendance(true);
    try {

      const attendanceRecords = students.map(student => ({
        name: student.username,
        roll: student.roll,
        subject: subject.name,
        semester: subject.semester.toString(),
        course: subject.course,
        status: 'present' as const,
        subject_code: subject.code,
      }));

      const { error } = await supabase
        .from('attendance')
        .insert(attendanceRecords);

      if (error) {
        throw error;
      }

      console.log('Successfully marked attendance for', attendanceRecords.length, 'students');
    } catch (err) {
      console.error('Error marking attendance:', err);
      setError('Failed to mark attendance');
    } finally {
      setMarkingAttendance(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>

      <View style={styles.card}>
        <Text style={styles.subjectName}>{subject?.name || 'Subject Name'}</Text>
        <Text style={styles.subjectId}>Subject Code: {subject?.code || 'Subject Code'}</Text>
        <Image source={require('../assets/images/Subjects.png')} style={styles.subjectImage} />

        <View style={styles.infoSection}>
          <Text style={styles.infoText}>Course: {subject?.course || 'Course'}</Text>
          <Text style={styles.infoText}>Semester: {subject?.semester || 'Semester'}</Text>
          <Text style={styles.infoText}>Status: {subject?.is_active ? 'Active' : 'Inactive'}</Text>
        </View>

        <TouchableOpacity
          style={[styles.markAttendanceButton, markingAttendance && styles.disabledButton]}
          onPress={handleMarkAttendance}
          disabled={markingAttendance}
        >
          <Text style={styles.markAttendanceButtonText}>
            {markingAttendance ? 'Loading...' : 'Mark Attendance'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f0',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    marginTop: 100,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  card: {
    width: '90%',
    height: "60%",
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  subjectName: {
    fontSize: 32,
    marginTop: 30,
    marginBottom: 20,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  subjectId: {
    fontSize: 24,
    marginBottom: 10,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  subjectImage: {
    marginTop: 30,
    marginBottom: 20,
    height: 120,
    width: 200,
  },
  infoSection: {
    marginVertical: 20,
    alignItems: 'center',
  },
  infoText: {
    fontSize: 18,
    marginBottom: 5,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  markAttendanceButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: { width: 2, height: 4 },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
  },
  markAttendanceButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  disabledButton: {
    backgroundColor: '#cccccc',
  },
});