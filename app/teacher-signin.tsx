import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function TeacherSigninScreen() {
  const [name, setName] = useState('');

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/teacher.png')} style={styles.image} />
      <Text style={styles.title}>The name is ..?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={() => { /* TODO: Handle continue */ }}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => { /* TODO: Handle new user */ }}>
        <Text style={styles.newHereText}>New Here ?</Text>
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
    width: 140,
    height: 140,
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
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    width: '90%',
    height: 50,
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#000',
    fontSize: 18,
  },
  newHereText: {
    color: '#555',
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});
