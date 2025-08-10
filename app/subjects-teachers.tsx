import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../context/AuthContext';
import { useSubjects } from '../hooks/useSubjects';
import { useAttendance } from '../hooks/useAttendance';
import { Subject } from '../types/database';
import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function TeacherSubjectsScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const { subjects, loading, error, fetchSubjects } = useSubjects();
  const { getAttendanceStats } = useAttendance();
  const [subjectStats, setSubjectStats] = useState<Record<number, any>>({});

  // Helper function to get semester safely

  const renderItem = ({ item }: { item: { id: string; name: string; is_active: string } }) => (
    <TouchableOpacity
      style={styles.subjectItem}
      onPress={() => router.push(`/subject-detail?subjectId=${item.id}&subjectName=${item.name}`)}
    >
      <Text style={styles.subjectText}>{item.name}</Text>
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: item.is_active === 'active' ? '#4caf50' : '#f44336' },
        ]}
      />
    </TouchableOpacity>
  );

  const getSemester = (user: any) => {
    if ('sem' in user) return user.sem;
    if ('semester' in user) return user.semester;
    return null;
  };

  useEffect(() => {
    if (user && user.course) {
      const semester = getSemester(user);
      if (semester) {
        fetchSubjects(user.course, semester);
      }
    }
  }, [user]);

  useEffect(() => {
    if (subjects.length > 0 && user) {
      loadSubjectStats();
    }
  }, [subjects, user]);

  const loadSubjectStats = async () => {
    if (!user) return;
    
    const semester = getSemester(user);
    if (!semester) return;
    
    const stats: Record<number, any> = {};
    for (const subject of subjects) {
      try {
        const stat = await getAttendanceStats(subject.id, user.course, semester);
        stats[subject.id] = stat;
      } catch (error) {
        console.error('Error loading stats for subject:', subject.id, error);
      }
    }
    setSubjectStats(stats);
  };


  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4a7c59" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Subjects</Text>
          <Text style={styles.subtitle}>List of all subjects</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.profileIcon} onPress={() => { router.push('/profile-teacher') }}>
            <MaterialIcons name="person" size={24} color="#004d40" />
          </TouchableOpacity>
        </View>
      </View>
      <FlatList
        data={subjects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity style={styles.addButton} onPress={() => { router.push('/add-subject') }}>
        <Text style={styles.addButtonText}>Add Subject</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding:10
  },
  headerRow: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  exportButton: {
    backgroundColor: '#a9cbb7',
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#000',
    fontFamily: "ClashDisplay",
    fontWeight: "400",
  },
  exportButtonText: {
    fontSize: 16,
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  profileIcon: {
    backgroundColor: '#a9cbb7',
    borderRadius: 12,
    padding: 4,
  },
  title: {
    fontSize: 50,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  subtitle: {
    fontSize: 24,
    color: '#555',
    marginBottom: 20,
    fontWeight: '400',
    fontFamily: "ClashDisplay",
  },

  listContainer: {
    paddingBottom: 20,
  },
  subjectItem: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 40,
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
  subjectText: {
    fontSize: 20,
    color: '#000',
    fontWeight: 'regular',
    fontFamily: "ClashDisplay",
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 25,
    marginBottom: 20,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '400',
    fontFamily: "ClashDisplay",
  },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  subjectHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  subjectName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    flex: 1,
  },
  subjectCode: {
    fontSize: 14,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4a7c59',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 4,
  },
  secondaryButton: {
    backgroundColor: '#e8f5e8',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  secondaryText: {
    color: '#4a7c59',
  },
  errorText: {
    fontSize: 16,
    color: '#f44336',
  },
});
