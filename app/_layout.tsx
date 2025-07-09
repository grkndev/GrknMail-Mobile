import { AuthProvider, useAuth } from "@/context/auth";
import "@/global.css";
import '@/lib/utils';

import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, View } from 'react-native';
import 'react-native-reanimated';

function RootLayoutContent() {
  const { user, isLoading } = useAuth();
  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  if (!loaded) {
    // Async font loading only occurs in development.
    return null;
  }

  if (isLoading) {
    // Show loading screen while authentication state is being determined
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  const isLoggedIn = user ? true : false;
  console.log(user);
  console.log(isLoggedIn);
  
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} initialRouteName={isLoggedIn ? "(DrawerScreens)" : "(auth)/SignIn"}>
        <Stack.Protected guard={isLoggedIn}>
          <Stack.Screen name="(DrawerScreens)" />
          <Stack.Screen name="(screens)" />
        </Stack.Protected>

        <Stack.Protected guard={!isLoggedIn}>
          <Stack.Screen name="(auth)/SignIn" />
        </Stack.Protected>
        <Stack.Screen name="+not-found" />
      </Stack>
      <StatusBar style="dark" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutContent />
    </AuthProvider>
  );
}
