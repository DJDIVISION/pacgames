import React, { useEffect,useState,useCallback,useRef } from 'react'
import styled from 'styled-components'
import { debounce } from 'lodash';
import { supabase } from '../supabase/client'
import { Avatar, Button, IconButton } from '@mui/material';
import {motion,AnimatePresence} from 'framer-motion'
import england from '../assets/logos/england.png'
import spain from '../assets/logos/spain.png'
import italy from '../assets/logos/italy.png' 
import germany from '../assets/logos/germany.png' 
import france from '../assets/logos/france.png' 
import field from '../assets/lineups/vertField.png' 
import { BallColumn,CountryBall,CountryBallText, MiniArrowDownTop, MiniArrowupTop,CountryBallTextTop, PlayerSettingsIcon, Search, SearchIconButton, ArrowLeftRelative } from './index';
import { FantasyState } from '../context/FantasyContext';
import { CircularProgress } from '@mui/material';
import { AverageDisplay, BalanceDisplay, startCountdown, useAuth, useGetTeams } from './functions';
import { useMediaQuery } from 'react-responsive';

import { message } from 'antd';
import { StyledButton } from '../components';
import TeamStats from '../components/menus/TeamStats';
import PlayerStatsMenu from '../components/menus/PlayerStatsMenu';
import {useTranslation} from "react-i18next";
import { getBackgroundColor } from './functions';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { DndContext,useDraggable,useDroppable,DragOverlay } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import {Section,BottomRow,IconHolder,Container,LeagueRow,item,LeagueHolder,AbsoluteIconButton,ArrowUp,ArrowDown,
    Title,AbsoluteIconButtonLeft,TeamCircularRow,TeamRow,TeamHolder
} from './indexThree'

