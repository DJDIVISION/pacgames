import React, {useState, useEffect} from 'react'
import { useTheme } from 'styled-components'
import {motion,AnimatePresence,Reorder,useMotionValue} from 'framer-motion'
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { BallColumn,CountryBall,CountryBallText, MiniArrowDownTop, MiniArrowupTop,CountryBallTextTop, PlayerSettingsIcon, Search, SearchIconButton, ArrowLeftRelative, SmallArrowDown, TeamsLogo, TeamLogoWrapper, TeamLogoText, TeamsResult, DateRow, ResultRow, BigDateRow, VenueRow, ArrowRightRelative, StyledButton, OddsColumn, OddsColumnBig, AllBetsBadge, LeagueLogo, LeagueName } from './index';
import {useTranslation} from "react-i18next";
import { Avatar, CircularProgress, IconButton, Switch } from '@mui/material';
import england from '../assets/logos/england.png'
import back30 from '../assets/backs/back30.jpg'
import spain from '../assets/logos/spain.png'
import italy from '../assets/logos/italy.png'
import laliga from '../assets/laliga.png'
import laliga2 from '../assets/laliga2.png'
import dfb from '../assets/dfb.png'
import ligueuno from '../assets/ligue1.png'
import FACup from '../assets/FA.png'
import liguedos from '../assets/ligue2.png'
import bundes from '../assets/bundesliga.png'
import bundesdos from '../assets/bundesdos.png'
import coppa from '../assets/coppa.png'
import premierlogo from '../assets/premier.png'
import championship from '../assets/championship.png'
import seriea from '../assets/serieA.png' 
import serieb from '../assets/serieB.png' 
import copaRey from '../assets/copaRey.png' 
import europa from '../assets/europa.png' 
import europe from '../assets/logos/europe.png' 
import germany from '../assets/logos/germany.png' 
import france from '../assets/logos/france.png' 
import chart from '../assets/logos/chart.png' 
import champions from '../assets/champions.png' 
import conference from '../assets/conference.png' 
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {Section,BottomRow,IconHolder,LeagueRowBets,Container,item,LeagueHolder,AbsoluteIconButton,ArrowUp,ArrowDown,
  Title,AbsoluteIconButtonLeft,TeamCircularRow,TeamRow,TeamBetsHolder,ArrowsHolder,ArrowIconHolder,RoundNameHolder,
  AbsoluteChart,
  CurrentBetHolder,
  CurrentBetLogoHolder,
  CurrentBetNameHolder,
  AddIcon,
  LiveBetIcon,
  CurrentBetRow,
  TeamBetsHolderBlur,
  NewsTicker,
  TickerItem
} from './indexThree' 
import { FantasyState } from '../context/FantasyContext';
import axios from 'axios';
import ownGoal from '../assets/logos/ownGoal.png'
import goal from '../assets/logos/goal.png'
import redCard from '../assets/logos/redCard.png'
import betting from '../assets/logos/h2h.png'
import penalty from '../assets/logos/penalty.png'
import yellowCard from '../assets/logos/yellowCard.png'
import { LowRower,Rower,RowerColumn,RowerRowBets,MiniRower,MiniRowerType,MiniRowerAmount,RowerFirstEvent, RowerRow, RowerRowEvent, RowerRowName, RowerTeamEvent, AbsoluteScore,
  RowerRowBet,
  BetInput,
  BetAmount,
  PossibleWinningsAmount,
  Switcher,
  AntSwitch,
  BigRowBet,
  TopRowBet,
  BottomRowBet,
  BetHolder,
  LeagueRower,
  LeagueWrapper
 } from '../components';
import { supabase } from '../supabase/client';
import Skeleton from '@mui/material/Skeleton';
import LeagueStats from '../components/menus/LeagueStats';
import { useAuth } from './functions';
import { CrossAnimation, TickAnimation } from '../animations';
import { message } from 'antd';
import TeamStats from '../components/menus/TeamStats';
import PlayerStatsMenu from '../components/menus/PlayerStatsMenu';
import SendOdds from '../components/menus/SendOdds';
import SelectedBet from '../components/menus/SelectedBet';
import { CloseChatRoomIcon } from '../components/chats';

