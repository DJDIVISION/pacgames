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
import field from '../assets/lineups/vertField.png' 
import { BallColumn,CountryBall,CountryBallText, MiniArrowDownTop, MiniArrowupTop,CountryBallTextTop } from './index';
import { FantasyState } from '../context/FantasyContext';
import { CircularProgress } from '@mui/material';
import { useGetTeams } from './functions';
import { useMediaQuery } from 'react-responsive';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';
import { DndContext,useDraggable,useDroppable,DragOverlay } from '@dnd-kit/core';
import { TouchSensor, MouseSensor, useSensor, useSensors } from '@dnd-kit/core';
import { message } from 'antd';

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

    const [startDate, setStartDate] = useState('2024-11-01')
    const [endDate, setEndDate] = useState('2024-11-05')
    const [allLeagues, setAllLeagues] = useState(leagues)
    const [availableLeagues, setAvailableLeagues] = useState([])
    const [activeBall, setActiveBall] = useState(1)
    const {activeLeague, setActiveLeague} = FantasyState();
    const {activeTeam, setActiveTeam} = FantasyState();
    const {activePlayer, setActivePlayer} = FantasyState();
    const [openLeagueMenu, setOpenLeagueMenu] = useState(true)
    const [openTeamMenu, setOpenTeamMenu] = useState(false)
    const [openPlayerMenu, setOpenPlayerMenu] = useState(false)
    const [openDropMenu, setOpenDropMenu] = useState(false)
    const [openConfirmMenu, setOpenConfirmMenu] = useState(false)
    const [areaId, setAreaId] = useState(null)
    const [loading, setLoading] = useState(false)
    const [balance, setBalance] = useState(300)
    const [isDateExpanded, setIsDateExpanded] = useState(true)
    const { activeTeamId, setActiveTeamId } = FantasyState(); 
    const {teams,getTeams,loadingTeams,players,loadingPlayers,handleTeamChange,setPlayers,getPlayers,setTeams} = useGetTeams();
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


    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100%", opacity: 1, transition: { duration: 0.7 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.7 } }
    }

    const openLeague = () => {
        
        setOpenDropMenu(false)
        setTeams([])
        setActiveLeague(null)
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
    const openPlayer = () => {
        setOpenPlayerMenu((prev) => !prev);
    }
    const openTeam = () => {
        setOpenTeamMenu((prev) => !prev);
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
            setOpenDropMenu(true)
        }, 500)
    }
    
    
    
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
    setTimeout(() => {
        setOpenTeamMenu(true)
    }, 500)
}

const toggleMenu = () => {
    setOpenDropMenu((prev) => !prev);

}

