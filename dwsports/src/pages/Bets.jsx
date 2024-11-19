import React, {useState, useEffect} from 'react'
import { useTheme } from 'styled-components'
import {motion,AnimatePresence} from 'framer-motion'
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import { BallColumn,CountryBall,CountryBallText, MiniArrowDownTop, MiniArrowupTop,CountryBallTextTop, PlayerSettingsIcon, Search, SearchIconButton, ArrowLeftRelative, SmallArrowDown, TeamsLogo, TeamLogoWrapper, TeamLogoText, TeamsResult, DateRow, ResultRow, BigDateRow, VenueRow, ArrowRightRelative, StyledButton, OddsColumn, OddsColumnBig, AllBetsBadge } from './index';
import {useTranslation} from "react-i18next";
import { Avatar, CircularProgress, IconButton, Switch } from '@mui/material';
import england from '../assets/logos/england.png'
import spain from '../assets/logos/spain.png'
import italy from '../assets/logos/italy.png' 
import germany from '../assets/logos/germany.png' 
import france from '../assets/logos/france.png' 
import chart from '../assets/logos/chart.png' 
import champions from '../assets/logos/champions.png' 
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
  CurrentBetRow
} from './indexThree' 
import { FantasyState } from '../context/FantasyContext';
import axios from 'axios';
import ownGoal from '../assets/logos/ownGoal.png'
import goal from '../assets/logos/goal.png'
import redCard from '../assets/logos/redCard.png'
import betting from '../assets/logos/liveBetting.jpg'
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
  BetHolder
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

