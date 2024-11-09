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
  PlayerInput,PlayerRating,PlayerValue,PlayerDroppingArea,TopPokerNavBar,BottomPokerColumn,TopPokerColumnLeft,
  DraggContainer,PlayerTeamLogo,TopPlayerHolder,TopPlayerText,TopPokerColumn,PlayerTeamCross,BigPokerColumnLeft,
  ArrowLeftMiddle,ArrowRightMiddle,Formation,ArrowWrapper,ArrowWrapperColumn,Search,PlayerTeamRating,BottomPokerColumnLeft,
  ArrowDown,
  ArrowDownRelative,
  ArrowWrapperColumnSmall,
  ArrowBar,
  SearchBar,
  PlayerSettingsIcon,
  ArrowLeft,
  BackStyledIconButton} from './index';
import england from '../assets/logos/england.png'
import spain from '../assets/logos/spain.png'
import italy from '../assets/logos/italy.png' 
import germany from '../assets/logos/germany.png' 
import france from '../assets/logos/france.png' 
import field from '../assets/lineups/field.jpg' 
import cross from '../assets/chips/delete.png'
import {Link as LinkR, useNavigate} from 'react-router-dom'
import { AverageDisplay, EuroBalanceDisplay, useAuth, useGetTeams } from './functions';
import { FantasyState } from '../context/FantasyContext';
import { Row } from './indexTwo';
import { DndContext,useDraggable,useDroppable,DragOverlay } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import EditMenu from '../components/menus/EditMenu';
import { PlayerDroppingAreas } from './fakeData';
import { StyledButton } from '../components';
import { StyledIconButtonHover } from '../components/chats';
import PlayerStatsMenu from '../components/menus/PlayerStatsMenu';
import TeamStats from './TeamStats';

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
  const [gameStarted, setGameStarted] = useState(false)
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
  const [isColumnExpanded, setIsColumnExpanded] = useState(false)
  const [playerValue, setPlayerValue] = useState(null)
  const [nationality, setNationality] = useState(null)
  const [height, setHeight] = useState(null)
  const [preferred, setPreferred] = useState(null)
  const [isTop, setIsTop] = useState(true)
  const [rating, setRating] = useState(null)
  const [openEditMenu, setOpenEditMenu] = useState(false)
  const [activePlayer, setActivePlayer] = useState(null); 
  const [selectedPlayerMenu, setSelectedPlayerMenu] = useState(false)
  const [selectedTeamMenu, setSelectedTeamMenu] = useState(false)
  const [activeClassName, setActiveClassName] = useState(1)
  const [balance, setBalance] = useState(300)
  const [teamAverage, setTeamAverage] = useState(0)
  const [allPlayersData, setAllPlayersData] = useState([])
  const [formation, setFormation] = useState("4-3-3")
  const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
  const [activeMatch, setActiveMatch] = useState([])
  const navigate = useNavigate()
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

  useEffect(() => {
    if(gameStarted === true){
      setIsColumnExpanded(true)
    }
  }, [gameStarted])

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10, // Start dragging after 10px of movement
      },
    })
  );

  const getAllIds = (data) => {
    let ids = [];
  
    // Iterate over the values in the object
    Object.values(data).forEach((areaArray) => {
      // For each array, iterate over the objects and collect the ids
      areaArray.forEach((player) => {
        ids.push(player.id);
      });
    });
  
    return ids;
  };

  const getPlayerRating = async () => {
    const allIds = getAllIds(droppedPlayers); // Get all player IDs
    console.log(allIds);
  
    let totalRating = 0;  // Variable to accumulate the total ratings
    let ratingCount = 0;  // Variable to keep track of how many ratings were found
  
    // Iterate over all player IDs
    allIds.forEach(async (id) => {
      const idOnDB = localStorage.getItem(`player${id}`); // Check local storage
      let rating;
  
      // If the player rating is not in local storage, fetch it from the database
      if (idOnDB === null) {
        const { data, error } = await supabase
          .from('footballPlayers')
          .select('latestMatches')
          .eq('id', id);
  
        if (error) {
          console.log(error);
        }
  
        if (data) {
          rating = parseFloat(data[0]?.latestMatches[0]?.games?.rating || null);
          if (rating) {
            localStorage.setItem(`player${id}`, rating); // Store in local storage
          }
        }
      } else {
        rating = parseFloat(idOnDB); // Retrieve the rating from local storage
      }
  
      console.log(`Rating for player ${id}:`, rating); // Check if the rating is correct
  
      if (rating) {
        totalRating += rating;  // Add the rating to the total
        ratingCount++;          // Increment the rating count
  
        // Now, update the correct player's lastMatchRating
        Object.values(droppedPlayers).forEach((areaArray) => {
          areaArray.forEach((player) => {
            if (player.id === parseInt(id)) {  // Check if the player's ID matches
              player.lastMatchRating = rating;  // Set the specific rating
              console.log(`Updated player ${player.id} with rating ${rating}`);
            }
          });
        });
      }
  
      // After processing all players, calculate and log the average rating
      if (ratingCount > 0 && ratingCount === allIds.length) {
        const averageRating = totalRating / ratingCount;
        setTeamAverage(averageRating.toFixed(2))
      }
    });
  };
  
  /* useEffect(() => {
    getPlayerRating()
  }, [droppedPlayers]) */

 

  const getDroppedPlayers = async () => {
  const { data, error } = await supabase
    .from('fantasyFootball')
    .select('*')
    .eq("playerId", user.id);

  if (error) {
    console.error('Error fetching players:', error);
    return [];
  }
  
  setFormation(data[0].formation)
  setBalance(data[0].balanceRemaining)
  return data; // This should be the array of player objects
};

