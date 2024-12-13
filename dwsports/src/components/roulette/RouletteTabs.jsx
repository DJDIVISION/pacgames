import React, {useState,useEffect} from 'react'
import {BlackSection,WelcomeTitle,Tabs,TabWrapper,Tab,FilterContainer,RoomWrapper,
  RoomNumber,NumberWrapper,RoomAvailable,PlayersOnline,GridItem,JoinButton,PlayerHolder,PlayerAvatar,PlayerUser,
  GameProgressText,GameProgressRound,GameProgressCircle,VolumeIcon,ButtonHoverAbsolute,BlackSectionSmart
} from '../blackjack/index'
import { motion, useAnimate, stagger } from "framer-motion";
import { ArrowLeft, ArrowLeftRelative, SmallArrowDown, StyledButton } from '../../pages';
import { BetState } from '../../context/BetsContext';
import Swal from "sweetalert2";
import io from 'socket.io-client';
import { Avatar } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../../pages/functions';
import { animationFive, transition } from '../../animations';
import {Link as LinkR} from 'react-router-dom'
import { AbsoluteIconButtonLeft, TeamBetsHolderBlur } from '../../pages/indexThree';
import { LeagueRower, LeagueRowerScroll, LowRower, RowerRow, RowerRowScroll } from '../../components/index';


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

