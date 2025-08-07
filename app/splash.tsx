import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { StyleSheet, Text, View,Image } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/login-selection');
    }, 4000); 

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        {/* <MaterialIcons name="person" size={100} color="#004d40" /> */}
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
    fontFamily: "Playwrite US Modern",
    color: '#004d40',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontFamily: "Playwrite US Modern",
    color: '#7a7a7a',
  },
});