import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Attendance } from '../types/database';
import { useLocalSearchParams } from 'expo-router';

export default function StudentsScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string}>();
  const [attendanceRecords, setAttendanceRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId) {
      fetchAttendanceRecords();
    }
  }, [subjectId]);

  const fetchAttendanceRecords = async () => {
    try {
      setLoading(true);
      // console.log('Fetching attendance for subjectId:', subjectId);

      // if (!subjectId || subjectId === 'undefined') {
      //   console.log('No valid subjectId provided');
      //   setAttendanceRecords([]);
      //   return;
      // }

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('subject_code', subjectId)

      // const { data, error } = await query.order('created_at', { ascending: true });

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} attendance records`);
      setAttendanceRecords(data || []);

    } catch (err) {
      // setError(err instanceof Error ? err.message : 'Failed to fetch attendance records');
      console.error('Error fetching attendance:', err);
    } finally {
      setLoading(false);
    }
  };


  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'present':
        return { color: '#4caf50', fontWeight: 'bold' as const };
      case 'absent':
        return { color: '#f44336', fontWeight: 'bold' as const };
      case 'late':
        return { color: '#ff9800', fontWeight: 'bold' as const };
      default:
        return { color: '#666', fontWeight: 'bold' as const };
    }
  };

  const AttendanceTable = () => (
    <ScrollView>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Date</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Name</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Roll</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Status</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Subject</Text>
        </View>
        {attendanceRecords.map((record) => (
          <View key={record.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>
              {new Date(record.created_at).toLocaleDateString()}
            </Text>
            <Text style={styles.tableCell}>{record.name}</Text>
            <Text style={styles.tableCell}>{record.roll}</Text>
            <Text style={[styles.tableCell, getStatusStyle(record.status)]}>
              {record.status.toUpperCase()}
            </Text>
            <Text style={styles.tableCell}>{record.subject}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4a7c59" />
        <Text style={styles.loadingText}>Loading attendance records...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchAttendanceRecords}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Attendance Records</Text>
      <Text style={styles.subtitle}>Subject: {subjectId || 'All Subjects'}</Text>

      {attendanceRecords.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No attendance records found</Text>
          <Text style={styles.debugText}>Subject ID: {subjectId}</Text>
          
        </View>
      ) : (
        <AttendanceTable />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f0',
    borderRadius: 20,
    padding: 20,
  },
  title: {
    marginTop: 60,
    fontSize: 52,
    color: '#000',
    fontWeight: '400',
    fontFamily: "ClashDisplay",
  },
  subtitle: {
    fontSize: 21,
    color: '#555',
    marginBottom: 20,
    fontWeight: '400',
    fontFamily: "ClashDisplay",
  },
  centerContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#4a7c59',
    marginTop: 10,
    fontFamily: "ClashDisplay",
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    fontFamily: "ClashDisplay",
  },
  retryButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  retryButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: "ClashDisplay",
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 50,
    fontFamily: "ClashDisplay",
  },
  tableContainer: {
    flex: 1,
    marginVertical: 10,
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#4a7c59',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  tableCell: {
    padding: 10,
    fontSize: 14,
    textAlign: 'center',
    minWidth: 135,
    fontFamily: "ClashDisplay",
  },
  tableHeaderText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  debugText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#999',
    marginTop: 10,
    fontFamily: "ClashDisplay",
  },
});
