import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator, TextInput } from 'react-native';
import { supabase } from '../utils/supabase';
import { Teacher } from '../types/database';
import { useAuth } from '../context/AuthContext';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAuth();
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    course: '',
    semester: 1,
  });

  useEffect(() => {
    if (user?.id) {
      fetchTeacherProfile();
    }
  }, [user]);

  const fetchTeacherProfile = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        throw error;
      }

      setTeacher(data);
      setFormData({
        username: data.username || '',
        course: data.course || '',
        semester: data.semester || 1,
      });
    } catch (error) {
      console.error('Error fetching teacher profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async () => {
    if (!teacher) return;

    try {
      setSaving(true);
      
      // Validate inputs
      if (!formData.username.trim()) {
        Alert.alert('Error', 'Username is required');
        return;
      }
      
      if (!formData.course.trim()) {
        Alert.alert('Error', 'Course is required');
        return;
      }

      const { error } = await supabase
        .from('teachers')
        .update({
          username: formData.username.trim(),
          course: formData.course.trim(),
          semester: Math.max(1, Math.min(8, formData.semester)), // Ensure semester is between 1-8
        })
        .eq('id', teacher.id);

      if (error) {
        throw error;
      }

      setTeacher({ ...teacher, ...formData });
      setEditing(false);
      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        throw error;
      }
      router.replace('/login-selection');
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to logout');
    }
  };

  const handleEditToggle = () => {
    if (editing) {
      setFormData({
        username: teacher?.username || '',
        course: teacher?.course || '',
        semester: teacher?.semester || 1,
      });
    }
    setEditing(!editing);
  };

  const handleSemesterChange = (text: string) => {
    const value = parseInt(text);
    if (isNaN(value)) {
      setFormData({ ...formData, semester: 1 });
    } else {
      setFormData({ ...formData, semester: Math.max(1, Math.min(8, value)) });
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4a7c59" />
      </View>
    );
  }

  if (!teacher) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>No teacher data found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Image
          source={require('../assets/images/teacherIllustration.png')}
          style={styles.image}
          resizeMode="contain"
          onError={(error) => {
            console.error('Error loading image:', error);
          }}
        />
        
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Username</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              placeholder="Enter username"
              maxLength={50}
            />
          ) : (
            <Text style={styles.value}>{teacher.username}</Text>
          )}

          <Text style={styles.label}>Course</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.course}
              onChangeText={(text) => setFormData({ ...formData, course: text })}
              placeholder="Enter course name"
              maxLength={100}
            />
          ) : (
            <Text style={styles.value}>{teacher.course}</Text>
          )}

          <Text style={styles.label}>Semester</Text>
          {editing ? (
            <TextInput
              style={styles.input}
              value={formData.semester.toString()}
              onChangeText={handleSemesterChange}
              keyboardType="numeric"
              maxLength={1}
            />
          ) : (
            <Text style={styles.value}>{teacher.semester}</Text>
          )}
        </View>

        <View style={styles.buttonContainer}>
          {editing ? (
            <React.Fragment>
              <TouchableOpacity 
                style={[styles.button, styles.saveButton]} 
                onPress={handleSaveProfile}
                disabled={saving}
              >
                <Text style={styles.buttonText}>{saving ? 'Saving...' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.cancelButton]} 
                onPress={handleEditToggle}
              >
                <Text style={styles.buttonText}>Cancel</Text>
              </TouchableOpacity>
            </React.Fragment>
          ) : (
            <React.Fragment>
              <TouchableOpacity 
                style={[styles.button, styles.editButton]} 
                onPress={handleEditToggle}
              >
                <Text style={styles.buttonText}>Edit Profile</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.button, styles.logoutButton]} 
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>Logout</Text>
              </TouchableOpacity>
            </React.Fragment>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f0',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  card: {
    backgroundColor: '#fff9f0',
    borderRadius: 20,
    padding: 20,
    width: '90%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: 'rgba(0,0,0,0.3)',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontFamily: 'ClashDisplay',
    fontSize: 28,
    fontWeight: '400',
    color: '#000',
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  image: {
    width: 140,
    height: 140,
    marginBottom: 20,
  },
  infoContainer: {
    width: '100%',
    marginBottom: 30,
  },
  label: {
    fontFamily: 'ClashDisplay',
    fontSize: 18,
    color: '#555',
    marginTop: 10,
  },
  value: {
    fontFamily: 'ClashDisplay',
    fontSize: 20,
    color: '#000',
    fontWeight: '400',
  },
  input: {
    fontFamily: 'ClashDisplay',
    fontSize: 18,
    color: '#000',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginTop: 5,
    marginBottom: 10,
  },
  buttonContainer: {
    width: '100%',
    gap: 10,
  },
  button: {
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderWidth: 1,
    borderColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'ClashDisplay',
    fontSize: 18,
    color: '#000',
    fontWeight: '400',
  },
  saveButton: {
    backgroundColor: '#4a7c59',
    shadowColor: '#3a5a39',
  },
  cancelButton: {
    backgroundColor: '#a9cbb7',
    shadowColor: '#888',
  },
  editButton: {
    backgroundColor: '#4a7c59',
    shadowColor: '#3a5a39',
  },
  logoutButton: {
    backgroundColor: '#ff6b6b',
    shadowColor: '#cc5555',
  },
  errorText: {
    fontFamily: 'ClashDisplay',
    fontSize: 18,
    color: 'red',
    textAlign: 'center',
  },
});
