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

import { BallColumn,CountryBall,CountryBallText, MiniArrowDownTop, MiniArrowupTop,CountryBallTextTop, PlayerSettingsIcon, Search, SearchIconButton, ArrowLeftRelative, SmallArrowDown, TeamsLogo } from './index';
import { FantasyState } from '../context/FantasyContext';
import { CircularProgress } from '@mui/material';
import { AverageDisplay, startCountdown, useAuth, useGetTeams } from './functions';
import { useMediaQuery } from 'react-responsive';

import { message } from 'antd';
import { LowRower, Rower, RowerRow, SmallAvatar, SmallAvatarTwo, SmallPlayerName, SmallRower, StyledButton } from '../components';
import TeamStats from '../components/menus/TeamStats';
import PlayerStatsMenu from '../components/menus/PlayerStatsMenu';
import {useTranslation} from "react-i18next";
import { getBackgroundColor } from './functions';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { DndContext,useDraggable,useDroppable,DragOverlay } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import {Section,BottomRow,IconHolder,Container,LeagueRow,item,LeagueHolder,AbsoluteIconButton,ArrowUp,ArrowDown,
    Title,AbsoluteIconButtonLeft,TeamCircularRow,TeamRow,TeamHolder,
    TeamBetsHolder
} from './indexThree'


const NewFantasy = () => {


    
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
    
    const [openLeagueMenu, setOpenLeagueMenu] = useState(true)
    const [startAgain, setStartAgain] = useState(true)
    const [openTeamMenu, setOpenTeamMenu] = useState(false)
    const [openPlayerMenu, setOpenPlayerMenu] = useState(false)
    const [selectedTeamMenu, setSelectedTeamMenu] = useState(false)
    const [openConfirmMenu, setOpenConfirmMenu] = useState(false)
    const [openConfirmSellMenu, setOpenConfirmSellMenu] = useState(false)
    const [openSellMenu, setOpenSellMenu] = useState(false)
    const [openSearchMenu, setOpenSearchMenu] = useState(false)
    const [openStatsMenu, setOpenStatsMenu] = useState(false)
    const [openTrainingMenu, setOpenTrainingMenu] = useState(false)
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
    
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const { activeTeamId, setActiveTeamId } = FantasyState(); 
    const {teams,getTeams,loadingTeams,players,loadingPlayers,handleTeamChange,setPlayers,getPlayers,setTeams} = useGetTeams();
    const [droppedPlayers, setDroppedPlayers] = useState([])
    const [searchedPlayers, setSearchedPlayers] = useState([])
    const [playerToFind, setPlayerToFind] = useState("")
    const [playerHasTeam, setPlayerHasTeam] = useState(false)
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
        const now = new Date('2024-11-24 20:30:00'); // Current date and time
        const isBetween = now >= start && now <= end;
        setGameStarted(isBetween)
    }, [])

    

      

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
        if(user){
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
      }

      /* console.log(lastTraining) */

      useEffect(() => {
        fetchUserData(); 
      }, [user])

      useEffect(() => {
        getTeams();
      }, [activeLeague])



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
    setTimeout(() => {
        setOpenTeamMenu(true)
    }, 500)
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
                let rate = 0
                console.log(data)
                console.log(data[0].players)
                const userPlayersData = data[0].players || {}; 
                userPlayersData.players = userPlayersData.players || []; 
                
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
                userPlayersData.players.push(updatedData);
                console.log(userPlayersData)
                if(data[0].players === null){
                    const { error: updateError } = await supabase
                    .from('fantasyFootball')
                    .update({ players: updatedData, balanceRemaining: parsedBalance, teamRating: parsedRating }) 
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', updatedData);
                    setOpenConfirmMenu(false)
                    setActivePlayer(null)
                    setActiveTeam(null)
                    setBalance((prev) => prev - activePlayer.value)
                    
                    setTimeout(() => {
                        message.success("Player added to your team!!!");
                        setOpenLeagueMenu(true)
                    }, 300)
                }
                } else {
                    console.log(data[0].players.players);
                for(const player of data[0].players.players){
                    rate += player.rating
                }
                const final = (rate + activePlayer.rating) / (data[0].players.players.length + 1)
                
                const parsed = parseFloat(parseFloat(final).toFixed(2))
                console.log(parsed)
                
                
                // Initialize referrals array if it doesn't exist
                userPlayersData.players = userPlayersData.players || []; 
                
                // Prepare the updated data structure to add
                
    
                // Add the updated data to the referrals array
                userPlayersData.players.push(updatedData);
                
                // Update the user's jsonb column
                const { error: updateError } = await supabase
                    .from('fantasyFootball')
                    .update({ players: userPlayersData, balanceRemaining: parsedBalance, teamRating: parsed }) 
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    console.log('User data updated successfully:', userPlayersData);
                    setOpenConfirmMenu(false)
                    setActivePlayer(null)
                    setActiveTeam(null)
                    setBalance((prev) => prev - activePlayer.value)
                    
                    setTimeout(() => {
                        message.success("Player added to your team!!!");
                        setOpenLeagueMenu(true)
                    }, 300)
                }
                }
                
            }
        }
    }
    

    

    

    const cancelPlayer = () => {
        setActivePlayer(null)
        setOpenConfirmMenu(false)
        setTimeout(() => {
            setOpenTeamMenu(true)
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
    
    
  return (
    <Section>
        {isDateExpanded ? <AbsoluteIconButton onClick={closeDate}><ArrowDown /></AbsoluteIconButton> : <AbsoluteIconButton onClick={closeDate}><ArrowUp /></AbsoluteIconButton>}
        
        <Title initial="collapsed"
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <h2>{t("fantasy.title1")} {startDate} <br/>{t("fantasy.title2")} {endDate}</h2>
        </Title>
        <AbsoluteIconButtonLeft onClick={() => {setActiveTeam(null);setActivePlayer(null);navigate('/fantasy')}}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
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
                                
                                <TeamHolder whileHover={{scale: 1.05}} key={index} >
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
        
        
        
        {openSearchMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '40px'}} variants={item}
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
        </IconHolder>
        <IconHolder>
            {openTeamMenu ? (
                <h2 style={{color: openTeamMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title21")}</h2>
            ) : (
                <>
                    {activeTeam ? (
                       <BallColumn onClick={closePlayers}>
                       <CountryBall initial={{y:10}}><img src={activeTeam?.teamLogo} alt="england" style={{width: '60%', display: 'block', objectFit: 'cover'}}/></CountryBall>
                           <CountryBallText initial={{y:-15}} >{activeTeam?.teamName}</CountryBallText>
                       </BallColumn> 
                    ) : (
                        <h2 onClick={openSearch} style={{color: openSearchMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title26")}</h2> 
                    )}
                </>
            )}
        </IconHolder>
        <IconHolder>
                {activePlayer && (
                        <BallColumn >
                        <CountryBall initial={{y:10}}><img src={activePlayer?.photo} alt="" style={{width: '60%', borderRadius: '50%'}}/></CountryBall>
                            <CountryBallText initial={{y:-15}} >{activePlayer?.name}</CountryBallText>
                        </BallColumn>
                    )}
        </IconHolder>
        <IconHolder >
        {activePlayer && (
            <h2 style={{color: activePlayer ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title24")}</h2>
        )}
        </IconHolder>
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




const PlayerRating = styled.div`
    width: 30px;
    height: 30px;
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
        font-size: 14px;
        span{
            font-size: 14px;
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
            font-size: 14px;
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
    @media(max-width: 498px){
        h2{
            font-size: 16px; 
        }
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
    margin-top: 40px;
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