useEffect(() => {
    console.log(activePlayer)
}, [activePlayer])


    const placePlayer = (areaId) => {
        setAreaId(areaId)
        setOpenConfirmMenu(true)
    }

    const confirmPlayer = () => {
        const { value, photo, position, name, teamLogo, rating, id } = activePlayer;
        const fakeBalance = balance - value
        if(value && photo && fakeBalance > 0){
            setBalance((prevBalance) => prevBalance - value);
            setDroppedPlayers((prev) => ({
                ...prev,
                [areaId]: [{ id: id, value, photo, teamLogo, areaId: areaId, rating: rating, isDropped: true, name: name, lastMatchRating: null, position: position }], // Replace the existing player
            }));
        }
        setActivePlayer(null)
        setOpenConfirmMenu(false)
        message.success("Your player has been placed!")
    }

    console.log(droppedPlayers)

  const BetArea = ({ id, children }) => {
    
    return (
      <PlayerDroppingArea className="player-area" id={id} onClick={() => placePlayer(id)}>
        {children}
      </PlayerDroppingArea>
    );
  };

  return (
    <Section>
        <Title initial="expanded"
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
      <h2>THIS FANTASY FOOTBALL GAME INCLUDES LEAGUES PLAYING FROM {startDate} TO {endDate}</h2>
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
                                
                                <TeamHolder whileHover={{scale: 1.05}} key={index} onClick={() => setAllPlayers(team)}>
                                    <TeamLogo><img src={team.teamLogo} alt={team.teamLogo} /></TeamLogo>
                                    <TeamName><h2>{team.teamName}</h2></TeamName>
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
                 
                <Button onClick={confirmPlayer} variant="contained">CONFIRM</Button>
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
                    <PlayerRow >
                        {players?.map((player) => {
                            const playerIsDropped = Object.values(droppedPlayers).some(area =>
                                area.find(droppedPlayer => droppedPlayer.id === player.id)
                            );
                            /* const filter = player.laLigaStats[0].statistics.filter((stat) => stat.league.name === player.leagueName && stat.team.name === player.team)
                            const rating = parseFloat(filter[0].games.rating).toFixed(2) */
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
                                
                                <TeamHolder whileHover={{scale: 1.02}} style={{border: `${borderStyle}`}} onClick={() => selectPlayer(player,playerIsDropped)}>
                                    <PlayerLogo><Avatar alt="Image" src={player.photo} sx={{
                                        width: { xs: 70, sm: 70, md: 80, lg: 90, xl: 90 },
                                        height: { xs: 70, sm: 70, md: 80, lg: 90, xl: 90 }
                                    }} /><PlayerTeamLogo><img src={player.teamLogo} alt="logo" /></PlayerTeamLogo></PlayerLogo>
                                    <TeamName>
                                      <PlayerName><h2>{player.name}</h2></PlayerName>  
                                      <PlayerLogo><PlayerRating><span>{player.value}M€</span></PlayerRating></PlayerLogo>
                                      <PlayerLogo><PlayerRating style={{background: player.rating >= 7 ? `green` : player.rating >= 6 && player.rating < 7 ? "yellow" : "red"}}>{!isNaN(player.rating) && player.rating}</PlayerRating></PlayerLogo>
                                    </TeamName>
                                </TeamHolder>
                                
                            )
                        })}
                    </PlayerRow>
                )}
            </FoldingMenu>
        )}
        {openDropMenu && (
            <FantasyFoldingMenu 
            variants={item}
            initial="initial"
            animate="animate"
            exit="exit"
            className='layout1'
            transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                 
                 <BetArea id="area1" className='droppable-area'>
                {droppedPlayers.area1.map((player) => {
                    return(
                    <div key={player.id} style={{position: 'relative'}}>
                        <PlayerTeamLogo style={{backgroundImage: `url(${player.teamLogo})`, backgroundSize: 'cover'}}></PlayerTeamLogo>
                    <img src={player.photo} alt="player" style={{borderRadius: '50%'}}/>
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
                    <img src={player.photo} alt="player" style={{borderRadius: '50%'}}/>
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
                  <img src={player.photo} alt="player" style={{borderRadius: '50%'}}/>
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
                    <img src={player.photo} alt="player" style={{borderRadius: '50%'}}/>
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
                    <img src={player.photo} alt="player" style={{borderRadius: '50%'}}/>
                  {player.lastMatchRating !== null && <PlayerTeamRating style={{background: player.lastMatchRating >= 7 ? `green` : player.lastMatchRating >= 6 && player.lastMatchRating < 7 ? "yellow" : "red"}}>{player.lastMatchRating}</PlayerTeamRating>}
                  </div>
                )
              })}
            </BetArea>
            </FantasyFoldingMenu>
        )}
        </AnimatePresence>
      </Container>
      
      <BottomRow>
        {openLeagueMenu ? (
            <IconHolder onClick={openLeague}><h2>CHOOSE A LEAGUE</h2></IconHolder>
        ) : (
            <IconHolder>
        {loading ? (
            <CircularProgress sx={{ width: 80, height: 80 }} />
        ) : (
            <BallColumn onClick={openLeague}>
            <CountryBall initial={{ height: activeBall === activeLeague?.id ? '70%' : '100%'}}
                animate={{ height: activeBall === activeLeague?.id ? '70%' : '100%', transform: activeBall === activeLeague?.id ? 'translateY(10px) scale(0.9)' : '' }} 
                transition={{ duration: 0.3 }} ><img src={activeLeague?.logo} alt="england" /></CountryBall>
                <CountryBallText initial={{fontSize: activeBall === activeLeague?.id ? '18px' : '0', display: activeBall === activeLeague?.id ? 'flex' : 'none', height: activeBall === activeLeague?.id ? '30%' : '0%'}} 
                animate={{fontSize: activeBall === activeLeague?.id ? '18px' : '0', display: activeBall === activeLeague?.id ? 'flex' : 'none', height: activeBall === activeLeague?.id ? '30%' : '0%', transform: activeBall === activeLeague?.id ? 'translateY(-5px)' : ''  }} 
                transition={{ duration: 0.3 }}>{activeLeague?.name}</CountryBallText>
            </BallColumn>
        )}
        </IconHolder>
        )}
        
        {openTeamMenu ? (
            <IconHolder><h2>CHOOSE A TEAM</h2></IconHolder>
        ) : (
            <IconHolder>
        {loading ? (
            <CircularProgress sx={{ width: 80, height: 80 }} />
        ) : (
            <>
                {activeTeam && (
                    <BallColumn onClick={closePlayers}>
                    <CountryBall initial={{y:10}}><img src={activeTeam?.teamLogo} alt="england" style={{width: '60%', display: 'block', objectFit: 'cover'}}/></CountryBall>
                        <CountryBallText initial={{y:-2.5}} >{activeTeam?.teamName}</CountryBallText>
                    </BallColumn>
                )}
            </>
        )}
        </IconHolder>
        )}
        {openPlayerMenu ? (
            <IconHolder><h2>CHOOSE A PLAYER</h2></IconHolder>
        ) : (
            <IconHolder>
        {loading ? (
            <CircularProgress sx={{ width: 80, height: 80 }} />
        ) : (
            <>
                {activePlayer && (
                    <BallColumn >
                    <CountryBall initial={{y:10}}><img src={activePlayer?.photo} alt="" style={{width: '60%', borderRadius: '50%'}}/></CountryBall>
                        <CountryBallText initial={{y:-2.5}} >{activePlayer?.name}</CountryBallText>
                    </BallColumn>
                )}
            </>
        )}
        </IconHolder>
        )}
        {activePlayer ? (
            <IconHolder >PLACE YOUR PLAYER</IconHolder>
        ) : (
            <IconHolder onClick={toggleMenu}>OPEN TEAM</IconHolder>
        )}
      </BottomRow>
    </Section>
  )
}

