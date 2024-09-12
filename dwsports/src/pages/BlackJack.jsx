import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components'
import {StyledButton,Disconnect} from './index'
import { DndContext } from '@dnd-kit/core';
import Swal from "sweetalert2";
import io from 'socket.io-client';
import {waitingtToStarttNotify,dismissAll,welcomeNotify,placeBetNotify} from './functions'
import { BetState } from '../context/BetsContext';
import { ToastContainer, toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import Chips from '../components/blackjack/Chips';
import BetArea from '../components/blackjack/BetArea';
import { Avatar } from '@mui/material';
import chipImage from '../assets/chips/emptyChip.png'

const socket = io.connect("http://localhost:8080")
// Array of content objects
const contents = [
  { title: 'Victor', description: 'This is the first card', bet: 50 },
  { title: 'David', description: 'This is the second card', bet: 75 },
  { title: 'Bittu', description: 'This is the third card', bet: 50 },
  { title: 'Rick', description: 'This is the fourth card', bet: 25},
  { title: 'Morty', description: 'This is the fifth card', bet: 100 }
];

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

const BlackJack = () => {
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playOnline, setPlayOnline] = useState(false)
  const [playerName, setPlayerName] = useState(null);
  const [playerAvatar, setPlayerAvatar] = useState(null);
  const [myId, setMyId] = useState(null);
  const [players, setPlayers] = useState([])
  const [activeRoom, setActiveRoom] = useState(null);
  const {user, setUser} = BetState();
  const [initialValue, setInitialValue] = useState(2500)
  const [chipMenuOpen, setChipMenuOpen] = useState(false)
  const [placedBet, setPlacedBet] = useState(null);
  const [droppedChips, setDroppedChips] = useState([]);
  const [droppedChipValue, setDroppedChipValue] = useState(null);

  const handleDragEnd = (event) => {
    const { over, active } = event;

    // Check if the chip was dropped in the bet area
    if (over && over.id === 'bet-area') {
      const chipValue = active.data.current.chipValue;
      if(chipValue === null){
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

  const CardSpot = ({ transform, index, currentIndex }) => {
    if (players.length === 0) return null;

  // Calculate the content index for this card spot
  const contentIndex = (index - currentIndex + players.length) % players.length;

  // Check if we should render content
  const shouldRenderContent = index < players.length;
  const player = shouldRenderContent ? players[contentIndex] : null;
  
    return (
      <div className="card-spot" style={{ transform }}>
        {shouldRenderContent && players ? (
          <motion.div
            className="card-content"
            key={player.id}
            initial={{ opacity: 0, x: index > currentIndex ? 100 : -100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: index > currentIndex ? -100 : 100 }}
            transition={{ duration: 0.5 }}
          >
            {/* Display dynamic content */}
            <UserAvatar style={{backgroundImage: `url(${player.avatar})`, backgroundPosition: 'center'}}></UserAvatar>
            <UserChipSum style={{backgroundImage: `url(${chipImage})`, backgroundPosition: 'center'}}>{player.bet}</UserChipSum>
            <EmptyCardLine></EmptyCardLine>
            <EmptyCardLine>{player.name}</EmptyCardLine>
            
          </motion.div>
        ) : (
          <div className="card-content empty"></div> // Render empty content
        )}
      </div>
    );
  };

  const disconnect = () => {
    socket?.emit('manual-disconnect')
    socket?.disconnect();
    setPlayOnline(false)
}

  const getUser = () => {
    const user = localStorage.getItem("user")
    setUser(JSON.parse(user))
  }

  useEffect(() => {
    getUser();
  }, [])

  console.log(players)
  console.log(playOnline)

  useEffect(() => {
    socket?.on('thisIsYourId', (data) => {
      console.log("dataidididid", data)
      setMyId(data.playerId)
      setPlayOnline(true)
      waitingtToStarttNotify('Waiting for other players to join the room... ⌛')
    });
    socket?.on('update_players', (data) => {
      const {gameData, message} = data;
      console.log("updatePlayers", data)
      dismissAll();
      welcomeNotify(message)
      setTimeout(() => {
          dismissAll();
          waitingtToStarttNotify('Waiting for other players to join the room... ⌛')
      }, 2500)
      setPlayers(gameData.players)
      setActiveRoom(gameData.room)
  });
  socket.on('betting-start', (data) => {
        console.log(data)
        dismissAll();
        placeBetNotify("You have 15 seconds to place your bet ⏱️")
        setPlayers(data.players)
        setChipMenuOpen(true)
        //setGameInProgress(true)
  });
  socket.on('new_update_players', (data) => {
    const {gameData, playerName, bet} = data;
    console.log("new_update_players", data)
    setPlayers(gameData.players)
    setActiveRoom(gameData.room)
    welcomeNotify(`${playerName} has placed a ${bet}$ bet`)
  });
    return () => {
      socket?.off('thisIsYourId');
      socket?.off('update_players');
      socket?.off('betting-start');
      socket?.off('new_update_players');
    };
  }, [socket])

  socket?.on("connect", function () {
    setPlayOnline(true);
    console.log("connected")
  });

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

    if(placedBet > 0){
        socket?.emit("place-bet", {
            bet: placedBet,
            room: activeRoom,
            id: myId
         });
         setChipMenuOpen(false)
         dismissAll();
    } else {
        message.error("There is no bet placed!")
    }
}

  if(!playOnline){
    return(
      <BlackJackSection>
        <BlackJackTitle>BlackJack</BlackJackTitle>
          <StyledButton onClick={askSocket} id="button" style={{marginTop: '50px'}}>PLAY ONLINE</StyledButton>
      </BlackJackSection>
    )
  }

  if(playOnline && players){
    return (
      <BlackJackSection>
        <BlackJackTitle>
  
        </BlackJackTitle>
        <BlackJackCards>
        <IconButton className={"MyCustomIconButton"} onClick={disconnect}><Disconnect /></IconButton>

            {Array.from({ length: 5 }).map((_, i) => (
                <CardSpot
                  key={i}
                  transform={getTransformForIndex(i)}
                  index={i}
                  currentIndex={currentIndex}
                  players={players}
                />
              ))}
        </BlackJackCards>
        <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
        <button onClick={disconnect}>Previous</button>
        <button onClick={goToNext}>Next</button>
        </div>
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
              <   Chips />
            </DndContext>
          </motion.div>
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

const item={
  exit:{
    opacity:0,
    height:0,
    transition:{
      ease:"easeInOut",
      duration:0.3,
      delay:1
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
`;

const BlackJackTitle = styled.div`
    width: 100%;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 98px;
`;

const EmptyCardLine = styled.div`
  width: 100%;
  height: 15%;
  color: ${props => props.theme.text};
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const PlayerName = styled.div`
  width: 100%;
  height: 10%;
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: orange;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
    
`;

const UserChipSum = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: red;
    position: absolute;
    top: 10%;
    left: 55%;
    transform: translate(-25%, -25%);
    color: ${props => props.theme.body};
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
`;

const BlackJackCards = styled.div`
    width: 100%;
    height: 58vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 98px;
    border: 1px solid white;
    position: relative;
    perspective: 1000px;
`;