const RouletteTabs = ({players,socket,rooms,setPlayerName,playerName}) => {

  const [activeTab, setActiveTab] = useState(1)
  const [activeBackground, setActiveBackground] = useState(1)
  const [filtered, setFiltered] = useState([]);
  const [room, setRoom] = useState("")
  const [animate, animateApi] = useAnimate();
  const staggeredItems = stagger(0.2); 
  const { user } = useAuth(); 
  const [playerAvatar, setPlayerAvatar] = useState(null);
  const [myId, setMyId] = useState("");
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    
    if(socket.connected === false){
      navigate('/')
      window.location.reload()
    }
  }, [socket])

  const handleClick = (divNumber) => {
    setActiveBackground(divNumber);
    setActiveTab(divNumber)
  };

  const joinRoom = async (room) => {
    if(!user){
      navigate('/')
    }
    setPlayerAvatar(user.user_metadata.avatar_url)
    const result = await takePlayerName();
    if (!result.isConfirmed) {
      return;
    }
    const username = result.value;
    setPlayerName(username);
    socket?.emit("join-room", {
      playerName: username,
      googleId: user.id,
      avatar: user.user_metadata.avatar_url,
      roomId: room.id
    });
  }

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <motion.div initial="out" animate="in" variants={animationFive} transition={transition}>
    <BlackSection>
    <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <WelcomeTitle>American Roulette</WelcomeTitle>
      <Tabs>
      <TabWrapper>
            <Tab className={`box ${activeBackground === 1 ? 'active' : ''}`} onClick={() => handleClick(1)}>ROOMS</Tab>
            <Tab className={`box ${activeBackground === 2 ? 'active' : ''}`} onClick={() => handleClick(2)}>TOURNAMENT</Tab>
            <Tab className={`box ${activeBackground === 3 ? 'active' : ''}`} onClick={() => handleClick(3)}>TOP PLAYERS</Tab>
      </TabWrapper>
      <FilterContainer initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.3 },
                },
              }}>
                {rooms?.map((room, index) => {
                  console.log(room)
                  return(
                    <TeamBetsHolderBlur key={index}
                      initial={{ minHeight: '60px' }}
                      animate={{ minHeight: expandedIndex === index ? '220px' : '60px' }}
                      transition={{ duration: 0.5 }}>
                        {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                        <LeagueRower style={{width: '90%'}}>
                        <RoomAvailable>
                        Room {room.id}
                        </RoomAvailable>
                        {room.players.filter(p => p.playerId !== "").length < 20 ? (
                      <>
                      <RoomAvailable>Available ✅</RoomAvailable>
                      <RoomAvailable>PLAYERS: {room.players.filter(p => p.playerId !== "").length}/20</RoomAvailable>
                      </>
                    ) : (
                      <>
                      <RoomAvailable>PLAYERS: {room.players.filter(p => p.playerId !== "").length}/20</RoomAvailable>
                      <RoomAvailable>Full ❌</RoomAvailable>
                      </>
                    )}
                    
                    </LeagueRower>
                    {expandedIndex === index && (
                      <>
                        <LeagueRowerScroll style={{width: '90%'}}>
                          {room.players.filter(player => player.playerId !== "").map((player,index) => {
                            console.log(player)
                            return(
                              <PlayerHolder key={room.id}>
                              <PlayerAvatar>
                              <Avatar alt="Image" src={player?.avatar} sx={{ width: 30, height: 30 }} />
                              </PlayerAvatar>
                              <PlayerUser>{player.playerName}</PlayerUser> 
                      </PlayerHolder>
                            )
                          })}
                        </LeagueRowerScroll>
                        <LeagueRower style={{width: '90%', transform: 'translateY(10px)'}}>
                        <StyledButton onClick={() => joinRoom(room)}>JOIN ROOM</StyledButton>
                        </LeagueRower>
                      </>
                      )}
                    </TeamBetsHolderBlur>
                  )
                })}
      </FilterContainer>
      </Tabs>
      {/* <Tabs>
        
            <TabWrapper>
              <Tab className={`box ${activeBackground === 1 ? 'active' : ''}`} onClick={() => handleClick(1)}>ROOMS</Tab>
              <Tab className={`box ${activeBackground === 2 ? 'active' : ''}`} onClick={() => handleClick(2)}>TOURNAMENT</Tab>
              <Tab className={`box ${activeBackground === 3 ? 'active' : ''}`} onClick={() => handleClick(3)}>TOP PLAYERS</Tab>
            </TabWrapper>
            <FilterContainer initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.3 },
                },
              }}>
            {rooms.map((room, index) => {
              return(
                <RoomWrapper key={index} initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }} >
                    <RoomNumber><NumberWrapper>{room.id}</NumberWrapper></RoomNumber>
                    {room.players.filter(p => p.playerId !== "").length < 20 ? (
                      <>
                      <RoomAvailable>Available ✅</RoomAvailable>
                      <RoomAvailable>PLAYERS: {room.players.filter(p => p.playerId !== "").length}/20</RoomAvailable>
                      </>
                    ) : (
                      <>
                      <RoomAvailable>PLAYERS: {room.players.filter(p => p.playerId !== "").length}/20</RoomAvailable>
                      <RoomAvailable>Full ❌</RoomAvailable>
                      </>
                    )}
                    <PlayersOnline>
                    
                    {room.players.filter(player => player.playerId !== "").map((player, index) => (
                      <PlayerHolder key={room.id}>
                      <PlayerAvatar>
                      <Avatar alt="Image" src={player.avatar} sx={{ width: 30, height: 30 }} />
                      </PlayerAvatar>
                      <PlayerUser>{player.name}</PlayerUser> 
                      </PlayerHolder>
                    ))}
                   
                    </PlayersOnline>
                    <GameProgressText>GAME IN PROGRESS: </GameProgressText>
                    <GameProgressRound><GameProgressCircle style={{background: room.gameStarted ? 'red' : 'green'}}>{room.gameStarted ? "YES" : "NO"}</GameProgressCircle></GameProgressRound>
                    <JoinButton>
                      {room.gameStarted && <StyledButton onClick={() => joinRoom(room)}>JOIN AND WAIT</StyledButton>}
                      {!room.gameStarted && <StyledButton onClick={() => joinRoom(room)}>JOIN ROOM</StyledButton>}
                    </JoinButton>

                  
                
                </RoomWrapper>
              )
            })}
            </FilterContainer>
       
      </Tabs> */}
    </BlackSection>
    </motion.div>
  )
}

export default RouletteTabs
