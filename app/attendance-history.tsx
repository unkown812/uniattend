import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '../utils/supabase';
import { Attendance, Student } from '../types/database';

interface AttendanceWithStudent extends Attendance {
  student?: Student;
}

export default function AttendanceHistoryScreen() {
  const { subjectId, subjectName } = useLocalSearchParams<{
    subjectId: string;
    subjectName: string;
  }>();

  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceWithStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);

  useEffect(() => {
    if (subjectId) {
      loadAttendanceData();
    }
  }, [subjectId]);

  const loadAttendanceData = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('subject_id', parseInt(subjectId));

      if (error) throw error;

      setAttendanceRecords(data || []);
    } catch (error) {
      console.error('Error loading attendance data:', error);
      Alert.alert('Error', 'Failed to load attendance data');
    } finally {
      setLoading(false);
    }
  };

  const renderAttendanceItem = ({ item }: { item: AttendanceWithStudent }) => (
    <View style={styles.attendanceItem}>
      <Text style={styles.studentName}>{item.student?.username || 'Unknown Student'}</Text>
      <Text style={styles.attendanceStatus}>{item.status}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4a7c59" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Attendance History for {subjectName}</Text>
      </View>

      <FlatList
        data={attendanceRecords}
        renderItem={renderAttendanceItem}
        keyExtractor={(item) => item.id.toString()}
        style={styles.attendanceList}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f0',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 20,
    backgroundColor: '#4a7c59',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'ClashDisplay',
  },
  attendanceList: {
    paddingHorizontal: 20,
  },
  attendanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  studentName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    fontFamily: 'ClashDisplay',
  },
  attendanceStatus: {
    fontSize: 14,
    color: '#666',
    fontFamily: 'ClashDisplay',
  },
});
