import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';

export default function AddSubjectScreen() {
  const [subjectName, setSubjectName] = useState('');
  const [subjectID, setSubjectID] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');

  const courses = ['Course 1', 'Course 2', 'Course 3'];
  const semesters = ['1', '2', '3', '4', '5', '6', '7', '8'];

  const onAddPress = () => {
    // TODO: Handle add subject logic
    console.log('Add pressed', { subjectName, subjectID, course, semester });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Image
          source={require('../assets/images/education.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <Text style={styles.title}>Add Subject</Text>

        <TextInput
          style={styles.input}
          placeholder="Enter Subject Name"
          placeholderTextColor="#4a5a4a"
          value={subjectName}
          onChangeText={setSubjectName}
        />

        <TextInput
          style={styles.input}
          placeholder="Enter Subject ID"
          placeholderTextColor="#4a5a4a"
          value={subjectID}
          onChangeText={setSubjectID}
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={course}
            onValueChange={(itemValue) => setCourse(itemValue)}
            style={styles.picker}
            dropdownIconColor="#4a5a4a"
          >
            <Picker.Item label="Enter Course" value="" color="#4a5a4a" />
            {courses.map((c) => (
              <Picker.Item key={c} label={c} value={c} />
            ))}
          </Picker>
        </View>

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={semester}
            onValueChange={(itemValue) => setSemester(itemValue)}
            style={styles.picker}
            dropdownIconColor="#4a5a4a"
          >
            <Picker.Item label="Enter Semester" value="" color="#4a5a4a" />
            {semesters.map((s) => (
              <Picker.Item key={s} label={s} value={s} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
          <Text style={styles.addButtonText}>Add</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff9f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  card: {
    borderRadius: 20,
    padding: 10,
    width: '90%',
    alignItems: 'center',
  },
  image: {
    width: 280,
    height: 250,
    marginBottom: 20,
  },
  title: {
    fontFamily: 'ClashDisplay',
    fontSize: 32,
    fontWeight: '400',
    color: '#000',
    marginBottom: 80,
  },
  input: {
    backgroundColor: '#a9cbb7',
    width: '100%',
    borderRadius: 20,
    paddingVertical: Platform.OS === 'ios' ? 15 : 10,
    paddingHorizontal: 20,
    fontSize: 16,
    fontFamily: 'ClashDisplay',
    color: '#000',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000',
  },
  pickerContainer: {
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#000',
    overflow: 'hidden',
  },
  picker: {
    width: '100%',
    color: '#000',
    fontFamily: 'ClashDisplay',
  },
  addButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 15,
    paddingHorizontal: 60,
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#bfcbb8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 4,
  },
  addButtonText: {
    fontFamily: 'ClashDisplay',
    fontSize: 20,
    color: '#000',
    fontWeight: '400',
  },
});
