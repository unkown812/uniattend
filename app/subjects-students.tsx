import { MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import React, { useEffect } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { useSubjects } from '../hooks/useSubjects';

export default function SubjectsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { subjects, loading, error, fetchSubjects } = useSubjects();
  
  const course = params.course as string;
  const semester = parseInt(params.sem as string);

  useEffect(() => {
    if (course && semester) {
      fetchSubjects(course, semester);
    }
  }, [course, semester]);

  const renderItem = ({ item }: { item: { id: number; name: string; code: string; is_active: boolean } }) => (
    <TouchableOpacity 
      style={styles.subjectItem} 
      onPress={() => router.push(`/subject-mark-attendance?subjectId=${item.id}&subject-Name=${item.name}&studentId=${params.studentId}`)}
    >
      <Text style={styles.subjectText}>{item.name}</Text>
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: item.is_active ? '#4caf50' : '#f44336' },
        ]}
      />
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#4a7c59" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
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
        <TouchableOpacity style={styles.profileIcon}>
          <MaterialIcons name="person" size={24} color="#004d40" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={subjects}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No subjects found for {course} - Semester {semester}</Text>
        }
      />
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
  headerRow: {
    marginTop: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  emptyText: {
    fontSize: 18,
    color: '#666',
    textAlign: 'center',
    marginTop: 50,
    fontFamily: "ClashDisplay",
  },
  errorText: {
    fontSize: 18,
    color: '#f44336',
    textAlign: 'center',
    fontFamily: "ClashDisplay",
  },
});
