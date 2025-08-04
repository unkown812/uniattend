import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const subjects = [
  { id: '1', name: 'DSD', status: 'red' },
  { id: '2', name: 'IOT', status: 'green' },
  { id: '3', name: 'EVS', status: 'green' },
];

export default function SubjectsScreen() {
  const renderItem = ({ item }: { item: { id: string; name: string; status: string } }) => (
    <View style={styles.subjectItem}>
      <Text style={styles.subjectText}>{item.name}</Text>
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: item.status === 'green' ? '#4caf50' : '#f44336' },
        ]}
      />
    </View>
  );

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
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => { /* TODO: Add subject */ }}>
        <Text style={styles.addButtonText}>Add Subject</Text>
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
  headerRow: {
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
    fontSize: 28,
    fontWeight: '700',
    color: '#000',
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  listContainer: {
    paddingBottom: 20,
  },
  subjectItem: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  subjectText: {
    fontSize: 20,
    color: '#000',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  addButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#000',
    fontSize: 18,
  },
});
