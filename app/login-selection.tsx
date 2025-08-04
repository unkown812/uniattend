import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LoginSelectionScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who Are You ?</Text>
      <Text style={styles.subtitle}>Login to Continue</Text>

      <TouchableOpacity style={styles.button} onPress={() => { /* TODO: Handle Teacher login */ }}>
        <MaterialCommunityIcons name="account-tie" size={60} color="#004d40" />
        <Text style={styles.buttonText}>Teacher</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => { /* TODO: Handle Student login */ }}>
        <MaterialIcons name="school" size={60} color="#004d40" />
        <Text style={styles.buttonText}>Student</Text>
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
    fontSize: 28,
    fontWeight: '400',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: 20,
    color: '#555',
  },
  button: {
    backgroundColor: '#a9cbb7',
    width: 250,
    height: 140,
    borderRadius: 20,
    marginVertical: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    marginTop: 10,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
});