const Bets = () => {

  const englandLeagues = [
    
  ]

  const spainLeagues = [
    
  ]

  const italyLeagues = [
    
  ]

  const franceLeagues = [
    ,
  ]

  const germanyLeagues = [
    
  ]

  const europaLeagues = [
    
  ]

  const countries = [
    {
      name: "EUROPE",
      logo: europe,
      id: 6,
      leagues: [
        {
          league: "Champions League",
          logo: champions,
          name: "UEFA",
          id: 2,
          currentRound: 6
        },
        {
          league: "Europa League",
          logo: europa,
          name: "UEFA",
          id: 3,
          currentRound: 6
        },
        {
          league: "Conference League",
          logo: conference,
          name: "UEFA",
          id: 848,
          currentRound: 5
        }
      ]
    },
    {
      name: "ENGLAND",
      logo: england,
      id: 1,
      leagues: [
        {
          league: "Premier League",
          logo: premierlogo,
          name: "England",
          id: 39,
          currentRound: 15
        },
        {
          league: "Championship",
          logo: championship,
          name: "England",
          id: 40,
          currentRound: 19
        },
        {
          league: "FA Cup",
          logo: FACup,
          name: "England",
          id: 45,
          currentRound: 3
        }
      ]
    },
    {
      name: "SPAIN",
      logo: spain,
      id: 2,
      leagues: [
        {
          league: "La Liga",
          logo: laliga,
          name: "Spain",
          id: 140,
          currentRound: 16
        },
        {
          league: "La Liga 2",
          logo: laliga2,
          name: "Spain",
          id: 141,
          currentRound: 18
        },
        {
          league: "Copa del Rey",
          logo: copaRey,
          name: "Spain",
          id: 143,
          currentRound: 2
        }
      ]
    },
    {
      name: "GERMANY",
      logo: germany,
      id: 3,
      leagues: [
        {
          league: "Bundesliga",
          logo: bundes,
          name: "Germany",
          id: 78,
          currentRound: 13
        },
        {
          league: "2 Bundesliga",
          logo: bundesdos,
          name: "Germany",
          id: 79,
          currentRound: 15
        },
        {
          league: "DFB Pokal",
          logo: dfb,
          name: "Germany",
          id: 81,
          currentRound: 16
        }
      ]
    },
    {
      name: "ITALY",
      logo: italy,
      id: 4,
      leagues: [
        {
          league: "Serie A",
          logo: seriea,
          name: "Italy",
          id: 135,
          currentRound: 15
        },
        {
          league: "Serie B",
          logo: serieb,
          name: "Italy",
          id: 136,
          currentRound: 16
        },
        {
          league: "Coppa Italia",
          logo: coppa,
          name: "Italy",
          id: 137,
          currentRound: 16
        }
      ]
    },
    {
      name: "FRANCE",
      logo: france,
      id: 5,
      leagues: [
        {
          league: "Ligue 1",
          logo: ligueuno,
          name: "France",
          id: 61,
          currentRound: 14
        },
        {
          league: "Ligue 2",
          logo: liguedos,
          name: "France",
          id: 62,
          currentRound: 15
        }
      ]
    }
  ]
  const theme = useTheme();
  const [checkedMultiple, setCheckedMultiple] = useState(false);
  const [openLeagueMenu, setOpenLeagueMenu] = useState(true)
  const { user } = useAuth();
  const isMobile = useMediaQuery({ query: '(max-width: 498px)' });
  const [availableLeagues, setAvailableLeagues] = useState(countries)
  const [t, i18n] = useTranslation("global");
  const [isDateExpanded, setIsDateExpanded] = useState(false)
  const [openMatchesMenu, setOpenMatchesMenu] = useState(false)
  const [openWonBetsMenu, setOpenWonBetsMenu] = useState(false)
  const [openLostBetsMenu, setOpenLostBetsMenu] = useState(false)
  const [openLiveMatchesMenu, setOpenLiveMatchesMenu] = useState(false)
  const [openLiveBetMenu, setOpenLiveBetMenu] = useState(false)
  const [selectedOddsMenu, setSelectedOddsMenu] = useState(false)
  const [selectedTeamMenu, setSelectedTeamMenu] = useState(false)
  const {activeTeamId, setActiveTeamId} = FantasyState();
  const {fixtureId, setFixtureId} = FantasyState();
  const {selectedBet, setSelectedBet} = FantasyState();
  const [selectedBetMenu, setSelectedBetMenu] = useState(false);
  const {playerToUpdate, setPlayerToUpdate} = FantasyState();
  const [openMyBetsMenu, setOpenMyBetsMenu] = useState(false)
  const [openCurrentBetMenu, setOpenCurrentMenu] = useState(false)
  const [loadingMatches, setLoadingMatches] = useState(false)
  const [loadingLiveBets, setLoadingLiveBets] = useState(false)
  const [loadingLiveMatches, setLoadingLiveMatches] = useState(false)
  const [selectedPlayerMenu, setSelectedPlayerMenu] = useState(false)
  const [loadingWonBets, setLoadingWonBets] = useState(false)
  const [loadingLostBets, setLoadingLostBets] = useState(false)
  const [loadingBets, setLoadingBets] = useState(false)
  const {activeLeague, setActiveLeague} = FantasyState();
  const {activeRound,setActiveRound} = FantasyState();
  const {balance, setBalance} = FantasyState();
  const [news, setNews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const {activeLeagueId, setActiveLeagueId} = FantasyState();
  const [activeBall, setActiveBall] = useState(1)
  const [currentLiveMaches, setCurrentLiveMatches] = useState([])
  const [currentRoundMaches, setCurrentRoundMatches] = useState([])
  const [winningBets, setWinningBets] = useState([])
  const [lostBets, setLostBets] = useState([])
  const [liveOdds, setLiveOdds] = useState([])
  const [myBets, setMyBets] = useState([])
  const [headToHead, setHeadToHead] = useState([])
  const [winOrLostBets, setWinOrLostBets] = useState([])
  const [selectedFixture, setSelectedFixture] = useState([])
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [leagueStatsMenu, setLeagueStatsMenu] = useState(false);
  const navigate = useNavigate()
  const [premier, setPremier] = useState([])
  const [serieA, setSerieA] = useState([])
  const [bundesliga, setBundesliga] = useState([])
  const [ligue1, setLigue1] = useState([])
  const [laLiga, setLaLiga] = useState([])
  const [checked, setChecked] = useState(false);
  const [amount, setAmount] = useState(null)
  const [dragIntensities, setDragIntensities] = useState(
    Array(selectedBet.length).fill(0)
  );
  
  const handleRemoveBet = (index) => {
    setSelectedBet((prevBets) => prevBets.filter((_, i) => i !== index));
    setDragIntensities((prevIntensities) =>
      prevIntensities.filter((_, i) => i !== index)
    );
  };

  const handleDrag = (index, distance) => {
    // Calculate intensity based on drag distance (between 0 and 1)
    const intensity = Math.min(Math.abs(distance) / (window.innerWidth * 0.4), 1);

    // Update the drag intensity of the specific item
    setDragIntensities((prevIntensities) => {
      const updatedIntensities = [...prevIntensities];
      updatedIntensities[index] = intensity;
      return updatedIntensities;
    });
  };

  const handleDragEnd = (index, distance) => {
    if (Math.abs(distance) > window.innerWidth * 0.4) {
      handleRemoveBet(index); // Remove the item if dragged far enough
    } else {
      // Reset intensity to 0 for this item if not removed
      setDragIntensities((prevIntensities) => {
        const updatedIntensities = [...prevIntensities];
        updatedIntensities[index] = 0;
        return updatedIntensities;
      });
    }
  };


  const getWinOrLost = async (status) => {
    setLoadingBets(true)
    const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', status);
  
        if (error) {
          console.error('Error retrieving data from Supabase:', error.message);
        }
        if(data){
          console.log(data)
          const updatedBets = data.map(bet => ({
            ...bet,
            bet: bet.bet.map(matchBet => {
              const fixtureId = matchBet.match.fixture.id;
              const league = matchBet.match.league.name;
        
              // Fetch matches for the league from local storage
              const matches = JSON.parse(localStorage.getItem(league));
        
              // Find and update the matching match with its goals
              const matchedGame = matches?.find(match => match.fixture.id === fixtureId);
              if (matchedGame) {
                
                return {
                  ...matchBet,
                  match: {
                    ...matchBet.match,
                    goals: matchedGame.goals,
                    teams: matchedGame.teams,
                    fixture: matchedGame.fixture
                  },
                };
              }
              return matchBet; // Return unchanged if no match found
            })
          }));
          updatedBets.forEach(bet => {
            bet.bet.forEach(matchBet => {
              const isFulfilled = isBetFulfilled(matchBet);
              
              // Optionally update the bet object with the result
              matchBet.isWinningBet = isFulfilled;
            });
            
          });
          setWinOrLostBets(updatedBets)
          setLoadingBets(false)
        }
  }

  const getBets = async () => {
    setLoadingBets(true)
    if(user){
      const { data, error } = await supabase
          .from('bets')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', "Pending");
        if (error) {
          console.error('Error retrieving data from Supabase:', error.message);
        }
        if(data){
          setMyBets(data)
          setLoadingBets(false)
        }
    }
  }
  
  function isBetFulfilled(bet) {
    
    const { name, value, match } = bet;
    const { home, away } = match.goals;
    const halfHome = match.score.halftime.home
    const halfAway = match.score.halftime.away
    const secondHome = home - halfHome
    const secondAway = away - halfAway
    const total = home + ":" + away
    const totalHalf = halfHome + ":" + halfAway
    const totalSecond = secondHome + ":" + secondAway
    if (name === "Match Winner" && value === "Home") {
      return home > away;
  } else if (name === "Match Winner" && value === "Away") {
      return away > home;
  } else if (name === "Match Winner" && value === "Draw") {
      return home === away;
  } else if (name === "Home/Away" && value === "Home") {
      return null;
  } else if (name === "Home/Away" && value === "Away") {
      return null;
  } else if (name === "Second Half Winner" && value === "Home") {
      return secondHome > secondAway;
  } else if (name === "Second Half Winner" && value === "Away") {
      return secondAway > secondHome;
  } else if (name === "Second Half Winner" && value === "Draw") {
      return secondHome === secondAway;
  } else if (name === "Goals Over/Under First Half" && value.startsWith("Over")) {
      return halfHome + halfAway > parseInt(value.replace("Over", "").trim());
  } else if (name === "Goals Over/Under First Half" && value.startsWith("Under")) {
      return halfHome + halfAway < parseInt(value.replace("Under", "").trim());
  } else if (name === "Goals Over/Under - Second Half" && value.startsWith("Over")) {
      return secondHome + secondAway > parseInt(value.replace("Over", "").trim());
  } else if (name === "Goals Over/Under - Second Half" && value.startsWith("Under")) {
      return secondHome + secondAway < parseInt(value.replace("Under", "").trim());
  } else if (name === "Both Teams Score" && value === "Yes") {
      return home > 0 && away > 0;
  } else if (name === "Both Teams Score" && value === "No") {
      return home === 0 || away === 0;
  } else if (name === "Both Teams Score - First Half" && value === "Yes") {
      return halfHome > 0 && halfAway > 0;
  } else if (name === "Both Teams Score - First Half" && value === "No") {
      return halfHome === 0 || halfAway === 0;
  } else if (name === "Both Teams To Score - Second Half" && value === "Yes") {
      return secondHome > 0 && secondAway > 0;
  } else if (name === "Both Teams To Score - Second Half" && value === "No") {
      return secondHome === 0 || secondAway === 0;
  } else if (name === "Win to Nil - Home" && value === "Yes") {
      return home > away && away === 0;
  } else if (name === "Win to Nil - Home" && value === "No") {
      return away > 0;
  } else if (name === "Win to Nil - Away" && value === "Yes") {
      return away > home && home === 0;
  } else if (name === "Win to Nil - Away" && value === "No") {
      return home > 0;
  } else if (name === "Win to Nil" && value === "Home") {
      return home > away && away === 0;
  } else if (name === "Win to Nil" && value === "Away") {
      return away > home && home === 0;
  } else if (name === "Exact Score") {
      return total === value;
  } else if (name === "Correct Score - First Half") {
      return totalHalf === value;
  } else if (name === "Correct Score - Second Half") {
      return totalSecond === value;
  } else if (name === "Highest Scoring Half" && value === "1st Half") {
      return halfHome + halfAway > secondHome + secondAway;
  } else if (name === "Highest Scoring Half" && value === "2nd Half") {
      return secondHome + secondAway > halfHome + halfAway;
  } else if (name === "Highest Scoring Half" && value === "Draw") {
      return secondHome + secondAway === halfHome + halfAway;
  } else if (name === "Double Chance" && value === "Home/Draw") {
      return home > away || home === away;
  } else if (name === "Double Chance" && value === "Home/Away") {
      return home > away || away > home;
  } else if (name === "Double Chance" && value === "Draw/Away") {
      return home === away || away > home;
  } else if (name === "Double Chance - First Half" && value === "Home/Draw") {
      return halfHome > halfAway || halfHome === halfAway;
  } else if (name === "Double Chance - First Half" && value === "Home/Away") {
      return halfAway > halfHome || halfHome > halfAway;
  } else if (name === "Double Chance - First Half" && value === "Draw/Away") {
      return halfHome === halfAway || halfAway > halfHome;
  } else if (name === "Double Chance - Second Half" && value === "Home/Draw") {
      return secondHome > secondAway || secondHome === secondAway;
  } else if (name === "Double Chance - Second Half" && value === "Home/Away") {
      return secondHome === secondAway || secondAway === secondHome;
  } else if (name === "Double Chance - Second Half" && value === "Draw/Away") {
      return secondHome === secondAway || secondAway > secondHome;
  } else if(name === "Results/Both Teams Score" && value === "Home/Yes"){
    return(home > away && away > 0)
  } else if(name === "Results/Both Teams Score" && value === "Draw/Yes"){
    return(home === away && away > 0 && home > 0)
  } else if(name === "Results/Both Teams Score" && value === "Away/Yes"){
    return(away > home && home > 0)
  } else if(name === "Win Both Halves" && value === "Home"){
    return(halfHome > halfAway && secondHome > secondAway)
  } else if(name === "Win Both Halves" && value === "Away"){
    return(halfAway > halfHome && secondAway > secondHome)
  } else {
      return false;
  }
  }

  const getName = (name, value, match) => {
    if(name === "Match Winner" && value === "Home") return `${match.teams.home.name} wins to ${match.teams.away.name}`
    if(name === "Match Winner" && value === "Away") return `${match.teams.away.name} wins to ${match.teams.home.name}`
    if(name === "Match Winner" && value === "Draw") return `${match.teams.home.name} draws with ${match.teams.away.name}`
    if(name === "Home/Away" && value === "Home") return `${match.teams.home.name} wins to ${match.teams.away.name}`
    if(name === "Home/Away" && value === "Away") return `${match.teams.away.name} wins to ${match.teams.home.name}`
    if(name === "Second Half Winner" && value === "Home") return `${match.teams.home.name} wins second half`
    if(name === "Second Half Winner" && value === "Away") return `${match.teams.away.name} wins second half`
    if(name === "Second Half Winner" && value === "Draw") return `Second half ends in draw`
    if(name === "Goals Over/Under First Half" && value.startsWith("Over")) return `First half ${value} goals`
    if(name === "Goals Over/Under First Half" && value.startsWith("Under")) return `First half ${value} goals`
    if(name === "Goals Over/Under - Second Half" && value.startsWith("Over")) return `Second half ${value} goals`
    if(name === "Goals Over/Under - Second Half" && value.startsWith("Under")) return `Second half ${value} goals`
    if(name === "Both Teams Score" && value === "Yes") return `${match.teams.home.name} & ${match.teams.away.name} both score`
    if(name === "Both Teams Score - First Half" && value === "Yes") return `${match.teams.home.name} & ${match.teams.away.name} both score on 1st half`
    if(name === "Both Teams To Score - Second Half" && value === "Yes") return `${match.teams.home.name} & ${match.teams.away.name} both score on 2nd half`
    if(name === "Both Teams Score" && value === "No") return `${match.teams.home.name} & ${match.teams.away.name} both not score`
    if(name === "Both Teams Score - First Half" && value === "No") return `${match.teams.home.name} & ${match.teams.away.name} both not score on 1st Half`
    if(name === "Both Teams To Score - Second Half" && value === "No") return `${match.teams.home.name} & ${match.teams.away.name} both not score on 2nd Half`
    if(name === "Win to Nil - Home" && value === "Yes") return `${match.teams.home.name} wins to nill`
    if(name === "Win to Nil" && value === "Home") return `${match.teams.home.name} wins to nill`
    if(name === "Win to Nil - Home" && value === "No") return `${match.teams.home.name} does not win to nill`
    if(name === "Win to Nil - Away" && value === "Yes") return `${match.teams.away.name} wins to nill`
    if(name === "Win to Nil" && value === "Away") return `${match.teams.away.name} wins to nill`
    if(name === "Win to Nil - Away" && value === "No") return `${match.teams.away.name} does not win to nill`
    if(name === "Exact Score") return `Exact Score: ${value}`
    if(name === "Highest Scoring Half" && value === "1st Half") return `More goals on 1st half`
    if(name === "Highest Scoring Half" && value === "2nd Half") return `More goals on 2nd half`
    if(name === "Highest Scoring Half" && value === "Draw") return `Same goals on both halves`
    if(name === "Correct Score - First Half") return `Correct Score on First Half: ${value}`
    if(name === "Correct Score - Second Half") return `Correct Score on Second Half: ${value}`
    if(name === "Double Chance" && value === "Home/Draw") return `${match.teams.home.name} wins or draws`
    if(name === "Double Chance - First Half" && value === "Home/Draw") return `${match.teams.home.name} wins or draws on 1st half`
    if(name === "Double Chance - Second Half" && value === "Home/Draw") return `${match.teams.home.name} wins or draws on 2nd half`
    if(name === "Double Chance" && value === "Home/Away") return `${match.teams.home.name} or ${match.teams.away.name} wins`
    if(name === "Double Chance - First Half" && value === "Home/Away") return `${match.teams.home.name} or ${match.teams.away.name} wins on 1st half`
    if(name === "Double Chance - Second Half" && value === "Home/Away") return `${match.teams.home.name} or ${match.teams.away.name} wins on 2nd half`
    if(name === "Double Chance" && value === "Draw/Away") return `${match.teams.away.name} wins or draws`
    if(name === "Double Chance - First Half" && value === "Draw/Away") return `${match.teams.away.name} wins or draws on 1st half`
    if(name === "Double Chance - Second Half" && value === "Draw/Away") return `${match.teams.away.name} wins or draws on 2nd half`
    if(name === "First Half Winner" && value === "Home") return `${match.teams.home.name} wins 1st Half`
    if(name === "First Half Winner" && value === "Away") return `${match.teams.away.name} wins 1st Half`
    if(name === "First Half Winner" && value === "Draw") return `1st Half ends in draw`
    if(name === "Win Both Halves" && value === "Home") return `${match.teams.home.name} wins both halves`
    if(name === "Win Both Halves" && value === "Away") return `${match.teams.away.name} wins both halves`
    if(name === "Odd/Even" && value === "Odd") return `Odd number of goals in the match`
    if(name === "Odd/Even - First Half" && value === "Odd") return `Odd number of goals in the 1st half`
    if(name === "Odd/Even - First Half" && value === "Even") return `Even number of goals in the 1st half`
    if(name === "Odd/Even - Second Half" && value === "Odd") return `Odd number of goals in the 2nd half`
    if(name === "Odd/Even - Second Half" && value === "Even") return `Even number of goals in the 2nd half`
    if(name === "Odd/Even" && value === "Even") return `Even number of goals in the match`
    if(name === "Home win both halves" && value === "Yes") return `${match.teams.home.name} wins both halves`
    if(name === "Home win both halves" && value === "No") return `${match.teams.home.name} does not win both halves`
    if(name === "Away win both halves" && value === "Yes") return `${match.teams.away.name} wins both halves`
    if(name === "Away win both halves" && value === "No") return `${match.teams.away.name} does not win both halves`
    if(name === "Exact Goals Number" && value === 0) return `0 goals in the game`
    if(name === "Exact Goals Number" && value === 1) return `1 goal in the game`
    if(name === "Exact Goals Number" && value === 2) return `2 goals in the game`
    if(name === "Exact Goals Number" && value === 3) return `3 goals in the game`
    if(name === "Exact Goals Number" && value === 4) return `4 goals in the game`
    if(name === "Exact Goals Number" && value === 5) return `5 goals in the game`
    if(name === "Exact Goals Number" && value === 'more 6') return `6 or more goals in the game`
    if(name === "To Win Either Half" && value === 'Home') return `${match.teams.home.name} wins either half`
    if(name === "To Win Either Half" && value === 'Away') return `${match.teams.away.name} wins either half`
    if(name === "Home Team Exact Goals Number" && value === 0) return `${match.teams.home.name} scores 0 goals in the match`
    if(name === "Home Team Exact Goals Number" && value === 1) return `${match.teams.home.name} scores 1 goal in the match`
    if(name === "Home Team Exact Goals Number" && value === 2) return `${match.teams.home.name} scores 2 goals in the match`
    if(name === "Home Team Exact Goals Number" && value === 3) return `${match.teams.home.name} scores 3 goals in the match`
    if(name === "Home Team Exact Goals Number" && value === "4 more") return `${match.teams.home.name} scores 4 goals or more in the match`
    if(name === "Second Half Exact Goals Number" && value === 0) return `0 goals in the second half`
    if(name === "Second Half Exact Goals Number" && value === 1) return `1 goal in the second half`
    if(name === "Second Half Exact Goals Number" && value === 2) return `2 goals in the second half`
    if(name === "Second Half Exact Goals Number" && value === 3) return `3 goals in the second half`
    if(name === "Second Half Exact Goals Number" && value === "4 more") return `4 goals or more in the second half`
    if(name === "Away Team Exact Goals Number" && value === 0) return `${match.teams.away.name} scores 0 goals in the match`
    if(name === "Away Team Exact Goals Number" && value === 1) return `${match.teams.away.name} scores 1 goal in the match`
    if(name === "Away Team Exact Goals Number" && value === 2) return `${match.teams.away.name} scores 2 goals in the match`
    if(name === "Away Team Exact Goals Number" && value === 3) return `${match.teams.away.name} scores 3 goals in the match`
    if(name === "Away Team Exact Goals Number" && value === "4 more") return `${match.teams.away.name} scores 4 goals or more in the match`
    if(name === "Exact Goals Number - First Half" && value === 0) return `0 goals in the first half`
    if(name === "Exact Goals Number - First Half" && value === 1) return `1 goal in the first half`
    if(name === "Exact Goals Number - First Half" && value === 2) return `2 goals in the first half`
    if(name === "Exact Goals Number - First Half" && value === 3) return `3 goals in the first half`
    if(name === "Exact Goals Number - First Half" && value === "4 more") return `4 goals or more in the first half`
    if(name === "Results/Both Teams Score" && value === "Home/Yes") return `${match.teams.home.name} wins both teams score`
    if(name === "Results/Both Teams Score" && value === "Draw/Yes") return `Draw & both teams score`
    if(name === "Results/Both Teams Score" && value === "Away/Yes") return `${match.teams.away.name} wins both teams score`
    if(name === "Home Team Score a Goal" && value === "Yes") return `${match.teams.home.name} scores`
    if(name === "Home Team Score a Goal" && value === "No") return `${match.teams.home.name} does not score`
    if(name === "Away Team Score a Goal" && value === "Yes") return `${match.teams.away.name} scores`
    if(name === "Away Team Score a Goal" && value === "No") return `${match.teams.away.name} does not score`
    if(name === "Home team will score in both halves" && value === "Yes") return `${match.teams.home.name} scores in both halves`
    if(name === "Home team will score in both halves" && value === "No") return `${match.teams.home.name} does not score in both halves`
    if(name === "Away team will score in both halves" && value === "Yes") return `${match.teams.away.name} scores in both halves`
    if(name === "Away team will score in both halves" && value === "No") return `${match.teams.away.name} does not score in both halves`
    
    return ''
};
  


const checkBets = async () => {
  if (myBets) {
    // Iterate over each bet
    for (const bet of myBets) {
      
      let allMatchesStarted = true; // Flag to check if all matches in this bet have started
      let hasPostponedMatch = false;
      // Iterate over each match in the bet
      for (const matchBet of bet.bet) {
        const matchId = matchBet.match.fixture.id;
        
        
        // Fetch the match data
        const options = {
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
          params: { id: matchId },
          headers: {
            'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
          },
        };

        try {
          // Fetch the match data from the API
          const response = await axios.request(options);
          
          const matchData = response.data.response[0]; // Assuming the response structure

          // Extract the relevant match data to update
          const { goals, fixture, score, events } = matchData;
          
          
          // Update the matchBet object with the fetched data
          matchBet.match.goals = goals;
          matchBet.match.fixture = fixture;
          matchBet.match.score = score;
          //matchBet.events = events;  // Add the events field
          
          // Check if the match has started
          if (fixture.status.short === 'PST') {
            hasPostponedMatch = true;
            matchBet.isPostponed = true; // Mark the match as postponed
            matchBet.isWinningBet = true
          } else if (fixture.status.short !== 'FT') {
            allMatchesStarted = false;
            break;
          }
        } catch (error) {
          console.error('Error fetching match data:', error);
          allMatchesStarted = false; // If there’s an error, assume the match is not ready
          break;
        }
      }

      // If all matches have started, proceed with the next function
      if (hasPostponedMatch) {
        // Handle postponed matches in the bet
        console.log(bet)
        await handlePostponedBet(bet);
      } else if (allMatchesStarted) {
        proceedWithBet(bet);
      } else {
        console.log('Skipping bet because not all matches have started');
      }
    }
  }
};

console.log(myBets)

const handlePostponedBet = async (bet) => {
  console.log('Handling postponed matches for bet:', bet.id);
  console.log('myBets1:', myBets);
  const postponedMatches = bet.bet.filter((match) => match.isPostponed);
  console.log(`Postponed matches for bet ${bet.id}:`, postponedMatches);

  // Filter out postponed matches
  const activeMatches = bet.bet.filter((match) => !match.isPostponed);
  
  // Recalculate odds based on remaining matches
  const recalculatedOdds = activeMatches.reduce((acc, match) => acc * match.odd, 1);
  bet.possibleWinnings = recalculatedOdds * bet.amount;
  
  console.log('bet:', bet);
  if (activeMatches.length > 0) {
    proceedWithPostponedBet(bet,activeMatches);
  } else {
    console.log(`No active matches left for bet ${bet.id}, skipping calculation.`);
    console.log(bet)
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      if (error) {
        console.error('Error inserting/updating user session data:', error.message)
      } else {
        console.log(data[0])
        console.log(bet)
        const newBalance = data[0].appBalance + bet.amount
        console.log(newBalance)
        setBalance((prev) => prev + bet.amount)
        const { error: firstError } = await supabase
          .from('bets')
          .update({ status: 'Cancelled', bet: bet.bet })
          .eq('id', bet.id)
          if (firstError) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            const { error: secondError } = await supabase
              .from('users')
              .update({ appBalance: newBalance })
              .eq('id', user.id)
              if (secondError) {
                console.error('Error inserting/updating user session data:', error.message)
              } else {
                message.success("Your bet has been returned!")
            }
            
          }
       }
    
  }
}

const proceedWithPostponedBet = async (bet,activeMatches) => {
  
  activeMatches.map((el) => {
    const isFulfilled = isBetFulfilled(el);
      el.isWinningBet = isFulfilled;
  })
  console.log(`activeMatches2 for bet ${bet.id}:`, activeMatches);
  console.log(` bet ${bet.id}:`, bet);
  const allBetsFulfilled = bet.bet.every((el) => el.isWinningBet === true);
  if (allBetsFulfilled) {
    console.log(bet)
    const winnings = bet.possibleWinnings
    const amount = bet.amount
    let result = bet.bet.map((match, index) => {
      console.log(match)
      return `\n${match.match.teams.home.name} vs ${match.match.teams.away.name}\nOdds: ${match.odd}\nResult: ${match.name} - ${match.value} ${match.isPostponed === true ? `\n(MATCH POSTPONED - Skipped from bet)` : "✅"}`;
  }).join("\n");
  
  const messageToSend = `${user.user_metadata.name} has won a bet! 🎉🎉🎉 \n ${result} \n\nAmount: ${amount} PGZ \nWinnings: ${winnings} PGZ !!!`
  console.log(messageToSend)
  const imageUrl = "https://i.postimg.cc/xd1JfnGL/Apuestas-de-Futbol-1220x600.webp"
  try {
      
    const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend, imageUrl });
    
    if (response.data.success) {
      console.log('Message sent successfully!');
    } else {
      console.log('Failed to send message');
    }
  } catch (error) {
    console.log('Error sending message', error);
  }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      if (error) {
        console.error('Error inserting/updating user session data:', error.message)
      } else {
        console.log(data[0])
        console.log(bet)
        const newBalance = data[0].appBalance + bet.possibleWinnings
        console.log(newBalance)
        setBalance((prev) => prev + bet.possibleWinnings)
        const { error: firstError } = await supabase
          .from('bets')
          .update({ status: 'Won', bet: bet.bet, possibleWinnings: bet.possibleWinnings })
          .eq('id', bet.id)
          if (firstError) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            const { error: secondError } = await supabase
              .from('users')
              .update({ appBalance: newBalance })
              .eq('id', user.id)
              if (secondError) {
                console.error('Error inserting/updating user session data:', error.message)
              } else {
                message.success("You have won one bet 🤑")
            }
            
          }
       }
  } else {
    console.log("bet lostttttt")
    const { error: firstError } = await supabase
          .from('bets')
          .update({ status: 'Lost', bet: bet.bet })
          .eq('id', bet.id)
          if (firstError) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            message.error("You have lost one bet 😢")
          }
  }
}

