import * as React from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, View } from 'react-native';
import Card from './Card';
import ConfettiCannon from 'react-native-confetti-cannon';
import { Picker } from '@react-native-picker/picker';
import { cardsEasy, cardsMedium, cardsHard } from './Levels';

//funcion para desordenar/revolver las tarjetas - random
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    //cambia los elementos al index i y randomIndex
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}

export default function App() {

  //la card tiene que estar duplicada para poder encontrar la igual
  const [board, setBoard] = React.useState(() => shuffle([...cardsEasy, ...cardsEasy]));
  const [selectedCards, setSelectedCards] = React.useState([]);
  const [matchedCards, setMatchedCards] = React.useState([]);
  const [score, setScore] = React.useState(0);
  const [level, setLevel] = React.useState('Easy');

  React.useEffect(() => {
    if (selectedCards.length < 2) return;
    //comparar las tarjetas si son iguales -> usado los index
    if (board[selectedCards[0]] === board[selectedCards[1]]) {
      setMatchedCards([...matchedCards, ...selectedCards]);
      setSelectedCards([]);
    } else {
      //crear un time out para que gire la carta cuando no son iguales
      const timeoutId = setTimeout(() => setSelectedCards([]), 1000);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCards]);

  function changeLevel(itemValue) {
    if(itemValue === 'Fácil') {
      setBoard(() => shuffle([...cardsEasy, ...cardsEasy]));
      setLevel(itemValue);
      resetGame();
    }
    if(itemValue === 'Medio') {
      setBoard(() => shuffle([...cardsMedium, ...cardsMedium]));
      setLevel(itemValue);
      resetGame();
    }
    if(itemValue === 'Dificil') {
      setBoard(() => shuffle([...cardsHard, ...cardsHard]));
      setLevel(itemValue);
      resetGame();
    }
  };

  const handleTapCard = (index) => {
    if (selectedCards.length >= 2 || selectedCards.includes(index)) return;
    setSelectedCards([...selectedCards, index]);
    setScore(score + 1);
  };

  const didPlayerWin = () => matchedCards.length === board.length;

  const resetGame = () => {
    setMatchedCards([]);
    setScore(0);
    setSelectedCards([]);
  };
  
  return (
    <View style={styles.container}>
      {didPlayerWin() ? <ConfettiCannon count={50} origin={{x: -10, y: 0}} /> : null}
      <Text style={styles.title}>
        {didPlayerWin() ? "Felicitaciones 🎉" : "Memorama"}
      </Text>
      <Text style={styles.title}>Score: {score}</Text>
      <Picker
        style={styles.input}
        dropdownIconColor='white'
        selectedValue={level}
        onValueChange={(itemValue) => changeLevel(itemValue)}
      >
        <Picker.Item label="Fácil" value="Fácil" />
        <Picker.Item label="Medio" value="Medio" />
        <Picker.Item label="Dificil" value="Dificil" /> 
      </Picker>
      <View style={styles.board}>
        {board.map((card, index) => {
          const isTurnedOver = 
            selectedCards.includes(index) || matchedCards.includes(index);
          return (
            <Card 
              key={index}
              isTurnedOver={isTurnedOver}
              onPress={() => handleTapCard(index)}
            >{card}</Card>
          )
        })}
      </View>
      {didPlayerWin() && <Button onPress={resetGame} title="try again" />}
      <StatusBar style="light" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    color: "white",
    fontWeight: "900",
  },
  input: {
    width: '36%',
    fontSize: 30,
    fontWeight: '900',
    color: 'white',
    marginVertical: -4
  },
  board: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
  }
});