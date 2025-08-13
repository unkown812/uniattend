import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, Alert, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Student, Attendance, Subject } from '../types/database';
import { useLocalSearchParams } from 'expo-router';
import { useAttendance } from '../hooks/useAttendance';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

interface StudentWithAttendance extends Student {
  attendanceRecords: Attendance[];
  attendanceStats: {
    present: number;
    absent: number;
    late: number;
    total: number;
  };
}

export default function StudentsScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [modalVisible, setModalVisible] = useState(false);
  const [students, setStudents] = useState<StudentWithAttendance[]>([]);
  const [subject, setSubject] = useState<Subject | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportType, setExportType] = useState<'lecture' | 'month' | 'year'>('lecture');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'table' | 'summary'>('table');
  
  const { attendance, fetchAttendance } = useAttendance();

  useEffect(() => {
    fetchStudents();
    if (subjectId) {
      fetchSubject();
      fetchAttendanceData();
    }
  }, [subjectId, selectedDate]);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('students')
        .select('*')
        .order('roll', { ascending: true });

      if (error) {
        throw error;
      }

      const studentsWithAttendance = await Promise.all(
        data.map(async (student) => {
          const studentAttendance = attendance.filter(
            (a: Attendance) => a.subject === subjectId
          );

          return {
            ...student,
            attendanceRecords: studentAttendance,
            attendanceStats: {
              present: studentAttendance.filter((a: Attendance) => a.status === 'present').length,
              absent: studentAttendance.filter((a: Attendance) => a.status === 'absent').length,
              late: studentAttendance.filter((a: Attendance) => a.status === 'late').length,
              total: studentAttendance.length
            }
          };
        })
      );

      setStudents(studentsWithAttendance);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubject = async () => {
    try {
      if (!subjectId) return;
      
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', parseInt(subjectId))
        .single();

      if (error) throw error;
      setSubject(data);
    } catch (err) {
      console.error('Error fetching subject:', err);
    }
  };

  const fetchAttendanceData = async () => {
    if (subjectId) {
      await fetchAttendance({
        subjectId: subjectId,
        date: selectedDate
      });
    }
  };

  const handleExport = async (type: 'lecture' | 'month' | 'year') => {
    try {
      if (!subjectId) {
        Alert.alert('Error', 'Subject ID is required');
        return;
      }

      let query = supabase
        .from('attendance')
        .select('*')
        .eq('subject_code', subjectId);

      const now = new Date();
      if (type === 'lecture') {
        const today = now.toISOString().split('T')[0];
        const startOfDay = `${today}T00:00:00.000Z`;
        const endOfDay = `${today}T23:59:59.999Z`;
        query = query.gte('created_at', startOfDay).lte('created_at', endOfDay);
      } else if (type === 'month') {
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999).toISOString();
        query = query.gte('created_at', startOfMonth).lte('created_at', endOfMonth);
      } else if (type === 'year') {
        const startOfYear = new Date(now.getFullYear(), 0, 1).toISOString();
        const endOfYear = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999).toISOString();
        query = query.gte('created_at', startOfYear).lte('created_at', endOfYear);
      }

      query = query.order('created_at', { ascending: true });

      const { data, error } = await query;

      if (error) {
        throw error;
      }

      if (!data || data.length === 0) {
        Alert.alert('No Data', 'No attendance records found for the selected period');
        setModalVisible(false);
        return;
      }

      const csvRows = [
        ['ID', 'Name', 'Roll', 'Subject', 'Semester', 'Course', 'Date', 'Status', 'Subject ID'],
        ...data.map((record: Attendance) => [
          record.id || '',
          record.name || '',
          record.roll || '',
          record.subject || '',
          record.semester || '',
          record.course || '',
          record.created_at || '',
          record.status || '',
          record.subject_code || '',
        ]),
      ];

      const csvContent = csvRows.map(row => 
        row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(',')
      ).join('\n');

      const filename = `Attendance_${subject?.name || 'Subject'}_${type}_${new Date().toISOString().split('T')[0]}.csv`;
      const filePath = `${FileSystem.documentDirectory}${filename}`;
      await FileSystem.writeAsStringAsync(filePath, csvContent);
      
      if (await Sharing.isAvailableAsync()) {
        await Sharing.shareAsync(filePath, {
          mimeType: 'text/csv',
          dialogTitle: 'Share Attendance Report',
          UTI: 'public.comma-separated-values-text',
        });
      } else {
        Alert.alert('Success', `File saved to: ${filePath}`);
      }

      setModalVisible(false);
    } catch (error) {
      console.error('Export error:', error);
      Alert.alert('Export Error', error instanceof Error ? error.message : 'Failed to export attendance');
    }
  };

  const AttendanceTable = () => (
    <ScrollView>
      <View style={styles.tableContainer}>
        <View style={styles.tableHeader}>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Roll</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Name</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>Status</Text>
        </View>
        {students.map((student) => (
          <View key={student.id} style={styles.tableRow}>
            <Text style={styles.tableCell}>{student.roll.toString().padStart(2, '0')}</Text>
            <Text style={[styles.tableCell]}>{student.username}</Text>
            <Text style={styles.tableCell}>
              {student.attendanceRecords.length > 0 
                ? student.attendanceRecords[0].status 
                : 'No record'}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );

  const AttendanceSummary = () => (
    <View style={styles.summaryContainer}>
      <Text style={styles.summaryTitle}>Attendance Summary</Text>
      <View style={styles.summaryStats}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>{students.length}</Text>
          <Text style={styles.statLabel}>Total Students</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {students.reduce((sum, s) => sum + s.attendanceStats.present, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Present</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {students.reduce((sum, s) => sum + s.attendanceStats.absent, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Absent</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            {students.reduce((sum, s) => sum + s.attendanceStats.late, 0)}
          </Text>
          <Text style={styles.statLabel}>Total Late</Text>
        </View>
      </View>
    </View>
  );

  // const renderItem = ({ item }: { item: StudentWithAttendance }) => (
  //   <TouchableOpacity style={styles.studentItem}>
  //     <View>
  //       <Text style={styles.studentName}>{item.username}</Text>
  //       <Text style={styles.studentDetails}>
  //         Roll: {item.roll.toString().padStart(2, '0')} | 
  //         Present: {item.attendanceStats.present} | 
  //         Absent: {item.attendanceStats.absent} | 
  //         Percentage: {item.attendanceStats.total > 0 
  //           ? Math.round((item.attendanceStats.present / item.attendanceStats.total) * 100)
  //           : 0}%
  //       </Text>
  //     </View>
  //     <View style={styles.attendanceIndicator}>
  //       <View style={[styles.statusIndicator, { backgroundColor: '#4caf50' }]} />
  //       <Text style={styles.indicatorText}>{item.attendanceStats.present}</Text>
  //     </View>
  //   </TouchableOpacity>
  // );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <Text style={styles.subtitle}>{subject?.name || 'Subject'} - Attendance Records</Text>
      
      <View style={styles.controlsContainer}>
        <TouchableOpacity 
          style={[styles.toggleButton, viewMode === 'table' && styles.activeToggle]}
          onPress={() => setViewMode('table')}
        >
          <Text style={[styles.toggleText, viewMode === 'table' && styles.activeToggleText]}>Table View</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleButton, viewMode === 'summary' && styles.activeToggle]}
          onPress={() => setViewMode('summary')}
        >
          <Text style={[styles.toggleText, viewMode === 'summary' && styles.activeToggleText]}>Summary</Text>
        </TouchableOpacity>
      </View>

      {viewMode === 'table' ? <AttendanceTable /> : <AttendanceSummary />}

      {/* <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No students found for this subject</Text>
        }
      /> */}

      <TouchableOpacity style={styles.exportButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.exportButtonText}>Export Attendance</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPressOut={() => setModalVisible(false)}>
          <View style={styles.bottomPopupContent}>
            <Text style={styles.modalTitle}>Export Attendance</Text>
            
            <TouchableOpacity style={styles.popupButton} onPress={() => handleExport('lecture')}>
              <Text style={styles.popupButtonText}>Lecture</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.popupButton} onPress={() => handleExport('month')}>
              <Text style={styles.popupButtonText}>Month</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.popupButton} onPress={() => handleExport('year')}>
              <Text style={styles.popupButtonText}>Year</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.popupButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.popupButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  listContainer: {
    paddingBottom: 20,
  },
  studentItem: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: {
      width: 2,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  studentName: {
    fontSize: 28,
    color: '#000',
    fontFamily: "ClashDisplay",
    fontWeight: "400",
  },
  studentDetails: {
    fontSize: 20,
    fontFamily: "ClashDisplay",
    fontWeight: "400",
    color: '#333',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  exportButton: {
    backgroundColor: "#4a7c59",
    borderRadius: 20,
    paddingVertical: 25,
    marginBottom: 20,
    alignItems: 'center',
    shadowColor: "#bfcbb8",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
    height: 82,
    borderColor: '#000',
    borderWidth: 1,
    borderStyle: "solid"
  },
  exportButtonText: {
    color: '#000',
    fontSize: 24,
    fontFamily: "ClashDisplay",
    fontWeight: "400",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.63)',
    justifyContent: 'flex-end',
    alignItems: 'baseline',
  },
  modalContent: {
    width: 300,
    backgroundColor: '#d3d3c9',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
  },
  popupContent: {
    width: 280,
    backgroundColor: '#d3d3c9',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: "rgba(0, 0, 0, 0.85)",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.9,
    transform: [{ scale: 1 }],
  },
  bottomPopupContent: {
    width: '100%',
    backgroundColor: '#d3d3c9',
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    paddingVertical: 30,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: "rgba(0, 0, 0, 0.85)",
    shadowOffset: {
      width: 0,
      height: -8,
    },
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.9,
  },
  popupButton: {
    width: '80%',
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
    marginVertical: 10,
  },
  popupButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: "ClashDisplay",
    color: '#000',
  },
  modalButton: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#000',
  },
  modalButtonText: {
    fontSize: 18,
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  tableContainer: {
    flex:1,
    marginVertical: 10,
    width: 'auto',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#000',
  },
  tableHeader: {
    flex:1,
    width:"100%",
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
  nameCell: {
    minWidth: 120,
    textAlign: 'left',
  },
  presentCell: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  absentCell: {
    color: '#f44336',
    fontWeight: 'bold',
  },
  lateCell: {
    color: '#ff9800',
    fontWeight: 'bold',
  },
  summaryContainer: {
    marginVertical: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  summaryTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: "ClashDisplay",
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap',
  },
  statCard: {
    backgroundColor: '#a9cbb7',
    padding: 15,
    borderRadius: 10,
    minWidth: 100,
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
    borderColor: '#000',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  statLabel: {
    fontSize: 12,
    color: '#333',
    marginTop: 5,
    fontFamily: "ClashDisplay",
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 15,
  },
  toggleButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginHorizontal: 5,
    borderRadius: 20,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#000',
  },
  activeToggle: {
    backgroundColor: '#4a7c59',
  },
  toggleText: {
    fontSize: 16,
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  activeToggleText: {
    color: '#fff',
  },
  attendanceIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorText: {
    marginLeft: 5,
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: "ClashDisplay",
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 18,
    color: '#666',
    marginTop: 50,
    fontFamily: "ClashDisplay",
  },
});
