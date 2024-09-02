import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NavigationProp } from '@react-navigation/native';

type NavigationProps = NavigationProp<any>;

export default function Welcome() {
  const navigation = useNavigation<NavigationProps>();

  return (
    <View style={styles.container}>
      <View style={styles.containerPrincipal}>
        
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFF',
    overflow: 'hidden',
  },
 
  containerPrincipal: {
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    width: '100%',
    height: '90%',
  },
});

