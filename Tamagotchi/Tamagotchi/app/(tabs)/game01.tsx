import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { Gyroscope } from 'expo-sensors';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');
const SHIP_WIDTH = 50;
const SHIP_HEIGHT = 50;
const OBSTACLE_SIZE = 40;
const INITIAL_OBSTACLE_INTERVAL = 2000; // Increased interval for fewer obstacles

type Obstacle = {
  id: number;
  x: number;
  y: number;
};

const Game01 = () => {
  const shipPositionRef = useRef({ x: width / 2 - SHIP_WIDTH / 2 });
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const obstacleId = useRef(0);
  const obstacleIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const score = useRef(0);
  const gyroscopeDataRef = useRef({ x: 0 });
  const OBSTACLE_SPEED = 10; // Increased speed of obstacles
  const [gamePaused, setGamePaused] = useState(false);

  useEffect(() => {
    Gyroscope.setUpdateInterval(100);
    const subscription = Gyroscope.addListener((data) => {
      // Invert gyroscope data
      gyroscopeDataRef.current = { x: -data.x };
    });

    startObstacleGeneration();
    return () => {
      subscription.remove();
      stopObstacleGeneration();
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (!gamePaused) {
        // Update ship position
        const shipSpeed = 10;
        shipPositionRef.current.x += gyroscopeDataRef.current.x * shipSpeed;
        shipPositionRef.current.x = Math.max(0, Math.min(shipPositionRef.current.x, width - SHIP_WIDTH));

        // Update obstacles
        setObstacles((prevObstacles) => {
          const updatedObstacles = prevObstacles
            .map((obstacle) => ({ ...obstacle, y: obstacle.y + OBSTACLE_SPEED }))
            .filter((obstacle) => obstacle.y < height);

          // Collision detection
          updatedObstacles.forEach((obstacle) => {
            if (
              shipPositionRef.current.x < obstacle.x + OBSTACLE_SIZE &&
              shipPositionRef.current.x + SHIP_WIDTH > obstacle.x &&
              height - SHIP_HEIGHT < obstacle.y + OBSTACLE_SIZE
            ) {
              Alert.alert('Game Over', `Você colidiu! Sua pontuação: ${score.current}`, [
                { text: 'OK', onPress: resetGame },
              ]);
              setGamePaused(true); // Pause the game
            }
          });

          score.current += 1; // Increment score
          return updatedObstacles;
        });
      }
    }, 100);

    return () => clearInterval(interval);
  }, [gamePaused]);

  const startObstacleGeneration = () => {
    obstacleIntervalRef.current = setInterval(() => {
      if (!gamePaused) {
        const newObstacle: Obstacle = {
          id: obstacleId.current++,
          x: Math.random() * (width - OBSTACLE_SIZE),
          y: -OBSTACLE_SIZE,
        };
        setObstacles((prev) => [...prev, newObstacle]);
      }
    }, INITIAL_OBSTACLE_INTERVAL);
  };

  const stopObstacleGeneration = () => {
    if (obstacleIntervalRef.current) {
      clearInterval(obstacleIntervalRef.current);
    }
  };

  const resetGame = () => {
    setObstacles([]);
    obstacleId.current = 0;
    stopObstacleGeneration();
    startObstacleGeneration();
    score.current = 0;
    setGamePaused(false); // Resume the game
  };

  const renderObstacles = () => {
    return obstacles.map((obstacle) => (
      <View
        key={obstacle.id}
        style={[styles.obstacle, { left: obstacle.x, top: obstacle.y }]}
      />
    ));
  };

  return (
    <LinearGradient colors={['#4c669f', '#3b5998', '#192f6a']} style={styles.background}>
      <Text style={styles.title}>Desvie dos Obstáculos! Pontuação: {score.current}</Text>
      {renderObstacles()}
      <View style={[styles.ship, { left: shipPositionRef.current.x }]} />
      {gamePaused && (
        <TouchableOpacity style={styles.pauseOverlay} onPress={resetGame}>
          <Text style={styles.pauseText}>Jogo Pausado. Toque para Reiniciar.</Text>
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    position: 'absolute',
    top: 50,
  },
  ship: {
    width: SHIP_WIDTH,
    height: SHIP_HEIGHT,
    backgroundColor: '#FF4500',
    position: 'absolute',
    bottom: 50,
    borderRadius: 10,
  },
  obstacle: {
    width: OBSTACLE_SIZE,
    height: OBSTACLE_SIZE,
    backgroundColor: '#00FF00',
    position: 'absolute',
    borderRadius: 5,
  },
  pauseOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  pauseText: {
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
});

export default Game01;
