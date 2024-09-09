import React, { useRef, useState, useEffect } from 'react'
import image from '../assets/roulette.png'
import { Button } from '@mui/material';
import io from 'socket.io-client';
import {RouletteSection,BlackJackTitle, BlackJackColumn, BlackJackBigColumn, StyledButton,DealerCard} from './index.jsx'
import { BetState } from '../context/BetsContext';
import { message } from 'antd';
import Swal from "sweetalert2";
import PlayersUI from '../components/blackjack/PlayersUI.jsx';
import { SocketState } from '../context/SocketsContext.jsx';
import { animationFour,transitionLong } from '../animations';
import {motion} from 'framer-motion'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const Roulette = () => {

  const [activeSocket, setActiveSocket] = useState(null);
  const {socket, setSocket} = SocketState();
  const [isConnected, setIsConnected] = useState(false);
  const {user, setUser} = BetState();
  const [playerName, setPlayerName] = useState(null)
  const [opponents, setOpponents] = useState([])
  const [playerLeft, setPlayerLeft] = useState(false)
  const [players, setPlayers] = useState([])
  const [room, setRoom] = useState(null);
  const [status, setStatus] = useState('');
  const [hand, setHand] = useState([]);
  const [deck, setDeck] = useState([]);
  const [dealer, setDealer] = useState([]);
  const [gameStarted, setGameStarted] = useState([]);
  const [currentUser, setCurrentUser] = useState("")
  const [notifications, setNotifications] = useState([]);
  const [initialValue, setInitialValue] = useState(2500)
  const {dealerHidden, setDealerHidden} = SocketState();
  const {dealerHand, setDealerHand} = SocketState();
  const {playerHand, setPlayerHand} = SocketState();
  const {gameData, setGameData} = SocketState();
  const {activeRoom, setActiveRoom} = SocketState();
  const {myId, setMyId} = SocketState();
  const {playOnline, setPlayOnline} = SocketState();
  const MAX_NOTIFICATIONS = 4;

  const notify = (message) => {
    toast(message, {
      className: "custom-toast",
      position: "top-right",
      autoClose: initialValue,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
          });
  };

  socket?.on("connect", function () {
    setPlayOnline(true);
  });
  socket?.on("playerLeft", (data) => {
    message.error(`${data} has left the room!!!`)
    setPlayerLeft(true)
  });

  socket?.on("firstRound", (data) => {
    const {gameData, player_id, room} = data;
    setPlayers(gameData.players);
    setActiveRoom(room)
    setGameData(gameData)
    setMyId(player_id.socket)
    setDealerHidden(gameData.dealerHidden)
    setDealerHand(gameData.dealerHand)
    setPlayerHand(gameData.playerHand)
  });

  socket?.on("welcomeNotification", (data) => {
    notify(data.message)
  });

  console.log("gameData",gameData)

  const takePlayerName = async () => {
    const result = await Swal.fire({
      title: "Enter your name",
      input: "text",
      showCancelButton: true,
      buttonsStyling: false,  // Disables SweetAlert2 button styling
      customClass: {
        confirmButton: 'swal-ok',  // Custom class for confirm button
        cancelButton: 'swal-cancel',
        popup: 'custom-swal-modal'      // Custom class for cancel button
      },
      inputValidator: (value) => {
        if (!value) {
          return "You need to write something!";
        }
      },
    });

    return result;
  };

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
    });
    setSocket(newSocket);
  }

  
  //if(!playOnline)
  if(!playOnline){
    return(
      <RouletteSection>
        <BlackJackTitle>BlackJack</BlackJackTitle>
          <StyledButton onClick={askSocket} id="button">PLAY ONLINE</StyledButton>
      </RouletteSection>
    )
  }
  //if(playOnline && players)
  if(playOnline && players){
    return(
      <RouletteSection>
        <BlackJackTitle>
          <BlackJackColumn>CHAT</BlackJackColumn>
          <BlackJackBigColumn>
        <div id="dealer-cards" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <motion.img id="hidden" src="./assets/cards/BACK.png" initial="out" animate="in" variants={animationFour} transition={transitionLong}/>
            {dealerHand.map(card => {
                return(
                    <DealerCard key={card} initial="out" animate="in" variants={animationFour} transition={transitionLong}><img src={`./assets/cards/${card}.png`} /></DealerCard>
                )
            })}
        </div>
        </BlackJackBigColumn>
        <BlackJackColumn>
          <ToastContainer position="top-right"
            autoClose={initialValue}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            rtl
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover
            theme="dark"/>
        </BlackJackColumn>
        </BlackJackTitle>
        <PlayersUI />
        <p id="results"></p>
      </RouletteSection>
    )
  }
}

export default Roulette
