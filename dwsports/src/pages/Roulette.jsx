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
  const {playerName, setPlayerName} = SocketState();
  const {playerAvatar, setPlayerAvatar} = SocketState();
  const MAX_NOTIFICATIONS = 4;

  useEffect(() => {
    console.log(dealerHand)
  }, [dealerHand])

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

  const disconnect = () => {
    socket.disconnect();
    setPlayOnline(false)
}

  useEffect(() => {
    socket?.on("welcomeNotification", (data) => {
      notify(data.message)
    });
    return () => {
      socket.off('welcomeNotification');
  };
  }, [])

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







  const askSocket = async () => {
    //setMyId(user.id)
    setPlayerAvatar(user.user_metadata.avatar_url)
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
      id: user.id,
      avatar: user.user_metadata.avatar_url
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
          <BlackJackColumn onClick={disconnect}>CHAT {activeRoom}</BlackJackColumn>
          <BlackJackBigColumn>
        <div id="dealer-cards" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <motion.img id="hidden" src="./assets/cards/BACK.png" initial="out" animate="in" variants={animationFour} transition={transitionLong}/>
            {dealerHand?.map(card => {
              console.log(card)
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
        <PlayerGrid>
        {players?.map(player => {
            return(
                <>
                <PlayerWrapper key={player.id}>
                    <PlayerAvatarWrapper>
                    <PlayerAvatar>
                    <Avatar alt="Image" src={player.avatar} sx={{ width: 80, height: 80 }}/>
                    </PlayerAvatar>
                    <PlayerAvatarName>{player.name}</PlayerAvatarName>
                    </PlayerAvatarWrapper>
                    <PlayerBet>
                        <CurrentBetText>CURRENT BET</CurrentBetText>
                        <PlayerChip id="playerChip">{player.bet}</PlayerChip>
                        <CurrentBetText>POINTS: {player.playerSum}</CurrentBetText>
                    </PlayerBet>
                    <PlayerCardsHolder id="player-cards" ref={cardsContainerRef}>
                        {player.hand.map(card => {
                            return(
                                <PlayerCard initial="out" animate="in" variants={animationFour} transition={transitionLong}><img src={`./assets/cards/${card}.png`} /></PlayerCard>
                            )
                        })}
                    </PlayerCardsHolder>
                </PlayerWrapper>
                {activePlayer && (
                    <ActionButtons animate={animate} transition={transition}>
                        <StyledButton onClick={doubleBet}>DOUBLE</StyledButton>
                        {player.playerSum <= 21 && <StyledButton onClick={askHit}>HIT</StyledButton>}
                        {player.playerSum <= 21 ? (
                            <StyledButton /* onClick={stay} */>STAY</StyledButton>
                        ) : (
                            <StyledButton /* onClick={stay} */>FINISH GAME</StyledButton>
                        )}
                    </ActionButtons>
                )}
                </>
            )
        })}
        
        {gameFinished && (
            <ActionButtons animate={animate} transition={transition}>
                <StyledButton onClick={disconnect}>LEAVE ROOM</StyledButton>
                <StyledButton onClick={keepPlaying}>PLAY AGAIN</StyledButton>
            </ActionButtons>
        )}
        {chipMenuOpen && (
            <motion.div className="menu-container-seven" variants={item}
            initial={{opacity:0, height: 0}}
            animate={{ opacity:1, height: "70vh"}}
            transition={{duration:.5}}
            exit="exit">
                <DndContext onDragEnd={handleDragEnd}>
                    <ChipBalance>{placedBet !== 0 ? <div className="bet-info">Bet placed with: ${placedBet} chip</div> : <div className="bet-info">Time remaining: {timeRemaining}</div>}</ChipBalance>
                    <BetArea droppedChips={droppedChips} droppedChipValue={droppedChipValue}/>
                    <BJStartGame><StyledButton onClick={startGame} disabled={disabled}>START GAME</StyledButton></BJStartGame>
                <   Chips />
                </DndContext>
            </motion.div>
        )}
    </PlayerGrid>
        <p id="results"></p>
      </RouletteSection>
    )
  }
}

export default Roulette
