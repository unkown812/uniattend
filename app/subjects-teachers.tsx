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

  const renderSubject = ({ item }: { item: Subject }) => {
    const stats = subjectStats[item.id];
    const attendanceRate = stats && stats.total > 0 
      ? Math.round((stats.present / stats.total) * 100) 
      : 0;

    return (
      <TouchableOpacity
        style={styles.subjectCard}
        onPress={() => router.push(`/subject-detail?subjectId=${item.id}`)}
      >
        <View style={styles.subjectHeader}>
          <Text style={styles.subjectName}>{item.name}</Text>
          <Text style={styles.subjectCode}>{item.code}</Text>
        </View>
        
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Attendance Rate</Text>
            <Text style={[styles.statValue, { color: attendanceRate >= 75 ? '#4caf50' : '#f44336' }]}>
              {attendanceRate}%
            </Text>
          </View>
          
          {stats && (
            <>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Total Classes</Text>
                <Text style={styles.statValue}>{stats.total}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statLabel}>Present</Text>
                <Text style={[styles.statValue, { color: '#4caf50' }]}>{stats.present}</Text>
              </View>
            </>
          )}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/subject-mark-attendance?subjectId=${item.id}`)}
          >
            <MaterialIcons name="check-circle" size={20} color="#fff" />
            <Text style={styles.actionText}>Mark Attendance</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.actionButton, styles.secondaryButton]}
            onPress={() => router.push(`/subject-detail?subjectId=${item.id}`)}
          >
            <MaterialIcons name="info" size={20} color="#4a7c59" />
            <Text style={[styles.actionText, styles.secondaryText]}>Details</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
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
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.title}>My Subjects</Text>
            <Text style={styles.subtitle}>
              {user?.course} 
            </Text>
          </View>
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => router.push('/add-subject')}
          >
            <MaterialIcons name="add" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={subjects}
        renderItem={renderSubject}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  listContainer: {
    padding: 16,
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
  addButton: {
    backgroundColor: '#4a7c59',
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
});
