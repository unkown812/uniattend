import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
          router.replace('/login-selection');
      }, 2000); 
      return () => clearTimeout(timer);
    }
  }, [loading]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Image source={require('../assets/images/logo.png')} style={styles.checkIcon} />
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 20,
  },
  checkIcon: {
    alignSelf: 'center',
    height: 180,
    width: 180,
  },
  title: {
    fontSize: 32,
    fontFamily: "Playwrite",
    color: '#004d40',
    // fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Playwrite",
    fontWeight: "400",
    color: '#7a7a7a',
  },
});