// Example of the function to proceed with the bet
const proceedWithBet = async (bet) => {
  console.log('All matches have started for this bet:', bet);
  //message.warning("Some of your bets are being calculated ⏳")
  console.log('All matches have started for this bet:', bet);
  bet.bet.map((el) => {
        const isFulfilled = isBetFulfilled(el);
        el.isWinningBet = isFulfilled;
  })
  const allBetsFulfilled = bet.bet.every((el) => el.isWinningBet === true);
  // Add your logic to process the bet here
  if (allBetsFulfilled) {
    console.log(bet)
    const winnings = bet.possibleWinnings
    const amount = bet.amount
    let result = bet.bet.map((match, index) => {
      return `\n${match.match.teams.home.name} vs ${match.match.teams.away.name}\nOdds: ${match.odd}\nResult: ${match.name} - ${match.value} ✅`;
  }).join("\n");
  
  const messageToSend = `${user.user_metadata.name} has won a bet! 🎉🎉🎉 \n ${result} \n\nAmount: ${amount} PGZ \nWinnings: ${winnings} PGZ !!!`
  console.log(messageToSend)
  const imageUrl = "https://i.postimg.cc/xd1JfnGL/Apuestas-de-Futbol-1220x600.webp"
  try {
      
    const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend, imageUrl });
    
    if (response.data.success) {
      console.log('Message sent successfully!');
    } else {
      console.log('Failed to send message');
    }
  } catch (error) {
    console.log('Error sending message', error);
  }
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      if (error) {
        console.error('Error inserting/updating user session data:', error.message)
      } else {
        console.log(data[0])
        console.log(bet)
        const newBalance = data[0].appBalance + bet.possibleWinnings
        console.log(newBalance)
        setBalance((prev) => prev + bet.possibleWinnings)
        const { error: firstError } = await supabase
          .from('bets')
          .update({ status: 'Won', bet: bet.bet })
          .eq('id', bet.id)
          if (firstError) {
            console.error('Error inserting/updating user session data:', error.message)
          } else {
            const { error: secondError } = await supabase
              .from('users')
              .update({ appBalance: newBalance })
              .eq('id', user.id)
              if (secondError) {
                console.error('Error inserting/updating user session data:', error.message)
              } else {
                message.success("You have won one bet 🤑")
            }
            
          }
       }
  } else {
    console.log(bet)
      const { data, error } = await supabase
      .from('bets')
      .update({ status: 'Lost', bet: bet.bet })
      .eq('id', bet.id)
      if (error) {
        console.error('Error inserting/updating user session data:', error.message)
      } else {
        console.log(`Status changed for bet ${bet.id}`)
        message.error("You have lost one bet 😢")
      }
  }
};


  useEffect(() => {
    getBets();
  }, [user])

  useEffect(() => {
    if(openLostBetsMenu){
      getWinOrLost("Lost");
    }
  }, [openLostBetsMenu])

  useEffect(() => {
    if(openWonBetsMenu){
      getWinOrLost("Won");
    }
  }, [openWonBetsMenu])

  useEffect(() => {
    if(myBets){
      checkBets();
      console.log(myBets)
    }
  }, [myBets])


  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };
  
  

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
  const openTeamMenu = (id) => {
    setActiveTeamId(id)
    setSelectedTeamMenu(true)
  }
  const openPlayerStatsMenu = (player) => {
    setPlayerToUpdate(player)
    setSelectedPlayerMenu(true)
}
  const closeDate = () => {
    setIsDateExpanded((prev) => !prev);
  }

  const closeSendOdds = () => {
    setOpenCurrentMenu(false)
    setTimeout(() => {
      setSelectedOddsMenu(!selectedOddsMenu)
    }, 500)
  }
  const startAll = (league) => {
    setOpenMatchesMenu(false)
    setOpenLiveMatchesMenu(false)
    setOpenCurrentMenu(false)
    setOpenMyBetsMenu(false)
    setOpenLiveBetMenu(false)
    setOpenLostBetsMenu(false)
    setOpenWonBetsMenu(false)
   setCurrentRoundMatches([])
   setCurrentRoundMatches([])
   setActiveLeague("Premier League")
    setTimeout(() => {
      setOpenLeagueMenu(true); 
    }, 500)
  }
  const openCurrentBet = () => {
    setOpenLeagueMenu(false); 
    
    setOpenMyBetsMenu(false)
    setOpenMatchesMenu(false)
    setOpenLiveMatchesMenu(false)
    setOpenWonBetsMenu(false)
    setOpenLostBetsMenu(false)
    setOpenLiveBetMenu(false)
    setTimeout(() => {
      setCheckedMultiple(false)
      setOpenCurrentMenu(true)
    }, 500)
  }
  const openLiveMatches = () => {
    setOpenLeagueMenu(false); 
    setOpenMyBetsMenu(false)
    setOpenMatchesMenu(false)
    setOpenCurrentMenu(false)
    setOpenWonBetsMenu(false)
    setOpenLostBetsMenu(false)
    setOpenLiveBetMenu(false)
    setTimeout(() => {
      setOpenLiveMatchesMenu(true)
    }, 500)
  }
  const openLiveBet = () => {
    setOpenLeagueMenu(false); 
    setOpenMyBetsMenu(false)
    setOpenMatchesMenu(false)
    setOpenCurrentMenu(false)
    setOpenWonBetsMenu(false)
    setOpenLostBetsMenu(false)
    setOpenLiveMatchesMenu(false)
    setTimeout(() => {
      setOpenLiveBetMenu(true)
    }, 500)
  }

  const closeLiveBet = () => {
    setHeadToHead([])
    setSelectedFixture([])
    setOpenLiveBetMenu(false)
    setTimeout(() => {
      setOpenMatchesMenu(true)
    }, 500)
  }

  const handleSwitchMultiple = (e) => {
    setCheckedMultiple(e.target.checked);
    setOpenCurrentMenu(false)
    setTimeout(() => {
      setOpenMatchesMenu(true)
    }, 500)
  }
  const openBets = () => {
    setActiveLeague(null)
    setOpenLeagueMenu(false)
    setWinOrLostBets([])
    setOpenMatchesMenu(false)
    setOpenWonBetsMenu(false)
    setOpenLiveBetMenu(false)
    setOpenCurrentMenu(false)
    setOpenLiveMatchesMenu(false)
    setOpenLostBetsMenu(false)
    setTimeout(() => {
      setOpenMyBetsMenu(true)
    }, 500)
  }
  const openWonBets = () => {
    setOpenLeagueMenu(false); 
    setWinOrLostBets([])
    setOpenMatchesMenu(false)
    setOpenCurrentMenu(false)
    setOpenLiveBetMenu(false)
    setOpenMyBetsMenu(false)
    setOpenLostBetsMenu(false)
    setTimeout(() => {
      setOpenWonBetsMenu(true)
    }, 500)
  }
  const openLostBets = () => {
    setOpenLeagueMenu(false); 
    setOpenMatchesMenu(false)
    setWinOrLostBets([])
    setOpenWonBetsMenu(false)
    setOpenLiveBetMenu(false)
    setOpenCurrentMenu(false)
    setOpenMyBetsMenu(false)
    setTimeout(() => {
      setOpenLostBetsMenu(true)
    }, 500)
  }

  const closeBet = () => {
    setActiveLeague("Premier League")
    setOpenWonBetsMenu(false)
    setOpenLostBetsMenu(false)
    setOpenCurrentMenu(false)
    setOpenLiveBetMenu(false)
    setOpenMyBetsMenu(false)
    setTimeout(() => {
      setOpenLeagueMenu(true)
    }, 500)
  }

  const getAllLiveMatches = async () => {
    setLoadingLiveMatches(true)
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: {live: 'all'},
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      //console.log(response.data);
      const data = (response.data.response) 
      const matches = []
      data.forEach((match) => {
        matches.push(match)
        /* if(match.league.id === 39 || match.league.id === 140 || match.league.id === 135 || match.league.id === 61 || match.league.id === 78){
          matches.push(match)
        } */
      })
      setCurrentLiveMatches(matches)
      setLoadingLiveMatches(false)
    } catch (error) {
      console.error(error);
    }
  }

  const fetchCurrentMatches = async () => {
    console.log("fetching matches")
    console.log(activeLeagueId)
    console.log(activeRound)
    let round
    if(activeLeagueId === 2 || activeLeagueId === 848 || activeLeagueId === 3 ){
      round = `League Stage - ${activeRound}`
    } else if(activeLeagueId === 45){
      round = `${activeRound}rd Round`
    } else if (activeLeagueId === 143){
        round = `${activeRound}nd Round`
    } else if (activeLeagueId === 137 || activeLeagueId === 81){
      round = `Round of ${activeRound}`
  } else {
      round = `Regular Season - ${activeRound}`
    }
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: {
        league: activeLeagueId,
        season: '2024',
        round: round
      },
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    try {
      const response = await axios.request(options);
      setCurrentRoundMatches(response.data.response);
      console.log(response.data.response)
    } catch (error) {
      console.error(error);
    }
  }

  const handleButtonClick = (league) => {
    setExpandedIndex(null)
    console.log(league)
    setActiveLeagueId(league.id)
    setActiveLeague(league.league)
    setActiveRound(league.currentRound)
    setOpenLeagueMenu(false)
    setTimeout(() => {
      setOpenMatchesMenu(true)
    })
  };

  console.log(activeRound)

