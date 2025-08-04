import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/useColorScheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="splash" options={{ headerShown: false }} />
        <Stack.Screen name="login-selection" options={{ headerShown: false }} />
        <Stack.Screen name="student-signin" options={{ headerShown: false }} />
        <Stack.Screen name="teacher-signin" options={{ headerShown: false }} />
        <Stack.Screen name="teacher-login" options={{ headerShown: false }} />
        <Stack.Screen name="subjects" options={{ headerShown: false }} />
        <Stack.Screen name="subject-detail" options={{ headerShown: false }} />
        <Stack.Screen name="students" options={{ headerShown: false }} />
        <Stack.Screen name="subjects-student" options={{ headerShown: false }} />
        <Stack.Screen name="subject-mark-attendance" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
      {/* <StatusBar style="auto" /> */}
    </ThemeProvider>
  );
}
