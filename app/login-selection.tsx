import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View,Image } from 'react-native';
import { useRouter } from 'expo-router';

export default function LoginSelectionScreen() {

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who Are You ?</Text>
      <Text style={styles.subtitle}>Login to Continue</Text>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/teacher-signin')}>
        <Text style={styles.buttonText}>Teacher</Text>
        <Image source={require('../assets/images/teacher.png')} style={styles.buttonImage}/>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => router.push('/student-signin')}>
        <Text style={styles.buttonText}>Student</Text>
        <Image source={require('../assets/images/mortarboard.png')} style={styles.buttonImage} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 40,
    marginBottom: 4,
    fontWeight: '100',
    fontFamily: "ClashDisplay",
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    fontWeight: 'normal',
    color: '#555',
    fontFamily: "ClashDisplay",
  },
  button: {
    backgroundColor: '#a9cbb7',
    width: 350,
    height: 240,
    borderRadius: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    fontFamily: "ClashDisplay",
  },
  buttonText: {
    fontFamily: "ClashDisplay",
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  buttonImage: {
    marginTop: 10,
    height: 80,
    width: 80,
  },
});
