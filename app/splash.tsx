import { MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login-selection');
    }, 2000); // Navigate after 2 seconds

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <MaterialIcons name="person" size={100} color="#004d40" />
        <MaterialIcons
          name="check-circle"
          size={40}
          color="#4caf50"
          style={styles.checkIcon}
        />
      </View>
      <Text style={styles.title}>UniAttend</Text>
      <Text style={styles.subtitle}>Attendance Made Easy.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff9f0',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  checkIcon: {
    position: 'absolute',
    right: -10,
    top: 10,
  },
  title: {
    fontSize: 32,
    fontFamily: 'Cochin',
    color: '#004d40',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: 'Snell Roundhand',
    color: '#7a7a7a',
  },
});