const NewFantasy = () => {


    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
          activationConstraint: {
            distance: 10, // Start dragging after 10px of movement
          },
        })
      );
    const leagues = [
        {
            league: "Premier League",
            logo: england,
            name: "England",
            id: 1,
            currentRound: 12
        },
        {
            league: "La Liga",
            logo: spain,
            name: "Spain",
            id: 2,
            currentRound: 14
        },
        {
            league: "Serie A",
            logo: italy,
            name: "Italy",
            id: 3,
            currentRound: 13
        },
        {
            league: "Ligue 1",
            logo: france,
            name: "France",
            id: 4,
            currentRound: 12
        },
        {
            league: "Bundesliga",
            logo: germany,
            name: "Germany",
            id: 5,
            currentRound: 11
        }
    ]
    const [t, i18n] = useTranslation("global");
    const { user } = useAuth(); 
    const [loadingRating, setLoadingRating] = useState(false)
    const navigate = useNavigate()
    const [startDate, setStartDate] = useState("2024-11-22 20:30:00")
    const [endDate, setEndDate] = useState('2024-11-25 23:00:00')
    const [gameStarted, setGameStarted] = useState(false)
    const [allLeagues, setAllLeagues] = useState(leagues)
    const [availableLeagues, setAvailableLeagues] = useState([])
    const [activeBall, setActiveBall] = useState(1)
    const {activeLeague, setActiveLeague} = FantasyState();
    const {activeTeam, setActiveTeam} = FantasyState();
    const {activePlayer, setActivePlayer} = FantasyState();
    const [activePlayerSell, setActivePlayerSell] = useState(null)
    const [activePlayerDrag, setActivePlayerDrag] = useState(null)
    const [openLeagueMenu, setOpenLeagueMenu] = useState(true)
    const [openTeamMenu, setOpenTeamMenu] = useState(false)
    const [openPlayerMenu, setOpenPlayerMenu] = useState(false)
    const [selectedTeamMenu, setSelectedTeamMenu] = useState(false)
    const [openDropMenu, setOpenDropMenu] = useState(false)
    const [openConfirmMenu, setOpenConfirmMenu] = useState(false)
    const [openConfirmSellMenu, setOpenConfirmSellMenu] = useState(false)
    const [openSellMenu, setOpenSellMenu] = useState(false)
    const [openSearchMenu, setOpenSearchMenu] = useState(false)
    const [openStatsMenu, setOpenStatsMenu] = useState(false)
    const [openTrainingMenu, setOpenTrainingMenu] = useState(false)
    const [openRemovePlayerMenu, setOpenRemovePlayerMenu] = useState(false)
    const [selectedPlayerMenu, setSelectedPlayerMenu] = useState(false)
    const [areaId, setAreaId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState(null)
    const [disabledTitle, setDisabledTitle] = useState(false)
    const [lastTraining, setLastTraining] = useState(null)
    const [teamRating, setTeamRating] = useState(null)
    const [trainingsNumber, setTrainingsNumber] = useState(null)
    const [isDateExpanded, setIsDateExpanded] = useState(false)
    const {playerToUpdate, setPlayerToUpdate} = FantasyState();
    const {playersSelected, setPlayersSelected} = FantasyState();
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const { activeTeamId, setActiveTeamId } = FantasyState(); 
    const {teams,getTeams,loadingTeams,players,loadingPlayers,handleTeamChange,setPlayers,getPlayers,setTeams} = useGetTeams();
    const [droppedPlayers, setDroppedPlayers] = useState([])
    const [searchedPlayers, setSearchedPlayers] = useState([])
    const [playerToFind, setPlayerToFind] = useState("")
    const [width, setWidth] = useState(0);
    const [teamAverage, setTeamAverage] = useState(0)
    const [teamNewAverage, setTeamNewAverage] = useState(0)
    const carroussel = useRef(null);
    const [playerHasTeam, setPlayerHasTeam] = useState(false)
    const [playerToRemove, setPlayerToRemove] = useState(null)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [droppedTeamPlayers, setDroppedTeamPlayers] = useState({
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
        const start = new Date(startDate)
        const end = new Date(endDate)
        const now = new Date(); // Current date and time
        const isBetween = now >= start && now <= end;
        setGameStarted(isBetween)
    }, [])

      useEffect(() => {
        if(droppedPlayers){
            setWidth(droppedPlayers.length * 55)
        }
    }, [droppedPlayers]);

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
    

      const fetchUserData = async () => {
        const { data, error } = await supabase
                    .from('fantasyFootball')
                    .select('*') // Update the jsonb column
                    .eq('id', user.id); // Identify which user to update
    
                if (error) {
                    console.error('Error updating user data:', error);
                } 
                if(data){
                    if(data.length === 0){
                        const { error: updateError } = await supabase
                        .from('fantasyFootball')
                        .insert({ id: user.id, balanceRemaining: 300, playerName: user.user_metadata.full_name, email: user.email }) 
                        if (updateError) {
                            console.error('Error updating user data:', updateError.message);
                        } else {
                            console.log("data inserted now!")
                        }
                    } else {
                        setBalance(data[0].balanceRemaining)
                        setDroppedPlayers(data[0].players.players)
                        setTeamRating(data[0].teamRating)
                        setLastTraining(data[0].lastTraining)
                        setTrainingsNumber(data[0].trainingsNumber)
                        if(data[0].nextMatch !== null){
                            setDroppedTeamPlayers(data[0].nextMatch.players)
                            setPlayerHasTeam(true)
                        }
                    }
                }
      }

      /* console.log(lastTraining) */

      useEffect(() => {
        fetchUserData(); 
      }, [user])

      useEffect(() => {
        getTeams();
      }, [activeLeague])

      useEffect(() => {
        if (openTrainingMenu) {
            startCountdown(lastTraining); // Call countdown after component is rendered
        }
    }, [openTrainingMenu]);


    useEffect(() => {
        const fetchAvailableLeagues = async () => {
            setLoading(true);
    
            // Calculate date range in milliseconds
            const startDateMS = new Date(startDate).getTime();
            const endDateMS = new Date(endDate).getTime();
    
            const uniqueLeagues = new Set();
    
            // Fetch fixtures for each league
            for (const league of allLeagues) {
                const { data, error } = await supabase
                    .from('fixtures')
                    .select('fixtures')
                    .eq('leagueName', league.league);
    
                if (error) {
                    console.error('Error fetching fixtures:', error.message);
                    continue;
                }
    
                if (data && data.length > 0) {
                    data[0].fixtures.forEach((match) => {
                        const date = new Date(match.fixture.date).getTime();
                        
                        if (date >= startDateMS && date <= endDateMS) {
                            uniqueLeagues.add(league); // Add unique league if match falls within date range
                        }
                    });
                }
            }
    
            // Convert Set to array and update available leagues
            const uniqueLeaguesArray = Array.from(uniqueLeagues);
            setAvailableLeagues(uniqueLeaguesArray);
            
            // Set the active league to the first item in available leagues if available
            if (uniqueLeaguesArray.length > 0) {
                setActiveLeague(uniqueLeaguesArray[0]);
            }
    
            setLoading(false);
        };
    
        fetchAvailableLeagues();
    
        // Only re-run if startDate or endDate changes
    }, [startDate, endDate, allLeagues]);


    

    const openLeague = () => {
        if(openLeagueMenu){
            return
        } else {
            setActiveLeague(null)
        setOpenDropMenu(false)
        setTeams([])
        setActivePlayer(null)
        setOpenSearchMenu(false)
        setActiveTeam(null)
        if(openTeamMenu){
            setOpenTeamMenu(false)
        }
        if(openPlayerMenu){
            setOpenPlayerMenu(false)
        }
        setTimeout(() => {
            setOpenLeagueMenu((prev) => !prev);
        }, 500)
        }
    }
    const openStats = () => {
        setOpenDropMenu(false)
        setOpenSellMenu(false)
        setOpenTrainingMenu(false)
        setTimeout(() => {
            setOpenStatsMenu((prev) => !prev);
        },500)
    }
    const openSell = () => {
        setOpenDropMenu(false)
        setOpenStatsMenu(false)
        setOpenTrainingMenu(false)
        setTimeout(() => {
            setOpenSellMenu((prev) => !prev);
        },500)
    }
    const openTraining = () => {
        setOpenDropMenu(false)
        setOpenStatsMenu(false)
        setOpenSellMenu(false)
        setTimeout(() => {
            setOpenTrainingMenu((prev) => !prev);
        },500)
    }
    const closeDate = () => {
        setIsDateExpanded((prev) => !prev);
    }
    const openSearch = () => {
        if(openSearchMenu){
            setOpenSearchMenu(false)
            setTimeout(() => {
                setOpenLeagueMenu(true)
            },500)
        } else {
            setOpenLeagueMenu(false)
            setOpenDropMenu(false)
            setOpenPlayerMenu(false)
            setTimeout(() => {
                setOpenSearchMenu((prev) => !prev);
            },500)
        }
        
    }
    const isMobile = useMediaQuery({ query: '(max-width: 498px)' });
    const variants = {
        expanded: {
            height: isMobile ? '10vh' : '10vh'
        },
        collapsed: {
            height: '0vh'
        },
    };
    const variantsTwo = {
        expanded: {
            height: isMobile ? '90vh' : '85vh'
        },
        collapsed: {
            height: isMobile ? '80vh' : '75vh'
        },
    };
    

const setAllPlayers = (team) => {
    console.log(team)
    handleTeamChange(team.teamId)
    setOpenTeamMenu(false)
    setActiveTeam(team)
    setTimeout(() => {
        setOpenPlayerMenu(true)
    }, 500)
}

const selectPlayer = (player,playerIsDropped) => {
    if(playerIsDropped){
        message.error("This player is already on your team!")
    } else {
        setOpenSearchMenu(false)
        setActivePlayer(player)
        setOpenPlayerMenu(false)
        
        setTimeout(() => {
            setOpenConfirmMenu(true)
        }, 500)
    }
}

const openConfirmSell = (player) => {
    console.log(player)
    setActivePlayerSell(player)
    setOpenSellMenu(false)
    setTimeout(() => {
        setOpenConfirmSellMenu(!openConfirmSellMenu)
    }, 500)
}

const setAllTeams = (league) => {
    console.log(league)
    console.log(activeLeague)
    setActiveLeague(league); 
    setActiveBall(league.id)
    setOpenLeagueMenu(false); 
    setTimeout(() => {
        setOpenTeamMenu(true)
    }, 500)
}

const closePlayers = () => {
    setOpenPlayerMenu(false)
    setActiveTeam(null)
    setActivePlayer(null)
    setOpenDropMenu(false)
    setTimeout(() => {
        setOpenTeamMenu(true)
    }, 500)
}

const toggleMenu = () => {
    if(!openDropMenu){
        setOpenPlayerMenu(false)
        setOpenLeagueMenu(false)
        setOpenSellMenu(false)
        setOpenSearchMenu(false)
        setOpenTrainingMenu(false)
        setOpenStatsMenu(false)
        setOpenTeamMenu(false)
        setActiveTeam(null)
        setActivePlayer(null)
        setDisabledTitle(true)
        setTimeout(() => {
            setOpenDropMenu((prev) => !prev);
        }, 500)
    } else {
        setOpenDropMenu((prev) => !prev);
        setDisabledTitle(false)
        setTimeout(() => {
            setOpenLeagueMenu((prev) => !prev);
        }, 500)
    }
}


    const placePlayer = (areaId) => {
        setAreaId(areaId)
        setOpenConfirmMenu(true)
    }

    const confirmPlayer = async () => {
        
        const parsedRating = parseFloat(activePlayer.rating.toFixed(2)); 
        console.log(parsedRating)
        const fakeBalance = balance - activePlayer.value
        const parsedBalance = parseFloat(fakeBalance.toFixed(2)); 
        console.log(parsedBalance)

        const { data, error } = await supabase
            .from('fantasyFootball')
            .select('*')
            .eq('id', user.id);
    
        if (error) {
            console.error('Error fetching user data:', error.message);
        } else {
            if (data.length === 0) {
                message.error("This user does not exist in our database");
            } else {
                console.log(data);

                const userPlayersData = data[0].players || {}; 
                let teamRating
                const power = data[0].teamRating
                if(power === null){
                    teamRating = parsedRating
                } else {
                    const parsedPower = parseFloat(power)
                    teamRating =  (parsedRating + parsedPower)/ 2
                }
                const newRating = parseFloat(teamRating.toFixed(2))
                // Initialize referrals array if it doesn't exist
                userPlayersData.players = userPlayersData.players || []; 
                
                // Prepare the updated data structure to add
                const updatedData = {
                    name: activePlayer.name,
                    photo: activePlayer.photo,
                    position: activePlayer.position,
                    value: activePlayer.value,
                    teamLogo: activePlayer.teamLogo,
                    rating: parsedRating,
                    id: activePlayer.id,
                    teamName: activePlayer.team,
                    leagueName: activePlayer.leagueName
                };
    
                // Add the updated data to the referrals array
                userPlayersData.players.push(updatedData);
                
                // Update the user's jsonb column
                const { error: updateError } = await supabase
                    .from('fantasyFootball')
                    .update({ players: userPlayersData, balanceRemaining: parsedBalance, teamRating: newRating }) 
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', userPlayersData);
                    setOpenConfirmMenu(false)
                    setActivePlayer(null)
                    setActiveTeam(null)
                    setBalance((prev) => prev - activePlayer.value)
                    fetchUserData();
                    setTimeout(() => {
                        message.success("Player added to your team!!!");
                        setOpenDropMenu(true)
                    }, 300)
                }
            }
        }
    }
    const confirmPlayerSell = async () => {
        
        const newBalance = balance + (activePlayerSell.value * 75/100)
        const parsedBalance = parseFloat(newBalance.toFixed(2)); 
        console.log(parsedBalance)

        const { data, error } = await supabase
            .from('fantasyFootball')
            .select('*')
            .eq('id', user.id);
    
        if (error) {
            console.error('Error fetching user data:', error.message);
        } else {
            if (data.length === 0) {
                message.error("This user does not exist in our database");
            } else {
                console.log(data);
                let teamRating
                let restPlayers
                const userPlayersData = data[0].players || {}; 
                console.log("userPlayersData:", userPlayersData);
                const playersToInclude = userPlayersData.players.filter(player => player.id !== activePlayerSell.id);
                const totalRating = playersToInclude.reduce((sum, player) => sum + player.rating, 0);
                const averageRating = totalRating / playersToInclude.length;
                const updatedData = { players: playersToInclude}
                console.log(updatedData)
                console.log("Average Rating:", averageRating);
                if(userPlayersData.players.length === 1){
                    console.log("now")
                    teamRating = null
                    restPlayers = null
                    setDroppedPlayers([])
                } else {
                    teamRating =  parseFloat(averageRating.toFixed(2))
                    restPlayers = playersToInclude
                    setDroppedPlayers(playersToInclude)
                }
                

                const { error: updateError } = await supabase
                    .from('fantasyFootball')
                    .update({ players: updatedData, balanceRemaining: parsedBalance, teamRating: teamRating }) 
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', userPlayersData);
                    setOpenConfirmSellMenu(false)
                    setActivePlayerSell(null)
                    setActiveTeam(null)
                    setOpenSellMenu(false)
                    //setBalance(parsedBalance)
                    fetchUserData();
                    setTimeout(() => {
                        message.success("Player removed from your team!!!");
                        setOpenDropMenu(true)
                        
                    }, 300)
                }
                

                
               
                /* if(power === null){
                    teamRating = parsedRating
                } else {
                    const parsedPower = parseFloat(power)
                    teamRating =  (parsedRating + parsedPower)/ 2
                }
                const lastMatchRating = parseFloat(teamRating.toFixed(2))
                // Initialize referrals array if it doesn't exist
                userPlayersData.players = userPlayersData.players || []; 
                
                // Prepare the updated data structure to add
                const updatedData = {
                    name: activePlayer.name,
                    photo: activePlayer.photo,
                    position: activePlayer.position,
                    value: activePlayer.value,
                    teamLogo: activePlayer.teamLogo,
                    rating: parsedRating,
                    id: activePlayer.id 
                };
    
                // Add the updated data to the referrals array
                userPlayersData.players.push(updatedData);
    
                // Update the user's jsonb column
                const { error: updateError } = await supabase
                    .from('fantasyFootball')
                    .update({ players: userPlayersData, balanceRemaining: parsedBalance, teamRating: lastMatchRating }) 
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', userPlayersData);
                    setOpenConfirmMenu(false)
                    setActivePlayer(null)
                    setActiveTeam(null)
                    setBalance((prev) => prev - activePlayer.value)
                    fetchUserData();
                    setTimeout(() => {
                        message.success("Player added to your team!!!");
                        setOpenDropMenu(true)
                    }, 300)
                } */
            }
        }
    }

    const confirmRemovePlayer = () => {
        setButtonDisabled(false)
        for (let areaKey in droppedTeamPlayers) {
            // Check if the area has a player and if their ID matches the playerId
            if (droppedTeamPlayers[areaKey][0]?.id === playerToRemove.id) {
                droppedTeamPlayers[areaKey] = []; // Set the area to an empty array if a match is found
                setDroppedTeamPlayers(droppedTeamPlayers)
            }
        }
        setOpenRemovePlayerMenu(false)
        setPlayerToRemove(null)
        setTimeout(() => {
            setOpenStatsMenu(true)
        }, 500)
    }

    const cancelRemovePlayer = () => {
        setOpenRemovePlayerMenu(false)
        setPlayerToRemove(null)
        setTimeout(() => {
            setOpenStatsMenu(true)
        }, 500)
    }

    const cancelPlayer = () => {
        setActivePlayer(null)
        setOpenConfirmMenu(false)
        setOpenDropMenu(false)
        setTimeout(() => {
            setOpenTeamMenu(true)
        }, 500)
    }
    const cancelPlayerSell = () => {
        setActivePlayerSell(null)
        setOpenConfirmSellMenu(false)
        setTimeout(() => {
            setOpenSellMenu(true)
        }, 500)
        
    }

    const openTeamStatsMenu = (team) => {
        setActiveTeamId(team.teamId)
        setSelectedTeamMenu(true)
    }

    const openPlayerStatsMenu = (player) => {
        setPlayerToUpdate(player)
        setSelectedPlayerMenu(true)
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

    const positionOrder = ["Attacker", "Midfielder", "Defender", "Goalkeeper"];

    const groupedPlayers = positionOrder.map((position) => ({
        position,
        players: droppedPlayers.filter((player) => player.position === position),
    }));
    
    const startTraining = async () => {
        if(droppedPlayers.length < 11){
            message.error("You need a full team to start trainings!")
            return
        } else {
            const date = Date.now();
        console.log(date)
        const endDate = date + 86400000
        console.log(trainingsNumber)
        
        const { error: updateError } = await supabase
                    .from('fantasyFootball')
                    .update({ lastTraining: endDate, trainingsNumber: trainingsNumber + 1 }) 
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    message.success("The training has started!")
                    setOpenTrainingMenu(false)
                    fetchUserData();
                }
        }
    }

    const Player = ({ player }) => {
        const playerIsDropped = Object.values(droppedTeamPlayers).some(area =>
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
           <Avatar alt="Image" src={player.photo} sx={{
                                        width: { xs: 50, sm: 50, md: 60, lg: 60, xl: 60 },
                                        height: { xs: 50, sm: 50, md: 60, lg: 60, xl: 60 }
                                    }} />
          </div>
        );
      };

    const BetArea = ({ id, children }) => {
        const { isOver, setNodeRef } = useDroppable({
            id,
          });
        
          return (
            <PlayerDroppingArea ref={setNodeRef} className="player-area" id={id}>
              {children}
            </PlayerDroppingArea>
          );
    };

    const handleDragEnd = (event) => {
        const { over, active } = event;
        console.log(active)
        if (over) {
          const { value, image, position, name, teamLogo, rating, id } = active.data.current;
          
          if (value && image) {
            
            setPlayersSelected((prev) => [...prev, id])
            
            setDroppedTeamPlayers((prev) => ({
              ...prev,
              [over.id]: [{ id: id, value, image, teamLogo, overId: over.id, rating: rating, isDropped: true, name: name, lastMatchRating: null, position: position }], // Replace the existing player
            }));
            setActivePlayerDrag(null);
            
          } 
        }
        
      }

      

      const getAveragePlayerRating = () => {
        const allPlayers = Object.values(droppedTeamPlayers).flat(); 
        const totalRating = allPlayers.reduce((sum, player) => sum + player.rating, 0);
        const averageRating = totalRating / allPlayers.length;
        return parseFloat(averageRating.toFixed(2));
      };
    
      useEffect(() => {
        if (droppedTeamPlayers) {
    
          const allPlayers = Object.values(droppedTeamPlayers).flat();
          
          if(allPlayers.length > 0){
            setTeamAverage(getAveragePlayerRating())
          } else {
            setTeamAverage(0)
          }
        }
      }, [droppedTeamPlayers])


      const saveDroppedTeam = async () => {
        setButtonDisabled(true)
        console.log(droppedTeamPlayers.area1[0].name.charAt(0))
        const messageToSend = `${user.user_metadata.name} has placed his Fantasy Football Team for the next Round! \n 
        ${droppedTeamPlayers.area1[0].position.charAt(0)}: ${droppedTeamPlayers.area1[0].name}, 📊 ${droppedTeamPlayers.area1[0].rating} 
        ${droppedTeamPlayers.area2[0].position.charAt(0)}: ${droppedTeamPlayers.area2[0].name}, 📊 ${droppedTeamPlayers.area2[0].rating} 
        ${droppedTeamPlayers.area3[0].position.charAt(0)}: ${droppedTeamPlayers.area3[0].name}, 📊 ${droppedTeamPlayers.area3[0].rating} 
        ${droppedTeamPlayers.area4[0].position.charAt(0)}: ${droppedTeamPlayers.area4[0].name}, 📊 ${droppedTeamPlayers.area4[0].rating} 
        ${droppedTeamPlayers.area5[0].position.charAt(0)}: ${droppedTeamPlayers.area5[0].name}, 📊 ${droppedTeamPlayers.area5[0].rating} 
        ${droppedTeamPlayers.area6[0].position.charAt(0)}: ${droppedTeamPlayers.area6[0].name}, 📊 ${droppedTeamPlayers.area6[0].rating} 
        ${droppedTeamPlayers.area7[0].position.charAt(0)}: ${droppedTeamPlayers.area7[0].name}, 📊 ${droppedTeamPlayers.area7[0].rating} 
        ${droppedTeamPlayers.area8[0].position.charAt(0)}: ${droppedTeamPlayers.area8[0].name}, 📊 ${droppedTeamPlayers.area8[0].rating} 
        ${droppedTeamPlayers.area9[0].position.charAt(0)}: ${droppedTeamPlayers.area9[0].name}, 📊 ${droppedTeamPlayers.area9[0].rating} 
        ${droppedTeamPlayers.area10[0].position.charAt(0)}: ${droppedTeamPlayers.area10[0].name}, 📊 ${droppedTeamPlayers.area10[0].rating} 
        ${droppedTeamPlayers.area11[0].position.charAt(0)}: ${droppedTeamPlayers.area11[0].name}, 📊 ${droppedTeamPlayers.area11[0].rating} 
        \n TEAM AVERAGE RATING: ${teamAverage} 💪`
        console.log(messageToSend)
        const date = new Date();
        const isAnyAreaEmpty = Object.values(droppedTeamPlayers).some(area => area.length === 0);
        if(isAnyAreaEmpty){
            message.error("You don't have a complete team!")
            return
        } else {
            const updatedData = {
                players: droppedTeamPlayers,
                teamRating: teamAverage,
                date: date
            }
            const { error: updateError } = await supabase
                    .from('fantasyFootball')
                    .update({ nextMatch: updatedData}) 
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    message.success("Your team has been saved!")
                }
                try {
      
                    const response = await axios.post('https://pacgames-roulette-server.onrender.com/send-message', { messageToSend });
                    
                    if (response.data.success) {
                      console.log('Message sent successfully!');
                    } else {
                      console.log('Failed to send message');
                    }
                  } catch (error) {
                    console.log('Error sending message');
                  }
        }
      }

      const removePlayer = (player) => {
        setPlayerToRemove(player)
        setOpenStatsMenu(false)
        setTimeout(() => {
            setOpenRemovePlayerMenu(true)
        }, 500)
    }

    async function fetchFixtureData(fixtureId,playerId,teamName) {
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: {id: fixtureId},
            headers: {
              'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
          };
    
        try {
            const response = await axios.request(options);
            response.data.response[0].players.forEach((el) => {
                if(el.team.name === teamName && response.data.response[0].fixture.status.short === "FT"){
                    el.players.forEach((player) => {
                        if(player.player.id === playerId){
                            
                            const areas = Object.values(droppedTeamPlayers)
                            for (const area of areas){
                                for (const man of area){
                                    if(man.id === playerId){
                                        if(player.statistics[0].games.rating === null){
                                            man.lastMatchRating = null 
                                        } else {
                                            localStorage.setItem(`${player.player.name}`, `${player.statistics[0].games.rating}`)
                                            man.lastMatchRating = parseFloat(parseFloat(player.statistics[0].games.rating).toFixed(2))
                                        }
                                        
                                    }
                                }
                            }
                            
                        }
                        
                    })
                }
            })
            /* const date = new Date();
            const updatedData = {
                players: droppedTeamPlayers,
                teamRating: teamAverage,
                date: date
            }
            const { error: updateError } = await supabase
                    .from('fantasyFootball')
                    .update({ nextMatch: updatedData}) 
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                   console.log("Your player has been saved!")
            } */
            
           
            
        } catch (error) {
            console.error(`Error fetching fixture ${fixtureId}:`, error);
            return null;
        }
    }

    

    async function fetchDataFromSupabase(leagueName,playerId,teamName,type) {
        
        let currentRound
        const filter = leagues.filter((el) => el.league === leagueName)
        currentRound = filter[0].currentRound
        const {data, error} = await supabase
            .from("fixtures")
            .select(`${currentRound}`)
            .eq("leagueName", leagueName);
    
        if (error) {
            console.error(`Error fetching data for ${leagueName}:`, response.error);
            return null;
        } else {
            data[0][currentRound].forEach((match) => {
                fetchFixtureData(match.fixture.id,playerId,teamName,type)
            })
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
        
    }
    


    const getLastMatchRating = async () => {
        setLoadingRating(true)
        const end = new Date(endDate)
        const now = new Date();
        if (droppedTeamPlayers && now < end) {
            /* console.log(droppedTeamPlayers) */
            const areas = Object.values(droppedTeamPlayers); // Get all areas
            for (const area of areas) {
                for (const player of area) {
                    if (player.lastMatchRating === null) {
                        let first = localStorage.getItem(`${player.name}`)
                        if(first === null){
                            await fetchDataFromSupabase(player.leagueName, player.id, player.teamName, "local");
                            // Add a delay between requests if needed
                            await new Promise(resolve => setTimeout(resolve, 500)); 
                            message.success(`Fetching rating for ${player.name}`)
                        } else {
                            console.log(first)
                            console.log(`not null for ${player.name}`)
                            const areas = Object.values(droppedTeamPlayers)
                            for (const area of areas){
                                for (const man of area){
                                    if(man.id === player.id){
                                        man.lastMatchRating = first 
                                    }
                                }
                            }
                        }
                        /* await fetchDataFromSupabase(player.leagueName, player.id, player.teamName);
                        // Add a delay between requests if needed
                        await new Promise(resolve => setTimeout(resolve, 500)); 
                        message.success(`Fetching rating for ${player.name}`) */
                    } else {
                        return
                    }
                }
            }
        } else {
            console.log("week finished")
        }
        setDroppedTeamPlayers(droppedTeamPlayers)
        setTeamAverage(getAveragePlayerRating())
        setLoadingRating(false)
    }
    

    useEffect(() => {
        if(gameStarted && openStatsMenu){
            getLastMatchRating()
        }
    }, [gameStarted,openStatsMenu])



  return (
    <Section>
        {isDateExpanded ? <AbsoluteIconButton onClick={closeDate}><ArrowDown /></AbsoluteIconButton> : <AbsoluteIconButton onClick={closeDate}><ArrowUp /></AbsoluteIconButton>}
        
        <Title initial="expanded"
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <h2>{t("fantasy.title1")} {startDate} <br/>{t("fantasy.title2")} {endDate}</h2>
        </Title>
        <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
        <AnimatePresence>
          {openLeagueMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
                <LeagueRow variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
               {availableLeagues?.map((league,index) => {
                return(
                    
                        <LeagueHolder whileHover={{scale: 1.05}} key={league.name} onClick={() => setAllTeams(league)}>
                        <BallColumn key={league.id}>
              <CountryBall><img src={league.logo} alt="england" /></CountryBall>
              <CountryBallTextTop>{league.name === "England" && `${t("fantasy.england")}`}{league.name === "Spain" && `${t("fantasy.spain")}`}{league.name === "Italy" && `${t("fantasy.italy")}`}
              {league.name === "Germany" && `${t("fantasy.germany")}`}{league.name === "France" && `${t("fantasy.france")}`}</CountryBallTextTop><CountryBallTextTop>{league.league}</CountryBallTextTop>
              </BallColumn>
                        </LeagueHolder>
                )
            })} 
            </LeagueRow>
            </Container>
          )}  
          {openTeamMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} >
                {loadingTeams ? (
                    <TeamCircularRow>
                    <CircularProgress sx={{ width: 80, height: 80 }} />
                    </TeamCircularRow>
                ) : (
                    <TeamRow variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                        {teams?.map((team,index) => {
                            return(
                                
                                <TeamHolder whileHover={{scale: 1.05}} key={team.name} >
                                    <TeamLogo onClick={() => setAllPlayers(team)}><img src={team.teamLogo} alt={team.teamLogo} /></TeamLogo>
                                    <TeamName onClick={() => setAllPlayers(team)}><h2>{team.teamName}</h2></TeamName>
                                    <TeamSettings onClick={() => openTeamStatsMenu(team)}><PlayerSettingsIcon /></TeamSettings>
                                </TeamHolder>
                                
                            )
                        })}
                    </TeamRow>
                )}
            </Container>
          )} 
          {openPlayerMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                {loadingPlayers ? (
                    <TeamCircularRow>
                    <CircularProgress sx={{ width: 80, height: 80 }} />
                    </TeamCircularRow>
                ) : (
                    <>
                    <FilterRow>
                        <StyledButton onClick={sortByRating}>{t("fantasy.title8")}</StyledButton>
                        <StyledButton onClick={sortByPosition}>{t("fantasy.title9")}</StyledButton>
                        <StyledButton onClick={sortByValue}>{t("fantasy.title10")}</StyledButton>
                    </FilterRow>
                    <PlayerRow variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                        {players?.map((player) => {
                            const playerIsDropped = droppedPlayers.find(droppedPlayer => droppedPlayer.id === player.id)
                            const playerIsInjured = player.injuryType === 'Missing Fixture';
                            const playerIsQuestionable = player.injuryType === 'Questionable';
                            const borderStyle = playerIsDropped 
                              ? '3px solid green' 
                              : playerIsInjured 
                              ? '3px solid red' 
                              : playerIsQuestionable 
                              ? '3px solid orange' 
                              : '2px solid white'; 
                            return(
                                
                                <TeamHolder whileHover={{scale: 1.02}} style={{border: `${borderStyle}`}} key={player.name}>
                                    <PlayerLogo onClick={() => selectPlayer(player,playerIsDropped)}><Avatar alt="Image" src={player.photo} sx={{
                                        width: { xs: 50, sm: 50, md: 60, lg: 60, xl: 60 },
                                        height: { xs: 50, sm: 50, md: 60, lg: 60, xl: 60 }
                                    }} /><PlayerTeamLogo><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo></PlayerLogo>
                                    
                                      <PlayerName onClick={() => selectPlayer(player,playerIsDropped)}><h2>{player.name}</h2></PlayerName>  
                                      <PlayerPosition><h2>{player.position.charAt(0)}</h2></PlayerPosition>
                                      <PlayerLogo onClick={() => selectPlayer(player,playerIsDropped)}><PlayerRating><span>{player.value}M€</span></PlayerRating></PlayerLogo>
                                      <PlayerLogo onClick={() => selectPlayer(player,playerIsDropped)}><PlayerRating style={{background: getBackgroundColor(player.rating)}}>{!isNaN(player.rating) && player.rating}</PlayerRating></PlayerLogo>
                                      <PlayerLogo onClick={() => openPlayerStatsMenu(player)}><PlayerSettingsIcon /></PlayerLogo>
                                    
                                </TeamHolder>
                                
                            )
                        })}
                    </PlayerRow>
                    </>
                )}
            </Container>
          )} 
          {openConfirmMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '5%'}} variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                    <BigTeamName style={{color: 'white'}}><h2>{t("fantasy.title3")}: {balance}M€</h2></BigTeamName>
                <BigTeamName>
                    {balance - activePlayer.value > 0 ? (
                        <h2>{t("fantasy.title4")}</h2>
                    ) : (
                        <h2>{t("fantasy.title5")}</h2> 
                    )}
                </BigTeamName>
                <BuyPlayerHolder>
                    <BuyPlayerAvatar><Avatar alt="Image" src={activePlayer.photo} sx={{
                                        width: { xs: 80, sm: 80, md: 70, lg: 80, xl: 80 },
                                        height: { xs: 80, sm: 80, md: 70, lg: 80, xl: 80 }
                                    }} /></BuyPlayerAvatar>
                                    <BuyPlayerName><h2>{activePlayer.name}</h2></BuyPlayerName>
                                    <BuyPlayerName><span>{activePlayer.value}M€</span></BuyPlayerName>
                </BuyPlayerHolder>
                <div style={{display: 'flex', width: '100%', height: '70px', alignItems: 'center', justifyContent: 'center'}}>
                {balance - activePlayer.value > 0 ? (
                        <>
                            <StyledButton onClick={cancelPlayer} style={{fontSize: '18px', margin: '0 5px'}}>{t("fantasy.cancel")}</StyledButton>
                            <StyledButton onClick={confirmPlayer} style={{fontSize: '18px', margin: '0 5px'}}>{t("fantasy.confirm")}</StyledButton>
                        </>
                    ) : (
                        <StyledButton onClick={cancelPlayer} style={{fontSize: '18px', margin: '0 5px'}}>{t("fantasy.cancel")}</StyledButton>
                    )}
                
                </div>
                </motion.div>
            </Container>
        )}
          
        {openDropMenu && (
           <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
           variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
            <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5%'}} variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <MyBalanceRow><h2>{t("fantasy.title3")}: {balance}M€</h2></MyBalanceRow>
                <MyBalanceRow>{droppedPlayers.length > 0 ? <h2>{t("fantasy.title11")}: {gameStarted ? <span style={{color: getBackgroundColor(teamAverage)}}>{teamAverage}</span>
                : <span style={{color: getBackgroundColor(teamAverage)}}>{teamAverage}</span>}</h2> : <h2></h2>}</MyBalanceRow>
                {droppedPlayers.length > 0 ? (
                    <MyPlayerContainer >
                    {groupedPlayers.map((group) => (
                      group.players.length > 0 && (
                          <div style={{width: '100%', height: '50%', display: 'flex', flexDirection: 'column'}}>
                          <MyPlayerPosition><h2>{group.position === "Attacker" && `${t("fantasy.positionOrder1")}`}
                          {group.position === "Midfielder" && `${t("fantasy.positionOrder2")}`}{group.position === "Defender" && `${t("fantasy.positionOrder3")}`}
                          {group.position === "Goalkeeper" && `${t("fantasy.positionOrder4")}`}</h2></MyPlayerPosition>
                            <MyPlayerRow>
                                {group.players.map((player) => {
                                    return(
                                        <MyPlayer><MyPlayerAvatar><Avatar alt="Image" src={player.photo} sx={{
                                            width: { xs: 50, sm: 50, md: 30, lg: 60, xl: 60 },
                                            height: { xs: 50, sm: 50, md: 30, lg: 60, xl: 60 }
                                        }} /><PlayerTeamLogoValue><h2>{player.value}M€</h2></PlayerTeamLogoValue><PlayerTeamLogoShort><img src={player.teamLogo} alt="logo" /></PlayerTeamLogoShort><PlayerTeamRatingShort style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRatingShort></MyPlayerAvatar><MyPlayerName><h2>{player.name}</h2></MyPlayerName></MyPlayer>
                                    )
                                })}
                           </MyPlayerRow>
                           </div>
                      )
                    ))}
                    </MyPlayerContainer>
                ):(
                    <MyBalanceRow><h2>{t("fantasy.title12")}</h2></MyBalanceRow>
                )}
                </motion.div>
           </Container>
        )}
        {openSellMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5%'}} variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <SellPlayerRow><h2>{t("fantasy.title13")} <br/>{droppedPlayers.length > 0 && `${t("fantasy.title14")} :`}</h2></SellPlayerRow>
                {droppedPlayers.length > 0 ? (
                    <MyPlayerContainer style={{height: '110%'}}>
                    {groupedPlayers.map((group) => (
                      group.players.length > 0 && (
                          <div style={{width: '100%', height: '50%', display: 'flex', flexDirection: 'column'}}>
                          <MyPlayerPosition><h2>{group.position === "Attacker" && `${t("fantasy.positionOrder1")}`}
                          {group.position === "Midfielder" && `${t("fantasy.positionOrder2")}`}{group.position === "Defender" && `${t("fantasy.positionOrder3")}`}
                          {group.position === "Goalkeeper" && `${t("fantasy.positionOrder4")}`}</h2></MyPlayerPosition>
                            <MyPlayerRow>
                                {group.players.map((player) => (
                                    <MyPlayer onClick={() => openConfirmSell(player)}><MyPlayerAvatar><Avatar alt="Image" src={player.photo} sx={{
                                      width: { xs: 50, sm: 50, md: 30, lg: 60, xl: 60 },
                                      height: { xs: 50, sm: 50, md: 30, lg: 60, xl: 60 }
                                  }} /><PlayerTeamLogo><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo><PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating></MyPlayerAvatar><MyPlayerName><h2>{player.name}</h2></MyPlayerName></MyPlayer>
                                ))}
                           </MyPlayerRow>
                           </div>
                      )
                    ))}
                    </MyPlayerContainer>
                ):(
                    <MyBalanceRow><h2>{t("fantasy.title12")}</h2></MyBalanceRow>
                )}
                </motion.div>
            </Container>
        )}
        {openConfirmSellMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5%'}} variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <BigTeamName style={{color: 'white'}}><h2>{t("fantasy.title3")}: {balance}M€</h2></BigTeamName>
                <BigTeamName>
                <h2>{t("fantasy.title6")} {activePlayerSell.value * 75/100}M {t("fantasy.title7")}</h2>
                </BigTeamName>
                <BuyPlayerHolder>
                    <BuyPlayerAvatar><Avatar alt="Image" src={activePlayerSell.photo} sx={{
                                        width: { xs: 80, sm: 80, md: 70, lg: 80, xl: 80 },
                                        height: { xs: 80, sm: 80, md: 70, lg: 80, xl: 80 }
                                    }} /></BuyPlayerAvatar>
                                    <BuyPlayerName><h2>{activePlayerSell.name}</h2></BuyPlayerName>
                                    <BuyPlayerName><span>{activePlayerSell.value}M€</span></BuyPlayerName>
                </BuyPlayerHolder>
                <div style={{display: 'flex', width: '100%', height: '70px', alignItems: 'center', justifyContent: 'center'}}>
                        {<>
                            <StyledButton onClick={cancelPlayerSell} style={{fontSize: '18px', margin: '0 5px'}}>{t("fantasy.cancel")}</StyledButton>
                            <StyledButton onClick={confirmPlayerSell} style={{fontSize: '18px', margin: '0 5px'}}>{t("fantasy.confirm")}</StyledButton>
                        </>}
                
                </div>
                </motion.div>
            </Container>
        )}
        {openRemovePlayerMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5%'}} variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <BigTeamName style={{color: 'white'}}><h2>{t("fantasy.title3")}: {balance}M€</h2></BigTeamName>
                <BigTeamName>
                <h2>{playerHasTeam ? "YOU ALREADY HAVE ONE TEAM SAVED. IF YOU REMOVE THE PLAYER, YOU'LL NEED TO SAVE THE TEAM AGAIN" : "DO YOU WANT TO REMOVE THIS PLAYER?" }</h2>
                </BigTeamName>
                <BuyPlayerHolder>
                    <BuyPlayerAvatar><Avatar alt="Image" src={playerToRemove.image} sx={{
                                        width: { xs: 80, sm: 80, md: 70, lg: 80, xl: 80 },
                                        height: { xs: 80, sm: 80, md: 70, lg: 80, xl: 80 }
                                    }} /></BuyPlayerAvatar>
                                    <BuyPlayerName><h2>{playerToRemove.name}</h2></BuyPlayerName>
                                    <BuyPlayerName><span>{playerToRemove.value}M€</span></BuyPlayerName>
                </BuyPlayerHolder>
                <div style={{display: 'flex', width: '100%', height: '70px', alignItems: 'center', justifyContent: 'center'}}>
                        {<>
                            <StyledButton onClick={cancelRemovePlayer} style={{fontSize: '18px', margin: '0 5px'}}>{t("fantasy.cancel")}</StyledButton>
                            <StyledButton onClick={confirmRemovePlayer} style={{fontSize: '18px', margin: '0 5px'}}>{t("fantasy.confirm")}</StyledButton>
                        </>}
                
                </div>
                </motion.div>
            </Container>
        )}
        {openStatsMenu && (
            
             <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
             variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                
                 <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5%'}} variants={item}
                     initial="initial"
                     animate="animate"
                     exit="exit"
                     transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                     <DndContext sensors={sensors} onDragEnd={handleDragEnd} onDragStart={(event) => {
                setActivePlayerDrag(event.active.data.current);  // Set the active player when dragging starts
              }}>
                <MyPlayersRow ref={carroussel}>
                    <MyPlayersInnerRow  drag="x" dragConstraints={{ right: 0, left: -width }} whileTap={{ cursor: 'grabbing' }}>
                        {droppedPlayers.map((player) => {
                            return(
                                <MyTeamPlayerHolder>
                                    <MyTeamAvatar><PlayerTeamLogo><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo><Player key={player.id} player={player} /></MyTeamAvatar>
                                    <MyTeamName><h2>{player.name}</h2></MyTeamName>
                                </MyTeamPlayerHolder>
                            )
                        })}
                    </MyPlayersInnerRow>
                </MyPlayersRow>
                <MyTeamRow>
                    <AbsoluteDivLeft>
                        {gameStarted ? (
                            <h3>WAITING FOR RESULTS</h3>
                        ) : (
                            <StyledButton disabled={buttonDisabled} onClick={saveDroppedTeam} style={{fontSize: '10px'}}>SAVE TEAM</StyledButton>
                        )}
                    </AbsoluteDivLeft>
                    <AbsoluteDivRight><h3>TEAM AVERAGE: <br/><span style={{color: getBackgroundColor(teamAverage)}}>{gameStarted ? "Pending" : teamAverage}</span></h3></AbsoluteDivRight>
                    <FieldWrapper className='layout1'>
                    <BetArea id="area1" className='droppable-area'>
                    {droppedTeamPlayers.area1.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                            
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                        <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}
                        </div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area2">
                    {droppedTeamPlayers.area2.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                            
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                        <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}
                        </div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area3">
                    {droppedTeamPlayers.area3.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                            
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                    <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area4">
                    {droppedTeamPlayers.area4.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                            <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area5">
                    {droppedTeamPlayers.area5.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                    <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area6">
                    {droppedTeamPlayers.area6.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                    <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area7">
                    {droppedTeamPlayers.area7.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                    <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area8">
                    {droppedTeamPlayers.area8.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                    <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area9">
                    {droppedTeamPlayers.area9.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                    <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area10">
                    {droppedTeamPlayers.area10.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                    <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <BetArea id="area11">
                    {droppedTeamPlayers.area11.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                    <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>{gameStarted ? 
                        <PlayerTeamRating style={{background: player.lastMatchRating ? getBackgroundColor(player.lastMatchRating) : 'aqua'}}>{player.lastMatchRating}</PlayerTeamRating> : 
                        <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>{player.rating}</PlayerTeamRating>}</div>
                        )
                    })}
                    </BetArea>
                    <DragOverlay>
                {activePlayerDrag ? (
                  <Avatar
                    alt="Image"
                    src={activePlayerDrag.image}
                    sx={{
                      width: { xs: 50, sm: 50, md: 40, lg: 50, xl: 50 },
                      height: { xs: 50, sm: 50, md: 40, lg: 50, xl: 50 },
                    }}
                  />
                ) : null}
              </DragOverlay>
                    </FieldWrapper>
                </MyTeamRow>
                </DndContext>
                </motion.div>
                
                </Container>
                
        )}
         {openTrainingMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10%'}} variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <SellPlayerRow><h2>{t("fantasy.title15")}</h2></SellPlayerRow>
                <SellPlayerRow>{lastTraining === null ? (
                    <h2>{t("fantasy.title16")}</h2>
                ) : (
                    <h2>{t("fantasy.title17")} {trainingsNumber} {t("fantasy.title18")}</h2>
                )}</SellPlayerRow>
                <SellPlayerRow>
                    {lastTraining < Date.now() && <StyledButton style={{fontSize: '14px'}} onClick={startTraining}>{t("fantasy.title19")}</StyledButton>}
                </SellPlayerRow>
                <SellPlayerRow style={{width: '60%'}}><h2 id="countdown" style={{fontSize: '24px'}}></h2></SellPlayerRow>
                </motion.div>
                </Container>
        )}
        {openSearchMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '2.5%'}} variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <Search playerToFind={playerToFind} setPlayerToFind={setPlayerToFind}/>
                
                
                <SearchPlayerRow>
                        {searchedPlayers?.map((player) => {
                            const playerIsDropped = droppedPlayers.find(droppedPlayer => droppedPlayer.id === player.id)
                            const playerIsInjured = player.injuryType === 'Missing Fixture';
                            const playerIsQuestionable = player.injuryType === 'Questionable';
                            const borderStyle = playerIsDropped 
                              ? '3px solid green' 
                              : playerIsInjured 
                              ? '3px solid red' 
                              : playerIsQuestionable 
                              ? '3px solid orange' 
                              : '2px solid white'; 
                            return(
                                
                                <TeamHolder whileHover={{scale: 1.02}} style={{border: `${borderStyle}`}} key={player.name}>
                                    <PlayerLogo onClick={() => selectPlayer(player,playerIsDropped)}><Avatar alt="Image" src={player.photo} sx={{
                                        width: { xs: 50, sm: 50, md: 60, lg: 60, xl: 60 },
                                        height: { xs: 50, sm: 50, md: 60, lg: 60, xl: 60 }
                                    }} /><PlayerTeamLogo><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo></PlayerLogo>
                                    
                                      <PlayerName onClick={() => selectPlayer(player,playerIsDropped)}><h2>{player.name}</h2></PlayerName>  
                                      <PlayerPosition><h2>{player.position.charAt(0)}</h2></PlayerPosition>
                                      <PlayerLogo onClick={() => selectPlayer(player,playerIsDropped)}><PlayerRating><span>{player.value}M€</span></PlayerRating></PlayerLogo>
                                      <PlayerLogo onClick={() => selectPlayer(player,playerIsDropped)}><PlayerRating style={{background: getBackgroundColor(player.rating)}}>{!isNaN(player.rating) && player.rating}</PlayerRating></PlayerLogo>
                                      <PlayerLogo onClick={() => openPlayerStatsMenu(player)}><PlayerSettingsIcon /></PlayerLogo>
                                    
                                </TeamHolder>
                                
                            )
                        })}
                    </SearchPlayerRow>
                
                </motion.div>
                </Container>
        )}
        </AnimatePresence>
      <BottomRow>
        <IconHolder>
            {(openDropMenu || openSellMenu || openStatsMenu || openTrainingMenu) ? (
                <h2 style={{color: openTrainingMenu ? "rgba(244,215,21,1)" : ""}} onClick={openTraining}>{t("fantasy.training")}</h2>
            ):(
                <>
                    {openTeamMenu || openPlayerMenu  ? (
                        <h2 onClick={openLeague}>{t("fantasy.back")}</h2>
                    ):(
                        <>
                            {(openConfirmMenu || openStatsMenu || openTrainingMenu || openSellMenu || disabledTitle) ? (
                                <h2></h2>
                            ):(
                                <h2 onClick={openLeague} style={{color: openLeagueMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title20")}</h2>
                            )}
                        </>
                    )}
                </> 
            )}
        </IconHolder>
        <IconHolder>
            {openTeamMenu ? (
                 <h2 style={{color: openTeamMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title21")}</h2>
            ):(
                <>
                {loading ? (
                   <CircularProgress sx={{ width: 80, height: 80 }} /> 
                ):(
                    <>
                    {activeTeam && (
                        <BallColumn onClick={closePlayers}>
                        <CountryBall initial={{y:10}}><img src={activeTeam?.teamLogo} alt="england" style={{width: '60%', display: 'block', objectFit: 'cover'}}/></CountryBall>
                            <CountryBallText initial={{y:-15}} >{activeTeam?.teamName}</CountryBallText>
                        </BallColumn>
                    )}
                    {(openDropMenu || openSellMenu || openStatsMenu || openTrainingMenu) ? (
                        <h2 onClick={openStats} style={{color: openStatsMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.stats")}</h2>
                    ) : (
                        <>
                            {(!activeTeam && !disabledTitle) && <h2 onClick={openSearch} style={{color: openSearchMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title26")}</h2>}
                        </>
                    )}
                    </> 
                )}
                </>
            )}
        </IconHolder>
        <IconHolder>
            {openPlayerMenu ? (
                <h2 style={{color: openPlayerMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title22")}</h2>
            ):(
                <>
                 {loading ? (
                    <CircularProgress sx={{ width: 80, height: 80 }} />
                 ):(
                    <>
                    {activePlayer && (
                        <BallColumn >
                        <CountryBall initial={{y:10}}><img src={activePlayer?.photo} alt="" style={{width: '60%', borderRadius: '50%'}}/></CountryBall>
                            <CountryBallText initial={{y:-15}} >{activePlayer?.name}</CountryBallText>
                        </BallColumn>
                    )}
                    {(openDropMenu || openSellMenu || openStatsMenu || openTrainingMenu) &&  (
                        <h2 onClick={openSell} style={{color: openSellMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title23")}</h2> 
                    )}
                    </>
                 )}
                </>
            )}
        </IconHolder>
        {activePlayer ? (
            <IconHolder ><h2 style={{color: activePlayer ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title24")}</h2></IconHolder>
        ) : (
            <>
            {openDropMenu ? (
                <IconHolder onClick={toggleMenu}><h2 style={{color: openDropMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.back")}</h2></IconHolder>
            ):(
                <IconHolder onClick={toggleMenu}><h2 >{t("fantasy.title25")}</h2></IconHolder>
            )}
            </>
        )}
      </BottomRow>
      {selectedTeamMenu && (
        <TeamStats selectedTeamMenu={selectedTeamMenu} setSelectedTeamMenu={setSelectedTeamMenu} />
      )}
      {selectedPlayerMenu && (
        <PlayerStatsMenu selectedPlayerMenu={selectedPlayerMenu} setSelectedPlayerMenu={setSelectedPlayerMenu} />
      )}
    </Section>
  )
}

export default NewFantasy

const AbsoluteDivLeft = styled.div`
    width: 130px;
    height: 50px;
    position: absolute;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.text};
    background: ${props => props.theme.body};
    backdrop-filter: blur(10px);
    top: 10px;
    left: 20px;
    z-index: 50;
    text-align: center;
    ${props => props.theme.displayFlexCenter};
    h3{
        color: white;
        font-size: 14px;
        font-weight: bold;
    }
`;

const AbsoluteDivRight = styled.div`
    width: 130px;
    height: 50px;
    position: absolute;
    top: 10px;
    right: 10px;
    border-radius: 10px;
    border: 1px solid ${props => props.theme.text};
    background: ${props => props.theme.body};
    backdrop-filter: blur(10px);
    z-index: 50;
    ${props => props.theme.displayFlexCenter};
    h3{
        color: ${props => props.theme.text};
        font-size: 14px;
        font-weight: bold;
    }
`;

const PlayerTeamRating = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    z-index: 1000;
    position: absolute; 
    bottom: 0;
    right: 0;
    font-size: 14px;
    font-weight: bold;
    @media(max-width: 968px){
        font-size: 14px; 
        width: 30px;
        height: 30px;
    }
    @media(max-width: 490px){
        font-size: 12px; 
        width: 25px;
        height: 25px;
        bottom: -5px;
        right: -5px;
    }
`;

const PlayerTeamRatingShort = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    z-index: 1000;
    position: absolute; 
    bottom: 0;
    right: 0;
    font-size: 14px;
    font-weight: bold;
    @media(max-width: 968px){
        font-size: 14px; 
        width: 30px;
        height: 30px;
    }
    @media(max-width: 490px){
        font-size: 12px; 
        width: 25px;
        height: 25px;
        bottom: 5px;
        right: 5px;
    }
`;

const PlayerDroppingArea = styled.div`
    width: 50px;
    height: 50px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2cf5fcac;
    @media(max-width: 968px){
        width: 40px;
        height: 40px; 
    }
`;

const PlayerRating = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    color: ${props => props.theme.body};
    ${props => props.theme.displayFlexCenter};
    font-weight: bold;
    font-size: 18px;
    span{
        color: ${props => props.theme.pacColor};
        font-weight: bold;
        font-size: 18px;
    }
    @media(max-width: 498px){
        span{
        font-size: 16px;
    } 
    }
`;

const PlayerName = styled.div`
    min-width: 40%;
    height: 100%;
    padding: 5px;
    text-align: center;
    h2{
        color: ${props => props.theme.text};
        font-size: 16px;
        font-weight: bold;
    }
    @media(max-width: 968px){
        h2{
            font-size: 22px;
        } 
    }
    @media(max-width: 498px){
        h2{
            font-size: 20px;
        } 
    }
`;

const PlayerLogo = styled.div`
    min-width: 12.5%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
    position: relative;
`;

const PlayerPosition = styled.div`
    min-width: 10%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
    position: relative;
    h2{
        color: ${props => props.theme.text};
        font-size: 24px;
        font-weight: bold;
    }
`;

const PlayerTeamLogo = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10;
    @media(max-width: 490px){
        width: 25px;
        height: 25px;
        top: -5px;
        left: -5px;
    }
`;
const PlayerTeamLogoShort = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    top: 0px;
    left: 0px;
    z-index: 10;
    @media(max-width: 490px){
        width: 25px;
        height: 25px;
        top: 5px;
        left: 5px;
    }
`;
const PlayerTeamLogoValue = styled.div`
    h2{
        color: gold;
        font-size: 14px;
    }
    position: absolute;
    top: 0px;
    right: 5px;
    z-index: 10;
    @media(max-width: 490px){
        width: 25px;
        height: 25px;
        top: -5px;
        right: 10px;
    }
`;


const TeamLogo = styled.div`
    width: 15%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
    img{
        width: 50%;
        display: block;
        object-fit: cover;
    }
`;
const TeamSettings = styled.div`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
    position: absolute;
    top: 0;
    right: 0;
`;

const MyPlayerRow = styled.div`
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
`;

const MyPlayer = styled.div`
    width: 100px;
    height: 90px;
    ${props => props.theme.displayFlexColumn}
`;

const MyPlayerAvatar = styled.div`
    width: 100%;
    height: 70%;
    ${props => props.theme.displayFlexCenter}
    position: relative;
`;
const MyPlayerPosition = styled.div`
    width: 100%;
    height: 40px;
    ${props => props.theme.displayFlex}
    padding: 20px;
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 16px;
        font-weight: bold; 
    }
`;



const FieldWrapper = styled.div`
    width: 80%;
    height: 420px;
    position: relative;
    background-image: url(${field});
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
`;

const MyPlayersInnerRow = styled(motion.div)`
    width: auto;
    height: 100%;
    ${props => props.theme.displayFlex}
    
    
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 20px;
        font-weight: bold; 
    }
`;

const MyPlayersRow = styled(motion.div)`
    width: 100%;
    height: 15%;
    overflow: hidden;
    display: flex;
    align-items: center;
    text-align: center;
    margin-top: 30px;
    padding: 5px;
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 20px;
        font-weight: bold; 
    }
`;

export const MyTeamPlayerHolder = styled.div`
    width: 60px;
    height: 100%;
    margin: 0 10px;
    ${props => props.theme.displayFlexColumn}
`;

export const MyTeamAvatar = styled.div`
    width: 100%;
    height: 70%;
    ${props => props.theme.displayFlexCenter}
    position: relative;
`;

export const MyTeamName = styled.div`
    width: 100%;
    height: 30%;
    ${props => props.theme.displayFlexCenter}
    h2{
        color: ${props => props.theme.text};
        font-size: 12px;
        font-weight: bold;  
        transform: translateY(-3px);
    }
`;

const MyTeamRow = styled(motion.div)`
    width: 100%;
    height: 85%;
    position: relative;
    ${props => props.theme.displayFlexCenter}
    padding: 10px;
    text-align: center;
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 20px;
        font-weight: bold; 
    }
`;

const MyBalanceRow = styled.div`
    width: 100%;
    height: 5%;
    ${props => props.theme.displayFlexCenter}
    padding: 20px;
    text-align: center;
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 20px;
        font-weight: bold; 
    }
`;
const SellPlayerRow = styled.div`
    width: 70%;
    height: 15%;
    ${props => props.theme.displayFlexCenter}
    padding: 10px;
    text-align: center;
    h2{
        color: ${props => props.theme.MainAccent};
        font-size: 16px;
        font-weight: bold; 
    }
`;

const MyPlayerName = styled.div`
    width: 100%;
    height: 30%;
    ${props => props.theme.displayFlexCenter}
    text-align: center;
    h2{
        color: ${props => props.theme.text};
        font-size: 12px;
        font-weight: bold; 
        transform: translateY(-5px);
    }

`;

const BuyPlayerHolder = styled.div`
    width: 100%;
    height: 30%;
    ${props => props.theme.displayFlexColumn}
    margin: 20px 0;
`;

const BuyPlayerAvatar = styled.div`
    width: 100%;
    height: 60%;
    ${props => props.theme.displayFlexCenter}
`;
const BuyPlayerName = styled.div`
    width: 100%;
    height: 20%;
    ${props => props.theme.displayFlexCenter}
    h2{
        color: ${props => props.theme.text};
        font-size: 24px;
        font-weight: bold; 
    }
    span{
        color: ${props => props.theme.pacColor};
        font-size: 24px;
        font-weight: bold;  
    }
`;

const BigTeamName = styled.div`
    width: 70%;
    height: 15%;
    text-align: center;
    ${props => props.theme.displayFlexCenter}
    padding: 10px;
    text-align: center;
    position: relative;
    h2{
        color: ${props => props.theme.text};
        font-size: 20px;
        font-weight: bold;
    }
`;

const TeamName = styled.div`
    width: 85%;
    height: 100%;
    ${props => props.theme.displayFlex}
    padding: 10px;
    text-align: center;
    position: relative;
    h2{
        color: ${props => props.theme.text};
        font-size: 18px;
        font-weight: bold;
    }
`;











const MyPlayerContainer = styled.div`
    width: 60%;
    height: 87.5%;
    padding: 10px;
    ${props => props.theme.displayFlexColumn};
    overflow-y: auto;
    @media(max-width: 968px){
        grid-template-columns: repeat(2, 1fr);
        height: 85%;
    }
    @media(max-width: 498px){
        grid-template-columns: repeat(1, 1fr);
        width: 100%;
    }
`;

const SearchPlayerRow = styled.div`
    width: 100%;
    height: 90%;
    padding: 10px;
    display: grid;
    place-items: center;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    overflow-y: auto;
    @media(max-width: 968px){
        grid-template-columns: repeat(2, 1fr);
        height: 85%;
    }
    @media(max-width: 498px){
        grid-template-columns: repeat(1, 1fr);
        
    }
`;

const PlayerRow = styled(motion.div)`
    width: 100%;
    height: 90%;
    padding: 10px;
    display: grid;
    place-items: center;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    overflow-y: auto;
    @media(max-width: 968px){
        grid-template-columns: repeat(2, 1fr);
        height: 85%;
    }
    @media(max-width: 498px){
        grid-template-columns: repeat(1, 1fr);
        
    }
`;



const FilterRow = styled.div`
    width: 70%;
    height: 10%;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter}
    justify-content: space-around;
    @media(max-width: 498px){
        height: 10vh;
        width: 100%;  
        
    }
`;






const FoldingMenu = styled(motion.div)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    ${props => props.theme.displayFlexColumnCenter}
`;

const FantasyFoldingMenu = styled(motion.div)`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    ${props => props.theme.displayFlexColumn}   
`;