export default NewFantasy

const PlayerTeamRating = styled.div`
    width: 25px;
    height: 25px;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    z-index: 1000;
    position: absolute; 
    bottom: 0;
    right: 0;
    font-size: 16px;
    font-weight: bold;
    @media(max-width: 968px){
        
        width: 15px;
        height: 15px;
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
        font-size: 22px;
    }
`;

const PlayerName = styled.div`
    width: 50%;
    height: 100%;
    padding: 5px;
    h2{
        color: ${props => props.theme.text};
        font-size: 16px;
        font-weight: bold;
    }
`;

const PlayerLogo = styled.div`
    width: 25%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
    position: relative;
`;

const PlayerTeamLogo = styled.div`
    width: 30px;
    height: 30px;
    border-radius: 50%;
    position: absolute;
    top: -5px;
    left: -5px;
`;


const TeamLogo = styled.div`
    width: 25%;
    height: 100%;
    ${props => props.theme.displayFlexCenter}
    img{
        width: 50%;
        display: block;
        object-fit: cover;
    }
`;

const BigTeamName = styled.div`
    width: 75%;
    height: 100%;
    ${props => props.theme.displayFlex}
    padding: 10px;
    text-align: center;
    position: relative;
    h2{
        color: ${props => props.theme.text};
        font-size: 34px;
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
    height: 70vh;
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

const PlayerRow = styled.div`
    width: 100%;
    height: 90%;
    padding: 10px;
    display: grid;
    place-items: center;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    overflow-y: auto;
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
    ${props => props.theme.displayFlexColumnCenter}
    background-size: 95%;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    background-image: url(${field});
   
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