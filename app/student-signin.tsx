import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { Image, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';

export default function StudentSigninScreen() {
  const [name, setName] = useState('');
  const [course, setCourse] = useState('');
  const [sem, setSem] = useState('');
  const [rollNo, setRollNo] = useState('');

  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>May I know your details</Text>
      <Image source={require('../assets/images/professor.png')} style={styles.image} />

      <TextInput
        style={styles.input}
        placeholder="Enter Name"
        value={name}
        onChangeText={setName}
      />

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={course}
          onValueChange={(itemValue: string) => setCourse(itemValue)}
          style={styles.picker}
          dropdownIconColor="#555"
        >
          <Picker.Item label="Enter Course" value="" />
          <Picker.Item label="Computer Science" value="cs" />
          <Picker.Item label="Mechanical" value="mech" />
          <Picker.Item label="Electrical" value="ee" />
          {/* Add more courses as needed */}
        </Picker>
      </View>

      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={sem}
          onValueChange={(itemValue: string) => setSem(itemValue)}
          style={styles.picker}
          dropdownIconColor="#555"
        >
          <Picker.Item label="Enter Sem" value="" />
          <Picker.Item label="1" value="1" />
          <Picker.Item label="2" value="2" />
          <Picker.Item label="3" value="3" />
          <Picker.Item label="4" value="4" />
          <Picker.Item label="5" value="5" />
          <Picker.Item label="6" value="6" />
          <Picker.Item label="7" value="7" />
          <Picker.Item label="8" value="8" />
        </Picker>
      </View>

      <TextInput
        style={styles.input}
        placeholder="Enter Roll no."
        value={rollNo}
        onChangeText={setRollNo}
        keyboardType="numeric"
      />

      <TouchableOpacity style={styles.button} onPress={() => router.push('/subjects-students')}>
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
    marginTop: 10,
    width: 340,
    height: 340,
    borderRadius: 70,
    marginVertical: 30,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
    marginTop: 60,
    fontWeight: '100',
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
  pickerContainer: {
    width: '90%',
    height: Platform.OS === 'android' ? 50 : undefined,
    backgroundColor: "rgba(0, 64, 48, 0.25)",
    marginVertical: 8,
    justifyContent: 'center',
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
  picker: {
    width: '100%',
    color: '#000',
    fontWeight: '100',
    fontFamily: "ClashDisplay",
    fontSize: 16,
    paddingHorizontal: 15,
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
