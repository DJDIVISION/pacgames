import React, { useState, useEffect, useRef, useCallback  } from 'react';
import { debounce } from 'lodash';
import io from 'socket.io-client';
import styled from 'styled-components';
import { supabase } from '../supabase/client';
import { message } from 'antd';
import { Avatar, Button, CircularProgress } from '@mui/material';
import {motion, AnimatePresence} from 'framer-motion'
import axios from 'axios';
import { RightPokerColumn,LeftPokerColumn,PokerNavBar,CountryBall,CountryBallText,BallColumn,TeamsCarousel,TeamWrapper,InnerTeamsCarousel,
  TeamLogo,TeamName,PlayersContainer,PlayerWrapper,PlayerAvatar,PlayerName,PlayerPosition,PlayerShirt,PlayerShirtHolder,
  PlayerInput,PlayerRating,PlayerValue,PlayerDroppingArea,TopPokerNavBar,
  DraggContainer,PlayerTeamLogo,TopPlayerHolder,TopPlayerText,TopPokerColumn,PlayerTeamCross,
  ArrowLeftMiddle,ArrowRightMiddle,Formation,ArrowWrapper,ArrowWrapperColumn,Search,
  ArrowDown,
  ArrowDownRelative,
  ArrowWrapperColumnSmall,
  ArrowBar,
  SearchBar,
  PlayerSettingsIcon} from './index';
import england from '../assets/logos/england.png'
import spain from '../assets/logos/spain.png'
import italy from '../assets/logos/italy.png' 
import germany from '../assets/logos/germany.png' 
import france from '../assets/logos/france.png' 
import field from '../assets/lineups/field.jpg' 
import cross from '../assets/chips/delete.png'

import { AverageDisplay, EuroBalanceDisplay, useAuth, useGetTeams } from './functions';
import { FantasyState } from '../context/FantasyContext';
import { Row } from './indexTwo';
import { DndContext,useDraggable,useDroppable,DragOverlay } from '@dnd-kit/core';
import EditMenu from '../components/menus/EditMenu';
import { PlayerDroppingAreas } from './fakeData';
import { StyledButton } from '../components';
import { StyledIconButtonHover } from '../components/chats';
import PlayerStatsMenu from '../components/menus/PlayerStatsMenu';

const balls = [
  {
    name: "England",
    logo: england,
    id: 1,
    league: "Premier League"
  },
  {
    name: "Spain",
    logo: spain,
    id: 2,
    league: "La Liga"
  },
  {
    name: "Italy",
    logo: italy,
    id: 3,
    league: "Serie A"
  },
  {
    name: "France",
    logo: france,
    id: 4,
    league: "Ligue 1"
  },
  {
    name: "Germany",
    logo: germany,
    id: 5,
    league: "Bundesliga"
  }
]

