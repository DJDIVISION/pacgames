import React,{useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import { motion,AnimatePresence } from 'framer-motion'
import { FantasyState } from '../../context/FantasyContext';
import { ButtonAbsolute, CloseChatRoomIcon } from '../chats';
import { StyledAbsolute } from '../../pages/indexTwo';
import { supabase } from '../../supabase/client';
import {Section, Holder, Title, ListItemWrapper,ListWrapper,ListItemSpan,PlayerDataWrapper,PlayerLogo,PlayerStatsWrapper,
    PlayerStatsName,PlayerStatCountry,StatsCountryLocation,PlayerStatsRating,TeamRatingTitle,TeamRating,PlayerStatsNameSmall,
    RatingsContainer,RatingWrapper,HolderRow,Column,ListItemTitle,LeaguesHolder,HolderRowAround,SmallHolderRowAround,Row,

} from './index'
import { Avatar, Button, TextField } from '@mui/material';
import CountUp from '../../animations/CountUp';
import { message } from 'antd';
import EditPlayerMenu from './EditPlayerMenu';
import { StyledButton } from '../../pages';
import axios from 'axios'

const PlayerStatsMenu = ({selectedPlayerMenu,setSelectedPlayerMenu}) => {

    const {playerToUpdate, setPlayerToUpdate} = FantasyState();
    const {activeLeague, setActiveLeague} = FantasyState();
    const [playerLeagueData, setPlayerLeagueData] = useState({})
    const [activeLeagueData, setActiveLeagueData] = useState({})
    const [latestGamesData, setLatestGamesData] = useState({})
    const [latestRatings, setLatestRatings] = useState([])
    const [average, setAverage] = useState(null)
    const [newRating, setNewRating] = useState("")
    const [leagues, setLeagues] = useState([])
    
    const handleAction = (section, key, action) => {
        setPlayerLeagueData((prevData) => {
          const updatedSection = { ...prevData[section] };
      
          // Helper function to round to two decimal places
          const roundToTwoDecimals = (num) => Math.round(num * 100) / 100;
      
          switch (action) {
            case 'increment-0-01':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] + 0.01);
              break;
            case 'increment-0-1':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] + 0.1);
              break;
            case 'increment':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] + 1);
              break;
            case 'increment-10':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] + 10);
              break;
              case 'increment-50':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] + 50);
              break;
            case 'increment-100':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] + 100);
              break;
              case 'decrement-0-01':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] - 0.01);
              break;
            case 'decrement-0-1':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] - 0.1);
              break;
            case 'decrement':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] - 1);
              break;
            case 'decrement-10':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] - 10);
              break;
            case 'decrement-100':
              updatedSection[key] = roundToTwoDecimals(prevData[section][key] - 100);
              break;
            case 'captain':
              updatedSection[key] = true;
              break;
            case 'setToMax': // Example for setting to max value
              updatedSection[key] = 100;
              break;
            default:
              break;
          }
      
          return {
            ...prevData,
            [section]: updatedSection,
          };
        });
      };

    

    /* const fetchData = async () => {
        const item = localStorage.getItem("mainStats")
        const json = JSON.parse(item)
        setPlayerLeagueData(json)
    } */

    useEffect(() => {
        fetchData();
    }, [])

    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100vh", opacity: 1, transition: { duration: 0.7 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.7 } }
    }

    
    const sendPlayerRatings = async () => {
      let number = 0; // Default value for rating if there are no ratings
    
      if (latestRatings.length > 0) {
        // Only calculate the average if ratings are present
        const sum = latestRatings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / latestRatings.length;
        number = parseFloat(average.toFixed(2)); // Ensure the rating is properly formatted
      }
    
      // Proceed with updating the player data in the database
      const { data, error } = await supabase
        .from('footballPlayers')
        .update({ ratings: latestRatings, rating: number })
        .eq('id', playerToUpdate.id); // Match by player ID
    
      if (error) {
        console.error('Error updating data:', error);
      } else {
        console.log('Data updated successfully:', data);
        message.success("Data inserted successfully!");
      }
    
      setSelectedPlayerMenu(false);
      setPlayerToUpdate([]); // Reset the playerToUpdate state
    };

    const updatePlayerRatings = async () => {
      console.log(newRating);
      
      const number = parseFloat(newRating); // Parse the new rating to a number
      console.log(number);
      console.log(typeof number); // Confirm it's a number
      
      // Ensure `latestRatings` is always an array
      setLatestRatings((prevArray) => {
        const updatedArray = prevArray ? [...prevArray, number] : [number]; // Handle when prevArray is undefined or null
        return updatedArray;
      });
    };

    const getBackgroundColor = (number) => {
        if (number >= 0 && number < 6) return 'red'; // Color for 5 to <6
        if (number >= 6 && number < 6.5) return 'orange'; // Color for 5 to <6
        if (number >= 6.5 && number < 7) return '#eafa07';  // Color for 6 to <7
        if (number >= 7 && number < 8) return '#12f812'; // Color for 7 to <8
        if (number >= 8 && number < 9) return '#00ccff'; // Color for 8 to <9
        if (number >= 9 && number <= 10) return '#3F00FF'; // Color for 9 to 10
        return 'white'; // Default background color if number is out of range
    };

    const fetchData = async () => {
      /* const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players',
        params: {
          id: playerToUpdate.id,
          season: '2024'
        },
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      
      try {
        const response = await axios.request(options);
        setPlayerLeagueData(response.data.response[0].statistics);
      } catch (error) {
        console.error(error);
      } */
        const { data, error } = await supabase
        .from('footballPlayers')
        .select('*')
        .eq("id", playerToUpdate.id)
        if (error) {
        console.error('Error inserting/updating user session data:', error.message)
        } else {
          console.log(data)
          setLatestRatings(data[0].ratings)
          if(data[0].laLigaStats[0] !== null){
            
            setPlayerLeagueData(data[0].laLigaStats[0].statistics )
          } else {
            console.log("no such data")
          }
        }
  }

  const setData = () => {
    if(playerLeagueData.length > 0){
      const leagues = []
      playerLeagueData.forEach((league) => {
        leagues.push(league.league.name)
        if(league.league.name === activeLeague){
          setActiveLeagueData(league)
        }
      })
      setLeagues(leagues)
    }
  }


  useEffect(() => {
    setData();
  }, [playerLeagueData])

  const setLeague = (league) => {
    const filter = playerLeagueData.filter((el) => el.league.name === league)
    setActiveLeagueData(filter[0])
  }

  useEffect(() => {
    console.log(activeLeagueData)
  }, [activeLeagueData])

  const setRating = async () => {
    if(latestGamesData.games.rating && latestGamesData.games.rating > 0){
      const number = parseFloat(latestGamesData.games.rating)
      latestRatings.push(number)
    } else {
      console.log("no rating")
    }
    console.log(latestRatings)
    let number = 0; // Default value for rating if there are no ratings
    
      if (latestRatings.length > 0) {
        // Only calculate the average if ratings are present
        const sum = latestRatings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / latestRatings.length;
        number = parseFloat(average.toFixed(2)); // Ensure the rating is properly formatted
      }
    
      // Proceed with updating the player data in the database
      const { data, error } = await supabase
        .from('footballPlayers')
        .update({ ratings: latestRatings, rating: number })
        .eq('id', playerToUpdate.id); // Match by player ID
    
      if (error) {
        console.error('Error updating data:', error);
      } else {
        console.log('Data updated successfully:', data);
        message.success("Data inserted successfully!");
      }
    
      setSelectedPlayerMenu(false);
      setPlayerToUpdate([]); 
  }

  console.log(playerToUpdate.id)

  
  

  return (
    <AnimatePresence>
          <motion.div className="menu-container-one" variants={item}
              initial="initial"
              animate="animate"
              exit="exit">
                <Section>
                <PlayerDataWrapper>
                    <PlayerLogo>
                    <Avatar alt="Image" src={playerToUpdate.photo} sx={{ width: 120, height: 120, border: '4px solid aqua' }}/>
                    </PlayerLogo>
                    <PlayerStatsWrapper>
                        <PlayerStatsNameSmall>{playerToUpdate.name}</PlayerStatsNameSmall>
                        <PlayerStatsNameSmall>{playerToUpdate.nationality}</PlayerStatsNameSmall>
                        <PlayerStatsNameSmall>Age: {playerToUpdate.age}</PlayerStatsNameSmall>
                        <PlayerStatsNameSmall>Height: {playerToUpdate.height}cm.</PlayerStatsNameSmall>
                    </PlayerStatsWrapper>
                    <PlayerStatsWrapper>
                    <PlayerStatsNameSmall>Position: {playerToUpdate.position}</PlayerStatsNameSmall>
                    <PlayerStatsNameSmall>Main Foot: {playerToUpdate.preferredFoot}</PlayerStatsNameSmall>
                    <PlayerStatsNameSmall>Number: {playerToUpdate.number}</PlayerStatsNameSmall>
                    <PlayerStatsNameSmall>
                    <TeamRatingTitle>Rating:</TeamRatingTitle> <TeamRating><strong style={{background: playerToUpdate.rating >= 7 ? `green` : playerToUpdate.rating >= 6 && playerToUpdate.rating < 7 ? "yellow" : "red"}}><CountUp endValue={playerToUpdate.rating} duration={500}/></strong></TeamRating><span></span>
                    </PlayerStatsNameSmall>
                    </PlayerStatsWrapper>
                    <PlayerLogo>
                    <Avatar alt="Image" src={playerToUpdate.teamLogo} sx={{ width: 90, height: 90, border: '4px solid aqua' }}/>
                    </PlayerLogo>
                </PlayerDataWrapper>
                <StyledAbsolute onClick={() => {setSelectedPlayerMenu(false);setPlayerToUpdate({})}}><CloseChatRoomIcon /></StyledAbsolute>
                {playerToUpdate.injuryType !== null && (
                  <Holder style={{border: '3px solid red', marginBottom: '50px'}}>
                    <HolderRow>{playerToUpdate.injuryType}</HolderRow>
                    <HolderRow>{playerToUpdate.injuryReason}</HolderRow>
                  </Holder>
                )}   
                <LeaguesHolder>    
                {leagues && leagues.map((league) => {
                  return(
                    <StyledButton style={{fontSize: '10px', padding: '5px 5px'}} onClick={() => setLeague(league)}>{league}</StyledButton>
                  )
                })}
                </LeaguesHolder> 
                <Holder>
                <HolderRowAround>
                <Avatar alt="Image" src={activeLeagueData?.league?.logo} sx={{ width: 60, height: 60, border: '2px solid aqua', background: 'white'}}/>
                <h3>{activeLeagueData?.league?.name}</h3>
                <Avatar alt="Image" src={activeLeagueData?.team?.logo} sx={{ width: 60, height: 60, border: '2px solid aqua', background: 'white' }} />
                </HolderRowAround>
                <SmallHolderRowAround><h2>( {activeLeagueData?.league?.country} )</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>TEAM: {activeLeagueData?.team?.name}</h2></SmallHolderRowAround>
                </Holder>
                <Row>
                <Holder>
                <h3>GAMES</h3>
                <SmallHolderRowAround><h2>Appearences: {activeLeagueData?.games?.appearences}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Lineups: {activeLeagueData?.games?.lineups}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Minutes played: {activeLeagueData?.games?.minutes}</h2></SmallHolderRowAround>
                {activeLeagueData?.games?.rating !== null && <SmallHolderRowAround><h2>Rating: {(parseFloat(activeLeagueData?.games?.rating))}</h2></SmallHolderRowAround>}
                </Holder>
                <Holder>
                <h3>GOALS</h3>
                <SmallHolderRowAround><h2>Goals: {activeLeagueData?.goals?.total !== null ? activeLeagueData?.goals?.total : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Assists: {activeLeagueData?.goals?.assists !== null ? activeLeagueData?.goals?.assists : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Goals conceded: {activeLeagueData?.goals?.conceded !== null ? activeLeagueData?.goals?.conceded : 0}</h2></SmallHolderRowAround>
                </Holder>
                </Row>

                <Row>
                <Holder>
                <h3>SHOTS</h3> 
                <SmallHolderRowAround><h2>Total shots: {activeLeagueData?.shots?.total !== null ? activeLeagueData?.shots?.total : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>On target: {activeLeagueData?.shots?.on !== null ? activeLeagueData?.shots?.on : 0}</h2></SmallHolderRowAround>
                </Holder>
                <Holder>
                <h3>DUELS</h3> 
                <SmallHolderRowAround><h2>Total duels: {activeLeagueData?.duels?.total !== null ? activeLeagueData?.duels?.total : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Won: {activeLeagueData?.duels?.won !== null ? activeLeagueData?.duels?.won : 0}</h2></SmallHolderRowAround>
                </Holder>
                </Row>

                <Row>
                <Holder>
                <h3>PASSES</h3> 
                <SmallHolderRowAround><h2>Total Passes: {activeLeagueData?.passes?.total !== null ? activeLeagueData?.passes?.total : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Key Passes: {activeLeagueData?.passes?.key !== null ? activeLeagueData?.passes?.key : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Accuracy: {activeLeagueData?.passes?.accuracy !== null ? activeLeagueData?.passes?.accuracy + "%" : "N/A"}</h2></SmallHolderRowAround>
                </Holder>
                <Holder>
                <h3>TACKLES</h3> 
                <SmallHolderRowAround><h2>Total: {activeLeagueData?.tackles?.total !== null ? activeLeagueData?.tackles?.total : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Blocks: {activeLeagueData?.tackles?.blocks !== null ? activeLeagueData?.tackles?.blocks : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Interceptions: {activeLeagueData?.tackles?.interceptions !== null ? activeLeagueData?.tackles?.interceptions : 0}</h2></SmallHolderRowAround>
                </Holder>
                </Row>                

                <Row>
                <Holder>
                <h3>DRIBBLES</h3> 
                <SmallHolderRowAround><h2>Attempts: {activeLeagueData?.dribbles?.attempts !== null ? activeLeagueData?.dribbles?.attempts : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Successful: {activeLeagueData?.dribbles?.success !== null ? activeLeagueData?.dribbles?.success : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Past: {activeLeagueData?.dribbles?.past !== null ? activeLeagueData?.dribbles?.past : 0}</h2></SmallHolderRowAround>
                </Holder>
                <Holder>
                <h3>SUBSTITUTES</h3> 
                <SmallHolderRowAround><h2>In: {activeLeagueData?.substitutes?.in !== null ? activeLeagueData?.substitutes?.in : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Out: {activeLeagueData?.substitutes?.out !== null ? activeLeagueData?.substitutes?.out : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Bench: {activeLeagueData?.substitutes?.bench !== null ? activeLeagueData?.substitutes?.bench : 0}</h2></SmallHolderRowAround>
                </Holder>
                </Row>

                <Row>
                <Holder>
                <h3>FOULS</h3> 
                <SmallHolderRowAround><h2>Committed: {activeLeagueData?.fouls?.committed !== null ? activeLeagueData?.fouls?.committed : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Drawn: {activeLeagueData?.fouls?.drawn !== null ? activeLeagueData?.fouls?.drawn : 0}</h2></SmallHolderRowAround>
                </Holder>
                <Holder>
                <h3>CARDS</h3> 
                <SmallHolderRowAround><h2>Yellow: {activeLeagueData?.cards?.yellow}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Red: {activeLeagueData?.cards?.red}</h2></SmallHolderRowAround>
                </Holder>
                </Row>

                <Row>
                <Holder>
                <h3>PENALTY</h3> 
                <SmallHolderRowAround><h2>Won: {activeLeagueData?.penalty?.won !== null ? activeLeagueData?.penalty?.won : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Committed: {activeLeagueData?.penalty?.commited !== null ? activeLeagueData?.penalty?.commited : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Scored: {activeLeagueData?.penalty?.scored !== null ? activeLeagueData?.penalty?.scored : 0}</h2></SmallHolderRowAround>
                <SmallHolderRowAround><h2>Missed: {activeLeagueData?.penalty?.missed !== null ? activeLeagueData?.penalty?.missed : 0}</h2></SmallHolderRowAround>
                </Holder> 
                </Row>
                </Section>
          </motion.div>
    </AnimatePresence>
  )
}

export default PlayerStatsMenu

