import React, {useState,useEffect} from 'react'
import {BlackSection,WelcomeTitle,Tabs,TabsContainer,TabWrapper,Tab,FilterContainer,RoomWrapper,
  RoomNumber,NumberWrapper,RoomAvailable,PlayersOnline,GridItem,JoinButton,PlayerHolder,PlayerAvatar,PlayerUser
} from './index'
import { motion, useAnimate, stagger } from "framer-motion";
import { StyledButton } from '../../pages';
import { BetState } from '../../context/BetsContext';
import Swal from "sweetalert2";
import io from 'socket.io-client';
import { Avatar } from '@mui/material';
import { Navigate, useNavigate } from 'react-router-dom';


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

const BlackJackTabs = ({players,socket,rooms}) => {

  const [activeTab, setActiveTab] = useState(1)
  const [activeBackground, setActiveBackground] = useState(1)
  const [filtered, setFiltered] = useState([]);
  const [room, setRoom] = useState("")
  const [animate, animateApi] = useAnimate();
  const staggeredItems = stagger(0.2); 
  const { user, setUser } = BetState();
  const [playerName, setPlayerName] = useState(null);
  const [playerAvatar, setPlayerAvatar] = useState(null);
  const [myId, setMyId] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if(user === null){
      window.location.reload()
    }
    if(socket.connected === false){
      window.location.reload()
    }
  }, [user,socket])

  

  const handleClick = (divNumber) => {
    setActiveBackground(divNumber);
    setActiveTab(divNumber)
  };

  const joinRoom = async (room) => {
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


  return (
    <BlackSection>
      <WelcomeTitle>BlackJack</WelcomeTitle>
      <Tabs>
        <TabsContainer>
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
                    {room.players.filter(p => p.playerId !== "").length < 5 ? (
                      <>
                      <RoomAvailable>Available ✅</RoomAvailable>
                      <RoomAvailable>PLAYERS: {room.players.filter(p => p.playerId !== "").length}/5</RoomAvailable>
                      </>
                    ) : (
                      <>
                      <RoomAvailable>PLAYERS: {room.players.filter(p => p.playerId !== "").length}/5</RoomAvailable>
                      <RoomAvailable>Full ❌</RoomAvailable>
                      </>
                    )}
                    <PlayersOnline>
                    <PlayerHolder key={room.id}>
                    {room.players.filter(player => player.playerId !== "").map((player, index) => (
                      <>
                      <PlayerAvatar>
                      <Avatar alt="Image" src={player.avatar} sx={{ width: 20, height: 20 }} />
                      </PlayerAvatar>
                      <PlayerUser>{player.name}</PlayerUser>
                      </>
                    ))}
                    </PlayerHolder>
                    </PlayersOnline>
                    <JoinButton><StyledButton onClick={() => joinRoom(room)}>JOIN ROOM</StyledButton></JoinButton>
                  
                
                </RoomWrapper>
              )
            })}
            </FilterContainer>
        </TabsContainer>
      </Tabs>
    </BlackSection>
  )
}

export default BlackJackTabs