// Adjusted unflatPlayers function to group by 'overId'
const unflatPlayers = (flatPlayers) => {
  return flatPlayers.reduce((acc, player) => {
    const { overId, id, value, image, teamLogo, rating, isDropped, position, lastMatchRating } = player;

    // If there is no entry for this 'overId' yet, create one as an array
    if (!acc[overId]) {
      acc[overId] = [];
    }

    // Push player data into the respective 'overId' group
    acc[overId].push({
      id,
      value,
      image,
      teamLogo,
      rating,
      isDropped,
      overId,
      position,
      lastMatchRating,
    });

    return acc;
  }, {}); // Start with an empty object
};

const unflatPlayersTwo = (flatPlayers) => {
  return flatPlayers.reduce((acc, player) => {
    const { id, value, image, position, name, teamLogo, rating, overId, lastMatchRating } = player;

    // Create newPlayer object with the desired structure
    const newPlayer = {
      id,
      value,
      image,
      position,
      name,
      teamLogo,
      rating,
      overId,
      lastMatchRating, // Same as player.overId
    };

    // Update acc (accumulated object) using overId as key
    acc[overId] = [newPlayer]; // Replaces the existing entry with this new player

    return acc;
  }, {});
};

useEffect(() => {
  const fetchAndUnflatPlayers = async () => {
    const flatPlayers = await getDroppedPlayers();
    const players = (flatPlayers[0].players)
    const unflat = unflatPlayers(players);
    const structuredPlayers = unflatPlayersTwo(players);

    // Setting the unflattened players into state
    setDroppedPlayers(unflat);
    setAllPlayersData((prev) => ({
      ...prev,
      ...structuredPlayers, // Merge the new players into the existing state
    }));
  };

  fetchAndUnflatPlayers();
}, [user]);

  const fetchPlayers = useCallback(debounce(async (searchTerm) => {
    if (!searchTerm) {
      setSearchedPlayers([]);  // Reset players when input is empty
      return;
    }
    
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

  

  const handleUpdate = (player) => {
    setPlayerToUpdate(player)
    setOpenEditMenu(true)
  }


  

  const Player = ({ player }) => {
    const playerIsDropped = Object.values(droppedPlayers).some(area =>
      area.find(droppedPlayer => droppedPlayer.id === player.id)
    );
    const playerIsInjured = player.injuryType !== null && player.injuryType !== "Questionable";
    const isDraggingDisabled = playerIsDropped || playerIsInjured;
    const { attributes, listeners, setNodeRef, transform, isDragging  } = useDraggable({
      id: `${player.id}`,
      disabled: isDraggingDisabled,  
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
        <Avatar alt="Image" src={player.photo} sx={{ width: { xs: 20, sm: 20, md: 30, lg: 50, xl: 50 }, 
                      height: { xs: 20, sm: 20, md: 30, lg: 50, xl: 50 }, }} />
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
    if (droppedPlayers && gameStarted === false) {

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
      
      if (value && image && fakeBalance > 0) {
        setIsSearchExpanded(false)
        setPlayerToFind("")
        setSearchedPlayers([])
        setPlayersSelected((prev) => [...prev, id])
        setBalance((prevBalance) => prevBalance - value);
        setDroppedPlayers((prev) => ({
          ...prev,
          [over.id]: [{ id: id, value, image, teamLogo, overId: over.id, rating: rating, isDropped: true, name: name, lastMatchRating: null, position: position }], // Replace the existing player
        }));
        setActivePlayer(null);
        const newPlayer = { id: id, value: value, image: image, position: position, name: name, teamLogo: teamLogo, rating: rating, overId: over.id, lastMatchRating: null };

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
  const openTeamMenu = (player) => {
    
    setActiveTeamId(player.teamId)
    setSelectedTeamMenu(true)
  }

  const getFixture = async () => {
    const { data, error } = await supabase
      .from("fixtures").select('fixtures').eq('leagueName', "La Liga")
      if(error){
        console.log(error)
      }
      if(data){
        console.log(data)
        data[0].fixtures.forEach((el) => {
          if(el.teams.home.name === "Real Madrid" && el.teams.away.name === "Barcelona"){
            console.log(el)
          }
        })
      } 
    /* const json = JSON.parse(str);
    json.response.forEach((el) => {
      if(el.teams.home.name === "AS Roma" && el.teams.away.name === "Inter"){
        console.log(el)
      }
    }) */
  }
  
  /* useEffect(() => {
    getFixture();
  }, []) */

  const expandDiv = () => {
    setIsColumnExpanded(!isColumnExpanded)
  }

  const goBack = () => {
    navigate(`/`)
  }
   
  return ( 
    <Section>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(event) => {
              setActivePlayer(event.active.data.current);  // Set the active player when dragging starts
            }}>
      <ArrowRightMiddle onClick={expandDiv} style={{transform: isColumnExpanded ? 'rotate(90deg)' : "", top: '35%', display: gameStarted ? "none" : 'flex'}}></ArrowRightMiddle>
      <LeftPokerColumn initial={{ width: '60vw'}} 
    animate={{ width: isColumnExpanded ? '100vw' : '60vw' }} 
    transition={{ duration: 0.5 }} >
      <TopPokerColumnLeft>
      {Object.entries(allPlayersData).map(([area, players]) => (
       <>
          {players.map((player) => {
            return(
              <TopPlayerHolder isColumnExpanded={isColumnExpanded}>
                <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                <Avatar alt="Image" src={player.image} sx={{ width: { xs: 20, sm: 20, md: 40, lg: 50, xl: 50 }, 
                  height: { xs: 20, sm: 20, md: 40, lg: 50, xl: 50 },}} />
                  <TopPlayerText>{player.name}</TopPlayerText>
                  <TopPlayerText style={{color: 'gold'}}>{player.value}M €</TopPlayerText>
                  <PlayerTeamCross style={{display: gameStarted ? "none" : 'flex'}} onClick={() => removePlayer(player)}><img src={cross} alt="cross" /></PlayerTeamCross>
              </TopPlayerHolder>
            )
          })}
        </>
      ))}
      </TopPokerColumnLeft>
      <BigPokerColumnLeft>
      
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
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
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
                  </div>
                )
              })}
            </BetArea>
          </LeftPokerColumn>
          
           
          
      </BigPokerColumnLeft>
      <BottomPokerColumnLeft>
          <EuroBalanceDisplay balance={balance} />
          {!gameStarted && <StyledButton onClick={() => fetchData()}>SAVE TEAM</StyledButton>}
          {!gameStarted && <StyledButton onClick={() => setData()}>SEND DATA</StyledButton>}
          <AverageDisplay balance={teamAverage} />
          
      </BottomPokerColumnLeft>
    </LeftPokerColumn>
      <RightPokerColumn initial={{ width: '40vw'}} 
    animate={{ width: isColumnExpanded ? '0vw' : '40vw' }} 
    transition={{ duration: 0.5 }}>
      <TopPokerColumn>
      {balls.map((ball) => {
            return(
              <BallColumn key={ball.id}>
              <CountryBall initial={{ height: activeBall === ball.id ? '70%' : '100%'}}
              animate={{ height: activeBall === ball.id ? '70%' : '100%', transform: activeBall === ball.id ? 'translateY(10px) scale(0.9)' : '' }} 
              transition={{ duration: 0.3 }} ><img onClick={() => {setActiveLeague(ball.league); setActiveBall(ball.id)}} src={ball.logo} alt="england" /></CountryBall>
              <CountryBallText initial={{fontSize: activeBall === ball.id ? '18px' : '0', display: activeBall === ball.id ? 'flex' : 'none', height: activeBall === ball.id ? '30%' : '0%'}} 
              animate={{fontSize: activeBall === ball.id ? '18px' : '0', display: activeBall === ball.id ? 'flex' : 'none', height: activeBall === ball.id ? '30%' : '0%', transform: activeBall === ball.id ? 'translateY(-5px)' : ''  }} 
              transition={{ duration: 0.3 }}>{ball.name}</CountryBallText>
              </BallColumn>
            )
          })}
        </TopPokerColumn>
        <TopPokerColumn>
        <InnerTeamsCarousel>
          {loadingTeams ? (
            <CircularProgress sx={{width: 80, height: 80, margin: 'auto'}} />
          ) : (
            <Row>
              {teams?.map((team) => {
                return (
                  <TeamWrapper onClick={() => handleTeam(team)} key={team.teamId}>
                    <TeamLogo style={{backgroundImage: `url(${team.teamLogo})`,backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}></TeamLogo>
                    <TeamName>{team.teamName}</TeamName>
                  </TeamWrapper>
                )
              })}
            </Row>
          )}
          </InnerTeamsCarousel>
        </TopPokerColumn>
        <BottomPokerColumn>
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
                    <div style={{display: 'flex', alignItems:'center'}}>
                    <PlayerWrapper key={player.photo} initial={{ opacity: 0, y: 20 }} onClick={() => openPlayerMenu(player)}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.15 }} id={player.id} style={{border: playerIsDropped ? `3px solid green` : '2px solid white'}}>
                      <PlayerAvatar>
                    <Avatar alt="Image" src={player.teamLogo} sx={{ width: { xs: 30, sm: 30, md: 30, lg: 30, xl: 30 }, 
                      height: { xs: 30, sm: 30, md: 30, lg: 30, xl: 30 }, transform: 'translateX(-50%)'}} />
                      </PlayerAvatar>
                      <PlayerAvatar>
                      <PlayerShirt>{player.number}</PlayerShirt>
                      <Player key={player.id} player={player} />
                      </PlayerAvatar>
                      <PlayerName>{player.name}</PlayerName>
                      <PlayerPosition>{player.position}</PlayerPosition>
                      
                      <PlayerValue>{player.value}M €</PlayerValue>
                      <PlayerShirtHolder onClick={() => {setOpenEditMenu(true); setPlayerToUpdate(player)}}><PlayerRating style={{background: player.rating >= 7 ? `green` : player.rating >= 6 && player.rating < 7 ? "yellow" : "red"}}>{player.rating}</PlayerRating></PlayerShirtHolder>
                    </PlayerWrapper>
                    <StyledIconButtonHover style={{transform: 'translateX(-5px)'}} onClick={() => openPlayerMenu(player)}><PlayerSettingsIcon /></StyledIconButtonHover>
                    </div>
                  )
                })
              )}
              {(isSearchExpanded === false || searchedPlayers.length === 0) && players?.map((player, index) => {
                const playerIsDropped = Object.values(droppedPlayers).some(area =>
                  area.find(droppedPlayer => droppedPlayer.id === player.id)
                );
                const playerIsInjured = player.injuryType === 'Missing Fixture';
                const playerIsQuestionable = player.injuryType === 'Questionable';
                const borderStyle = playerIsDropped 
                  ? '3px solid green' 
                  : playerIsInjured 
                  ? '3px solid red' 
                  : playerIsQuestionable 
                  ? '3px solid orange' 
                  : '2px solid white'; 
                return (
                  <div style={{display: 'flex', alignItems:'center'}}>
                    <StyledIconButtonHover style={{transform: 'translateX(-5px)'}} onClick={() => openPlayerMenu(player)}><PlayerSettingsIcon /></StyledIconButtonHover>
                  <PlayerWrapper key={player.photo} initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15 }} id={player.id} style={{border: `${borderStyle}`}}>
                    <PlayerAvatar>
                    <Avatar onClick={() => openTeamMenu(player)} alt="Image" src={player.teamLogo} sx={{ width: { xs: 30, sm: 30, md: 20, lg: 30, xl: 30 }, 
                      height: { xs: 30, sm: 30, md: 20, lg: 30, xl: 30 }, transform: 'translateX(-10%)'}} />
                      </PlayerAvatar>
                    <PlayerAvatar>
                    <PlayerShirt>{player.number}</PlayerShirt>
                    <Player key={player.id} player={player} />
                    </PlayerAvatar>
                    <PlayerName>{player.name}</PlayerName>
                    <PlayerPosition>{player.position}</PlayerPosition>
                    
                    <PlayerValue>{player.value}M €</PlayerValue>
                    <PlayerShirtHolder onClick={() => {setOpenEditMenu(true); setPlayerToUpdate(player)}}><PlayerRating style={{background: player.rating >= 7 ? `green` : player.rating >= 6 && player.rating < 7 ? "yellow" : "red"}}>{player.rating}</PlayerRating></PlayerShirtHolder>
                  </PlayerWrapper>
                  
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
          </BottomPokerColumn>
    </RightPokerColumn>
    {/* {openEditMenu && (
        <EditMenu openEditMenu={openEditMenu} setOpenEditMenu={setOpenEditMenu}/>
      )} */}
      {selectedPlayerMenu && (
        <PlayerStatsMenu selectedPlayerMenu={selectedPlayerMenu} setSelectedPlayerMenu={setSelectedPlayerMenu} />
      )}
      {selectedTeamMenu && (
        <TeamStats selectedTeamMenu={selectedTeamMenu} setSelectedTeamMenu={setSelectedTeamMenu} />
      )}
      </DndContext>
      <BackStyledIconButton onClick={goBack}><ArrowLeft /></BackStyledIconButton>
    </Section>
  )
}

