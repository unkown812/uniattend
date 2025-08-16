import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

export default function ProfileScreen() {
  const profile = {
    name: 'Arpit Salunkhe',
    roll: '01',
    sem: '5',
    course: 'Computer Science',
  };

  const onEditPress = () => {
    // TODO: Handle edit action
    console.log('Edit pressed');
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Profile</Text>
        <Image
          source={require('../assets/images/teacherIllustration.png')}
          style={styles.image}
          resizeMode="contain"
        />
        <View style={styles.infoContainer}>
          <Text style={styles.label}>Name</Text>
          <Text style={styles.value}>{profile.name}</Text>

          <Text style={styles.label}>Roll</Text>
          <Text style={styles.value}>{profile.roll}</Text>

          <Text style={styles.label}>Sem</Text>
          <Text style={styles.value}>{profile.sem}</Text>

          <Text style={styles.label}>Course</Text>
          <Text style={styles.value}>{profile.course}</Text>
        </View>

        <TouchableOpacity style={styles.editButton} onPress={onEditPress}>
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
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
  editButton: {
    backgroundColor: '#4a7c59',
    borderRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 80,
    borderWidth: 1,
    borderColor: '#000',
    shadowColor: '#3a5a39',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
    elevation: 8,
  },
  editButtonText: {
    fontFamily: 'ClashDisplay',
    fontSize: 22,
    color: '#000',
    fontWeight: '400',
  },
});
