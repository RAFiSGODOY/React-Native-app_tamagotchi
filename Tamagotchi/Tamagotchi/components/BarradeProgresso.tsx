import React from 'react';
import { View, StyleSheet, Text } from 'react-native';

interface ProgressBarProps {
  progress: number;
  width?: number;
  height?: number;
  numSquares?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  width = 200,
  height = 20,
  numSquares = 7,
}) => {
  const squareWidth = width / numSquares;
  const filledSquares = Math.floor((progress / 100) * numSquares);

  return (
    <View style={[styles.container, { width, height }]}>
      {Array.from({ length: numSquares }).map((_, index) => {
        const color = index < filledSquares ? '#00ff6e' : '#b8b8b8'; 
        return (
          <View
            key={index}
            style={[
              styles.square,
              { backgroundColor: color },
              { width: squareWidth, height: height },
              { marginRight: 1 } 
            ]}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 2,
    backgroundColor: '#ffff',
    overflow: 'hidden',
    marginBottom: 10,
    marginRight: 20,
  },
  square: {
    flex:1,
  },
});

export default ProgressBar;