export default Fantasy

const Section = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${props => props.theme.body};
  ${props => props.theme.displayFlex};
  //overflow-x: hidden;
`;


const options = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/players',
  params: {fixture: '1208587'},
  headers: {
    'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  }
};

const optionsTwo = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
  params: {
    league: '78',
    season: '2024'
  },
  headers: {
    'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  }
};



const optionsFour = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
  params: {
    league: '140',
    season: '2024',
    round: 'Regular Season - 10'
  },
  headers: {
    'x-rapidapi-key': /*  */'5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  }
};



const optionsWWW = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/players',
  params: {
    id: '196156',
    season: '2024'
  },
  headers: {
    'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  }
};

const optionsFive = {
  method: 'GET',
  url: 'https://api-football-v1.p.rapidapi.com/v3/injuries',
  params: {date: '2024-11-03'},
  headers: {
    'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
  }
};
/* const setData = async () => {
  const str = localStorage.getItem("round")
  const json = JSON.parse(str)
  console.log(json.response)
  const delay = 500;
  for (const update of json.response){
    const playerId = update.player.id
    const { data, error } = await supabase
          .from('footballPlayers') // replace with your actual table name
          .select('*')
          .eq('id', playerId)
      if (error) {
          console.error(`Error updating row with ID ${playerId}:`, error.message);
      } else {
          if(data.length > 0){
            const injuryReason = update.player.reason
            const injuryType = update.player.type
            const { data, error } = await supabase
          .from('footballPlayers') // replace with your actual table name
          .update([{injuryType: injuryType, injuryReason: injuryReason}])
          .eq('id', playerId); // replace 'id' with your actual primary key column name

          if (error) {
              console.error(`Error updating row with ID ${playerId}:`, error.message);
          } else {
              console.log(`Row with ID ${playerId} updated successfully:`, data);
          }
          }
      }
  }
} */

  const setData = async () => {
    const str = localStorage.getItem("round");
    const json = JSON.parse(str);
    console.log(json)
    /* const { data, error } = await supabase
      .from('footballPlayers')
      .select('id, laLigaStats')
      .eq('leagueName', 'Ligue 1');
    if (error) {
      console.error("Error fetching data:", error.message);
    } else {
      // Filter rows in JavaScript
      const missingStatisticsRows = data.filter(row => 
        Array.isArray(row.laLigaStats) && // Ensure laLigaStats is an array
        !row.laLigaStats.some(stat => stat && stat.hasOwnProperty('statistics'))
      );
    
      const idsToUpdate = missingStatisticsRows.map(row => row.id);

      // Update rows in Supabase to set laLigaStats to null
      const { error: updateError } = await supabase
        .from('footballPlayers')
        .update({ laLigaStats: null })
        .in('id', idsToUpdate); // Use the IDs from the filtered rows

      if (updateError) {
        console.error("Error updating rows:", updateError.message);
      } else {
        console.log("Rows updated successfully. IDs:", idsToUpdate);
      }
    } */
  }

  const optionsThree = {
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/teams/statistics',
    params: {
      league: '39',
      season: '2024',
      team: '66'
    },
    headers: {
      'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
    }
  };

const fetchData = async () => {
  try {
    const response = await axios.request(optionsTwo);
    console.log(response.data);
    localStorage.setItem("round", JSON.stringify(response.data))
    message.success("data fetched!")
  } catch (error) {
    console.error(error);
  }
    /* const str = localStorage.getItem("round");
    const json = JSON.parse(str);
    console.log(json.response)
    const { error: updateError } = await supabase
        .from('teams')
        .update({ stats: json.response })
        .eq('teamId', 66); // Use the IDs from the filtered rows

      if (updateError) {
        console.error("Error updating rows:", updateError.message);
      } else {
        console.log("Rows updated successfully. 33:");
        message.success("data gone")
      } */
    
  /* const str = localStorage.getItem("update");
  const json = JSON.parse(str);
  //console.log(json.response);
  
  for (const player of json.response[0].players) {
    console.log(player.player.id);
    console.log(player.statistics);
    
    // Check if the player exists
    const { data, error: fetchError } = await supabase
      .from('footballPlayers')
      .select('*')
      .eq("id", player.player.id);
      
    if (fetchError) {
      console.error('Error fetching player:', fetchError);
      continue; // Skip to the next player if there's an error
    }

    if (data.length > 0) {
      // If the player exists, update their data
      const { error: updateError } = await supabase
        .from('footballPlayers')
        .update({
          latestMatches: player.statistics
        })
        .eq("id", player.player.id);
        
      if (updateError) {
        console.error('Error updating player:', updateError);
      } else {
        console.log(`Updated player: ${player.player.id}`);
      }
    } else {
      console.log(`Player with ID ${player.player.id} does not exist.`);
    }
  } */
};



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