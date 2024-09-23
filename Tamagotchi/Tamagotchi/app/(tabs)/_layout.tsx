import { Stack, Tabs } from 'expo-router';
import React, { useEffect } from 'react';
import { useFonts } from 'expo-font';
import { StyleSheet, Text } from 'react-native';
import { ProgressProvider } from '../../components/Progresso';

export default function TabLayout() {
  const [loaded] = useFonts({
    Minecraft: require('../../assets/fonts/Minecraft.ttf'),
  });
  useEffect(() => {
    if (loaded) {
     
    }
  }, [loaded]);
  if (!loaded) {
    return null;
  }
  return (
    <ProgressProvider>
    <Stack>
      <Stack.Screen 
        name="Comer" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Jogar" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="Dormir" 
        options={{ headerShown: false }} 
      />
      <Stack.Screen 
        name="game01" 
        options={{ headerShown: false }} 
      />
    </Stack>
  </ProgressProvider>
  );
}

const styles = StyleSheet.create({

});
