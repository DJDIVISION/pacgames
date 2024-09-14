import React, { useEffect, useState, useRef } from 'react';
import { motion, useCycle } from "framer-motion";
import styled from 'styled-components'
import { StyledButton,DealerCard,ColumnTopSmall,ColumnTopBig } from './index'
import { DndContext } from '@dnd-kit/core';
import Swal from "sweetalert2";
import io from 'socket.io-client';
import { autoCloseOff,dismissAll,welcomeNotify,placeBetNotify,waitingtToStarttNotify,
 } from './functions'

import { BetState } from '../context/BetsContext';
import { ToastContainer, toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import Chips from '../components/blackjack/Chips';
import BetArea from '../components/blackjack/BetArea';
import { Avatar } from '@mui/material';

import { Swiper, SwiperSlide } from 'swiper/react';
import BJBack from '../assets/bjTable.jpg';
import 'swiper/css';
import 'swiper/css/effect-cards';
import {Button,CircularProgress } from '@mui/material'
import { EffectCards } from 'swiper/modules';
import { transitionLong,animationFour } from '../animations';

import ChatInput from '../components/chats/ChatInput';
import { StyledIconButton } from '../components/chats';
import ActionIcons from '../components/chats/ActionIcons';
import ChatMessages from '../components/chats/ChatMessages';
import PlayerCards from '../components/blackjack/PlayerCards';


const socket = io.connect("http://localhost:8080")




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

const BlackJack = ({player}) => {

  
  const [playOnline, setPlayOnline] = useState(false)
  const [playerName, setPlayerName] = useState(null);
  const [playerAvatar, setPlayerAvatar] = useState(null);
  const [myId, setMyId] = useState("");
  const [players, setPlayers] = useState([])
  const [activeRoom, setActiveRoom] = useState(null);
  const { user, setUser } = BetState();
  const [initialValue, setInitialValue] = useState(2500)
  const [chipMenuOpen, setChipMenuOpen] = useState(false)
  const [placedBet, setPlacedBet] = useState(null);
  const [droppedChips, setDroppedChips] = useState([]);
  const [droppedChipValue, setDroppedChipValue] = useState(null);
  const [dealerHidden, setDealerHidden] = useState([])
  const [dealerHand, setDealerHand] = useState([])
  const [playerHand, setPlayerHand] = useState([])
  const [dealerSum, setDealerSum] = useState(null);
  const [playerSum, setPlayerSum] = useState(null);
  const [playerAceCount, setPlayerAceCount] = useState(null);
  const [dealerAceCount, setDealerAceCount] = useState(null);
  const [gameData, setGameData] = useState([])
  
  const [activePlayer, setActivePlayer] = useState(false);
  const [active, setActive] = useState("menuTwo");
  const [loading, setLoading] = useState(true); 
  const [cantHit, setCantHit] = useState(false)
  const [balance, setBalance] = useState(500); // Initial state
  const [chatMenuOpen, setChatMenuOpen] = useState(false)
  
  const [isExpanded, setIsExpanded] = useState(false);
  
  
  
  

  
 
  

  const handleDragEnd = (event) => {
    const { over, active } = event;

    // Check if the chip was dropped in the bet area
    if (over && over.id === 'bet-area') {
      const chipValue = active.data.current.chipValue;
      if (chipValue === null) {
        setPlacedBet(chipValue);
        setDroppedChipValue(chipValue);
      } else {
        const oldValue = placedBet
        setPlacedBet(oldValue + chipValue)
        setDroppedChipValue(chipValue);
      }
      const chipImage = active.data.current.chipImage;
      setDroppedChips((prev) => [
        ...prev,
        { chipValue, chipImage },  // Store value and image of the chip
      ]);
    }
  };

  const disconnect = () => {
    socket?.emit('manual-disconnect')
    socket?.disconnect();
    setPlayOnline(false)
  }

  console.log(players)
  console.log(playOnline)

  useEffect(() => {
    socket.on('connect', () => {
      //setMyId(socket.id);
      setPlayOnline(true);
      console.log(`Connected with socket ID: ${socket.id}`);
    });

    // Handle socket disconnect
    socket.on('disconnect', () => {
      console.log('Disconnected');
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  console.log("IIIIIIIIIDDDDDDDDDDDD", activeRoom)

  useEffect(() => {
    socket?.on('thisIsYourId', (data) => {
      console.log("dataidididid", data)
      setMyId(data.playerId)
      setPlayOnline(true)
      waitingtToStarttNotify('Waiting for other players to join the room... ⌛')
    });
    socket?.on('update_players', (data) => {
      const { gameData, message } = data;
      setPlayers(gameData.players)
      setActiveRoom(gameData.room)
      console.log("updatePlayers", data)
      dismissAll();
      welcomeNotify(message)
      setTimeout(() => {
        dismissAll();
        waitingtToStarttNotify('Waiting for other players to join the room... ⌛')
      }, 2500)

    });
    socket.on('betting-start', (data) => {
      console.log("betting-start", data)
      dismissAll();
      placeBetNotify("You have 15 seconds to place your bet ⏱️")
      setPlayers(data.players)
      setChipMenuOpen(true)
      //setGameInProgress(true)
    });
    socket.on('new_update_players', (data) => {
      const { gameData, playerName, bet } = data;
      console.log("new_update_players", data)
      setPlayers(gameData.players)
      setActiveRoom(gameData.room)
      welcomeNotify(`${playerName} has placed a ${bet}$ bet`)
    });
    socket.on('allBetsPlaced', () => {
      welcomeNotify(`All bets have been placed!`)
    });
    socket.on('your-turn', () => {
      //setCurrentIndex(data.playerIndex)
      autoCloseOff(`It's your turn.`)
      setTimeout(() => {
        setActivePlayer(true)
      }, 1000)
      
    });
    socket.on('your-second-turn', (data) => {
      autoCloseOff(`It's your turn.`)
      setTimeout(() => {
        setActivePlayer(true)
      }, 1000)
      
    });
    socket.on('dealCards', (data) => {
      console.log("dealCardsData", data)
        setGameData(data.gameData)
        setPlayers(data.gameData.players)
        setPlayerSum(data.gameData.playerSum)
        setPlayerAceCount(data.gameData.playerAceCount)
        setDealerSum(data.gameData.dealerSum)
        setDealerAceCount(data.gameData.dealerAceCount)
        setDealerHidden(data.gameData.dealerHidden)
        setDealerHand(data.gameData.dealerHand)
        setPlayerHand(data.gameData.playerHand)
        console.log("fetched now!")
    });
    socket.on("cardAfterHit", (data) => {
      const {playerName,playerSum,gameData} = data;
      setPlayerSum(playerSum)
      setPlayers(gameData.players)
      if(playerSum > 21){
        dismissAll();
        welcomeNotify("You have lost the game! Try again!")
        document.getElementById("hitButton").display = 'none'
      }
    });
    socket.on("playerLost", (data) => {
      welcomeNotify(data.message)
    });
    socket.on("restoreAmount", (data) => {
      setPlayers(data.players)
    });
    socket.on("round-ended", (data) => {
      const {dealerSum, dealerHidden} = data;
      dismissAll();
      autoCloseOff(`The dealer has got ${dealerSum} points. Calculating scores...`)
      document.getElementById("hidden").src = "./assets/cards/" + dealerHidden + ".png";
      console.log("./assets/cards/" + dealerHidden + ".png");
    });
    socket.on("gameResults", (results) => {
      console.log("data.results",results.results)
    });
    socket.on("balanceUpdate", (data) => {
      const {playerName,status,payout} = data;
      if(payout > 0){
        if(status === "Win!"){
          const amount = balance + payout
          setBalance(amount)
          
          welcomeNotify("You have won! Your balance has been updated.")
        }
        if(status === "Push!"){
          const amount = balance + payout
          setBalance(amount)
          
          welcomeNotify("Push! Your bet has been returned.")
        }
        if(status === 'BlackJack!'){
          const amount = balance + payout
          setBalance(amount)
          
          welcomeNotify("BlackJack! Your earn 1.5x your bet.")
        }
      } else {
        if(status === 'Lose!'){
          
          welcomeNotify("You have lost the game! Try again!")
        }
      }
     });
    return () => {
      socket?.off('thisIsYourId');
      socket?.off('update_players');
      socket?.off('betting-start');
      socket?.off('new_update_players');
      socket?.off('allBetsPlaced');
      socket?.off('your-turn');
      socket?.off('dealCards');
      socket?.off('cardAfterHit');
      socket?.off('your-second-turn');
      socket?.off('round-ended');
      socket?.off('restoreAmount');
      socket?.off('balanceUpdate');
    };
  }, [socket])
  
  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % players?.length);
  };
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 + players?.length) % players?.length);
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

    socket?.emit("request_to_play", {
      playerName: username,
      id: user.id,
      avatar: user.user_metadata.avatar_url
    });
    //setSocket(newSocket);
  }

  const startGame = () => {

    if (placedBet > 0) {
      socket?.emit("place-bet", {
        bet: placedBet,
        room: activeRoom,
        id: myId
      });
      setChipMenuOpen(false)
      dismissAll();
      const amount = balance - placedBet
      setBalance(amount)
    } else {
      message.error("There is no bet placed!")
    }
  }

  const doubleBet= () => {
    const prev = placedBet
    const value = (prev * 2)
    setPlacedBet(value)
    const chip = document.getElementById("chipSum").innerHTML = value
    const number = (parseInt(chip) * 2).toString();
    console.log(chip)
    welcomeNotify(`${playerName} has doubled his bet!`)
    socket?.emit("doubledBet", {
      placedBet: value,
      room: activeRoom,
      id: myId,
  });
  }

  const askHit = () => {
      socket?.emit("askForHit", {
          placedBet: placedBet,
          room: activeRoom,
          id: myId,
          gameData: gameData
      });
  }

  const stay = () => {
    setActivePlayer(false)
    dismissAll();
    autoCloseOff("Waiting for other players to end.")
    setCantHit(false)
    //goToNext();
    socket?.emit("playerStays", {
      playerSum: playerSum,
      room: activeRoom,
      id: myId
    });
  }

 

  
  //if(playOnline && players)
  if (!playOnline) {
    return (
      <BlackSection>
        <BlackJackTitle>BlackJack</BlackJackTitle>
        <StyledButton onClick={askSocket} id="button" style={{ marginTop: '50px' }}>PLAY ONLINE</StyledButton>
      </BlackSection>
    )
  }
  //if(playOnline && players)
  if(playOnline && players) {
    return (
      <BlackJackSection>
        <BlackJackTitle animate={{ height: activePlayer ? '35vh' : '40vh' }}
        initial={{ height: '70vh' }}
        transition={{ duration: 0.5 }}>
        <ChatMessages isExpanded={isExpanded} setIsExpanded={setIsExpanded}/>
        <BlackJackBigColumn>
        <div id="dealer-cards" style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
            <motion.img id="hidden" src="./assets/cards/BACK.png" initial="out" animate="in" variants={animationFour} transition={transitionLong}/>
            {dealerHand?.map(card => {
                return(
                    <DealerCard key={card} initial="out" animate="in" variants={animationFour} transition={transitionLong}><img src={`./assets/cards/${card}.png`} /></DealerCard>
                )
            })}
        </div>
        </BlackJackBigColumn>
        <BalanceColumn onClick={disconnect}>
          <ColumnTopBig>
          <Avatar alt="Image" src={playerAvatar} sx={{ width: 60, height: 60 }} />
          </ColumnTopBig>
          <ColumnTopSmall>Balance: <span id="counter">{balance}</span></ColumnTopSmall>
        </BalanceColumn>
          
          
        </BlackJackTitle>
        <PlayerCards players={players} activePlayer={activePlayer}/>
        {/* <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <button onClick={disconnect}>Previous</button>
          <button onClick={goToNext}>Next</button>
        </div> */}
        <ToastContainer position="top-right"
          autoClose={initialValue}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl
          pauseOnFocusLoss={false}
          draggable
          pauseOnHover
          theme="dark" />
        {chipMenuOpen && (
          <motion.div className="menu-container-seven" variants={item}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "70vh" }}
            transition={{ duration: .5 }}
            exit="exit">
            <DndContext onDragEnd={handleDragEnd}>
              <ChipBalance>{placedBet !== 0 ? <div className="bet-info">Bet placed with: ${placedBet} chip</div> : <div className="bet-info">Time remaining: {timeRemaining}</div>}</ChipBalance>
              <BetArea droppedChips={droppedChips} droppedChipValue={droppedChipValue} />
              <BJStartGame><StyledButton onClick={startGame} /* disabled={disabled} */>START GAME</StyledButton></BJStartGame>
              <Chips />
            </DndContext>
          </motion.div>
        )}
        {activePlayer && (
            <ActionButtons initial={{ opacity: 0, y: '13vh' }}
          animate={{ opacity: 1, y: '-10px' }}
          transition={{ duration: 0.5 }}>
                {cantHit ? (
                  <StyledButton onClick={stay}>FOLD</StyledButton>
                ) : (
                  <>
                    <StyledButton onClick={doubleBet}>DOUBLE</StyledButton>
                    <StyledButton id="hitButton" onClick={askHit}>HIT</StyledButton>
                    <StyledButton onClick={stay}>STAY</StyledButton>
                  </>
                )}
            </ActionButtons>
        )}
      </BlackJackSection>
    );
  }
};

