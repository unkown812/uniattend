import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Alert, FlatList } from 'react-native';
import { supabase } from '../utils/supabase';
import { Subject, Student } from '../types/database';
import { useAuth } from '../context/AuthContext';

export default function SubjectMarkAttendanceScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [savingAttendance, setSavingAttendance] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

  const fetchSubject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .single();

      if (error) {
        throw error;
      }

      setSubject(data);
      
      // Fetch students for this subject
      if (data) {
        fetchStudents(data.course, data.semester);
      }
    } catch (err) {
      console.error('Error fetching subject:', err);
      setError('Failed to load subject details');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async (course: string, semester: number) => {
    try {
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('course', course)
        .eq('sem', semester)
        .order('roll', { ascending: true });

      if (error) {
        throw error;
      }

      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    }
  };

  const toggleStudentSelection = (studentId: number) => {
    setSelectedStudents(prev => {
      const newSet = new Set(prev);
      if (newSet.has(studentId)) {
        newSet.delete(studentId);
      } else {
        newSet.add(studentId);
      }
      return newSet;
    });
  };

  const saveAttendance = async () => {
    if (!subject || selectedStudents.size === 0) {
      Alert.alert('Error', 'Please select at least one student');
      return;
    }

    setSavingAttendance(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const attendanceRecords = Array.from(selectedStudents).map(studentId => {
        const student = students.find(s => s.id === studentId);
        return {
          name: student?.username || '',
          roll: student?.roll || 0,
          subject: subject.name,
          semester: subject.semester.toString(),
          course: subject.course,
          date: today,
          status: 'present',
        };
      });

      const { error } = await supabase
        .from('attendance')
        .insert(attendanceRecords);

      if (error) {
        throw error;
      }

      Alert.alert('Success', 'Attendance saved successfully', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } catch (err) {
      console.error('Error saving attendance:', err);
      Alert.alert('Error', 'Failed to save attendance');
    } finally {
      setSavingAttendance(false);
    }
  };

  const renderStudent = ({ item }: { item: Student }) => (
    <TouchableOpacity
      style={[
        styles.studentItem,
        selectedStudents.has(item.id) && styles.selectedStudent
      ]}
      onPress={() => toggleStudentSelection(item.id)}
    >
      <View style={styles.studentInfo}>
        <Text style={styles.studentName}>{item.username}</Text>
        <Text style={styles.studentRoll}>Roll: {item.roll}</Text>
      </View>
      <View style={[
        styles.checkbox,
        selectedStudents.has(item.id) && styles.checkboxSelected
      ]}>
        {selectedStudents.has(item.id) && (
          <Text style={styles.checkmark}>✓</Text>
        )}
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a7c59" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mark Attendance</Text>
      <Text style={styles.subtitle}>{subject?.name || 'Subject Name'}</Text>

      <View style={styles.header}>
        <Text style={styles.headerText}>Course: {subject?.course || 'Course'}</Text>
        <Text style={styles.headerText}>Semester: {subject?.semester || 'Semester'}</Text>
      </View>

      <FlatList
        data={students}
        renderItem={renderStudent}
        keyExtractor={(item) => item.id.toString()}
        style={styles.studentList}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.footer}>
        <Text style={styles.selectionText}>
          Selected: {selectedStudents.size} / {students.length}
        </Text>
        <TouchableOpacity
          style={[styles.saveButton, savingAttendance && styles.disabledButton]}
          onPress={saveAttendance}
          disabled={savingAttendance}
        >
          <Text style={styles.saveButtonText}>
            {savingAttendance ? 'Saving...' : 'Save Attendance'}
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
  subtitle: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
    textAlign: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingHorizontal: 10,
  },
  headerText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  studentList: {
    flex: 1,
    marginBottom: 20,
  },
  studentItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    marginVertical: 5,
    backgroundColor: '#a9cbb7',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
  },
  selectedStudent: {
    backgroundColor: '#4a7c59',
  },
  studentInfo: {
    flex: 1,
  },
  studentName: {
    fontSize: 18,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  studentRoll: {
    fontSize: 14,
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  checkbox: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#4a7c59',
    borderColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  selectionText: {
    fontSize: 16,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  saveButtonText: {
    fontSize: 20,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});