const Fantasy = () => {

  const [activeBall, setActiveBall] = useState(1)
  const carroussel = useRef();
  const {user} = useAuth();
  const [width, setWidth] = useState(0);
  const { 
    teams, 
    getTeams, 
    loadingTeams, 
    players, 
    loadingPlayers, 
    handleTeamChange,setPlayers,getPlayers // Expose handleTeamChange for use in UI
  } = useGetTeams();
  const {activeLeague, setActiveLeague} = FantasyState();
  const [loading, setLoading] = useState(false); 
  const {activeTeamName, setActiveTeamName} = FantasyState();
  const {activeTeamId, setActiveTeamId} = FantasyState();
  const {playerToUpdate, setPlayerToUpdate} = FantasyState();
  const {playersSelected, setPlayersSelected} = FantasyState();
  const [playerToFind, setPlayerToFind] = useState("")
  const [searchedPlayers, setSearchedPlayers] = useState([])
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [playerValue, setPlayerValue] = useState(null)
  const [nationality, setNationality] = useState(null)
  const [height, setHeight] = useState(null)
  const [preferred, setPreferred] = useState(null)
  const [isTop, setIsTop] = useState(true)
  const [rating, setRating] = useState(null)
  const [openEditMenu, setOpenEditMenu] = useState(false)
  const [activePlayer, setActivePlayer] = useState(null); 
  const [selectedPlayerMenu, setSelectedPlayerMenu] = useState(false)
  const [activeClassName, setActiveClassName] = useState(1)
  const [balance, setBalance] = useState(300)
  const [teamAverage, setTeamAverage] = useState(0)
  const [allPlayersData, setAllPlayersData] = useState([])
  const [formation, setFormation] = useState("4-3-3")
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [droppedPlayers, setDroppedPlayers] = useState({
    area1: [],
    area2: [],
    area3: [],
    area4: [],
    area5: [],
    area6: [],
    area7: [],
    area8: [],
    area9: [],
    area10: [],
    area11: []
  });

  const fetchPlayers = useCallback(debounce(async (searchTerm) => {
    if (!searchTerm) {
      setSearchedPlayers([]);  // Reset players when input is empty
      return;
    }
    console.log(searchTerm)
    setLoading(true);

    const { data, error } = await supabase
      .from('footballPlayers')  // Replace with your actual table name
      .select('*')
      .ilike('name', `%${searchTerm}%`);  // Use ilike for case-insensitive search

    if (error) {
      console.error('Error fetching players:', error);
    } else {
      setSearchedPlayers(data);  // Update the players state with fetched data
    }

    setLoading(false);
  }, 500), []);  // Debounce with a delay of 500ms

  // Fetch players when the input value changes
  useEffect(() => {
    fetchPlayers(playerToFind);  // Call the debounced function
  }, [playerToFind, fetchPlayers]);

  
  

  useEffect(() => {
    getTeams();
  }, [activeLeague])



  const sendData = async (player) => {
    console.log(playerValue)
    console.log(player)
    const updatedData = {
      value: playerValue,
      leagueName: "Serie A",
      nationality: nationality,
      preferredFoot: preferred,
      height: height,
      topPlayer: isTop,
      rating: rating
    }
    const { data, error } = await supabase
    .from('footballPlayers')
    .update([updatedData]).eq("id", player.id)
    if (error) {
      console.error('Error inserting/updating user session data:', error.message)
    } else {
      console.log('User session data saved:', data)
      message.success("Your data has been registered")
    }
    setIsTop(true)
    setPlayerValue(null)
    setNationality(null)
    setPreferred(null)
    setHeight(null)
    setRating(null)
  }

  const handleTeam = (team) => {
    handleTeamChange(team.teamId)
  }

  const PlayerImage = ({ player }) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
      id: `drag-${player.id}`,
      data: { player },  // Passing chip value through drag data
    });
  
    // Apply transform styles during drag
    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
    };
  
    return (
      <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <img src={image} alt={`Chip ${player.id}`}  />
      </div>
    );
  };

  const handleUpdate = (player) => {
    setPlayerToUpdate(player)
    setOpenEditMenu(true)
  }


  

  const Player = ({ player }) => {
    const playerIsDropped = Object.values(droppedPlayers).some(area =>
      area.find(droppedPlayer => droppedPlayer.id === player.id)
    );
    const { attributes, listeners, setNodeRef, transform, isDragging  } = useDraggable({
      id: `${player.id}`,
      disabled: playerIsDropped,  
      data: { value: player.value, image: player.photo, position: player.position, name: player.name, teamLogo: player.teamLogo, rating: player.rating, id: player.id },  // Passing chip value through drag data
    });
  
    // Apply transform styles during drag
    const style = {
      transform: transform
        ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
        : undefined,
        opacity: isDragging ? 0 : 1,
    };
  
    return (
      <div className="dragged-player" ref={setNodeRef} style={style} {...listeners} {...attributes}>
        <Avatar alt="Image" src={player.photo} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 50, xl: 50 }, 
                      height: { xs: 30, sm: 30, md: 40, lg: 50, xl: 50 }, }} />
      </div>
    );
  };

  const BetArea = ({ id, children }) => {
    const { isOver, setNodeRef } = useDroppable({
      id,
    });

    if(isOver){
      console.log(id)
    }
  
    return (
      <PlayerDroppingArea ref={setNodeRef} className="player-area" id={id}>
        {children}
      </PlayerDroppingArea>
    );
  };

  const getAveragePlayerRating = () => {
    const allPlayers = Object.values(droppedPlayers).flat(); 
    const totalRating = allPlayers.reduce((sum, player) => sum + player.rating, 0);
    const averageRating = totalRating / allPlayers.length;
    return averageRating;
  };

  useEffect(() => {
    if (droppedPlayers) {

      const allPlayers = Object.values(droppedPlayers).flat();
      
      if(allPlayers.length > 0){
        setTeamAverage(getAveragePlayerRating())
      } else {
        setTeamAverage(0)
      }
    }
  }, [droppedPlayers])

  const removePlayer = (player) => {
    console.log(player)
    const id = player.overId
    const value = player.value
    const playerId = player.id
    console.log(playerId)
    console.log(playerId)
    setBalance((prevBalance) => prevBalance + value);

    
    setDroppedPlayers((prev) => ({
      ...prev,
      [id]: prev[id].filter((el) => el.id !== playerId),
    }));
    setAllPlayersData((prev) => ({
      ...prev,
      [id]: prev[id].filter((el) => el.id !== playerId),
    }));
    setTeamAverage(getAveragePlayerRating())
  }

  const handleDragEnd = (event) => {
    const { over, active } = event;
    
    if (over) {
      const { value, image, position, name, teamLogo, rating, id } = active.data.current;
      const fakeBalance = balance - value
      console.log(fakeBalance)
      if (value && image && fakeBalance > 0) {
        setIsSearchExpanded(false)
        setPlayerToFind("")
        setSearchedPlayers([])
        setPlayersSelected((prev) => [...prev, id])
        setBalance((prevBalance) => prevBalance - value);
        setDroppedPlayers((prev) => ({
          ...prev,
          [over.id]: [{ id: id, value, image, teamLogo, overId: over.id, rating: rating, isDropped: true }], // Replace the existing player
        }));
        setActivePlayer(null);
        const newPlayer = { id: id, value: value, image: image, position: position, name: name, teamLogo: teamLogo, rating: rating, overId: over.id };

        setAllPlayersData((prev) => ({
          ...prev,
          [over.id]: [newPlayer], // Replace with the new player
        }));
        
      } else if(fakeBalance < 0){
        message.error("You can not run out of balance. Try with a cheaper player!")
        return
      }
    }
    
  }

  function switchLayout(layout) {
    const container = document.getElementById('droppable-container');
    container.classList.remove('layout1', 'layout2', 'layout3', 'layout4', 'layout5', 'layout6');
    container.classList.add(layout);
  }

  useEffect(() => {
    console.log(activeClassName)
    if(activeClassName === 1){
      setFormation("4-3-3")
    }
    if(activeClassName === 2){
      setFormation("4-4-2")
    }
    if(activeClassName === 3){
      setFormation("4-5-1")
    }
    if(activeClassName === 4){
      setFormation("3-3-4")
    }
    if(activeClassName === 5){
      setFormation("3-4-3")
    }
    if(activeClassName === 6){
      setFormation("3-5-2")
    }
    if(activeClassName === 7){
      setFormation("5-3-2")
    }
  }, [activeClassName])

  const raiseClassName = () => {
    if(activeClassName <= 6){
      setActiveClassName((prev) => prev + 1);
    const plus = activeClassName + 1
    const newClass = `layout${plus}`
    console.log(newClass)
    switchLayout(newClass)
    } else {
      console.log("there are no more layers up")
      return
    }
  }

  const lowClassName = () => {
    if(activeClassName >= 1){
      setActiveClassName((prev) => prev - 1);
    const plus = activeClassName - 1
    const newClass = `layout${plus}`
    console.log(newClass)
    switchLayout(newClass)
    } else {
      console.log("there are no more layers down")
      return
    }
  }


  const saveTeam = async () => {
    const allPlayers = Object.values(droppedPlayers).flat(); 
    const id = user.id
    const updatedData = {
      players: allPlayers,
      playerName: user.user_metadata.name,
      playerId: user.id,
      formation: formation,
      teamPower: teamAverage,
      balanceRemaining: balance
    }
    
    if(allPlayers.length < 11){
      message.error("You don't have a complete team to save. Add more players!")
    } else {
      const { data, error } = await supabase
      .from("fantasyFootball").select('playerId').eq('playerId', user.id)
      if(error){
        console.log(error)
      } 
      if(data && data.length === 0){
        const { data2, error2 } = await supabase
          .from('fantasyFootball')
          .insert([updatedData])
        if (error2) {
          console.error('Error inserting/updating user session data:', error2.message)
        } else {
          console.log('User session data saved:', data2)
          message.success("Your bet has been registered")
        }
      } else {
        const { data2, error2 } = await supabase
          .from('fantasyFootball')
          .update([updatedData])
          .eq("playerId", user.id)
        if (error2) {
          console.error('Error inserting/updating user session data:', error2.message)
        } else {
          console.log('User session data saved:', data2)
          message.success("Your bet has been registered")
        }
      }
    } 
  }

  const sortByRating = () =>{
    const sortedPlayers = [...players].sort((a, b) => b.rating - a.rating);
    setPlayers(sortedPlayers);
  }

  const sortByValue = () =>{
    const sortedPlayers = [...players].sort((a, b) => b.value - a.value);
    setPlayers(sortedPlayers);
  }

  const positions = ['Goalkeeper', 'Defender', 'Midfielder', 'Attacker' ];

  const sortByPosition = () => {
    const currentPosition = positions[currentPositionIndex];
    const sortedPlayers = [...players].sort((a, b) => {
      if (a.position === currentPosition && b.position !== currentPosition) {
        return -1; 
      }
      if (a.position !== currentPosition && b.position === currentPosition) {
        return 1; 
      }
      return 0; 
    });
    setPlayers(sortedPlayers); 
    setCurrentPositionIndex((prevIndex) => (prevIndex + 1) % positions.length);
  };

  useEffect(() => {
    if(searchedPlayers.length === 0){
      setIsSearchExpanded(false)
    }
  }, [searchedPlayers])

  const openPlayerMenu = (player) => {
    setPlayerToUpdate(player)
    setSelectedPlayerMenu(true)
  }

   
  return ( 
    <Section>
      <TopPokerNavBar>
        <TopPokerColumn>
          <EuroBalanceDisplay balance={balance} />
          <AverageDisplay balance={teamAverage} />
          <StyledButton onClick={() => saveTeam()}>SAVE TEAM</StyledButton>
        </TopPokerColumn>
      <RightPokerColumn>
      {balls.map((ball) => {
            return(
              <BallColumn key={ball.id}>
              <CountryBall initial={{ height: activeBall === ball.id ? '70%' : '100%'}}
              animate={{ height: activeBall === ball.id ? '70%' : '100%', transform: activeBall === ball.id ? 'translateY(10px) scale(0.9)' : '' }} 
              transition={{ duration: 0.3 }} ><img onClick={() => {setActiveLeague(ball.league); setActiveBall(ball.id)}} src={ball.logo} alt="england" /></CountryBall>
              <CountryBallText initial={{fontSize: activeBall === ball.id ? '20px' : '0', display: activeBall === ball.id ? 'flex' : 'none', height: activeBall === ball.id ? '30%' : '0%'}} 
              animate={{fontSize: activeBall === ball.id ? '20px' : '0', display: activeBall === ball.id ? 'flex' : 'none', height: activeBall === ball.id ? '30%' : '0%', transform: activeBall === ball.id ? 'translateY(-5px)' : ''  }} 
              transition={{ duration: 0.3 }}>{ball.name}</CountryBallText>
              </BallColumn>
            )
          })}
      </RightPokerColumn>
      </TopPokerNavBar>
      <PokerNavBar>
      <TopPokerColumn>
      {Object.entries(allPlayersData).map(([area, players]) => (
       <>
          {players.map((player) => {
            return(
              <TopPlayerHolder>
                <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover', width: '20px', height: '20px', left: '10%'}}></PlayerTeamLogo>
                <Avatar alt="Image" src={player.image} sx={{ width: { xs: 10, sm: 10, md: 40, lg: 50, xl: 50 }, 
                  height: { xs: 10, sm: 10, md: 40, lg: 50, xl: 50 },}} />
                  <TopPlayerText>{player.name}</TopPlayerText>
                  <TopPlayerText style={{color: 'gold', transform: 'translateY(5px)'}}>{player.value}M €</TopPlayerText>
                  <PlayerTeamCross onClick={() => removePlayer(player)}><img src={cross} alt="cross" /></PlayerTeamCross>
              </TopPlayerHolder>
            )
          })}
        </>
      ))}
      </TopPokerColumn>
      <RightPokerColumn>
      {/* <TeamsCarousel ref={carroussel}> */}
          <InnerTeamsCarousel /* drag="x" dragConstraints={{right: 0, left: -width}} */>
          {loadingTeams ? (
            <CircularProgress sx={{width: 80, height: 80, margin: 'auto'}} />
          ) : (
            <Row>
              {teams?.map((team) => {
                return (
                  <TeamWrapper onClick={() => handleTeam(team)} key={team.teamId}>
                    <TeamLogo style={{backgroundImage: `url(${team.teamLogo})`, backgroundSize: '75%',backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}></TeamLogo>
                    <TeamName>{team.teamName}</TeamName>
                  </TeamWrapper>
                )
              })}
            </Row>
          )}
          </InnerTeamsCarousel>
        {/* </TeamsCarousel> */}
      </RightPokerColumn>
      </PokerNavBar>
      <DraggContainer>
          <DndContext onDragEnd={handleDragEnd} onDragStart={(event) => {
              setActivePlayer(event.active.data.current);  // Set the active player when dragging starts
            }}>
          <LeftPokerColumn id="droppable-container" className='layout1' style={{backgroundImage: `url(${field})`, backgroundSize: `90%`, backgroundRepeat: 'no-repeat', backgroundPosition: 'center', position: 'relative'}}>
            <ArrowLeftMiddle onClick={() => lowClassName()}></ArrowLeftMiddle>
            <ArrowRightMiddle onClick={() => raiseClassName()}></ArrowRightMiddle>
            <Formation>{formation}</Formation>
            <BetArea id="area1" className='droppable-area'>
              {droppedPlayers.area1.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 },}} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area2">
              {droppedPlayers.area2.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                  <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area3">
              {droppedPlayers.area3.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                  <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>  
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area4">
              {droppedPlayers.area4.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area5">
              {droppedPlayers.area5.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area6">
              {droppedPlayers.area6.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area7">
              {droppedPlayers.area7.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area8">
              {droppedPlayers.area8.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area9">
              {droppedPlayers.area9.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area10">
              {droppedPlayers.area10.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
            <BetArea id="area11">
              {droppedPlayers.area11.map((player) => {
                return(
                  <div key={player.id} style={{position: 'relative'}}>
                    <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                  <Avatar alt="Image" src={player.image} sx={{ width: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, 
                  height: { xs: 30, sm: 30, md: 40, lg: 60, xl: 60 }, }} />
                  </div>
                )
              })}
            </BetArea>
          </LeftPokerColumn>
          <RightPokerColumn>
          {loadingPlayers ? (
            <CircularProgress sx={{width: 80, height: 80}} />
          ) : (
            <motion.div initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.3 },
              },
            }} style={{width: '100%', height: '100%'}}>
              <ArrowWrapper>
                <SearchBar initial={{ width: '45%'}} 
                animate={{ width: isSearchExpanded ? '100%' : '45%' }}
                transition={{ duration: 0.3 }} isSearchExpanded={isSearchExpanded}>
                  <Search playerToFind={playerToFind} setPlayerToFind={setPlayerToFind} setIsSearchExpanded={setIsSearchExpanded} isSearchExpanded={isSearchExpanded}/>
                </SearchBar>
                <ArrowBar initial={{ width: '55%'}}
                animate={{ width: isSearchExpanded ? '0' : '55%' }}
                transition={{ duration: 0.3 }} >
                  <ArrowWrapperColumn><ArrowDownRelative onClick={() => sortByPosition()}/></ArrowWrapperColumn>
                <ArrowWrapperColumn><ArrowDownRelative onClick={() => sortByValue()}/></ArrowWrapperColumn>
                <ArrowWrapperColumn><ArrowDownRelative onClick={() => sortByRating()}/></ArrowWrapperColumn>
                </ArrowBar>
              </ArrowWrapper>
              {isSearchExpanded === true && (
                searchedPlayers?.map((player, index) => {
                  const playerIsDropped = Object.values(droppedPlayers).some(area =>
                    area.find(droppedPlayer => droppedPlayer.id === player.id)
                  );
                  return (
                    <>
                    <PlayerWrapper key={player.photo} initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }} id={player.id} style={{border: playerIsDropped ? `3px solid green` : '2px solid white'}}>
                      <PlayerAvatar>
                      <PlayerShirt>{player.number}</PlayerShirt>
                      <Player key={player.id} player={player} />
                      </PlayerAvatar>
                      <PlayerName>{player.name}</PlayerName>
                      <PlayerShirtHolder>{player.nationality}</PlayerShirtHolder>
                      <PlayerPosition>{player.position}</PlayerPosition>
                      
                      <PlayerValue>{player.value}M €</PlayerValue>
                      <PlayerShirtHolder onClick={() => /* handleUpdate(player) */{setOpenEditMenu(true); setPlayerToUpdate(player)}}><PlayerRating style={{background: player.rating >= 7 ? `green` : player.rating >= 6 && player.rating < 7 ? "yellow" : "red"}}>{player.rating}</PlayerRating></PlayerShirtHolder>
                    </PlayerWrapper>
                    <PlayerSettingsIcon />
                    </>
                  )
                })
              )}
              {(isSearchExpanded === false || searchedPlayers.length === 0) && players?.map((player, index) => {
                const playerIsDropped = Object.values(droppedPlayers).some(area =>
                  area.find(droppedPlayer => droppedPlayer.id === player.id)
                );
                return (
                  <div style={{display: 'flex', alignItems:'center'}}>
                  <PlayerWrapper key={player.photo} initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }} id={player.id} style={{border: playerIsDropped ? `3px solid green` : '2px solid white'}}>
                    <PlayerAvatar>
                    <PlayerShirt>{player.number}</PlayerShirt>
                    <Player key={player.id} player={player} />
                    </PlayerAvatar>
                    <PlayerName>{player.name}</PlayerName>
                    <PlayerShirtHolder>{player.nationality}</PlayerShirtHolder>
                    <PlayerPosition>{player.position}</PlayerPosition>
                    
                    <PlayerValue>{player.value}M €</PlayerValue>
                    <PlayerShirtHolder onClick={() => /* handleUpdate(player) */{setOpenEditMenu(true); setPlayerToUpdate(player)}}><PlayerRating style={{background: player.rating >= 7 ? `green` : player.rating >= 6 && player.rating < 7 ? "yellow" : "red"}}>{player.rating}</PlayerRating></PlayerShirtHolder>
                  </PlayerWrapper>
                  <StyledIconButtonHover style={{transform: 'translateX(-5px)'}} onClick={() => openPlayerMenu(player)}><PlayerSettingsIcon /></StyledIconButtonHover>
                  </div>
                )
              })}
              <DragOverlay>
                {activePlayer ? (
                  <Avatar
                    alt="Image"
                    src={activePlayer.image}
                    sx={{
                      width: { xs: 30, sm: 30, md: 40, lg: 50, xl: 50 },
                      height: { xs: 30, sm: 30, md: 40, lg: 50, xl: 50 },
                    }}
                  />
                ) : null}
              </DragOverlay>
            </motion.div>
          )}
          </RightPokerColumn>
          </DndContext>
      </DraggContainer>
      {openEditMenu && (
        <EditMenu openEditMenu={openEditMenu} setOpenEditMenu={setOpenEditMenu}/>
      )}
      {selectedPlayerMenu && (
        <PlayerStatsMenu selectedPlayerMenu={selectedPlayerMenu} setSelectedPlayerMenu={setSelectedPlayerMenu} />
      )}
    </Section>
  )
}

