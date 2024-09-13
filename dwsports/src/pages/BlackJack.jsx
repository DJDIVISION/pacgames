import React, { useEffect, useState, useRef } from 'react';
import { motion, useCycle } from "framer-motion";
import styled from 'styled-components'
import { StyledButton, Disconnect,BlackJackColumn,BlackJackBigColumn,DealerCard,ColumnTopSmall,ColumnTopBig } from './index'
import { DndContext } from '@dnd-kit/core';
import Swal from "sweetalert2";
import io from 'socket.io-client';
import { autoCloseOff, dismissAll, welcomeNotify, placeBetNotify, waitingtToStarttNotify } from './functions'
import { BetState } from '../context/BetsContext';
import { ToastContainer, toast } from 'react-toastify';
import { IconButton } from '@mui/material';
import 'react-toastify/dist/ReactToastify.css';
import Chips from '../components/blackjack/Chips';
import BetArea from '../components/blackjack/BetArea';
import { Avatar } from '@mui/material';
import chipImage from '../assets/chips/emptyChip.png'
import { Swiper, SwiperSlide } from 'swiper/react';
import BJBack from '../assets/bjTable.jpg';
import 'swiper/css';
import 'swiper/css/effect-cards';
import {Button,CircularProgress } from '@mui/material'
import { EffectCards } from 'swiper/modules';
import { transitionLong,animationFour } from '../animations';
import ChatIcon from '@mui/icons-material/Chat';

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

  const [currentIndex, setCurrentIndex] = useState(0);
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
  const [width, setWidth] = useState(0);
  const carroussel = useRef();
  const [activePlayer, setActivePlayer] = useState(false);
  const [active, setActive] = useState("menuTwo");
  const [loading, setLoading] = useState(true); 
  const [cantHit, setCantHit] = useState(false)
  const [balance, setBalance] = useState(500); // Initial state
  const [currentNumber, setCurrentNumber] = useState(500); // Initial number
  const [intervalId, setIntervalId] = useState(null);
  const [stayDisabled, setStayDisabled] = useState(false)
  const [isOpen, toggleOpen] = useCycle(false, true);
 
  const sidebar = {
    open: (height = 1000) => ({
      clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
      transition: {
        type: "spring",
        stiffness: 20,
        restDelta: 2
      }
    }),
    closed: {
      clipPath: "circle(30px at 40px 40px)",
      transition: {
        delay: 0.5,
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  console.log(balance)


  useEffect(() => {
    if (player?.hand && carroussel.current) {
      // Scroll to the end of the container when player.hand updates
      carroussel.current.scrollLeft = carroussel.current.scrollWidth;
    }
  }, [player?.hand]);

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

  const CardSpot = ({ transform, index, currentIndex }) => {
    if (!players || players.length === 0) return null;

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
            <UserAvatar><Avatar alt="Image" src={player.avatar} sx={{ width: 80, height: 80 }} /></UserAvatar>
            <UserChipSum id="chipSum" style={{ backgroundImage: `url(${chipImage})`, backgroundPosition: 'center' }}>{player.bet}</UserChipSum>
            <EmptyCardLine></EmptyCardLine>
            <EmptyCardLine>{player.name}</EmptyCardLine>
            <CardHolder>
            <SportsCarousel ref={carroussel}>
            <InnerSportsCarousel drag="x" dragConstraints={{right: 0, left: -width}} whileTap={{cursor: 'grabbing'}}>
              {player.hand.map((card) => {
                return (
                  <Card style={{backgroundImage: `url(./assets/cards/${card}.png)`,
                  backgroundSize: 'contain',}} initial="out" animate="in" variants={animationFour} transition={transitionLong} activePlayer={activePlayer}></Card>
                )
              })}
              </InnerSportsCarousel>
              </SportsCarousel>
              <EmptyCardLine>POINTS: {player.playerSum}</EmptyCardLine>
            </CardHolder>
          </motion.div>
        ) : (
          <div className="card-content empty"></div> // Render empty content
        )}
      </div>
    );
  };

  
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
        <BlackJackColumn onClick={disconnect}>
          <ColumnTopBig>
          <Avatar alt="Image" src={playerAvatar} sx={{ width: 60, height: 60 }} />
          </ColumnTopBig>
          <ColumnTopSmall>Balance: <span id="counter">{balance}</span></ColumnTopSmall>
        </BlackJackColumn>
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
        <BlackJackColumn>
          <ChatContainer>
             
                <ButtonAbsolute><ChatRoomIcon /></ButtonAbsolute>
              
            
            <motion.div className="navbar" variants={sidebar} />
          </ChatContainer>
        </BlackJackColumn>
        </BlackJackTitle>
        <BlackJackCards animate={{ height: activePlayer ? '55vh' : '60vh' }}
        initial={{ height: '70vh' }}
        transition={{ duration: 0.5 }}>
          <IconButton  onClick={disconnect}><Disconnect /></IconButton>
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

const Card = styled(motion.div)`
    min-width: 110px;
    min-height: 160px;
    margin: 0 10px;
    transform: ${({ activePlayer }) => (activePlayer ? "scale(0.9)" : "scale(1)")};
  `;

const SportsCarousel = styled(motion.div)`
  cursor: grab;
  height: 200px;
  width: 180px;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const InnerSportsCarousel = styled(motion.div)`
  display: flex;
  align-items: center;
  height: 200px;
  width: 180px;
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
    border: 1px solid red;
    font-size: 98px;
`;

const EmptyCardLine = styled.div`
  width: 100%;
  height: 50px;
  color: ${props => props.theme.text};
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const CardHolder = styled.div`
  width: 100%;
  height: 70%;
  font-size: 26px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    border: 2px solid aqua;
    display: flex;
    align-items: center;
    justify-content: center;
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

const BlackJackCards = styled(motion.div)`
    width: 100%;
    height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    perspective: 1200px;
    
`;

const ChatContainer = styled.div`
    width: 95%;
    height: 95%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    border: 1px solid ${props => props.theme.MainAccent};
    border-radius: 10px;
    position: relative;
`;

const ButtonAbsolute = styled(IconButton)`
        &&&{
          border: 0.5px solid ${props => props.theme.MainAccent};
        position: absolute;
        top: 15px;
        right: 15px;
        }
`;

const ChatRoomIcon = styled(ChatIcon)`
    &&&{
      color: ${props => props.theme.text};
      
    }
    
`;