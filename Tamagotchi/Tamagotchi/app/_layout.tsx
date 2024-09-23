import { Stack } from 'expo-router';
import { useFonts } from 'expo-font';
import 'react-native-reanimated';
import React, { useEffect } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { initDatabase } from './database/initDatabase';

export default function RootLayout() {

  const [loaded] = useFonts({
    Minecraft: require('../assets/fonts/Minecraft.ttf'),
  });
  useEffect(() => {
    if (loaded) {
      
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }

  return (
    <SQLiteProvider databaseName="myDatabase.db" onInit={initDatabase}>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="cadastrar" options={{ headerShown: false }} />
        <Stack.Screen name="escolhername" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </SQLiteProvider>
  );
}
