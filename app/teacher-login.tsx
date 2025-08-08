import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, TextInput, Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { Teacher } from '../types/database';

export default function TeacherLoginScreen() {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/teacherIllustration.png')} style={styles.image} />
      <Text style={styles.title}>Teacher Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Course"
        value={course}
        onChangeText={setCourse}
      />

      <TextInput
        style={styles.input}
        placeholder="Enter Semester"
        value={semester}
        onChangeText={setSemester}
      />

      <TouchableOpacity style={styles.button} onPress={() => router.push("/login-selection")}>
        <Text style={styles.buttonText}>Continue</Text>
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
  buttonText: {
    color: '#000',
    fontSize: 26,
    fontWeight: '100',
    fontFamily: "ClashDisplay",
  },
});