useEffect(() => {
  if (activeRound) {
      fetchCurrentMatches(activeRound); 
  }
}, [activeRound]);

  useEffect(() => {
    if(openLiveMatchesMenu){
      getAllLiveMatches();
    }
  }, [openLiveMatchesMenu])
  useEffect(() => {
    if(activeLeagueId){
      fetchCurrentMatches();
    }
  }, [activeLeagueId])

  const raiseRound = () => {
    setCurrentRoundMatches([])
    setActiveRound((prevRound) => prevRound + 1)
  }
  const lowRound = () => {
      setCurrentRoundMatches([])
      setActiveRound((prevRound) => prevRound - 1)
  }

  const setOpenLeague = (league) => {
    setActiveLeagueId(league.id)
    setLeagueStatsMenu(true)
  }

  const getURL = (betType, match) => {
    if(betType === "home") return match.teams.home.logo
    if(betType === "away") return match.teams.away.logo
    if(betType === "awayOver2") return match.teams.away.logo
    if(betType === "awayUnder2") return match.teams.away.logo
    if(betType === "awayBTTS") return match.teams.away.logo
    if(betType === "awayBTNTS") return match.teams.away.logo
    if(betType === "awayMinus1") return match.teams.away.logo
    if(betType === "homeOver2") return match.teams.home.logo
    if(betType === "homeBTTS") return match.teams.home.logo
    if(betType === "homeUnder2") return match.teams.home.logo
    if(betType === "homeBTNTS") return match.teams.home.logo
    if(betType === "homeMinus1") return match.teams.home.logo
    return ''
};




