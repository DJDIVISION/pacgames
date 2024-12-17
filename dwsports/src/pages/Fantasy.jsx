import React, {useState,useEffect,useRef} from 'react'
import { AbsoluteDivLeft, AbsoluteDivRight, AbsoluteIconButton,AbsoluteIconButtonLeft,ArrowDown,ArrowIconHolder,ArrowsHolder,ArrowUp,BigTeamName,BottomRow,BuyPlayerAvatar,BuyPlayerHolder,BuyPlayerName,Container,FieldWrapper,IconHolder,item,LeagueRow,LeagueRowBets,LiveBetIcon,MyBalanceRow,MyPlayer,MyPlayerAvatar,MyPlayerContainer,MyPlayerName,MyPlayerPosition,MyPlayerRow,MyPlayersInnerRow,MyPlayersRow,MyTeamAvatar,MyTeamName,MyTeamPlayerHolder,MyTeamRow,PlayerDroppingArea,PlayerTeamLogo,PlayerTeamLogoShort,PlayerTeamLogoValue,PlayerTeamRating,PlayerTeamRatingShort,RoundNameHolder,Section,SellPlayerRow,TeamBetsHolder,Title } from './indexThree'
import { useMediaQuery } from 'react-responsive'
import {useTranslation} from "react-i18next";
import { ArrowLeftRelative, ArrowRightRelative, SmallArrowDown } from './index';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence,motion } from 'framer-motion';
import {Link as LinkR} from 'react-router-dom'
import { LowRower, RowerRow, SmallAvatar, SmallAvatarTwo, SmallPlayerName, SmallRower, SmallSmallPlayerName, StyledButton } from '../components';
import { Avatar, CircularProgress } from '@mui/material';
import { supabase } from '../supabase/client';
import { getBackgroundColor, startCountdown, useAuth } from './functions';
import { DndContext,useDraggable,useDroppable,DragOverlay } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { FantasyState } from '../context/FantasyContext';
import { message } from 'antd';
import axios from 'axios'
const Fantasy = () => {

    const rounds = [
        "firstRound", "secondRound"
    ]
    
    const [isDateExpanded, setIsDateExpanded] = useState(false)
    const [startDate, setStartDate] = useState("2024-12-11 10:00:00")
    const [endDate, setEndDate] = useState('2024-12-17 23:00:00')
    const [t, i18n] = useTranslation("global");
    const [allFantasyTeams, setAllFantasyTeams] = useState([])
    const [allFantasyPastTeams, setAllFantasyPastTeams] = useState([])
    const [droppedPlayers, setDroppedPlayers] = useState([])
    const [currentRound, setCurrentRound] = useState(rounds[0])
    const [openTeamsNextRound, setOpenTeamsNextRound] = useState(true)
    const [openTeamsPastRound, setOpenTeamsPastRound] = useState(false)
    const [openPlayersMenu, setOpenPlayersMenu] = useState(false)
    const [openTrainingMenu, setOpenTrainingMenu] = useState(false)
    const [openSellMenu, setOpenSellMenu] = useState(false)
    const [openNextTeamMenu, setOpenNextTeamMenu] = useState(false)
    const [openConfirmSellMenu, setOpenConfirmSellMenu] = useState(false)
    const [openRemovePlayerMenu, setOpenRemovePlayerMenu] = useState(false)
    const [loadingFantasyTeams, setLoadingFantasyTeams] = useState(false)
    const [playerHasTeam, setPlayerHasTeam] = useState(false)
    const [startAgain, setStartAgain] = useState(false)
    const [gameStarted, setGameStarted] = useState(false)
    const [buttonDisabled, setButtonDisabled] = useState(false)
    const [lastTraining, setLastTraining] = useState(null)
    const [expandedIndex, setExpandedIndex] = useState(null);
    const [activePlayerSell, setActivePlayerSell] = useState(null)
    const [playerToRemove, setPlayerToRemove] = useState(null)
    const {playersSelected, setPlayersSelected} = FantasyState();
    const [balance, setBalance] = useState(null)
    const [teamAverage, setTeamAverage] = useState(0)
    const [teamRating, setTeamRating] = useState(null)
    const [trainingsNumber, setTrainingsNumber] = useState(null)
    const [activePlayerDrag, setActivePlayerDrag] = useState(null)
    const navigate = useNavigate()
    const { user } = useAuth(); 
    const carroussel = useRef(null);
    const [width, setWidth] = useState(0);
    const positionOrder = ["Attacker", "Midfielder", "Defender", "Goalkeeper"];
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

    

    const sensors = useSensors(
        useSensor(MouseSensor),
        useSensor(TouchSensor, {
          activationConstraint: {
            distance: 10, // Start dragging after 10px of movement
          },
        })
      );

    const groupedPlayers = positionOrder.map((position) => ({
        position,
        players: droppedPlayers.filter((player) => player.position === position),
    }));

    

    const openTraining = () => {
        setOpenPlayersMenu(false)
        setOpenSellMenu(false)
        setOpenTeamsNextRound(false)
        setOpenNextTeamMenu(false)
        setOpenTeamsPastRound(false) 
        setTimeout(() => {
            setOpenTrainingMenu(true);
        },500)
    }

    const openSell = () => {
        setOpenPlayersMenu(false)
        setOpenTrainingMenu(false)
        setOpenNextTeamMenu(false)
        setOpenTeamsPastRound(false) 
        setTimeout(() => {
            setOpenSellMenu(true);
        },500)
    }
    

    const openPlayers = () => {
        setOpenTeamsNextRound(false) 
        setOpenTrainingMenu(false)
        setOpenNextTeamMenu(false)
        setOpenSellMenu(false)
        setOpenTeamsPastRound(false) 
        setTimeout(() => {
            setOpenPlayersMenu(true) 
        }, 500)
    }

    const closePlayers = () => {
        setOpenPlayersMenu(false)  
        setOpenTrainingMenu(false)
        setOpenNextTeamMenu(false)
        setOpenSellMenu(false)
        setOpenTeamsPastRound(false) 
        setTimeout(() => {
            setOpenTeamsNextRound(true) 
        }, 500)
    }

    const openNextTeam = () => {
        setOpenPlayersMenu(false)
        setOpenTrainingMenu(false)
        setOpenTeamsNextRound(false) 
        setOpenNextTeamMenu(false)
        setOpenSellMenu(false)
        setOpenTeamsPastRound(false) 
        setTimeout(() => {
            setOpenNextTeamMenu(true)
        }, 500)
    }

    const openTeams = () => {
        setOpenPlayersMenu(false) 
        setOpenTrainingMenu(false)
        setOpenNextTeamMenu(false)
        setOpenSellMenu(false)
        setOpenTeamsPastRound(false)
        setTimeout(() => {
            setOpenTeamsNextRound(true) 
        }, 500)
    }

    const openPastTeam = () => {
        setOpenTeamsNextRound(false) 
        setOpenPlayersMenu(false) 
        setOpenTrainingMenu(false)
        setOpenNextTeamMenu(false)
        setOpenSellMenu(false)
        setTimeout(() => {
            setOpenTeamsPastRound(true) 
        }, 500)
    }

    const openConfirmSell = (player) => {
        setActivePlayerSell(player)
        setOpenSellMenu(false)
        setTimeout(() => {
            setOpenConfirmSellMenu(!openConfirmSellMenu)
        }, 500)
    }

    const cancelPlayerSell = () => {
        setActivePlayerSell(null)
        setOpenConfirmSellMenu(false)
        setTimeout(() => {
            setOpenSellMenu(true)
        }, 500)
    }

    const removePlayer = (player) => {
        setPlayerToRemove(player)
        setOpenNextTeamMenu(false)
        setTimeout(() => {
            setOpenRemovePlayerMenu(true)
        }, 500)
    }

    const cancelRemovePlayer = () => {
        setOpenRemovePlayerMenu(false)
        setPlayerToRemove(null)
        setTimeout(() => {
            setOpenNextTeamMenu(true)
        }, 500)
    }

    const toggleExpand = (index) => {
        setExpandedIndex(expandedIndex === index ? null : index);
    };

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
            setOpenNextTeamMenu(true)
        }, 500)
    }

    const getAllFantasyTeams = async () => {
        setLoadingFantasyTeams(true); // Show the loader
        try {
            const { data: rows, error } = await supabase
                .from('fantasyFootball')
                .select('*')
                .not('nextMatch', 'is', null);

            if (error) {
                console.error("Error fetching teams:", error);
                return;
            }

            setAllFantasyTeams(rows); // Update state with fetched data
            console.log("Fetched teams:", rows);
        } catch (err) {
            console.error("Unexpected error:", err);
        } finally {
            setLoadingFantasyTeams(false); // Hide the loader
        }
    };

    const getPastFantasyTeams = async () => {
        setLoadingFantasyTeams(true)
          const { data: rows, error: firstError } = await supabase
              .from('fantasyFootball')
              .select('*')
              .not(currentRound, 'is', null);
  
          if (firstError) {
              console.log("error", firstError);
          } else {
            console.log("rows", rows)
            //setAllFantasyPastTeams(rows)
            console.log(currentRound)
            const teams = []
            for(const row of rows){
                teams.push(row)
            }
            setAllFantasyPastTeams(teams)
          }
        setLoadingFantasyTeams(false)
    }

    console.log(allFantasyPastTeams)
    

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
                        for (const player of data[0].players.players){
                            const { data, error } = await supabase
                            .from('footballPlayers')
                            .select('*')
                            .eq("id", player.id)
                            .eq("topPlayer", true)
                            .order('position', { ascending: true }); // Fetch players by teamId

                            if (error) {
                            console.error('Error fetching players:', error.message);
                            } else {
                                player.injuryType = data[0].injuryType
                                player.injuryReason = data[0].injuryReason
                            }
                            
                        }
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

    console.log(droppedPlayers)

    const getTeamRating = () => {
        const allPlayers = Object.values(droppedTeamPlayers).flat(); 
        const totalRating = allPlayers.reduce((sum, player) => sum + player.rating, 0);
        const averageRating = totalRating / allPlayers.length;
        return parseFloat(averageRating.toFixed(2));
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
            }
        }
    }

    useEffect(() => {
        const start = new Date(startDate)
        const end = new Date(endDate)
        const now = new Date(); // Current date and time
        const isBetween = now >= start && now <= end;
        setGameStarted(isBetween)
    }, [])

    useEffect(() => {
        if (droppedTeamPlayers) {
    
          const allPlayers = Object.values(droppedTeamPlayers).flat();
          
          if(allPlayers.length > 0){
            setTeamAverage(getTeamRating())
          } else {
            setTeamAverage(0)
          }
        }
      }, [droppedTeamPlayers])
      
    const getAveragePlayerRating = (allPlayers) => {
        if(!gameStarted){
            const totalRating = allPlayers.reduce((sum, player) => sum + player.rating, 0);
            const averageRating = totalRating / allPlayers.length;
            return parseFloat(averageRating.toFixed(2));
        } else {
            const totalRating = allPlayers.reduce((sum, player) => sum + player.lastMatchRating, 0);
            const averageRating = totalRating / allPlayers.length;
            return parseFloat(averageRating.toFixed(2));
        }
    };

    useEffect(() => {
        if (droppedTeamPlayers) {

            const allPlayers = Object.values(droppedTeamPlayers).flat();
            
            if(allPlayers.length > 0){
            setTeamAverage(getAveragePlayerRating(allPlayers))
            } else {
            setTeamAverage(0)
            }
        }
        if(allFantasyTeams && gameStarted){
            for (const team of allFantasyTeams){
                
                const allPlayers = Object.values(team.nextMatch.players).flat();
                
                if (allPlayers.length > 0) {
                    team.nextMatch.teamAverage = getAveragePlayerRating(allPlayers)
                    
                } else {
                    setTeamAverage(0)
                }
            }
        }
    }, [droppedTeamPlayers,allFantasyTeams,gameStarted])

    useEffect(() => {
        if(droppedPlayers){
            setWidth(droppedPlayers.length * 55)
        }
    }, [droppedPlayers]);

    
    
    useEffect(() => {
        getAllFantasyTeams(); // Always fetch data when the component mounts
    }, []);

    const raiseRound = () => {
        setAllFantasyPastTeams([])
        const currentIndex = rounds.indexOf(currentRound);
        const nextIndex = (currentIndex + 1) % rounds.length; // Cycle to the first round if at the end
        setCurrentRound(rounds[nextIndex]);
    };
    
    const lowRound = () => {
        setAllFantasyPastTeams([])
        const currentIndex = rounds.indexOf(currentRound);
        const prevIndex = (currentIndex - 1 + rounds.length) % rounds.length; // Cycle to the last round if at the start
        setCurrentRound(rounds[prevIndex]);
    };

    useEffect(() => {
        if(openTeamsPastRound){
            getPastFantasyTeams();
        }
    }, [openTeamsPastRound,currentRound])

    useEffect(() => {
        if(openPlayersMenu){
            fetchUserData();
        }
    }, [openPlayersMenu])

    useEffect(() => {
        if (openTrainingMenu) {
            startCountdown(lastTraining); // Call countdown after component is rendered
        }
    }, [openTrainingMenu]);

    const closeDate = () => {
        setIsDateExpanded((prev) => !prev);
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
                    startCountdown(lastTraining)
                }
        }
    }

    const saveDroppedTeam = async () => {
        const allPlayers = Object.values(droppedTeamPlayers).flat(); 
        if(allPlayers.length < 11){
            message.error("You don't have a full team yet!")
            return
        }
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
                teamRating: teamRating,
                date: date,
                userId: user.id
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
      
                    const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend });
                    
                    if (response.data.success) {
                      console.log('Message sent successfully!');
                    } else {
                      console.log('Failed to send message');
                    }
                  } catch (error) {
                    console.log('Error sending message', error);
                  }
        }
      }

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
        
        if (over) {
          const { value, image, position, name, teamLogo, rating, id, leagueName, teamName } = active.data.current;
          
          if (value && image) {
            
            setPlayersSelected((prev) => [...prev, id])
            
            setDroppedTeamPlayers((prev) => ({
              ...prev,
              [over.id]: [{ id: id, value, image, teamLogo, overId: over.id, rating: rating, isDropped: true, name: name, lastMatchRating: null, position: position, leagueName: leagueName, teamName: teamName }], // Replace the existing player
            }));
            setActivePlayerDrag(null);
          } 
        }
    }

    const Player = ({ player }) => {
        const playerIsDropped = Object.values(droppedTeamPlayers).some(area =>
          area.find(droppedPlayer => droppedPlayer.id === player.id)
        );
        const playerIsInjured = player.injuryType === 'Missing Fixture';
        const playerIsQuestionable = player.injuryType === 'Questionable';
        const borderStyle = playerIsInjured
        ? '3px solid red'
        : playerIsQuestionable
        ? '3px solid orange'
        : ''
        
        const { attributes, listeners, setNodeRef, transform, isDragging  } = useDraggable({
          id: `${player.id}`,
          disabled: playerIsDropped || playerIsInjured,  
          data: { value: player.value, image: player.photo, position: player.position, name: player.name, teamLogo: player.teamLogo, rating: player.rating, id: player.id, leagueName: player.leagueName, teamName: player.teamName },  // Passing chip value through drag data
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
                                        height: { xs: 50, sm: 50, md: 60, lg: 60, xl: 60 }, border: `${borderStyle}`
                                    }} />
          </div>
        );
    };

  return (
    <Section>
     {isDateExpanded ? <AbsoluteIconButton onClick={closeDate}><ArrowDown /></AbsoluteIconButton> : <AbsoluteIconButton onClick={closeDate}><ArrowUp /></AbsoluteIconButton>}
     <Title initial="collapsed"
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <h2>{t("fantasy.title1")} {startDate} <br/>{t("fantasy.title2")} {endDate}</h2>
        </Title>
        <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
        <AnimatePresence>
       
        {openTeamsNextRound && (
        <Container
            initial="expanded"
            animate={isDateExpanded ? "collapsed" : "expanded"}
            variants={variantsTwo}
            transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}
        >
            <LeagueRowBets
                variants={item}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}
            >
                {loadingFantasyTeams ? (
                    <CircularProgress sx={{ width: 40, height: 40 }} />
                ) : (
                    <>
                        {allFantasyTeams?.length > 0 ? (
                            <>
                                {allFantasyTeams.map((team, index) => (
                                    <TeamBetsHolder
                                        key={index}
                                        initial={{ height: '100px' }}
                                        animate={{
                                            height:
                                                expandedIndex === index
                                                    ? '330px'
                                                    : '100px',
                                        }}
                                        transition={{ duration: 0.5 }}
                                    >
                                        {expandedIndex === index ? (
                                            <SmallArrowDown
                                                style={{ transform: 'rotate(180deg)' }}
                                                onClick={() => toggleExpand(index)}
                                            />
                                        ) : (
                                            <SmallArrowDown onClick={() => toggleExpand(index)} />
                                        )}
                                        <SmallRower>
                                            <SmallAvatar>
                                                <Avatar
                                                    alt="Home Team Logo"
                                                    src={team.avatar}
                                                    sx={{
                                                        width: {
                                                            xs: 50,
                                                            sm: 50,
                                                            md: 70,
                                                            lg: 70,
                                                            xl: 70,
                                                        },
                                                        height: {
                                                            xs: 50,
                                                            sm: 50,
                                                            md: 70,
                                                            lg: 70,
                                                            xl: 70,
                                                        },
                                                        transform: 'translateY(5px)',
                                                    }}
                                                />
                                            </SmallAvatar>
                                            <SmallPlayerName>
                                                <h2>{team.playerName}</h2>
                                            </SmallPlayerName>
                                            <SmallAvatar>
                                                <h2>
                                                    TRAININGS: <br />
                                                    <span>{team.trainingsNumber}</span>
                                                </h2>
                                            </SmallAvatar>
                                            <SmallAvatar>
                                                <h2>
                                                    TEAM RATING: <br />
                                                    {gameStarted ? (
                                                        <span
                                                            style={{
                                                                color: getBackgroundColor(
                                                                    team.nextMatch.teamAverage
                                                                ),
                                                            }}
                                                        >
                                                            {team.nextMatch.teamAverage}
                                                        </span>
                                                    ) : (
                                                        <span
                                                            style={{
                                                                color: getBackgroundColor(
                                                                    team.teamRating
                                                                ),
                                                            }}
                                                        >
                                                            {team.nextMatch.teamRating}
                                                        </span>
                                                    )}
                                                </h2>
                                            </SmallAvatar>
                                        </SmallRower>
                                        {expandedIndex === index && (
                                            <LowRower>
                                                {Object.entries(team.nextMatch.players).map(
                                                    ([area, players]) => {
                                                        return (
                                                            <>
                                                                {players.map(
                                                                    (player, playerIndex) => {
                                                                        console.log(player)
                                                                        return (
                                                                            <RowerRow key={playerIndex}>
                                                                                <SmallAvatar>
                                                                                    <Avatar
                                                                                        alt="Home Team Logo"
                                                                                        src={player.image}
                                                                                        sx={{
                                                                                            width: {
                                                                                                xs: 40,
                                                                                                sm: 40,
                                                                                                md: 70,
                                                                                                lg: 70,
                                                                                                xl: 70,
                                                                                            },
                                                                                            height: {
                                                                                                xs: 40,
                                                                                                sm: 40,
                                                                                                md: 70,
                                                                                                lg: 70,
                                                                                                xl: 70,
                                                                                            },
                                                                                        }}
                                                                                    />
                                                                                    <PlayerTeamLogo>
                                                                                        <img
                                                                                            src={
                                                                                                player.teamLogo
                                                                                            }
                                                                                            alt="logo"
                                                                                        />
                                                                                    </PlayerTeamLogo>
                                                                                </SmallAvatar>
                                                                                <SmallPlayerName>
                                                                                    <h2>{player.name}</h2>
                                                                                    {player.isMatchCancelled === true && (
                                                                                        <h2>
                                                                                            MATCH CANCELLED
                                                                                        </h2>
                                                                                    )}
                                                                                    {player.isMVP === true && (
                                                                                        <h2>
                                                                                            🏆 MVP
                                                                                        </h2>
                                                                                    )}
                                                                                </SmallPlayerName>
                                                                                <SmallAvatarTwo>
                                                                                    <h2>
                                                                                        {player.position.charAt(0)}
                                                                                    </h2>
                                                                                </SmallAvatarTwo>
                                                                                <SmallAvatarTwo>
                                                                                    {gameStarted ? (
                                                                                        <h2
                                                                                            style={{
                                                                                                color: getBackgroundColor(
                                                                                                    player.lastMatchRating
                                                                                                ),
                                                                                            }}
                                                                                        >
                                                                                            {player.lastMatchRating !== null
                                                                                                ? player.lastMatchRating
                                                                                                : ''}
                                                                                        </h2>
                                                                                    ) : (
                                                                                        <h2
                                                                                            style={{
                                                                                                color: getBackgroundColor(
                                                                                                    player.rating
                                                                                                ),
                                                                                            }}
                                                                                        >
                                                                                            {player.rating !== null
                                                                                                ? player.rating
                                                                                                : 0}
                                                                                        </h2>
                                                                                    )}
                                                                                </SmallAvatarTwo>
                                                                            </RowerRow>
                                                                        );
                                                                    }
                                                                )}
                                                            </>
                                                        );
                                                    }
                                                )}
                                            </LowRower>
                                        )}
                                    </TeamBetsHolder>
                                ))}
                            </>
                        ) : (
                            <h2>THERE ARE <br />NO TEAMS YET</h2>
                        )}
                    </>
                )}
            </LeagueRowBets>
        </Container>
    )}
        {openTeamsPastRound && (
        <Container initial="expanded" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
                 <LeagueRowBets variants={item}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                <ArrowsHolder>
                    <ArrowIconHolder><ArrowLeftRelative onClick={lowRound} style={{transform: 'translateX(15px) rotate(90deg)'}}></ArrowLeftRelative></ArrowIconHolder>
                    <RoundNameHolder><h2>Round: {currentRound === "firstRound" ? 1 : currentRound === "secondRound" ? 2 : ''}</h2></RoundNameHolder>
                    <ArrowIconHolder><ArrowRightRelative onClick={raiseRound} style={{transform: 'translateX(-15px) rotate(270deg)'}}></ArrowRightRelative></ArrowIconHolder>
                  </ArrowsHolder>
                        {allFantasyPastTeams?.length > 0 ? (
                            <>
                                {allFantasyPastTeams?.sort((a, b) => {
                                    const finalA = a[currentRound]?.finalAverage ?? 0;
                                    const finalB = b[currentRound]?.finalAverage ?? 0;
                                    return finalB - finalA; // Sort in descending order
                                }).map((team, index) => {
                                 console.log(team)
                                 const totalMVPs = Object.values(team[currentRound]?.players) // Get all areas (arrays of players)
                                    .flat() // Flatten all arrays into a single array
                                    .filter((player) => player.isMVP) // Filter players where isMVP is true
                                    .length; // Count the remaining players

                                    console.log("Total MVP players:", totalMVPs);
                            return(
                                <TeamBetsHolder key={index}
                                initial={{ height: '100px' }}
                                animate={{ height: expandedIndex === index ? '330px' : '100px' }}
                                transition={{ duration: 0.5 }}>
                                    <LiveBetIcon>{index === 0 ? "1st" : index === 1 ? "2nd" : index === 2 ? "3rd" : (index + 1) + "th"}</LiveBetIcon>
                                {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                                    <SmallRower>
                                       <SmallAvatar>
                                       <Avatar alt="Home Team Logo" src={team.avatar} sx={{
                                        width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                                        height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                                        }} />
                                        </SmallAvatar> 
                                        <SmallSmallPlayerName><h2>{team.playerName}</h2></SmallSmallPlayerName>
                                        
                                        <SmallAvatar><h2>PUSH FOR TRAININGS: <br/><span style={{color: team[currentRound]?.addedAverage > 0 ? "green" : "white"}}>{team[currentRound]?.addedAverage > 0 && "+"} {team[currentRound]?.addedAverage}</span></h2></SmallAvatar>
                                        <SmallAvatar><h2>PUSH FOR MVP'S: <br/><span style={{color: totalMVPs > 0 ? "green" : "white"}}>{totalMVPs > 0 && "+"} {totalMVPs * 0.33}</span></h2></SmallAvatar>
                                        <SmallAvatar><h2>FINAL RATING: <br/><span style={{color: getBackgroundColor(team[currentRound]?.finalAverage)}}>{team[currentRound]?.finalAverage}</span></h2></SmallAvatar>
                                    </SmallRower>
                                    {expandedIndex === index && (
                                        <LowRower>
                                            <SmallAvatar style={{width: '75%'}}><h2>FIXTURE RATING: <br/><span style={{color: getBackgroundColor(team[currentRound]?.teamAverage)}}>{team[currentRound]?.teamAverage}</span></h2></SmallAvatar>
                                            {Object.entries(team[currentRound]?.players).map(([area, players]) => {
                                                return(
                                                    <>
                                                    {players.map((player, playerIndex) => {
                                                        return(
                                                            <RowerRow key={playerIndex}>
                                                                <SmallAvatar>
                                                            <Avatar alt="Home Team Logo" src={player.image} sx={{
                                                                width: { xs: 40, sm: 40, md: 70, lg: 70, xl: 70 },
                                                                height: { xs: 40, sm: 40, md: 70, lg: 70, xl: 70 },
                                                                }} />
                                                                <PlayerTeamLogo><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>
                                                                </SmallAvatar> 
                                                                <SmallPlayerName><h2>{player.name}</h2>{player.isMatchCancelled === true ? <h2>MATCH CANCELLED</h2> : ''}{player.isMVP === true && (
                                                                                        <h2>
                                                                                            🏆 MVP
                                                                                        </h2>
                                                                                    )}</SmallPlayerName>
                                                                <SmallAvatarTwo><h2>{player.position.charAt(0)}</h2></SmallAvatarTwo>
                                                                <SmallAvatarTwo><h2 style={{color: getBackgroundColor(player.lastMatchRating)}}>{player.lastMatchRating !== null ? player.lastMatchRating : ''}</h2></SmallAvatarTwo>
                                                            </RowerRow>
                                                        )
                                                    })}
                                                    </>
                                                )
                                            })}
                                        </LowRower>
                                    )}
                                </TeamBetsHolder>
                            )
                        })}
                            </>
                        ) : (
                            <CircularProgress sx={{width: 50, height: 50}} />
                        )}
                </LeagueRowBets>
        </Container>
        )}
        {openPlayersMenu && (
        <Container initial="expanded" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px'}} variants={item}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                        <MyBalanceRow><h2>{t("fantasy.title3")}: {balance}M€</h2></MyBalanceRow>
                        <MyBalanceRow>{droppedPlayers.length > 0 && <h2>{t("fantasy.title11")}: <span style={{color: getBackgroundColor(teamRating)}}>{teamRating}</span></h2>}</MyBalanceRow>
                        {droppedPlayers.length > 0 ? (
                    <MyPlayerContainer>
                    {groupedPlayers.map((group) => (
                      group.players.length > 0 && (
                          <div style={{width: '100%', height: '50%', display: 'flex', flexDirection: 'column'}}>
                          <MyPlayerPosition><h2>{group.position === "Attacker" && `${t("fantasy.positionOrder1")}`}
                          {group.position === "Midfielder" && `${t("fantasy.positionOrder2")}`}{group.position === "Defender" && `${t("fantasy.positionOrder3")}`}
                          {group.position === "Goalkeeper" && `${t("fantasy.positionOrder4")}`}</h2></MyPlayerPosition>
                            <MyPlayerRow>
                                {group.players.map((player) => {
                                    const playerIsInjured = player.injuryType === 'Missing Fixture';
                                    const playerIsQuestionable = player.injuryType === 'Questionable';
                                    const borderStyle = playerIsInjured
                                    ? '3px solid red'
                                    : playerIsQuestionable
                                    ? '3px solid orange'
                                    : ''
                                    return(
                                        <MyPlayer><MyPlayerAvatar><Avatar alt="Image" src={player.photo} sx={{
                                            width: { xs: 50, sm: 50, md: 30, lg: 60, xl: 60 },
                                            height: { xs: 50, sm: 50, md: 30, lg: 60, xl: 60 }, border: `${borderStyle}`
                                        }} /><PlayerTeamLogoValue><h2>{player.value}M€</h2></PlayerTeamLogoValue><PlayerTeamLogoShort><img src={player.teamLogo} alt="logo" /></PlayerTeamLogoShort><PlayerTeamRatingShort style={{background: getBackgroundColor(player.rating)}}>{playerIsInjured ? '❌' : player.rating}</PlayerTeamRatingShort></MyPlayerAvatar><MyPlayerName><h2>{player.name}</h2></MyPlayerName>
                                        <MyPlayerName><h2>{playerIsInjured ? player.injuryReason : ''}</h2></MyPlayerName></MyPlayer>
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
        {openTrainingMenu && (
            <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{flexDirection: 'column'}}>
                <motion.div style={{width:'100%', height:'100%',display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '10%', justifyContent: 'center'}} variants={item}
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
        {openNextTeamMenu && (
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
                                    <MyTeamAvatar><PlayerTeamLogo><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo><Player key={player.id} player={player} />
                                    {player.injuryType !== null && <PlayerTeamRating style={{background: getBackgroundColor(player.rating)}}>❌</PlayerTeamRating>}</MyTeamAvatar>
                                    <MyTeamName><h2>{player.name}</h2></MyTeamName>
                                </MyTeamPlayerHolder>
                            )
                        })}
                    </MyPlayersInnerRow>
                </MyPlayersRow>
                <MyTeamRow>
                    <AbsoluteDivLeft>
                        {startAgain ? (
                            <StyledButton disabled={buttonDisabled} style={{fontSize: '10px'}} /* onClick={ReStartGame} */>START NEXT</StyledButton>
                        ) : (
                            gameStarted ? (
                                <h3>WAITING FOR RESULTS</h3>
                            ) : (
                                <StyledButton disabled={buttonDisabled} onClick={saveDroppedTeam} style={{fontSize: '10px'}}>SAVE TEAM</StyledButton>
                            )
                        )}
                    </AbsoluteDivLeft>
                    <AbsoluteDivRight><h3>TEAM AVERAGE: <br/><span style={{color: getBackgroundColor(teamAverage)}}>{teamAverage}</span></h3></AbsoluteDivRight>
                    <FieldWrapper className='layout1'>
                    <BetArea id="area1" className='droppable-area'>
                    {droppedTeamPlayers.area1.map((player) => {
                        return(
                        <div key={player.id} style={{position: 'relative'}}>
                            
                        <Avatar alt="Image" src={player.image} sx={{ width: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 }, 
                        height: { xs: 50, sm: 50, md: 40, lg: 60, xl: 60 },}} />
                        <PlayerTeamLogo onClick={() => removePlayer(player)}><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo>
                        {gameStarted ? 
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
        </AnimatePresence>
        <BottomRow>
            <IconHolder >
                {openTeamsNextRound ? (
                    <h2 onClick={openTeams} style={{color: openTeamsNextRound ? "rgba(244,215,21,1)" : ""}}>THIS ROUND TEAMS</h2>
                ) : openTeamsPastRound ? (
                    <h2 onClick={openTeams} style={{color: openTeamsNextRound ? "rgba(244,215,21,1)" : ""}}>THIS ROUND TEAMS</h2>
                ) : (openTrainingMenu || openSellMenu || openPlayersMenu || openNextTeamMenu) ? (
                    <h2 style={{color: openTrainingMenu ? "rgba(244,215,21,1)" : ""}} onClick={openTraining}>{t("fantasy.training")}</h2>
                ) : ""}
            </IconHolder>
            <IconHolder>
            {openTeamsNextRound ? (
                    <h2 style={{color: openTeamsPastRound ? "rgba(244,215,21,1)" : ""}} onClick={openPastTeam}>PAST ROUND TEAMS</h2>
                ) : openTeamsPastRound ? (
                    <h2 style={{color: openTeamsPastRound ? "rgba(244,215,21,1)" : ""}} onClick={openPastTeam}>PAST ROUND TEAMS</h2>
                ) : (openSellMenu || openPlayersMenu || openTrainingMenu || openNextTeamMenu) ? (
                    <h2 onClick={openNextTeam} style={{color: openNextTeamMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.stats")}</h2>
                ) : ""}
            </IconHolder>
            <IconHolder>
            {openTeamsNextRound ? (
                    <LinkR to="/newfantasy"><h2>BUILD TEAM</h2></LinkR>
                ) : openTeamsPastRound ? (
                    <LinkR to="/newfantasy"><h2>BUILD TEAM</h2></LinkR>
                ) : (openSellMenu || openPlayersMenu || openTrainingMenu || openNextTeamMenu) ? (
                    <h2 onClick={openSell} style={{color: openSellMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title23")}</h2> 
                ) : ""}
            </IconHolder>
            <IconHolder>
            
            {openPlayersMenu ? (<h2 onClick={closePlayers} style={{color: openPlayersMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.back")}</h2>) : (
                <h2 onClick={openPlayers} style={{color: openPlayersMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title25")}</h2>
            )}
            </IconHolder>
        </BottomRow>
    </Section>
  )
}

export default Fantasy
