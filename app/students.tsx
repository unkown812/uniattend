import { FlatList, StyleSheet, Text, TouchableOpacity, View, Modal, Alert, Share } from 'react-native';
import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';
import { Student } from '../types/database';
import { useLocalSearchParams } from 'expo-router';
import { CSVExportService } from '../utils/csvExport';

interface StudentWithStatus extends Student {
  status: 'green' | 'red' | 'white';
}

export default function StudentsScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [modalVisible, setModalVisible] = useState(false);
  const [students, setStudents] = useState<StudentWithStatus[]>([]);
  const [subject, setSubject] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [exportType, setExportType] = useState<'lecture' | 'month' | 'year'>('lecture');

  useEffect(() => {
    fetchStudents();
    if (subjectId) {
      fetchSubject();
    }
  }, [subjectId]);

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

      const studentsWithStatus = data.map(student => ({
        ...student,
        status: 'white' as 'green' | 'red' | 'white' 
      }));

      setStudents(studentsWithStatus);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch students');
      console.error('Error fetching students:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubject = async () => {
    try {
      const { data, error } = await supabase
        .from('subjects')
        .select('name')
        .eq('id', subjectId)
        .single();

      if (error) throw error;
      setSubject(data);
    } catch (err) {
      console.error('Error fetching subject:', err);
    }
  };

  const handleExport = async (type: 'lecture' | 'month' | 'year') => {
    try {
      if (!subjectId) {
        Alert.alert('Error', 'Subject ID is required');
        return;
      }

      let csvContent = '';
      let filename = '';
      const currentYear = new Date().getFullYear().toString();
      const currentMonth = new Date().toISOString().slice(5, 7);

      switch (type) {
        case 'lecture':
          const lectureDate = new Date().toISOString().split('T')[0];
          csvContent = await CSVExportService.exportLectureAttendance(subjectId, lectureDate);
          filename = `Lecture_${subject?.name || 'Subject'}_${lectureDate}`;
          break;
        case 'month':
          csvContent = await CSVExportService.exportMonthlyAttendance(subjectId, currentMonth, currentYear);
          filename = `Monthly_${subject?.name || 'Subject'}_${currentYear}_${currentMonth}`;
          break;
        case 'year':
          csvContent = await CSVExportService.exportYearlyAttendance(subjectId, currentYear);
          filename = `Yearly_${subject?.name || 'Subject'}_${currentYear}`;
          break;
      }

      await CSVExportService.shareCSV(csvContent, filename);
      setModalVisible(false);
    } catch (error) {
      Alert.alert('Export Error', error instanceof Error ? error.message : 'Failed to export attendance');
    }
  };

  const renderItem = ({ item }: { item: StudentWithStatus }) => (
    <TouchableOpacity style={styles.studentItem}>
      <View>
        <Text style={styles.studentName}>{item.username}</Text>
        <Text style={styles.studentDetails}>Roll: {item.roll.toString().padStart(2, '0')}   Sem: {item.sem}</Text>
      </View>
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: item.status === 'white' ? '#fff' : item.status === 'green' ? '#4caf50' : '#f44336' },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <Text style={styles.subtitle}>Attendance Summary</Text>

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
      />

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
});
