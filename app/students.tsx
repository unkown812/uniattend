import React from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const students = [
  { id: '1', name: 'Arpit Salunkhe', roll: '01', sem: '5', status: 'green' },
  { id: '2', name: 'Adhya Shukla', roll: '01', sem: '5', status: 'red' },
  { id: '3', name: 'Nasha Talwar', roll: '01', sem: '5', status: 'white' },
];

export default function StudentsScreen() {
  const renderItem = ({ item }: { item: { id: string; name: string; roll: string; sem: string; status: string } }) => (
    <View style={styles.studentItem}>
      <View>
        <Text style={styles.studentName}>{item.name}</Text>
        <Text style={styles.studentDetails}>Roll: {item.roll}   Sem: {item.sem}</Text>
      </View>
      <View
        style={[
          styles.statusIndicator,
          { backgroundColor: item.status === 'white' ? '#fff' : item.status === 'green' ? '#4caf50' : '#f44336' },
        ]}
      />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Students</Text>
      <Text style={styles.subtitle}>Attendance Summary</Text>

      <FlatList
        data={students}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
      />

      <TouchableOpacity style={styles.exportButton} onPress={() => { /* TODO: Handle export */ }}>
        <Text style={styles.exportButtonText}>Export</Text>
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
  studentItem: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 30,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  studentName: {
    fontSize: 20,
    color: '#000',
  },
  studentDetails: {
    fontSize: 14,
    color: '#333',
  },
  statusIndicator: {
    width: 20,
    height: 20,
    borderRadius: 10,
  },
  exportButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  exportButtonText: {
    color: '#000',
    fontSize: 18,
  },
});
