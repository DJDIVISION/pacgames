import React, { useRef, useState, useEffect } from 'react'
import image from '../assets/roulette.png'
import { Button } from '@mui/material';
import io from 'socket.io-client';
import {RouletteSection,BlackJackTitle, BlackJackColumn, BlackJackBigColumn} from './index.jsx'
import { BetState } from '../context/BetsContext';
import { message } from 'antd';
import Swal from "sweetalert2";
import { pokerCards } from '../data/cards.jsx';



const Roulette = () => {

  const [activeSocket, setActiveSocket] = useState(null);
  const [socket, setSocket] = useState(null);
  const {user, setUser} = BetState();
  const [playerName, setPlayerName] = useState(null)
  const [opponents, setOpponents] = useState([])
  const [playerId, setPlayerId] = useState(null)
  const [allPlayers, setAllPlayers] = useState([])
  const [playOnline, setPlayOnline] = useState(false);
  const [room, setRoom] = useState(null);
  const [hand, setHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [currentUser, setCurrentUser] = useState("")
  
  let dealerSum = 0;
  let yourSum = 0;

  let dealerAceCount = 0;
  let yourAceCount = 0; 

  let hidden;
  let canHit = true;

  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    return result;
  };

  console.log(playOnline)

  socket?.on("connect", function () {
    setPlayOnline(true)
  });

  socket?.on('room-assigned', (data) => {
    const { room, playersInRoom, gameStage, welcomeMessage, currentUser, allPlayers } = data;

    setRoom(room);
    setCurrentUser(currentUser)
    console.log('Assigned to room:', room);
    console.log('Players in room:', playersInRoom);
    console.log('Current game stage:', gameStage);
    console.log('Message:', welcomeMessage);
    if(room){
      buildDeck();
      /* shuffleDeck(); */
      startGame(); 
    } 
  });

  function buildDeck() {
    let values = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    let types = ["C", "D", "H", "S"];
    const deck = [];

    for (let i = 0; i < types.length; i++) {
        for (let j = 0; j < values.length; j++) {
            deck.push(values[j] + "-" + types[i]); //A-C -> K-C, A-D -> K-D
        }
    }
    for (let i = 0; i < deck.length; i++) {
      let j = Math.floor(Math.random() * deck.length); // (0-1) * 52 => (0-51.9999)
      let temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
  }
    console.log(deck)
    setDeck(deck)
}



useEffect(() => {
  if(deck){
    startGame();
  }
}, [deck])

function startGame() {
  if(deck.length > 0){
    hidden = deck.pop();
    console.log(deck)
    dealerSum += getValue(hidden);
    dealerAceCount += checkAce(hidden);
    console.log(hidden);
    console.log(dealerSum);
    while (dealerSum < 17) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./assets/cards/" + card + ".png";
        dealerSum += getValue(card);
        dealerAceCount += checkAce(card);
        document.getElementById("dealer-cards").append(cardImg);
    }
    console.log(dealerSum);

    for (let i = 0; i < 2; i++) {
        let cardImg = document.createElement("img");
        let card = deck.pop();
        cardImg.src = "./assets/cards/" + card + ".png";
        yourSum += getValue(card);
        yourAceCount += checkAce(card);
        document.getElementById("your-cards").append(cardImg);
        document.getElementById("hit").addEventListener("click", hit);
        document.getElementById("stay").addEventListener("click", stay);
    }
  }

  }

  function getValue(card) {
    if(card){
      let data = card.split("-");
      let value = data[0];
    
      if (isNaN(value)) { 
          if (value == "A") {
              return 11;
          }
          return 10;
      }
      return parseInt(value);
    }
  }
  
  function checkAce(card) {
    if(card){
      if (card[0] == "A") {
        return 1;
    }
    return 0;
    }
  }

  function hit() {
    if (!canHit) {
        return;
    }

    let cardImg = document.createElement("img");
    let card = deck.pop();
    cardImg.src = "./assets/cards/" + card + ".png";
    yourSum += getValue(card);
    yourAceCount += checkAce(card);
    document.getElementById("your-cards").append(cardImg);

    if (reduceAce(yourSum, yourAceCount) > 21) { //A, J, 8 -> 1 + 10 + 8
        canHit = false;
        
    }

  }

  function reduceAce(playerSum, playerAceCount) {
    while (playerSum > 21 && playerAceCount > 0) {
        playerSum -= 10;
        playerAceCount -= 1;
    }
    return playerSum;
}
  

function stay() {
    dealerSum = reduceAce(dealerSum, dealerAceCount);
    yourSum = reduceAce(yourSum, yourAceCount);

    canHit = false;
    document.getElementById("hidden").src = "./assets/cards/" + hidden + ".png";

    let message2 = "";
    if (yourSum > 21) {
        message2 = "You Lose!";
        message.error("You Lose!")
    }
    else if (dealerSum > 21) {
        message2 = "You win!";
        message.success("You Win!")
    }
    //both you and dealer <= 21
    else if (yourSum == dealerSum) {
        message2 = "Tie!";
        message.warning("Tie!")
    }
    else if (yourSum > dealerSum) {
        message2 = "You Win!";
        message.success("You Win!")
    }
    else if (yourSum < dealerSum) {
        message2 = "You Lose!";
        message.error("You Lose!")
    }

    document.getElementById("dealer-sum").innerText = dealerSum;
    document.getElementById("your-sum").innerText = yourSum;
    document.getElementById("results").innerText = message;
}

  const askSocket = async () => {
    const result = await takePlayerName();
    if (!result.isConfirmed) {
      return;
    }
    const username = result.value;
    setPlayerName(username);
    const newSocket = io("http://localhost:8080", {
      autoConnect: true,
    });
    newSocket?.emit("request_to_play", {
      playerName: username,
      balance: 500
    });
    setSocket(newSocket);
  }

  if(!playOnline){
    return(
      <RouletteSection>
        <BlackJackTitle>BlackJack</BlackJackTitle>
          <Button onClick={askSocket} color="success" variant="outlined" id="button">PLAY ONLINE</Button>
      </RouletteSection>
    )
  }

  if(playOnline && room){
    return(
      <RouletteSection>
        <BlackJackTitle>
          <BlackJackColumn>ROOM: {room}</BlackJackColumn>
          <BlackJackBigColumn>
        <div id="dealer-cards">
            <img id="hidden" src="./assets/cards/BACK.png" />
        </div>
        </BlackJackBigColumn>
        <BlackJackColumn>PLAYER: {currentUser}</BlackJackColumn>
        </BlackJackTitle>
        <h2>You: <span id="your-sum"></span></h2>
        <div id="your-cards"></div>

        <br />
        <div style={{display: 'flex'}}>
        <button id="hit">Hit</button>
        <button id="stay">Stay</button>
        </div>
        <p id="results"></p>
      </RouletteSection>
    )
  }
}

export default Roulette