// Function to get the transform based on the index
const getTransformForIndex = (index) => {
  const transforms = [
    'translateZ(0) rotateX(15deg)',
    'rotateY(10deg) translateX(520px) translateZ(-50px) rotateX(15deg) scale(1.05)',
    'rotateY(5deg) translateX(250px) translateZ(-50px) rotateX(15deg) scale(1.05)',
    'rotateY(-5deg) translateX(-250px) translateZ(-50px) rotateX(15deg) scale(1.05)',
    'rotateY(-10deg) translateX(-520px) translateZ(-50px) rotateX(15deg) scale(1.05)'
  ];
  return transforms[index];
};



export default BlackJack;





const BlackJackBigColumn = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 0;
    left: 25vw;
`;

const BalanceColumn = styled.div`
    width: 25vw;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 24px;
    flex-direction: column;
    padding: 5px;
    position: absolute;
    top: 0;
    left: 75vw;
`;








const ActionButtons = styled(motion.div)`
    width: 30%;
    height: 10vh;
    border: 1px solid ${props => props.theme.MainAccent};
    background: rgba(0, 0, 0, 0.6);
    backdrop-filter: blur(10px);
    display: flex;
    align-items: center;
    justify-content: space-around;
    border-radius: 10px;
`;





const item = {
  exit: {
    opacity: 0,
    height: 0,
    transition: {
      ease: "easeInOut",
      duration: 0.3,
      delay: 1
    }
  }
}

const ChipBalance = styled.div`
    width: 50%;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: space-around;
`;

const BJStartGame = styled.div`
    width: 30%;
    height: 15vh;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const BlackJackSection = styled.div`
    width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
    align-items: center;
    background-image: url(${BJBack});
    background-repeat: no-repeat;
    background-size: cover;
    
`;

const BlackSection = styled.div`
    width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlackJackTitle = styled(motion.div)`
    width: 100%;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 98px;
    position: relative;
`;