const Bets = () => {

  const leagues = [
    {
      league: "Champions League",
      logo: champions,
      name: "UEFA",
      id: 2,
      currentRound: 5
    },
    {
        league: "Premier League",
        logo: england,
        name: "England",
        id: 39,
        currentRound: 12
    },
    {
        league: "La Liga",
        logo: spain,
        name: "Spain",
        id: 140,
        currentRound: 14
    },
    {
        league: "Serie A",
        logo: italy,
        name: "Italy",
        id: 135,
        currentRound: 13
    },
    {
        league: "Ligue 1",
        logo: france,
        name: "France",
        id: 61,
        currentRound: 12
    },
    {
        league: "Bundesliga",
        logo: germany,
        name: "Germany",
        id: 78,
        currentRound: 11
    }
]
  const theme = useTheme();
  const [checkedMultiple, setCheckedMultiple] = useState(false);
  const [openLeagueMenu, setOpenLeagueMenu] = useState(true)
  const { user } = useAuth();
  const isMobile = useMediaQuery({ query: '(max-width: 498px)' });
  const [availableLeagues, setAvailableLeagues] = useState(leagues)
  const [t, i18n] = useTranslation("global");
  const [isDateExpanded, setIsDateExpanded] = useState(true)
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
  const {activeLeagueId, setActiveLeagueId} = FantasyState();
  const [activeBall, setActiveBall] = useState(1)
  const [currentLiveMaches, setCurrentLiveMatches] = useState([])
  const [currentRoundMaches, setCurrentRoundMatches] = useState([])
  const [winningBets, setWinningBets] = useState([])
  const [lostBets, setLostBets] = useState([])
  const [liveOdds, setLiveOdds] = useState([])
  const [myBets, setMyBets] = useState([])
  const [winOrLostBets, setWinOrLostBets] = useState([])
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


  const getFixtures = async () => {
    setLoadingMatches(true)
    const leagueIds = [39, 135, 140, 78, 61]; 
    const season = '2024';
    const apiKey = '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2';
    const apiHost = 'api-football-v1.p.rapidapi.com';
    const premier = localStorage.getItem("Premier League")
    if(premier === null){
      try {
        // Map each leagueId to an axios request
        const requests = leagueIds.map(leagueId => {
          const options = {
            method: 'GET',
            url: `https://${apiHost}/v3/fixtures`,
            params: { league: leagueId, season },
            headers: {
              'x-rapidapi-key': apiKey,
              'x-rapidapi-host': apiHost,
            },
          };
    
          return axios.request(options);
        });
    
        // Execute all requests at once
        const responses = await Promise.all(requests);
        responses.forEach((res) => {
          if(res.data.parameters.league === "39"){
            setPremier(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("Premier League", str)
          } else if(res.data.parameters.league === "140"){
            setLaLiga(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("La Liga", str)
          } else if(res.data.parameters.league === "135"){
            setSerieA(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("Serie A", str)
          } else if(res.data.parameters.league === "61"){
            setLigue1(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("Ligue 1", str)
          } else if(res.data.parameters.league === "78"){
            setBundesliga(res.data.response)
            const str = JSON.stringify(res.data.response)
            localStorage.setItem("Bundesliga", str)
          }
        })
      } catch (error) {
        console.error('Error fetching or updating fixtures:', error);
      }
    } else {
      
      console.log("this is from local")
      const prem = localStorage.getItem("Premier League")
      const json = JSON.parse(prem)
      console.log(json)
      setPremier(json)
      const prem2 = localStorage.getItem("La Liga")
      const json2 = JSON.parse(prem2)
      setLaLiga(json2)
      const prem3 = localStorage.getItem("Serie A")
      const json3 = JSON.parse(prem3)
      setSerieA(json3)
      const prem4 = localStorage.getItem("Ligue 1")
      const json4 = JSON.parse(prem4)
      setLigue1(json4)
      const prem5 = localStorage.getItem("Bundesliga")
      const json5 = JSON.parse(prem5)
      setBundesliga(json5)
    }
    setLoadingMatches(false)
  }


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
          setMyBets(updatedBets)
          setLoadingBets(false)
        }
    }
  }

  const writePendingBets = async () => {
    const updatedBets = myBets.map(bet => ({
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
  
    // Update state with the modified bets array
    setMyBets(updatedBets);
    updatedBets.forEach(bet => {
      bet.bet.forEach(matchBet => {
        const isFulfilled = isBetFulfilled(matchBet);
        
        // Optionally update the bet object with the result
        matchBet.isWinningBet = isFulfilled;
      });
      
    });
  } 

  
  
  function isBetFulfilled(bet) {
    const { betType, match } = bet;
    const { home, away } = match.goals;
  
    switch (betType) {
      case "home":
        return home > away;
        case "away":
        return away > home;
        case "draw":
        return home === away;
      case "homeOver2":
        return home >= 3;
      case "homeUnder2":
        return home <= 2;
      case "homeBTTS":
        return home > 0 && away > 0;
      case "awayBTTS":
        return home > 0 && away > 0;
      case "homeBTNTS":
        return home > away && away === 0;
      case "awayBTNTS":
        return away > home || home === 0;
      case "btts":
        return home > 0 && away > 0;
      case "btnts":
        return home === 0 || away === 0;
      case "homeMinus1":
        return home - away >= 2;
      case "awayMinus1":
        return away - home >= 2;
      case "awayOver2":
        return away >= 3;
      case "awayUnder2":
        return away <= 2;
      default:
        return false;
    }
  }
  
  // Loop through each bet and check conditions
 


  const checkBets = () => {
    if(myBets){
      myBets.forEach(bet => {
        bet.bet.forEach(matchBet => {
          const isFulfilled = isBetFulfilled(matchBet);
          
          // Optionally update the bet object with the result
          matchBet.isWinningBet = isFulfilled;
        });
        
      });
      
    }
    const winningBets = myBets.filter(bet => 
      bet.bet.every(matchBet => matchBet.isWinningBet === true)
    );

    winningBets.forEach(async (bet) => {
      if(balance){
        const { data: searchData, error: updateError } = await supabase
                    .from('users')
                    .select('appBalance') // Update the jsonb column
                    .eq('id', user.id); // Identify which user to update
    
                if (updateError) {
                    console.error('Error updating user data:', updateError.message);
                } else {
                    const filter = myBets.filter((el) => el.id !== bet.id)
                    setMyBets(filter)
                    const balance = searchData[0].appBalance
                    const newBalance = balance + bet.possibleWinnings
                    console.log(newBalance)
                    const { data: userData, error: userError } = await supabase
                          .from('users')
                          .update({appBalance: newBalance}) // Update the jsonb column
                          .eq('id', user.id); // Identify which user to update
          
                          if (userError) {
                              console.error('Error updating user data:', userError.message);
                          } else {
                            const { data: betData, error: betError } = await supabase
                                .from('bets')
                                .update({status: "Won"}) // Update the jsonb column
                                .eq('id', bet.id); // Identify which user to update
                
                                if (betError) {
                                    console.error('Error updating user data:', betError.message);
                                } else {
                                  toast('You have won your bet! 🤑🤑🤑  ', {
                                    position: "top-center",
                                    autoClose: 5000,
                                    hideProgressBar: true,
                                    closeOnClick: true,
                                    pauseOnHover: true,
                                    draggable: true,
                                    progress: undefined,
                                    theme: "dark"
                                    });
                                }
                                
                          }
                          
                }
      }
    })
    
    const nonWinningBets = myBets.filter(bet => 
      !bet.bet.every(matchBet => matchBet.isWinningBet === true)
    );
    
    nonWinningBets.forEach(async (bet) => {
                    const filter = myBets.filter((el) => el.id !== bet.id)
                    setMyBets(filter)
                                const { data: betData, error: betError } = await supabase
                                .from('bets')
                                .update({status: "Lost"}) // Update the jsonb column
                                .eq('id', bet.id); // Identify which user to update
                
                                if (betError) {
                                    console.error('Error updating user data:', betError.message);
                                } else {
                                  console.log("one added")
                                }
    })
  }

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

  /* useEffect(() => {
    if(myBets){
      checkBets();
    }
  }, [myBets]) */

  

  /* useEffect(() => {
    if(openMyBetsMenu){
      getFixtures();
      getBets();
    }
  }, [openMyBetsMenu]) */

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
    if(activeLeagueId === 2){
      round = `League Stage - ${activeRound}`
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
    console.log(league)
    setActiveLeagueId(league.id)
    setActiveLeague(league.league)
    setActiveRound(league.currentRound)
    setOpenLeagueMenu(false)
    setTimeout(() => {
      setOpenMatchesMenu(true)
    })
  };

  

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



const getWinnings = (el) => {
  if(el.isWinningBet === true){
    return <TickAnimation />
  }
  if(el.isWinningBet === false){
    return <CrossAnimation />
  }
  return ''
  }

  const getFixture = async () => {
    const { data, error } = await supabase
      .from("fixtures").select('fixtures').eq('leagueName', "Ligue 1")
      if(error){
        console.log(error)
      }
      if(data){
        console.log(data)
        data[0].fixtures.forEach((el) => {
          if(el.teams.home.name === "Nice" && el.teams.away.name === "Strasbourg"){
            console.log(el)
          }
        })
      }
  }

  const handleBetClick = (match, name, value, odd, filter) => {
    console.log(match)
    console.log(name)
    console.log(value)
    console.log(odd)
    if(filter !== undefined){
      toast('You can not bet on the same event twice! ❌', {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark"
      });
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
    return totalWinnings;
    };

  const handleSwitchSendBet = async (event) => {
    if(amount === null){
      message.error("You must enter the amount of the bet!")
      return
    }
    if(amount > balance){
      message.error("You don't have enough balance to place this bet!")
      return
    }
    //setPendingBets((prevBets) => prevBets + 1)
    const winnings = calculateTotalWinnings();
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
        toast('You have placed your bet. Good luck!🤞', {
          position: "top-center",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark"
          });
      }
        }
        
        setOpenCurrentMenu(false)
        setTimeout(() => {
          setOpenLeagueMenu(true)
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
        setLiveOdds(response.data.response[0].bookmakers[2].bets);
      } catch (error) {
        console.error(error);
      }
    }
  }


  useEffect(() => {
    getOddsFromBooker();
  }, [fixtureId])


  return (
    <Section>
      <ToastContainer
      position="top-center"
      autoClose={5000}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
      />
      {isDateExpanded ? <AbsoluteIconButton onClick={closeDate}><ArrowDown /></AbsoluteIconButton> : <AbsoluteIconButton onClick={closeDate}><ArrowUp /></AbsoluteIconButton>}
      <Title initial="expanded" 
        animate={isDateExpanded ? "expanded" : "collapsed"} 
        variants={variants}
        transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <h2>YOUR BALANCE: {parseFloat(balance?.toFixed(2))} PGZ</h2>
        </Title>
        <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <AnimatePresence>
        {openLeagueMenu && (
          <Container initial="collapsed" animate={isDateExpanded ? "collapsed" : "expanded"}
            variants={variantsTwo} transition={{ type: 'tween', ease: 'linear', duration: 0.5 }}>
            <LeagueRowBets variants={item}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
              {availableLeagues?.map((league, index) => {
                return (
                  <LeagueHolder whileHover={{ scale: 1.05 }} key={league.name} >
                    <AbsoluteChart onClick={() => setOpenLeague(league)}><img src={chart} alt="chart" /></AbsoluteChart>
                    <BallColumn key={league.id}>
                      <CountryBall onClick={() => handleButtonClick(league)}><img src={league.logo} alt="england" /></CountryBall>
                      <CountryBallTextTop>{league.name === "England" && `${t("fantasy.england")}`}{league.name === "Spain" && `${t("fantasy.spain")}`}{league.name === "Italy" && `${t("fantasy.italy")}`}
                        {league.name === "Germany" && `${t("fantasy.germany")}`}{league.name === "France" && `${t("fantasy.france")}`}</CountryBallTextTop><CountryBallTextTop>{league.league}</CountryBallTextTop>
                    </BallColumn>
                  </LeagueHolder>
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
                      {expandedIndex === index ? <SmallArrowDown style={{ transform: 'rotate(180deg)' }} onClick={() => {toggleExpand(index);setFixtureId(null)}} /> : <SmallArrowDown onClick={() => {toggleExpand(index);setFixtureId(match.fixture.id);}} />}
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
                          {liveOdds?.map((odd) => {
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
{/*                         <LiveBetIcon onClick={() => {setFixtureId(match.fixture.id);openLiveBet();}} style={{backgroundImage: `url(${betting})`, backgroundSize: 'cover', backgroundPosition: 'center'}}></LiveBetIcon>
 */}                      <Rower>
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
                exit="exit"  style={{paddingTop: '60px'}}
                transition={{ type: 'tween', ease: 'linear', duration: 0.2 }}>
                  LIVE BETS MENU
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
                            console.log(match)
                            const url = getURL(match.betType, match.match);
                            const homeLogo = getURL("home", match.match);
                            const awayLogo = getURL("away", match.match);
                            const name = getName(match.name, match.match)
                            const winnings = getWinnings(match)
                            return(
                              <RowerRowBets>
                                <RowerFirstEvent><h2>{match.name} - {match.value}</h2></RowerFirstEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${homeLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}><AbsoluteScore><h2 style={{color: match.match.teams.home.winner === true ? '#2cff02' : match.match.teams.home.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.home}</h2></AbsoluteScore></RowerRowEvent>
                                <RowerTeamEvent><h2>-</h2></RowerTeamEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${awayLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}><AbsoluteScore><h2 style={{color: match.match.teams.away.winner === true ? '#2cff02' : match.match.teams.away.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.away}</h2></AbsoluteScore></RowerRowEvent>
                                <RowerRowEvent><h2 style={{fontSize: '22px'}}>{winnings}</h2></RowerRowEvent>
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
                           
                            const url = getURL(match.betType, match.match);
                            const homeLogo = getURL("home", match.match);
                            const awayLogo = getURL("away", match.match);
                            const name = getName(match.betType, match.match)
                            const winnings = getWinnings(match)
                            
                            return(
                              <RowerRowBets>
                                <RowerFirstEvent><h2>{name}</h2></RowerFirstEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${homeLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}><AbsoluteScore><h2 style={{color: match.match.teams.home.winner === true ? '#2cff02' : match.match.teams.home.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.home}</h2></AbsoluteScore></RowerRowEvent>
                                <RowerTeamEvent><h2>-</h2></RowerTeamEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${awayLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}><AbsoluteScore><h2 style={{color: match.match.teams.away.winner === true ? '#2cff02' : match.match.teams.away.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.away}</h2></AbsoluteScore></RowerRowEvent>
                                <RowerRowEvent><h2 style={{fontSize: '22px'}}>{winnings}</h2></RowerRowEvent>
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
                                <RowerFirstEvent><h2>{name}</h2></RowerFirstEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${homeLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}><AbsoluteScore><h2 style={{color: match.match.teams.home.winner === true ? '#2cff02' : match.match.teams.home.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.home}</h2></AbsoluteScore></RowerRowEvent>
                                <RowerTeamEvent><h2>-</h2></RowerTeamEvent>
                                <RowerRowEvent style={{backgroundImage: `url(${awayLogo})`, backgroundSize: '70%', backgroundPosition: 'center', backgroundRepeat: 'no-repeat'}}><AbsoluteScore><h2 style={{color: match.match.teams.away.winner === true ? '#2cff02' : match.match.teams.away.winner === false ? '#ff2802' : '#eeff00'}}>{match.match.goals.away}</h2></AbsoluteScore></RowerRowEvent>
                                <RowerRowEvent><h2 style={{fontSize: '22px'}}>{winnings}</h2></RowerRowEvent>
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


