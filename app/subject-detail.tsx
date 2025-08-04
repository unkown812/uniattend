import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SubjectDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subject</Text>

      <View style={styles.card}>
        <Text style={styles.subjectName}>Subject Name</Text>
        <Text style={styles.subjectCode}>Subject Code: XXX</Text>

        <TouchableOpacity style={styles.studentListButton} onPress={() => { /* TODO: Handle student list */ }}>
          <Text style={styles.studentListButtonText}>Student List</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.activateButton} onPress={() => { /* TODO: Handle activate */ }}>
        <Text style={styles.activateButtonText}>Activate</Text>
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
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  card: {
    width: '90%',
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 30,
  },
  subjectName: {
    fontSize: 22,
    marginBottom: 10,
  },
  subjectCode: {
    fontSize: 16,
    marginBottom: 20,
  },
  studentListButton: {
    backgroundColor: '#d3d3c9',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  studentListButtonText: {
    fontSize: 16,
    color: '#000',
  },
  activateButton: {
    width: '90%',
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  activateButtonText: {
    fontSize: 18,
    color: '#000',
  },
});
