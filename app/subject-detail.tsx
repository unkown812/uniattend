import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Image, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../utils/supabase';
import { Subject } from '../types/database';

export default function SubjectDetailScreen() {
  const { subjectId } = useLocalSearchParams<{ subjectId: string }>();
  const [subject, setSubject] = useState<Subject>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subjectId) {
      fetchSubject();
      const channel = supabase
        .channel(`subject-${subjectId}`)
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'subjects',
            filter: `id=eq.${subjectId}`
          },
          (payload) => {
            setSubject(payload.new as Subject);
          }
        )
        .subscribe();
        
      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [subjectId]);

  const fetchSubject = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .eq('id', subjectId)
        .single();

      if (error) {
        throw error;
      }

      setSubject(data);
    } catch (err) {
      console.error('Error fetching subject:', err);
      setError('Failed to load subject details');
    } finally {
      setLoading(false);
    }
  };

  const handleActivate = async () => {
    if (!subject) return;
    
    const isCurrentlyActive = subject.is_active === 'active';
    const action = isCurrentlyActive ? 'deactivate' : 'activate';
    const title = `${isCurrentlyActive ? 'Deactivate' : 'Activate'} Subject`;
    const message = `Are you sure you want to ${action} "${subject.name}"?`;
    
    Alert.alert(
      title,
      message,
      [
        {
          text: 'Cancel',
          style: 'cancel'
        },
        {
          text: 'Confirm',
          onPress: async () => {
            try {
              const newStatus = isCurrentlyActive ? 'inactive' : 'active';
              const { error } = await supabase
                .from('subjects')
                .update({ is_active: newStatus })
                .eq('id', subjectId);
              
              if (error) {
                throw error;
              }
              
              await fetchSubject();
            } catch (err) {
              console.error('Error updating subject status:', err);
              setError('Failed to update subject status');
            }
          },
          style: 'default'
        }
      ],
      { cancelable: true }
    );
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#4a7c59" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchSubject}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!subject) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Subject not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Subject</Text>
      <View style={styles.card}>
        <Text style={styles.subjectName}>{subject.name}</Text>
        <Text style={styles.subjectCode}>Subject Code: {subject.code}</Text>
        <Image source={require('../assets/images/Subjects.png')} style={styles.studentListImage} />
        <TouchableOpacity style={styles.studentListButton} onPress={() => router.push(`/students?subjectId=${subjectId}`)}>
          <Text style={styles.studentListButtonText}>Student   List</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.activateButton, { backgroundColor: subject.is_active === 'active' ? '#e74c3c' : '#4a7c59' }]}
          onPress={handleActivate}
        >
          <Text style={styles.activateButtonText}>
            {subject.is_active === 'active'? 'Deactivate' : 'Activate'}
          </Text>
        </TouchableOpacity>
      </View>
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
  centerContent: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 40,
    marginBottom: 20,
    marginTop: 100,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  card: {
    width: '90%',
    height: "70%",
    backgroundColor: '#a9cbb7',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: {
      width: 2,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
  },
  subjectName: {
    fontSize: 32,
    marginTop: 50,
    marginBottom: 50,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  subjectCode: {
    marginBottom: 50,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  studentListButton: {
    backgroundColor: '#d3d3c9',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderStyle: "solid",
    borderColor: "#000",
    borderWidth: 1,
    shadowColor: "rgba(0, 0, 0, 0.65)",
    shadowOffset: {
      width: 2,
      height: 4
    },
    shadowRadius: 4,
    elevation: 4,
    shadowOpacity: 3,
  },
  studentListButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  studentListImage: {
    marginTop: 50,
    marginBottom: 50,
    height: 120,
    width: 200,
  },
  activateButton: {
    width: '60%',
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 30,
  },
  activateButtonText: {
    fontSize: 24,
    fontWeight: '400',
    color: '#000',
    fontFamily: "ClashDisplay",
  },
  errorText: {
    fontSize: 18,
    color: '#e74c3c',
    marginBottom: 20,
    fontFamily: "ClashDisplay",
  },
  retryButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 30,
  },
  retryButtonText: {
    fontSize: 18,
    color: '#fff',
    fontFamily: "ClashDisplay",
  },
});
