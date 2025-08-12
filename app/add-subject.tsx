import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Platform,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { supabase } from '../utils/supabase';
import { useRouter } from 'expo-router';
import { COURSES } from '@/types/database';

export default function AddSubjectScreen() {
  const router = useRouter();
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('');
  const [course, setCourse] = useState('');
  const [semester, setSemester] = useState('');
  const [courses, setCourses] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      // Use the predefined COURSES array instead of fetching from database
      setCourses([...COURSES]);
    } catch (error) {
      console.error('Error loading courses:', error);
      Alert.alert('Error', 'Failed to load courses');
    }
  };

  const onAddPress = async () => {
    if (!subjectName.trim() || !subjectCode.trim() || !course || !semester) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // Check if subject already exists
      const { data: existingSubject } = await supabase
        .from('subjects')
        .select('id')
        .eq('code', subjectCode.toUpperCase())
        .single();

      if (existingSubject) {
        Alert.alert('Error', 'Subject with this code already exists');
        setLoading(false);
        return;
      }

      // Insert new subject
      const { data, error } = await supabase
        .from('subjects')
        .insert({
          name: subjectName.trim(),
          code: subjectCode.toUpperCase(),
          semester: parseInt(semester),
          course: course,
          is_active: 'inactive'
        })
        .select()
        .single();

      if (error) throw error;

      Alert.alert(
        'Success',
        'Subject added successfully',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );

    } catch (error) {
      console.error('Error adding subject:', error);
      Alert.alert('Error', 'Failed to add subject');
    } finally {
      setLoading(false);
    }
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
          placeholder="Enter Subject Code (e.g., CS101)"
          placeholderTextColor="#4a5a4a"
          value={subjectCode}
          onChangeText={setSubjectCode}
          autoCapitalize="characters"
        />

        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={course}
            onValueChange={(itemValue) => setCourse(itemValue)}
            style={styles.picker}
            dropdownIconColor="#4a5a4a"
          >
            <Picker.Item label="Select Course" value="" color="#4a5a4a" />
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
            <Picker.Item label="Select Semester" value="" color="#4a5a4a" />
            {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
              <Picker.Item key={s} label={`${s}`} value={`${s}`} />
            ))}
          </Picker>
        </View>

        <TouchableOpacity 
          style={[styles.addButton, loading && styles.disabledButton]} 
          onPress={onAddPress}
          disabled={loading}
        >
          <Text style={styles.addButtonText}>
            {loading ? 'Adding...' : 'Add Subject'}
          </Text>
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
  disabledButton: {
    backgroundColor: '#a9a9a9',
  },
  addButtonText: {
    fontFamily: 'ClashDisplay',
    fontSize: 20,
    color: '#000',
    fontWeight: '400',
  },
});
