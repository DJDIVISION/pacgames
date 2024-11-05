import React, { useEffect,useState } from 'react'
import styled from 'styled-components'
import { supabase } from '../supabase/client'
import { Avatar, Button, IconButton } from '@mui/material';
import {motion,AnimatePresence} from 'framer-motion'
import england from '../assets/logos/england.png'
import spain from '../assets/logos/spain.png'
import italy from '../assets/logos/italy.png' 
import germany from '../assets/logos/germany.png' 
import france from '../assets/logos/france.png' 
import { BallColumn,CountryBall,CountryBallText, MiniArrowDownTop, MiniArrowupTop,CountryBallTextTop, PlayerSettingsIcon } from './index';
import { FantasyState } from '../context/FantasyContext';
import { CircularProgress } from '@mui/material';
import { startCountdown, useAuth, useGetTeams } from './functions';
import { useMediaQuery } from 'react-responsive';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { message } from 'antd';
import { StyledButton } from '../components';
import TeamStats from './TeamStats';
import PlayerStatsMenu from '../components/menus/PlayerStatsMenu';

const NewFantasy = () => {

    const leagues = [
        {
            league: "Premier League",
            logo: england,
            name: "England",
            id: 1
        },
        {
            league: "La Liga",
            logo: spain,
            name: "Spain",
            id: 2
        },
        {
            league: "Serie A",
            logo: italy,
            name: "Italy",
            id: 3
        },
        {
            league: "Ligue 1",
            logo: france,
            name: "France",
            id: 4
        },
        {
            league: "Bundesliga",
            logo: germany,
            name: "Germany",
            id: 5
        }
    ]
    const { user } = useAuth(); 
    const [startDate, setStartDate] = useState('2024-11-01')
    const [endDate, setEndDate] = useState('2024-11-05')
    const [allLeagues, setAllLeagues] = useState(leagues)
    const [availableLeagues, setAvailableLeagues] = useState([])
    const [activeBall, setActiveBall] = useState(1)
    const {activeLeague, setActiveLeague} = FantasyState();
    const {activeTeam, setActiveTeam} = FantasyState();
    const {activePlayer, setActivePlayer} = FantasyState();
    const [activePlayerSell, setActivePlayerSell] = useState(null)
    const [openLeagueMenu, setOpenLeagueMenu] = useState(true)
    const [openTeamMenu, setOpenTeamMenu] = useState(false)
    const [openPlayerMenu, setOpenPlayerMenu] = useState(false)
    const [selectedTeamMenu, setSelectedTeamMenu] = useState(false)
    const [openDropMenu, setOpenDropMenu] = useState(false)
    const [openConfirmMenu, setOpenConfirmMenu] = useState(false)
    const [openConfirmSellMenu, setOpenConfirmSellMenu] = useState(false)
    const [openSellMenu, setOpenSellMenu] = useState(false)
    const [openStatsMenu, setOpenStatsMenu] = useState(false)
    const [openTrainingMenu, setOpenTrainingMenu] = useState(false)
    const [selectedPlayerMenu, setSelectedPlayerMenu] = useState(false)
    const [areaId, setAreaId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState(null)
    const [lastTraining, setLastTraining] = useState(null)
    const [teamRating, setTeamRating] = useState(null)
    const [trainingsNumber, setTrainingsNumber] = useState(null)
    const [isDateExpanded, setIsDateExpanded] = useState(true)
    const {playerToUpdate, setPlayerToUpdate} = FantasyState();
    const [currentPositionIndex, setCurrentPositionIndex] = useState(0);
    const { activeTeamId, setActiveTeamId } = FantasyState(); 
    const {teams,getTeams,loadingTeams,players,loadingPlayers,handleTeamChange,setPlayers,getPlayers,setTeams} = useGetTeams();
    const [droppedPlayers, setDroppedPlayers] = useState([]);

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


    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100%", opacity: 1, transition: { duration: 0.7 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.7 } }
    }

    const openLeague = () => {
        if(openLeagueMenu){
            return
        } else {
            setActiveLeague(null)
        setOpenDropMenu(false)
        setTeams([])
        setActivePlayer(null)
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
            console.log("lastTraining", lastTraining)
        },500)
    }
    const closeDate = () => {
        setIsDateExpanded((prev) => !prev);
    }
    const isMobile = useMediaQuery({ query: '(max-width: 498px)' });
    const variants = {
        expanded: {
            height: isMobile ? '10vh' : '15vh'
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
            height: isMobile ? '80vh' : '70vh'
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
    setOpenConfirmSellMenu(!openConfirmSellMenu)
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
        setOpenTrainingMenu(false)
        setOpenStatsMenu(false)
        setOpenTeamMenu(false)
        setActiveTeam(null)
        setActivePlayer(null)
        setTimeout(() => {
            setOpenDropMenu((prev) => !prev);
        }, 500)
    } else {
        setOpenDropMenu((prev) => !prev);
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
                    id: activePlayer.id 
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
                    id: activePlayer.id 
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
                } */
            }
        }
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
    console.log(droppedPlayers.length)
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

    

