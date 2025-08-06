import React, { useState } from 'react';
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function TeacherSigninScreen() {
  const [name, setName] = useState('');
  const router = useRouter();
  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/teacherIllustration.png')} style={styles.image} />
      <Text style={styles.title}>The name is ..?</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        placeholderTextColor={"rgba(0, 0, 0, 0.5)"}
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={styles.button} onPress={() => router.push('/subjects')}>
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('/teacher-login')}>
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
    marginTop: 130,
    width: 340,
    height: 340,
    borderRadius: 70,
    marginVertical: 30,
  },
  title: {
    fontSize: 35,
    marginBottom: 100,
    fontWeight: 'regular',
    fontFamily: "ClashDisplay",
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
    shadowColor: "rgba(0, 0, 0, 0.25)",
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 1,
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
    fontWeight: 'regular',
    fontFamily: "ClashDisplay",
  },
  newHereText: {
    color: "rgba(0, 0, 0, 0.5)",
    fontSize: 16,
    textDecorationLine: 'underline',
    fontWeight: '100',
    fontFamily: "ClashDisplay",
  },
});