export default Fantasy

const Section = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.body};
  ${props => props.theme.displayFlexColumn}
`;


const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/players/squads',
  params: {team: '77'},
  headers: {
    'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  }
};


const fetchData = async () => {
  try {
      const response = await axios.request(options);
      console.log(response.data);
      localStorage.setItem("villa", JSON.stringify(response.data))
      message.success("data fetched!")
  } catch (error) {
      console.error(error);
  }
}
const sendTeam = () => {
  const str = localStorage.getItem("brest")
  const barcelona = JSON.parse(str)
  console.log(barcelona)
  barcelona.response[0].players.forEach(async (p) => {
    const updatedData = {
    id: p.id,
    name: p.name,
    number: p.number,
    age: p.age,
    photo: p.photo,
    position: p.position,
    team: barcelona.response[0].team.name,
    teamId: barcelona.response[0].team.id,
    teamLogo: barcelona.response[0].team.logo,
  }
  const { data, error } = await supabase
    .from('footballPlayers')
    .insert([updatedData])
    if (error) {
      console.error('Error inserting/updating user session data:', error.message)
    } else {
      console.log('User session data saved:', data)
      message.success("Your data has been registered")
    }

  });
}

{/* <PlayerInput placeholder='value' onChange={(e) => setPlayerValue(e.target.value)}></PlayerInput>
                    <PlayerInput placeholder='nationality' onChange={(e) => setNationality(e.target.value)}></PlayerInput>
                    <PlayerInput placeholder='height' onChange={(e) => setHeight(e.target.value)}></PlayerInput>
                    <PlayerInput placeholder='preferred' onChange={(e) => setPreferred(e.target.value)}></PlayerInput>
                    <PlayerInput placeholder='top player' onChange={() => setIsTop(false)}></PlayerInput>
                    <PlayerInput placeholder='top player' onChange={(e) => setRating(e.target.value)}></PlayerInput>
                    <Button onClick={() => sendData(player)}>SEND</Button> */}