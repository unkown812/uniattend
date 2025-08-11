import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useAuth } from '../context/AuthContext';

export default function SplashScreen() {
  const router = useRouter();
  const { user, userType, loading, isFirstLaunch } = useAuth();

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        if (isFirstLaunch) {
          // First time launch - show signup
          router.replace('/login-selection');
        } else if (user && userType) {
          // User is logged in - redirect to appropriate subjects
          if (userType === 'student') {
            router.replace('/subjects-students');
          } else if (userType === 'teacher') {
            router.replace('/subjects-teachers');
          }
        } else {
          // Not first launch but not logged in - show login
          router.replace('/login-selection');
        }
      }, 2000); // Reduced from 4000ms for better UX

      return () => clearTimeout(timer);
    }
  }, [router, user, userType, loading, isFirstLaunch]);

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