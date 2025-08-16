import { StyleSheet, Text, TouchableOpacity, View, ScrollView, ActivityIndicator,Platform,BackHandler } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Attendance } from '../types/database';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function StudentsScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
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

      const today = new Date();
      const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0);
      const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);

      const { data, error } = await supabase
        .from('attendance')
        .select('*')
        .eq('subject_code', subjectId)
        .gte('created_at', startOfDay.toISOString())
        .lte('created_at', endOfDay.toISOString())
        .order('created_at', { ascending: true })

      if (error) {
        console.error('Supabase query error:', error);
        throw error;
      }

      console.log(`Found ${data?.length || 0} attendance records for today`);
      setAttendanceRecords(data || []);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch attendance records');
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

  const exportToCSV = async () => {
    if (attendanceRecords.length === 0) {
      alert('No attendance records to export');
      return;
    }

    try {
      const headers = ['Date', 'Name', 'Roll', 'Status', 'Subject', 'Created At'];
      
      const rows = attendanceRecords.map(record => [
        new Date(record.created_at).toLocaleDateString(),
        record.name,
        record.roll,
        record.status,
        record.subject,
        new Date(record.created_at).toLocaleString()
      ]);


      const csvContent = [headers, ...rows]
        .map(row => row.map(field => `"${field}"`).join(','))
        .join('\n');

      const today = new Date();
      const fileName = `attendance_${subjectId}_${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}.csv`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      if (Platform.OS === 'web') {
        // Web implementation
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } else {
        const filePath = `${FileSystem.documentDirectory}${fileName}`;
        await FileSystem.writeAsStringAsync(filePath, csvContent);

        await Sharing.shareAsync(filePath, {
          mimeType: 'text/csv',
          dialogTitle: 'Export Attendance Records',
          UTI: 'public.comma-separated-values-text'
        });
      }
    } catch (error) {
      alert('Error exporting attendance records');
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
              {new Date(record.created_at).toLocaleTimeString()}
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
          <Text style={styles.emptyText}>No attendance records found for today</Text>
          <Text style={styles.debugText}>Subject ID: {subjectId}</Text>

        </View>
      ) : (
        <AttendanceTable />
      )}

      <TouchableOpacity
        style={[
          styles.activateButton,
          {
            backgroundColor:"#4a7c59",
          },
        ]}
        onPress={exportToCSV}
      >
        <Text style={styles.activateButtonText}>
          Export
        </Text>
      </TouchableOpacity>
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
    width: 70,
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
  activateButton: {
    width: "60%",
    backgroundColor: "#4a7c59",
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 30,
  },
  activateButtonText: {
    fontSize: 24,
    fontWeight: "400",
    color: "#000",
    fontFamily: "ClashDisplay",
  },
});
