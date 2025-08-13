import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { useColorScheme } from '@/hooks/useColorScheme';
import { AuthProvider } from '../context/AuthContext';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ClashDisplay: require('../assets/fonts/ClashDisplay-Variable.ttf'),
    ClashGrostek: require('../assets/fonts/ClashGrotesk-Variable.ttf'),
    Playwrite: require('../assets/fonts/PlaywriteUSModern-VariableFont_wght.ttf'),
  });

  if (!loaded) {
    return null;
  }

  return (
    <AuthProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="splash" options={{ headerShown: false }} />

          <Stack.Screen name="login-selection" options={{ headerShown: false }} />

          <Stack.Screen name="student-signin" options={{ headerShown: false }} />
          <Stack.Screen name="student-login" options={{ headerShown: false }} />

          <Stack.Screen name="teacher-signin" options={{ headerShown: false }} />
          <Stack.Screen name="teacher-login" options={{ headerShown: false }} />

          <Stack.Screen name="subjects-teachers" options={{ headerShown: false }} />
          <Stack.Screen name="subjects-students" options={{ headerShown: false }} />

          <Stack.Screen name="subject-detail" options={{ headerShown: false }} />

          <Stack.Screen name="students" options={{ headerShown: false }} />

          <Stack.Screen name="add-subject" options={{ headerShown: false }} />

          <Stack.Screen name="subject-mark-attendance" options={{ headerShown: false }} />

          <Stack.Screen name="profile-teacher" options={{ headerShown: false }} />
          {/* <Stack.Screen name="profile-student" options={{ headerShown: false }} /> */}
          
          <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </AuthProvider>
  );
}
