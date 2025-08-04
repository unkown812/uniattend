import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function SubjectMarkAttendanceScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subject</Text>

      <View style={styles.card}>
        <Text style={styles.subjectName}>Subject Name</Text>
        <Text style={styles.subjectId}>Subject ID: XXX</Text>

        <TouchableOpacity style={styles.markAttendanceButton} onPress={() => { /* TODO: Handle mark attendance */ }}>
          <Text style={styles.markAttendanceButtonText}>Mark Attendance</Text>
        </TouchableOpacity>
      </View>
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
  },
  subjectName: {
    fontSize: 22,
    marginBottom: 10,
  },
  subjectId: {
    fontSize: 16,
    marginBottom: 20,
  },
  markAttendanceButton: {
    backgroundColor: '#d3d3c9',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  markAttendanceButtonText: {
    fontSize: 16,
    color: '#000',
  },
});