const getWinnings = (el) => {
  if(el.isWinningBet === true){
    return <TickAnimation />
  }
  if(el.isWinningBet === false){
    return <CrossAnimation />
  }
  return ''
  }

  

  const handleBetClick = (match, name, value, odd, filter) => {
    console.log(match)
    console.log(name)
    console.log(value)
    console.log(odd)
    if(filter !== undefined){
      message.error("You can not bet on the same event twice! ❌")
      return
    } else {
      setSelectedBet((prevBets) => {
        const isAlreadySelected = prevBets.some(
          (bet) => bet.match.fixture.id === match.fixture.id && bet.name === name
        );
        
        if (isAlreadySelected) {
          return prevBets.filter(
            (bet) => !(bet.match.fixture.id === match.fixture.id && bet.name === name)
          );
        } else {
          setOpenMatchesMenu(false)
          setExpandedIndex(null)
          setTimeout(() => {
            setOpenCurrentMenu(true)
          }, 500)
          return [...prevBets, { match, name, value, odd }];
        }
      });
    }
  };


  const calculateTotalWinnings = () => {
      const totalOdds = selectedBet.reduce((accumulator, currentBet) => {
        return accumulator * parseFloat(currentBet.odd);
    }, 1); // Initial value is 1 for multiplication

    // Calculate total winnings
    const totalWinnings = totalOdds * amount;
    return parseFloat(totalWinnings).toFixed(2);
    }; 

  const handleSwitchSendBet = async (event) => {
    console.log(selectedBet)
    const winnings = calculateTotalWinnings();
    
    let result = selectedBet.map((match, index) => {
      let league
            if(match.match.league.name === "Premier League"){
                league = "🇬🇧"
            }
            if(match.match.league.name === "La Liga"){
                league = "🇪🇸"
            }
            if(match.match.league.name === "Serie A"){
                league = "🇮🇹"
            }
            if(match.match.league.name === "Bundesliga"){
                league = "🇩🇪"
            }
            if(match.match.league.name === "Ligue 1"){
                league = "🇫🇷"
            }
            if(match.league.name === "UEFA Champions League" || match.league.name === "UEFA Europa League"){
                league = "🇪🇺"
            }
      return `\n${league} ${match.match.teams.home.name} vs ${match.match.teams.away.name}\nOdds: ${match.odd}\nResult: ${match.name} - ${match.value}`;
  }).join("\n");
  const imageUrl = "https://i.postimg.cc/4x16yPYt/bet.jpg"
  const messageToSend = `${user.user_metadata.name} has placed a bet! \n ${result} \n\nAmount: ${amount} PGZ \nPossible Winnings: ${winnings} PGZ`
  console.log(messageToSend)
  console.log(messageToSend);
    if(amount === null){
      message.error("You must enter the amount of the bet!")
      return
    }
    if(amount > balance){
      message.error("You don't have enough balance to place this bet!")
      return
    }
    //setPendingBets((prevBets) => prevBets + 1)

    console.log(winnings)
    setChecked(event.target.checked);
    const updatedData = {
      email: user.email,
      name: user.user_metadata.full_name,
      user_id: user.id,
      bet: selectedBet,
      amount: amount,
      user_avatar: user.user_metadata.avatar_url,
      possibleWinnings: winnings,
      status: "Pending"
    }
    setBalance((prevBal) => prevBal - amount)
    const newBalance = balance - amount
    const {data:setData, error: setError} = await supabase
    .from('users')
      .select('wagerBalance')
      .eq('id', user.id)
      if(setError){
        console.log(setError)
      } else {
        console.log("shitty data:", setData)
        const wager = setData[0].wagerBalance
        const newWager = +wager + +amount;
        console.log(newWager)
        
        const { data: firstData, error: firstError } = await supabase
        .from('users')
        .update({appBalance: newBalance, wagerBalance: newWager})
        .eq('id', user.id)
        if (firstError) {
          console.error('Error inserting/updating user session data:', firstError.message)
        } else {
          console.log('User balance data saved:', firstData)
          const { data, error } = await supabase
      .from('bets')
      .insert([updatedData])
      if (error) {
        console.error('Error inserting/updating user session data:', error.message)
      } else {
        console.log('User session data saved:', data)
        setOpenCurrentMenu(false)
        setSelectedBet([])
        setAmount(null)
        getBets();
        message.success("You have placed your bet. Good luck!🤞")
        try {
      
          const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend,imageUrl });
          
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
        
        setOpenCurrentMenu(false)
        setTimeout(() => {
          setOpenLeagueMenu(true)
          setChecked(false)
        }, 500)
      }
  };

  const getOddsFromBooker = async () => {
    if(fixtureId !== null){
      console.log(fixtureId)
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/odds',
        params: {fixture: fixtureId},
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      
      try {
        const response = await axios.request(options);
        console.log(response)
        setLiveOdds(response.data.response[0].bookmakers[2].bets);
      } catch (error) {
        console.error(error);
      }
    }
  }

  const getHeadToHead = async (homeId, awayId) => {
    console.log(homeId, awayId)
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/headtohead',
      params: {h2h: `${homeId}-${awayId}`},
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data.response);
      setHeadToHead(response.data.response)
    } catch (error) {
      console.error(error);
    }
  }

  const getMatchStats = async (id) => {
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
      params: {id: id},
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      setSelectedFixture(response.data.response);
    } catch (error) {
      console.error(error);
    }
  }


  useEffect(() => {
    getOddsFromBooker();
  }, [fixtureId])

  const fetchNews = async () => {
    const { data, error } = await supabase
          .from('news')
          .select('*')
        if (error) {
          console.error('Error retrieving data from Supabase:', error.message);
        }
        if(data){
          setNews(data[0].news)
          console.log(data[0].news)
        }
  }

  useEffect(() => {
    if(isDateExpanded){
      fetchNews();
    }
  },[isDateExpanded])

  useEffect(() => {
    if (news.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % news.length);
    }, 7000); // 7 seconds between each news

    return () => clearInterval(interval); // Clean up interval on unmount
  }, [news]);


  return (
    <Section>
      {isDateExpanded ? <AbsoluteIconButton onClick={closeDate}><ArrowDown /></AbsoluteIconButton> : <AbsoluteIconButton onClick={closeDate}><ArrowUp /></AbsoluteIconButton>}
      <Title initial="collapsed" 
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <h2>YOUR BALANCE: {parseFloat(balance?.toFixed(2))} PGZ</h2>
            {/* <NewsTicker>
            {news.length > 0 && (
              <TickerItem>{news[currentIndex]?.text}</TickerItem>
            )}
          </NewsTicker> */}
        </Title>
        <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <AnimatePresence>
        {openLeagueMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"}
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}
            style={{padding: '40px 10px 20px 10px',backgroundImage: `url(${back30})`, backgroundPosition: 'center', backgroundRepeat: 'no-repeat', backgroundSize: 'cover'}}>
            <LeagueRowBets variants={item} 
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                 {availableLeagues?.map((league, index) => {
                  return(
                    <TeamBetsHolderBlur key={index}
                      initial={{ minHeight: '60px' }}
                      animate={{ minHeight: expandedIndex === index ? '280px' : '60px' }}
                      transition={{ duration: 0.5 }}>
                        {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                        <LeagueRower>
                          <LeagueWrapper>
                        <LeagueLogo>
                            <img src={league.logo} alt={league.logo} />
                        </LeagueLogo>
                        <LeagueName><h2>{league.name}</h2></LeagueName>
                        </LeagueWrapper>
                        </LeagueRower>
                        {expandedIndex === index && (
                        <LowRower >
                          {league.leagues.map((liga, index) => {
                            return(
                              <RowerRow key={index}>
                                <LeagueWrapper style={{transform: 'translateX(-20px)'}} onClick={() => handleButtonClick(liga)}>
                                <LeagueLogo>
                                <img src={liga.logo} alt={liga.logo} style={{width: '50%'}}/>
                              </LeagueLogo>
                              <LeagueName><h2>{liga.league}</h2></LeagueName>
                                </LeagueWrapper>
                                <AbsoluteChart onClick={() => setOpenLeague(liga)}><img src={chart} alt="chart" /></AbsoluteChart>
                              </RowerRow>
                            )
                          })}
                        </LowRower>
                      )}
                      </TeamBetsHolderBlur>
                  )
                 })}
            </LeagueRowBets>
          </Container>
        )}
        {openMatchesMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} >
            {loadingMatches ? (
              <TeamCircularRow>
                <CircularProgress sx={{ width: 80, height: 80 }} />
              </TeamCircularRow>
            ) : (
              <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                  <ArrowsHolder>
                    <ArrowIconHolder><ArrowLeftRelative onClick={lowRound} style={{transform: 'translateX(15px) rotate(90deg)'}}></ArrowLeftRelative></ArrowIconHolder>
                    <RoundNameHolder><h2>Round: {activeRound}</h2></RoundNameHolder>
                    <ArrowIconHolder><ArrowRightRelative onClick={raiseRound} style={{transform: 'translateX(-15px) rotate(270deg)'}}></ArrowRightRelative></ArrowIconHolder>
                  </ArrowsHolder>
                {currentRoundMaches?.map((match, index) => {
                  const date = new Date(match.fixture.date).toLocaleString();
                  const filter = selectedBet.find((el) => el.match.fixture.id === match.fixture.id)
                  return (
                    <TeamBetsHolder key={index} style={{margin: '0', boxShadow: filter ? `inset 0 0 25px green` : `inset 0 0 25px ${theme.text}`}}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '400px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                        {match.fixture.status.short === "NS" && <LiveBetIcon onClick={() => {openLiveBet();getHeadToHead(match.teams.home.id,match.teams.away.id);}}><img src={betting} alt="logo" style={{width: '60%'}}/></LiveBetIcon>}
                        {match.fixture.status.short === "FT" && <LiveBetIcon onClick={() => {setFixtureId(match.fixture.id);openLiveBet();getMatchStats(match.fixture.id)}}><img src={betting} alt="logo" style={{width: '60%'}}/></LiveBetIcon>}
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => {toggleExpand(index);setFixtureId(null)}} /> : match.fixture.status.short !== "FT" ? <SmallArrowDown onClick={() => {toggleExpand(index);setFixtureId(match.fixture.id);}} /> : ""}
                      <Rower>
                        <TeamsLogo>
                          {loadingMatches ? (
                            <Skeleton variant="circular" width={50} height={50} />
                          ) : (
                            <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.home.id)} alt="Home Team Logo" src={match.teams.home.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          )}
                          <TeamLogoText>{match.teams.home.name}</TeamLogoText>
                        </TeamsLogo>
                        <TeamsResult>
                          <DateRow>{date}</DateRow>
                          <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.goals.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.goals.away}</h2></ResultRow>
                          <BigDateRow>{match.fixture.status.long}</BigDateRow>
                          <VenueRow>{match.fixture.venue.name}, {match.fixture.venue.city}</VenueRow>
                        </TeamsResult>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.away.id)} alt="Away Team Logo" src={match.teams.away.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
                        </TeamsLogo>
                      </Rower>
                      {expandedIndex === index && (
                        <LowRower >
                          { match.fixture.status.short==="NS" && liveOdds?.map((odd) => {
                            return(
                              <BigRowBet>
                                <TopRowBet><h2>{odd.name}</h2></TopRowBet>
                                <BottomRowBet>
                                  {odd.values.map((bet) => {
                                    return(
                                      <BetHolder isSelected={selectedBet.some(
                                        (el) => el.match.fixture.id === match.fixture.id && el.value === bet.value && el.odd === bet.odd
                                    )} onClick={() => handleBetClick(match, odd.name, bet.value, bet.odd, filter)}><h2>{bet.value} - {bet.odd}</h2></BetHolder>
                                    )
                                  })}
                                </BottomRowBet>
                              </BigRowBet>
                            )
                          })}
                        </LowRower>
                      )}
                    </TeamBetsHolder>
                  )
                })}
              </TeamRow>
            )}
          </Container>
        )}
        {openLiveMatchesMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"}
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} style={{
              paddingTop: isMobile ? "50px" : "0px"
            }}>
            {loadingLiveMatches ? (
              <TeamCircularRow>
                <CircularProgress sx={{ width: 80, height: 80 }} />
              </TeamCircularRow>
            ) : (
              <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                {currentLiveMaches.length > 0 ? (
                    <>
                      {currentLiveMaches?.map((match, index) => {
                  const date = new Date(match.fixture.date).toLocaleString();
                  return (
                    <TeamBetsHolder key={index}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '330px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                      <Rower>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.home.id)} alt="Home Team Logo" src={match.teams.home.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.home.name}</TeamLogoText>
                        </TeamsLogo>
                        <TeamsResult>
                          <DateRow>{date}</DateRow>
                          <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.goals.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.goals.away}</h2></ResultRow>
                          <BigDateRow>{match.fixture.status.long}</BigDateRow>
                          <VenueRow>{match.fixture.venue.name}, {match.fixture.venue.city}</VenueRow>
                        </TeamsResult>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.away.id)} alt="Away Team Logo" src={match.teams.away.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
                        </TeamsLogo>
                      </Rower>
                      {expandedIndex === index && (
                        <LowRower >
                          {match?.events?.map((event) => {
                            console.log(event)
                            return (
                              <RowerRow>
                                <RowerRowEvent><img src={event?.team?.logo} alt="owngoal" /></RowerRowEvent>
                                <RowerFirstEvent>{event?.detail === "Own Goal" ? <img style={{ transform: 'rotate(180deg)' }} src={ownGoal} alt="owngoal" /> : event.detail === "Yellow Card" ? <img src={yellowCard} alt="owngoal" /> : event.detail === "Red Card" ? <img src={redCard} alt="owngoal" /> : event.detail === "Normal Goal" ? <img src={goal} alt="owngoal" /> :
                                  event.detail.startsWith("Substitution") ? <h2>OUT: {event?.assist?.name}</h2> : event.detail.startsWith("Goal Disallowed") ? <img src={ownGoal} alt="owngoal" /> : event.detail === "Penalty" ? <img src={penalty} alt="owngoal" /> : event?.detail}</RowerFirstEvent>
                                <RowerRowName><h2>{event?.player?.name}</h2></RowerRowName>
                                <RowerRowEvent><h2>{event?.time?.elapsed}'</h2></RowerRowEvent>

                              </RowerRow>
                            )
                          })}

                        </LowRower>
                      )}
                    </TeamBetsHolder>
                  )
                })}
                    </>
                ) : (
                  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center'}}>
                  <h2 style={{fontSize: '18px', fontWeight: 'bold', color: 'aqua', width: '70%'}}>THERE ARE NO LIVE EVENTS AT THIS MOMENT</h2>
                  </div>
                )}
              </TeamRow>

            )}

          </Container>
        )} 
        {openLiveBetMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} >
            {loadingLiveBets ? (
              <TeamCircularRow>
                <CircularProgress sx={{ width: 80, height: 80 }} />
              </TeamCircularRow>
            ) : (
              <TeamRow variants={item} 
                initial="initial"
                animate="animate"
                exit="exit"  style={{paddingTop: '0px'}}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                  <IconButton><CloseChatRoomIcon onClick={closeLiveBet}/></IconButton>
                  {selectedFixture ? <h3>MATCH STATS</h3> : <h3>HEAD TO HEAD</h3>}
                  {headToHead?.sort((a, b) => {
                    const dateA = new Date(a.fixture.date)
                    const dateB = new Date(b.fixture.date)
                    return dateB - dateA
                  }).map((match, index) => {
                    console.log(match)
                    const date = new Date(match.fixture.date).toLocaleString();
                    return(
                      <TeamBetsHolder key={index}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '330px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                     <Rower>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.home.id)} alt="Home Team Logo" src={match.teams.home.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.home.name}</TeamLogoText>
                        </TeamsLogo>
                        <TeamsResult>
                          <DateRow>{date}</DateRow>
                          <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.goals.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.goals.away}</h2></ResultRow>
                          <BigDateRow>{match.fixture.status.long}</BigDateRow>
                          <VenueRow>{match.fixture.venue.name}, {match.fixture.venue.city}</VenueRow>
                        </TeamsResult>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.away.id)} alt="Away Team Logo" src={match.teams.away.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
                        </TeamsLogo>
                      </Rower>
                    </TeamBetsHolder>
                    )
                  })}
                  {selectedFixture?.map((match, index) => {
                    console.log(match)
                    const date = new Date(match.fixture.date).toLocaleString();
                    return(
                      <TeamBetsHolder key={index}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '330px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                     <Rower>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.home.id)} alt="Home Team Logo" src={match.teams.home.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.home.name}</TeamLogoText>
                        </TeamsLogo>
                        <TeamsResult>
                          <DateRow>{date}</DateRow>
                          <ResultRow><h2 style={{ color: match.teams.home.winner === true ? "lime" : "white" }}>{match.goals.home}</h2> - <h2 style={{ color: match.teams.away.winner === true ? "lime" : "white" }}>{match.goals.away}</h2></ResultRow>
                          <BigDateRow>{match.fixture.status.long}</BigDateRow>
                          <VenueRow>{match.fixture.venue.name}, {match.fixture.venue.city}</VenueRow>
                        </TeamsResult>
                        <TeamsLogo>
                          <TeamLogoWrapper>
                            <Avatar onClick={() => openTeamMenu(match.teams.away.id)} alt="Away Team Logo" src={match.teams.away.logo} sx={{
                              width: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 },
                              height: { xs: 50, sm: 50, md: 70, lg: 70, xl: 70 }, transform: 'translateY(5px)'
                            }} />
                          </TeamLogoWrapper>
                          <TeamLogoText>{match.teams.away.name}</TeamLogoText>
                        </TeamsLogo>
                      </Rower>
                      {expandedIndex === index && (
                        <LowRower >
                          {match?.events?.map((event) => {
                            
                            return (
                              <RowerRow>
                                <RowerRowEvent><img src={event?.team?.logo} alt="owngoal" /></RowerRowEvent>
                                <RowerFirstEvent>{event?.detail === "Own Goal" ? <img style={{ transform: 'rotate(180deg)' }} src={ownGoal} alt="owngoal" /> : event.detail === "Yellow Card" ? <img src={yellowCard} alt="owngoal" /> : event.detail === "Red Card" ? <img src={redCard} alt="owngoal" /> : event.detail === "Normal Goal" ? <img src={goal} alt="owngoal" /> :
                                  event.detail.startsWith("Substitution") ? <h2>OUT: {event?.assist?.name}</h2> : event.detail.startsWith("Goal Disallowed") ? <img src={ownGoal} alt="owngoal" style={{transform: 'rotate(180deg)'}}/> : event.detail === "Penalty" ? <img src={penalty} alt="owngoal" /> : event.detail === "Goal cancelled" ? <img src={ownGoal} alt="owngoal" /> : event?.detail}</RowerFirstEvent>
                                <RowerRowName><h2>{event?.player?.name}</h2></RowerRowName>
                                <RowerRowEvent><h2>{event?.time?.elapsed}'</h2></RowerRowEvent>

                              </RowerRow>
                            )
                          })}

                        </LowRower>
                      )}
                    </TeamBetsHolder>
                    )
                  })}
                </TeamRow>
            )}
          </Container>
        )}
        {openMyBetsMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} >
            {loadingMatches ? (
              <TeamCircularRow>
                <CircularProgress sx={{ width: 80, height: 80 }} />
              </TeamCircularRow>
            ) : (
              myBets.length > 0 ? (
                <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"  style={{paddingTop: '60px'}}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                
                {myBets?.map((bet, index) => {
                  const type = bet.bet.length === 1 ? "SINGLE BET" : "MULTIPLE BET"
                  const date = bet.created_at
                  const newdate = new Date(date);
                  const localDateTime = newdate.toLocaleString();
                  return (
                    <TeamBetsHolder key={index} style={{margin: '0'}}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '330px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                      <RowerColumn>
                          <MiniRower><MiniRowerType><h2>{type}</h2></MiniRowerType><MiniRowerAmount><span>{bet.amount} PGZ</span></MiniRowerAmount></MiniRower>
                          <MiniRower><h2>{localDateTime}</h2></MiniRower>
                          <MiniRower><MiniRowerType><h2 style={{fontSize: isMobile ? "16px" : "20px", transform: isMobile ? "translateY(5px)" : "translateY(10px)"}}>POSSIBLE WINNINGS</h2></MiniRowerType><MiniRowerAmount><span>{bet.possibleWinnings} PGZ</span></MiniRowerAmount></MiniRower>
                      </RowerColumn>
                      {expandedIndex === index && (
                        <LowRower >
                          {bet.bet.map((match) => {
                            const homeLogo = getURL("home", match.match);
                            const awayLogo = getURL("away", match.match);
                            const winnings = getWinnings(match)
                            return(
                              <RowerRowBets>
                                <RowerRowEvent style={{backgroundImage: `url(${homeLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></RowerRowEvent>
                                <RowerFirstEvent><h2>{match.name} - {match.value}</h2></RowerFirstEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${awayLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></RowerRowEvent>
                                {match.isPostponed ? <h2>MATCH POSTPONED</h2> : (
                                  <>
                                  <RowerRowEvent><AbsoluteScore><h2 style={{color: match.match.teams.home.winner === true ? '#2cff02' : match.match.teams.home.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.home}</h2></AbsoluteScore></RowerRowEvent>
                                  <RowerTeamEvent><h2>-</h2></RowerTeamEvent>
                                  <RowerRowEvent><AbsoluteScore><h2 style={{color: match.match.teams.away.winner === true ? '#2cff02' : match.match.teams.away.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.away}</h2></AbsoluteScore></RowerRowEvent>
                                  </>
                                )}
                                <RowerRowEvent><h2 style={{fontSize: '22px'}}>{match.isPostponed ? "" : winnings}</h2></RowerRowEvent>
                              </RowerRowBets>
                            )
                          })}

                        </LowRower>
                      )}
                    </TeamBetsHolder>
                  )
                })}
              </TeamRow>
              ) : (
                <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"  style={{paddingTop: '60px'}}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}><h3>YOU HAVE NO PENDING BETS</h3></TeamRow>
              )
            )}
          </Container>
        )}
        {openWonBetsMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} >
            {loadingWonBets ? (
              <TeamCircularRow>
                <CircularProgress sx={{ width: 80, height: 80 }} />
              </TeamCircularRow>
            ) : (
              <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"  style={{paddingTop: '60px'}}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                {winOrLostBets?.map((bet, index) => {
                  const type = bet.bet.length === 1 ? "SINGLE BET" : "MULTIPLE BET"
                  const date = bet.created_at
                  const newdate = new Date(date);
                  const localDateTime = newdate.toLocaleString();
                  return (
                    <TeamBetsHolder key={index} style={{margin: '0'}}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '250px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                      <RowerColumn>
                          <MiniRower><MiniRowerType><h2>{type}</h2></MiniRowerType><MiniRowerAmount><span>{bet.amount} PGZ</span></MiniRowerAmount></MiniRower>
                          <MiniRower><h2>{localDateTime}</h2></MiniRower>
                          <MiniRower><MiniRowerType><h2 style={{fontSize: isMobile ? "16px" : "20px", transform: isMobile ? "translateY(5px)" : "translateY(10px)"}}>POSSIBLE WINNINGS</h2></MiniRowerType><MiniRowerAmount><span>{bet.possibleWinnings} PGZ</span></MiniRowerAmount></MiniRower>
                      </RowerColumn>
                      {expandedIndex === index && (
                        <LowRower >
                          {bet.bet.map((match) => {
                           console.log(match)
                            const homeLogo = getURL("home", match.match);
                            const awayLogo = getURL("away", match.match);
                            const winnings = getWinnings(match)
                            
                            return(
                              <RowerRowBets>
                                <RowerRowEvent style={{backgroundImage: `url(${homeLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></RowerRowEvent>
                                <RowerFirstEvent><h2>{match.name} - {match.value}</h2></RowerFirstEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${awayLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></RowerRowEvent>
                                {match.isPostponed ? <h2>MATCH POSTPONED</h2> : (
                                  <>
                                  <RowerRowEvent><AbsoluteScore><h2 style={{color: match.match.teams.home.winner === true ? '#2cff02' : match.match.teams.home.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.home}</h2></AbsoluteScore></RowerRowEvent>
                                  <RowerTeamEvent><h2>-</h2></RowerTeamEvent>
                                  <RowerRowEvent><AbsoluteScore><h2 style={{color: match.match.teams.away.winner === true ? '#2cff02' : match.match.teams.away.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.away}</h2></AbsoluteScore></RowerRowEvent>
                                  </>
                                )}
                                <RowerRowEvent><h2 style={{fontSize: '22px'}}>{match.isPostponed ? "" : winnings}</h2></RowerRowEvent>
                              </RowerRowBets>
                            )
                          })}

                        </LowRower>
                      )}
                    </TeamBetsHolder>
                  )
                })}
              </TeamRow>
            )}
          </Container>
        )}
        {openLostBetsMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} >
            {loadingWonBets ? (
              <TeamCircularRow>
                <CircularProgress sx={{ width: 80, height: 80 }} />
              </TeamCircularRow>
            ) : (
              <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"  style={{paddingTop: '60px'}}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                {winOrLostBets?.map((bet, index) => {
                  const type = bet.bet.length === 1 ? "SINGLE BET" : "MULTIPLE BET"
                  const date = bet.created_at
                  const newdate = new Date(date);
                  const localDateTime = newdate.toLocaleString();
                  return (
                    <TeamBetsHolder key={index} style={{margin: '0'}}
                      initial={{ height: '130px' }}
                      animate={{ height: expandedIndex === index ? '250px' : '130px' }}
                      transition={{ duration: 0.5 }}>
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => toggleExpand(index)} /> : <SmallArrowDown onClick={() => toggleExpand(index)} />}
                      <RowerColumn>
                          <MiniRower><MiniRowerType><h2>{type}</h2></MiniRowerType><MiniRowerAmount><span>{bet.amount} PGZ</span></MiniRowerAmount></MiniRower>
                          <MiniRower><h2>{localDateTime}</h2></MiniRower>
                          <MiniRower><MiniRowerType><h2 style={{fontSize: isMobile ? "16px" : "20px", transform: isMobile ? "translateY(5px)" : "translateY(10px)"}}>POSSIBLE WINNINGS</h2></MiniRowerType><MiniRowerAmount><span>{bet.possibleWinnings} PGZ</span></MiniRowerAmount></MiniRower>
                      </RowerColumn>
                      {expandedIndex === index && (
                        <LowRower >
                          {bet.bet.map((match) => {
                           
                            const url = getURL(match.betType, match.match);
                            const homeLogo = getURL("home", match.match);
                            const awayLogo = getURL("away", match.match);
                            const name = getName(match.betType, match.match)
                            const winnings = getWinnings(match)
                            
                            return(
                              <RowerRowBets>
                                <RowerRowEvent style={{backgroundImage: `url(${homeLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></RowerRowEvent>
                                <RowerFirstEvent><h2>{match.name} - {match.value}</h2></RowerFirstEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${awayLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}></RowerRowEvent>
                                {match.isPostponed ? <h2>MATCH POSTPONED</h2> : (
                                  <>
                                  <RowerRowEvent><AbsoluteScore><h2 style={{color: match.match.teams.home.winner === true ? '#2cff02' : match.match.teams.home.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.home}</h2></AbsoluteScore></RowerRowEvent>
                                  <RowerTeamEvent><h2>-</h2></RowerTeamEvent>
                                  <RowerRowEvent><AbsoluteScore><h2 style={{color: match.match.teams.away.winner === true ? '#2cff02' : match.match.teams.away.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.away}</h2></AbsoluteScore></RowerRowEvent>
                                  </>
                                )}
                                <RowerRowEvent><h2 style={{fontSize: '22px'}}>{match.isPostponed ? "" : winnings}</h2></RowerRowEvent>
                              </RowerRowBets>
                            )
                          })}

                        </LowRower>
                      )}
                    </TeamBetsHolder>
                  )
                })}
              </TeamRow>
            )}
          </Container>
        )}
        {openCurrentBetMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"} 
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }} >
            <TeamRow variants={item}
                initial="initial"
                animate="animate"
                exit="exit"  style={{paddingTop: '60px'}}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                {/* <StyledButton onClick={getFixture}>GET FIXTURE</StyledButton>
                <StyledButton onClick={closeSendOdds}>OPEN ODDS</StyledButton> */}
                {selectedBet?.map((selectedBet,index) => {
                  console.log(selectedBet)
                  const name = getName(selectedBet.name, selectedBet.value, selectedBet.match)
                  return(
                    <motion.div
                      key={selectedBet.id}
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0.2}
                      onDragStart={() => handleDrag(index, 0.1)} // Initial light red shadow on drag start
                      onDrag={(event, info) => handleDrag(index, info.point.x)}
                      onDragEnd={(event, info) => handleDragEnd(index, info.point.x)}
                      
                      
                    >
                    <CurrentBetHolder  boxShadow={
                      dragIntensities[index] > 0
                        ? `inset 0 0 25px rgba(255, 0, 0, ${dragIntensities[index]})`
                        : `inset 0 0 25px ${theme.text}`
                    }>
                      <LiveBetIcon>{selectedBet.odd}</LiveBetIcon>
                    <CurrentBetLogoHolder>
                    <img src={selectedBet?.match?.teams?.home?.logo} alt="homeTeamLogo" />
                    </CurrentBetLogoHolder>
                    <CurrentBetNameHolder>
                      <CurrentBetRow ><h2>{selectedBet.name}</h2></CurrentBetRow>
                      <CurrentBetRow ><h2>{name}</h2></CurrentBetRow>
                    </CurrentBetNameHolder>
                    <CurrentBetLogoHolder>
                    <img src={selectedBet?.match?.teams?.away?.logo} alt="awayTeamLogo" />
                    </CurrentBetLogoHolder>
                    </CurrentBetHolder>
                    </motion.div>
                  )
                })}
              <BetAmount>
                SELECT AMOUNT:
                <BetInput onChange={(e) => setAmount(e.target.value)} />
              </BetAmount>
              <PossibleWinningsAmount>POSSIBLE WINNINGS: <span>{calculateTotalWinnings()} PGZ</span> </PossibleWinningsAmount>
              <Switcher>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography style={{ color: 'white', fontFamily: 'Quicksand' }}>SIGN BET</Typography>
                  <Switch inputProps={{ 'aria-label': 'ant design' }} checked={checked} onChange={handleSwitchSendBet} />
                  <Typography></Typography>
                </Stack>
                <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
                  <Typography style={{ color: 'white', fontFamily: 'Quicksand' }}>MULTIPLE BET</Typography>
                  <IconButton><AddIcon onClick={handleSwitchMultiple} /></IconButton>
                  <Typography></Typography>
                </Stack>
              </Switcher>
            </TeamRow>
          </Container>
        )}
        {leagueStatsMenu && (
              <LeagueStats variants={item} 
              initial="initial"
              animate="animate"
              exit="exit" style={{justifyContent: 'space-around'}} leagueStatsMenu={leagueStatsMenu} setLeagueStatsMenu={setLeagueStatsMenu}/>
        )}
        {selectedTeamMenu && (
                <TeamStats selectedTeamMenu={selectedTeamMenu} setSelectedTeamMenu={setSelectedTeamMenu} />
        )}
        {selectedPlayerMenu && (
        <PlayerStatsMenu selectedPlayerMenu={selectedPlayerMenu} setSelectedPlayerMenu={setSelectedPlayerMenu} />
        )}
        {selectedOddsMenu && (
        <SendOdds selectedOddsMenu={selectedOddsMenu} setSelectedOddsMenu={setSelectedOddsMenu} />
        )}
        {/* {selectedBetMenu && (
                <SelectedBet selectedBetMenu={selectedBetMenu} setSelectedBetMenu={setSelectedBetMenu} />
            )} */}
      </AnimatePresence>
      <BottomRow>
        <IconHolder onClick={startAll}>{(activeLeague === null) ? (
            <h2 style={{color: openMyBetsMenu ? "rgba(244,215,21,1)" : ""}} onClick={closeBet}>GO BACK</h2>
        ) : (
            <h2 style={{color: openMyBetsMenu ? "rgba(244,215,21,1)" : ""}}>{t("fantasy.title20")}</h2>
        )}</IconHolder>
        <IconHolder>
          {(activeLeague === null) ? <h2 onClick={openLostBets} style={{color: openLostBetsMenu ? "rgba(244,215,21,1)" : ""}}>LOST BETS</h2> : <h2 onClick={() => openLiveMatches(true)}>LIVE MATCHES</h2>}
        </IconHolder>
        <IconHolder>{(activeLeague && selectedBet.length !== 0) && <AllBetsBadge>{selectedBet.length}</AllBetsBadge>}{(activeLeague === null) ? <h2 onClick={openWonBets} style={{color: openWonBetsMenu ? "rgba(244,215,21,1)" : ""}}>WON BETS</h2> : <h2 style={{color: openCurrentBetMenu ? "rgba(244,215,21,1)" : ""}} onClick={() => openCurrentBet(true)}>CURRENT BET</h2>}</IconHolder>
        <IconHolder onClick={() => openBets()}>{openMyBetsMenu ? <h2 style={{color: openMyBetsMenu ? "rgba(244,215,21,1)" : ""}}>PENDING BETS</h2> : <h2>YOUR BETS</h2>}</IconHolder>
      </BottomRow>
      <ToastContainer />
    </Section>
  )
}

export default Bets


