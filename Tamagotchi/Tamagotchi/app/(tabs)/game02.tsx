import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';

const Game02 = () => {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [winner, setWinner] = useState<string | null>(null);

  
  const handlePress = (index: number) => {
   
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

 
  useEffect(() => {
    const winner = calculateWinner(board);
    if (winner) {
      setWinner(winner);
      Alert.alert('Game Over', `The winner is: ${winner}`);
    } else if (!board.includes(null)) {
      Alert.alert('Draw', 'The game ended in a draw!');
    }
  }, [board]);

  
  const renderSquare = (index: number) => (
    <TouchableOpacity key={index} style={styles.square} onPress={() => handlePress(index)}>
      <Text style={styles.squareText}>{board[index]}</Text>
    </TouchableOpacity>
  );

  
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setWinner(null);
  };

  const status = winner ? `Winner: ${winner}` : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <View style={styles.container}>
      <Text style={styles.status}>{status}</Text>
      <View style={styles.board}>
        {[...Array(9)].map((_, index) => renderSquare(index))}
      </View>
      <TouchableOpacity style={styles.resetButton} onPress={resetGame}>
        <Text style={styles.resetText}>Reset</Text>
      </TouchableOpacity>
    </View>
  );
};


const calculateWinner = (squares: Array<string | null>) => {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    height: 300,
    marginVertical: 20,
  },
  square: {
    width: 100,
    height: 100,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareText: {
    fontSize: 36,
    fontFamily: 'Minecraft', 
  },
  status: {
    fontSize: 24,
    fontFamily: 'Minecraft',
    color: '#FFF',
  },
  resetButton: {
    backgroundColor: 'black',
    padding: 20,
    borderRadius: 5,
    borderWidth:0.5,
    borderColor:'white',
  },
  resetText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontFamily: 'Minecraft',
  },
});

export default Game02;