const getBackgroundColor = (number) => {
    if (number >= 0 && number < 6) return 'red'; // Color for 5 to <6
    if (number >= 6 && number < 6.5) return 'orange'; // Color for 5 to <6
    if (number >= 6.5 && number < 7) return '#eafa07';  // Color for 6 to <7
    if (number >= 7 && number < 8) return '#12f812'; // Color for 7 to <8
    if (number >= 8 && number < 9) return '#00ccff'; // Color for 8 to <9
    if (number >= 9 && number <= 10) return '#3F00FF'; // Color for 9 to 10
    return 'white'; // Default background color if number is out of range
};


  return (
    <Section>
        <Title initial="expanded"
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
      <h2>NEXT FANTASY FOOTBALL GAME INCLUDES LEAGUES PLAYING FROM {startDate} TO {endDate}</h2>
      <AbsoluteIconButton onClick={closeDate}><ArrowDown /></AbsoluteIconButton>
      </Title>
      <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
      variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
        {!isDateExpanded && <AbsoluteIconButton onClick={closeDate}><ArrowUp /></AbsoluteIconButton>}
      <AnimatePresence>
        {openLeagueMenu && (
            <FoldingMenu 
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                 <LeagueRow >
                {availableLeagues?.map((league,index) => {
                return(
                        <LeagueHolder whileHover={{scale: 1.05}} key={index} onClick={() => setAllTeams(league)}>
                        <BallColumn key={league.id}>
              <CountryBall><img src={league.logo} alt="england" /></CountryBall>
              <CountryBallTextTop>{league.name}</CountryBallTextTop><CountryBallTextTop>{league.league}</CountryBallTextTop>
              </BallColumn>
                        </LeagueHolder>
                )
            })}
            </LeagueRow>
            </FoldingMenu>
        )}
        {openTeamMenu && (
            <FoldingMenu 
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                 
                {loadingTeams ? (
                    <TeamCircularRow>
                    <CircularProgress sx={{ width: 80, height: 80 }} />
                    </TeamCircularRow>
                ) : (
                    <TeamRow >
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
            </FoldingMenu>
        )}
        {openConfirmMenu && (
            <FoldingMenu 
            style={{zIndex: 5000, background: 'black'}}
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <BigTeamName style={{color: 'white'}}><h2>YOUR BALANCE: {balance}M€</h2></BigTeamName>
                <BigTeamName>
                    {balance - activePlayer.value > 0 ? (
                        <h2>DO YOU WANT TO BUY THIS PLAYER?</h2>
                    ) : (
                        <h2>YOU CAN NOT AFFORD THIS PLAYER</h2> 
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
                            <StyledButton onClick={cancelPlayer} style={{fontSize: '18px', margin: '0 5px'}}>CANCEL</StyledButton>
                            <StyledButton onClick={confirmPlayer} style={{fontSize: '18px', margin: '0 5px'}}>CONFIRM</StyledButton>
                        </>
                    ) : (
                        <StyledButton onClick={cancelPlayer} style={{fontSize: '18px', margin: '0 5px'}}>CANCEL</StyledButton>
                    )}
                
                </div>
            </FoldingMenu>
        )}
        {openConfirmSellMenu && (
            <FoldingMenu 
            style={{zIndex: 5000, background: 'black'}}
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <BigTeamName style={{color: 'white'}}><h2>YOUR BALANCE: {balance}M€</h2></BigTeamName>
                <BigTeamName>
                <h2>DO YOU WANT TO SELL THIS PLAYER? YOU WILL GET {activePlayerSell.value * 75/100}M BACK</h2>
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
                            <StyledButton onClick={cancelPlayerSell} style={{fontSize: '18px', margin: '0 5px'}}>CANCEL</StyledButton>
                            <StyledButton onClick={confirmPlayerSell} style={{fontSize: '18px', margin: '0 5px'}}>CONFIRM</StyledButton>
                        </>}
                
                </div>
            </FoldingMenu>
        )}
        {openPlayerMenu && (
            <FoldingMenu 
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                 
                {loadingPlayers ? (
                    <TeamCircularRow>
                    <CircularProgress sx={{ width: 80, height: 80 }} />
                    </TeamCircularRow>
                ) : (
                    <>
                    <FilterRow>
                        <StyledButton onClick={sortByRating}>SORT BY RATE</StyledButton>
                        <StyledButton onClick={sortByPosition}>SORT BY POSITION</StyledButton>
                        <StyledButton onClick={sortByValue}>SORT BY VALUE</StyledButton>
                    </FilterRow>
                    <PlayerRow >
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
            </FoldingMenu>
        )}
        {openDropMenu && (
            <FantasyFoldingMenu 
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <MyBalanceRow><h2>BALANCE: {balance}M€</h2></MyBalanceRow>
                <MyBalanceRow>{droppedPlayers.length > 0 ? <h2>TEAM RATING: <span style={{color: getBackgroundColor(teamRating)}}>{teamRating}</span></h2> : <h2></h2>}</MyBalanceRow>
                {droppedPlayers.length > 0 ? (
                    <MyPlayerContainer >
                    {groupedPlayers.map((group) => (
                      group.players.length > 0 && (
                          <div style={{width: '100%', height: '50%', display: 'flex', flexDirection: 'column'}}>
                          <MyPlayerPosition><h2>{group.position}s</h2></MyPlayerPosition>
                            <MyPlayerRow>
                                {group.players.map((player) => (
                                    <MyPlayer><MyPlayerAvatar><Avatar alt="Image" src={player.photo} sx={{
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
                    <MyBalanceRow><h2>YOU DON'T HAVE ANY PLAYERS YET</h2></MyBalanceRow>
                )}
            </FantasyFoldingMenu>
        )}
        {openSellMenu && (
            <FantasyFoldingMenu 
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <SellPlayerRow><h2>IF YOU SELL A PLAYER YOU WILL GET 75% OF HIS VALUE BACK. <br/>{droppedPlayers.length > 0 && "PICK A PLAYER TO SELL."}</h2></SellPlayerRow>
                <LeagueRow>
                {droppedPlayers.length > 0 ? (
                    <MyPlayerContainer style={{height: '110%'}}>
                    {groupedPlayers.map((group) => (
                      group.players.length > 0 && (
                          <div style={{width: '100%', height: '50%', display: 'flex', flexDirection: 'column'}}>
                          <MyPlayerPosition><h2>{group.position}s</h2></MyPlayerPosition>
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
                    <MyBalanceRow><h2>YOU DON'T HAVE ANY PLAYERS YET</h2></MyBalanceRow>
                )}
                </LeagueRow>
            </FantasyFoldingMenu>
        )}

        {openStatsMenu && (
            <FantasyFoldingMenu 
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <MyBalanceRow><h2>STATS MENU</h2></MyBalanceRow>
            </FantasyFoldingMenu>
        )}

        {openTrainingMenu && (
            <FantasyFoldingMenu 
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <SellPlayerRow><h2>YOU CAN TRAIN YOUR PLAYERS EVERY 24 HOURS TO BOOST THEIR RATING ON THEIR NEXT MATCH</h2></SellPlayerRow>
                <SellPlayerRow>{lastTraining === null ? (
                    <h2>You haven't trained your players yet</h2>
                ) : (
                    <h2>You have trained your players {trainingsNumber} {trainingsNumber === 1 ? "time" : "times"} this week</h2>
                )}</SellPlayerRow>
                <SellPlayerRow>
                    {lastTraining < Date.now() && <StyledButton style={{fontSize: '14px'}} onClick={startTraining}>START TRAINING</StyledButton>}
                </SellPlayerRow>
                <SellPlayerRow style={{width: '60%'}}><h2 id="countdown" style={{fontSize: '24px'}}></h2></SellPlayerRow>
            </FantasyFoldingMenu>
        )}
        </AnimatePresence>
      </Container>
      
      <BottomRow>
        <IconHolder>
            {(openDropMenu || openSellMenu || openStatsMenu || openTrainingMenu) ? (
                <h2 onClick={openTraining}>TRAINING</h2>
            ):(
                <>
                    {openTeamMenu || openPlayerMenu  ? (
                        <h2 onClick={openLeague}>GO BACK</h2>
                    ):(
                        <>
                            {(openConfirmMenu || openStatsMenu || openTrainingMenu || openSellMenu) ? (
                                <h2></h2>
                            ):(
                                <h2 onClick={openLeague}>CHOOSE A LEAGUE</h2>
                            )}
                        </>
                    )}
                </> 
            )}
        </IconHolder>
        <IconHolder>
            {openTeamMenu ? (
                 <h2>CHOOSE A TEAM</h2>
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
                    {(openDropMenu || openSellMenu || openStatsMenu || openTrainingMenu) && (
                        <h2 onClick={openStats}>STATISTICS</h2>
                    )}
                    </> 
                )}
                </>
            )}
        </IconHolder>
        <IconHolder>
            {openPlayerMenu ? (
                <h2>CHOOSE A PLAYER</h2>
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
                        <h2 onClick={openSell}>SELL PLAYER</h2> 
                    )}
                    </>
                 )}
                </>
            )}
        </IconHolder>
        {activePlayer ? (
            <IconHolder ><h2>BUY THIS PLAYER?</h2></IconHolder>
        ) : (
            <>
            {openDropMenu ? (
                <IconHolder onClick={toggleMenu}><h2>GO BACK</h2></IconHolder>
            ):(
                <IconHolder onClick={toggleMenu}><h2>YOUR TEAM</h2></IconHolder>
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

const PlayerTeamRating = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    z-index: 1000;
    position: absolute; 
    bottom: 0;
    right: 0;
    font-size: 16px;
    font-weight: bold;
    @media(max-width: 968px){
        font-size: 14px; 
        width: 30px;
        height: 30px;
    }
`;

const PlayerDroppingArea = styled.div`
    width: 75px;
    height: 75px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #2cf5fcac;
    @media(max-width: 968px){
        width: 50px;
        height: 50px; 
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
        font-size: 20px;
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
`;


const TeamLogo = styled.div`
    width: 20%;
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
    min-width: 25%;
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
const MyBalanceRow = styled.div`
    width: 100%;
    height: 30px;
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
    height: 15vh;
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
    height: 10%;
    ${props => props.theme.displayFlexCenter}
    margin: 10px 0;
    padding: 10px;
    text-align: center;
    position: relative;
    h2{
        color: ${props => props.theme.text};
        font-size: 24px;
        font-weight: bold;
    }
`;

const TeamName = styled.div`
    width: 75%;
    height: 100%;
    ${props => props.theme.displayFlex}
    padding: 10px;
    text-align: center;
    position: relative;
    h2{
        color: ${props => props.theme.text};
        font-size: 24px;
        font-weight: bold;
    }
`;

const TeamHolder = styled(motion.div)`
    width: 90%;
    min-height: 100px;
    border: 1px solid ${props => props.theme.card};
    background: ${props => props.theme.cardTwo};
    ${props => props.theme.displayFlexCenter}
    border-radius: 5px;
    cursor: pointer;
    position: relative;
    padding: 10px;
`;

const LeagueHolder = styled(motion.div)`
    width: 18%;
    height: 95%;
    border: 1px solid ${props => props.theme.card};
    background: ${props => props.theme.cardTwo};
    border-radius: 5px;
    cursor: pointer;
    @media(max-width: 498px){
        width: 60%; 
        margin: 5px 0;
    }
`;

const LeagueRow = styled.div`
    width: 100%;
    height: 35vh;
    padding: 10px;
    ${props => props.theme.displayFlexCenter}
    justify-content: space-around;
    @media(max-width: 498px){
        height: 70vh; 
        flex-direction: column;
        overflow-y: auto;
    }
`;

const TeamCircularRow = styled.div`
    width: 100%;
    height: 70vh;
    padding: 10px;
    ${props => props.theme.displayFlexCenter}
`;

const TeamRow = styled.div`
    width: 100%;
    height: 80vh;
    padding: 10px;
    display: grid;
    place-items: center;
    grid-template-columns: repeat(4, 1fr); /* 2 columns */
    grid-template-rows: repeat(5, 1fr); /* 10 rows */
    gap: 10px;
    overflow-y: auto;
    @media(max-width: 498px){
        grid-template-columns: repeat(1, 1fr);
    }
`;

const MyPlayerContainer = styled.div`
    width: 100%;
    height: 90%;
    padding: 10px;
    ${props => props.theme.displayFlexColumn};
    overflow-y: auto;
    @media(max-width: 968px){
        grid-template-columns: repeat(2, 1fr);
        height: 85%;
    }
    @media(max-width: 498px){
        grid-template-columns: repeat(1, 1fr);
        height: 85%;
    }
`;

const PlayerRow = styled.div`
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
        height: 85%;
    }
`;

const IconHolder = styled.div`
    position: relative; /* Ensure the parent div is relative */
    width: 10%;
    height: 100%;
    background: #3f3e3e;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 16px !important;
        font-weight: bold; 
    }

    /* Triangle pointing up */
    &::before {
        content: '';
        position: absolute;
        top: -12px; /* Adjust this value to move the triangle higher or lower */
        left: 50%;
        transform: translateX(-50%);
        border-left: 12px solid transparent; /* Wider base */
        border-right: 12px solid transparent;
        border-bottom: 12px solid #3f3e3e; /* Match background color */
        z-index: 1; /* Bring triangle to the front if needed */
    }
    @media(max-width: 498px){
        height: 100%;
        width: 24%;  
    }
`;

const FilterRow = styled.div`
    width: 70%;
    height: 10vh;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter}
    justify-content: space-around;
    @media(max-width: 498px){
        height: 10vh;
        width: 100%;  
    }
`;

const BottomRow = styled.div`
    width: 70%;
    height: 15vh;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter}
    justify-content: space-around;
    text-align: center;
    h2{
        font-size: 24px;
    }
    @media(max-width: 498px){
        height: 10vh;
        width: 100%;  
    }
`;

const Title = styled(motion.div)`
    width: 100%;
    height: 15vh;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter}
    justify-content: space-around;
    text-align: center;
    position: relative;
    overflow: hidden;
    h2{
        font-size: 24px;
        width: 70%;
    }
    @media(max-width: 498px){
        height: 10vh;
        h2{
            font-size: 18px;
            width: 65%;
        }
    }
`;

const Container = styled(motion.div)`
    width: 100%;
    height: 70vh;
    position: relative;
    @media(max-width: 498px){
        height: 80vh;
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


const Section = styled.div`
    width: 100vw;
    height: 100vh;
    ${props => props.theme.displayFlexColumn}
    background: ${props => props.theme.body};
`;

const AbsoluteIconButton = styled(IconButton)`
    &&&{
        position: absolute;
        top: 20px;
        right: 20px;
        padding: 5px;
        background: ${props => props.theme.body};
        scale: 1.2;
        box-shadow: 0 0 5px #03e9f4, 0 0 25px #03e9f4, 0 0 50px #03e9f4, 0 0 100px #03e9f4;
        z-index: 1000;
        @media (max-width: 968px) {
        top: 15px;
        right: 15px;
        scale: 1.2;
        }
    }
`;

const ArrowDown = styled(ArrowCircleLeftIcon)`
    &&&{
        color: ${props => props.theme.text};
        transform: rotate(90deg)
    }
`;
const ArrowUp = styled(ArrowCircleLeftIcon)`
    &&&{
        color: ${props => props.theme.text};
        transform: rotate(270deg)
    }
`;