import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, FlatList, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { Student } from '../types/database';

export default function MarkAttendanceStudentsScreen() {
  const { subjectId, subjectName, course, semester } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
    course: string;
    semester: string;
  }>();

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<number>>(new Set());
  const [savingAttendance, setSavingAttendance] = useState(false);

  useEffect(() => {
    if (subjectId && course && semester) {
      fetchStudents();
    }
  }, [subjectId, course, semester]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .eq('course', course)
        .eq('sem', parseInt(semester))
        .order('roll', { ascending: true });

      if (error) {
        throw error;
      }

      setStudents(data || []);
    } catch (err) {
      console.error('Error fetching students:', err);
      setError('Failed to load students');
    } finally {
      setLoading(false);
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
    if (!subjectId || !subjectName || !course || !semester) {
      Alert.alert('Error', 'Missing required information');
      return;
    }

    setSavingAttendance(true);
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const attendanceRecords = students.map(student => ({
        name: student.username,
        roll: student.roll,
        subject: subjectName,
        semester: semester,
        course: course,
        date: today,
        status: selectedStudents.has(student.id) ? 'present' as const : 'absent' as const,
        student_id: student.id,
        subject_id: parseInt(subjectId)
      }));

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
      <Text style={styles.subtitle}>{subjectName}</Text>
      
      <View style={styles.header}>
        <Text style={styles.headerText}>Course: {course}</Text>
        <Text style={styles.headerText}>Semester: {semester}</Text>
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
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
    textAlign: 'center',
    marginTop: 50,
    marginBottom: 10,
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
  disabledButton: {
    backgroundColor: '#cccccc',
  },
  errorText: {
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
    marginTop: 50,
  },
});
