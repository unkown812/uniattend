import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Alert, ActivityIndicator } from 'react-native';
import { useAuth } from '../context/AuthContext';
import { COURSES, SEMESTERS } from '../types/database';

export default function TeacherLoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();

  const handleTeacherLogin = async () => {
    if (!username.trim() || !password.trim() || !course || !semester) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await signIn('teacher', {
        username: username.trim(),
        password: password.trim(),
        course,
        semester: parseInt(semester),
      });
      
      // On successful login, navigate to teacher dashboard
      router.replace('/subjects-teachers');
    } catch (error) {
      Alert.alert('Login Failed', error instanceof Error ? error.message : 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/teacherIllustration.png')} style={styles.image} />
      <Text style={styles.title}>Teacher Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Username"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Course</Text>
        <View style={styles.pickerWrapper}>
          {COURSES.map((courseOption) => (
            <TouchableOpacity
              key={courseOption}
              style={[styles.pickerOption, course === courseOption && styles.pickerOptionSelected]}
              onPress={() => setCourse(courseOption)}
            >
              <Text style={[styles.pickerOptionText, course === courseOption && styles.pickerOptionTextSelected]}>
                {courseOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.pickerContainer}>
        <Text style={styles.pickerLabel}>Select Semester</Text>
        <View style={styles.pickerWrapper}>
          {SEMESTERS.map((semesterOption) => (
            <TouchableOpacity
              key={semesterOption}
              style={[styles.pickerOption, semester === semesterOption.toString() && styles.pickerOptionSelected]}
              onPress={() => setSemester(semesterOption.toString())}
            >
              <Text style={[styles.pickerOptionText, semester === semesterOption.toString() && styles.pickerOptionTextSelected]}>
                {semesterOption}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity 
        style={[styles.button, loading && styles.buttonDisabled]} 
        onPress={handleTeacherLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#000" />
        ) : (
          <Text style={styles.buttonText}>Continue</Text>
        )}
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
  image: {
    marginTop: 130,
    width: 340,
    height: 340,
    borderRadius: 70,
    marginVertical: 30,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    width: '90%',
    height: 50,
    backgroundColor: "rgba(0, 64, 48, 0.25)",
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
    fontWeight: '100',
    fontFamily: "ClashDisplay",
    borderRadius: 30,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  button: {
    width: '70%',
    height: 60,
    backgroundColor: '#4a7c59',
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 50,
    marginTop: 100,
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#000',
    fontSize: 26,
    fontWeight: '100',
    fontFamily: "ClashDisplay",
  },
  pickerContainer: {
    width: '90%',
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  pickerWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  pickerOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#f5f5f5',
  },
  pickerOptionSelected: {
    backgroundColor: '#4a7c59',
    borderColor: '#4a7c59',
  },
  pickerOptionText: {
    fontSize: 14,
    color: '#333',
  },
  pickerOptionTextSelected: {
    color: '#fff',
  },
});
