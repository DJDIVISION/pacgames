import React,{useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import { motion,AnimatePresence } from 'framer-motion'
import { FantasyState } from '../../context/FantasyContext';
import { ButtonAbsolute, CloseChatRoomIcon } from '../chats';
import { StyledAbsolute } from '../../pages/indexTwo';
import { supabase } from '../../supabase/client';
import {Section, Holder, Title, ListItemWrapper,ListWrapper,ListItemSpan,PlayerDataWrapper,PlayerLogo,PlayerStatsWrapper,
    PlayerStatsName,PlayerStatCountry,StatsCountryLocation,PlayerStatsRating,TeamRatingTitle,TeamRating,PlayerStatsNameSmall,
    RatingsContainer,RatingWrapper,HolderRow,Column,ListItemTitle
} from './index'
import { Avatar, Button, TextField } from '@mui/material';
import CountUp from '../../animations/CountUp';
import { message } from 'antd';
import EditPlayerMenu from './EditPlayerMenu';


const PlayerStatsMenu = ({selectedPlayerMenu,setSelectedPlayerMenu}) => {

    const {playerToUpdate, setPlayerToUpdate} = FantasyState();
    const [playerLeagueData, setPlayerLeagueData] = useState({})
    const [latestGamesData, setLatestGamesData] = useState({})
    const [latestRatings, setLatestRatings] = useState([])
    const [average, setAverage] = useState(null)
    const [newRating, setNewRating] = useState("")
    
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
          if(data[0].latestMatches !== null){
            setLatestGamesData(data[0].latestMatches[0] )
          } else {
            console.log("no such data")
          }
            
            
            console.log(data[0].ratings)
            console.log(data[0].latestMatches[0])
            const str = JSON.stringify(data[0].laLigaStats[0])
            localStorage.setItem("mainStats", str);
            //setPlayerChampionsData(data[0].championsStats[0])            
        }
  }

 console.log(playerLeagueData)

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

  /* console.log(playerLeagueData)
  console.log(latestGamesData) */

 /*  const filterObject = (obj) => {
    let result = {};
  
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Recursively filter nested objects
        const nestedResult = filterObject(value);
        if (Object.keys(nestedResult).length > 0) {
          result[key] = nestedResult; // Only add if there are valid nested results
        }
      } else if (value !== null && value > 0) {
        result[key] = value; // Only add the property if it's not null and greater than 0
      }
    });
  
    return result;
  };

  const filteredStats = filterObject(latestGamesData);
  console.log(filteredStats); */
  

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
                <Holder style={{width: '90vw'}}>
                <h3>RATINGS</h3>
                <RatingsContainer>
                    {/* {playerToUpdate.ratings?.map((el) => {
                        return(
                            <RatingWrapper key={el} style={{background: getBackgroundColor(el)}}>{el}</RatingWrapper>
                        )
                    })} */}
                    {latestRatings?.map((el) => {
                        return(
                            <RatingWrapper key={el}  style={{background: getBackgroundColor(el)}}>{el}</RatingWrapper>
                        )
                    })}
                </RatingsContainer>
                <input type="number" style={{width: '200px', height: '50px'}} onChange={((e) => setNewRating(e.target.value))}></input>
                <Button variant="contained" onClick={updatePlayerRatings}>ADD</Button>
                <Button variant="contained" onClick={setRating}>SEND</Button>
                </Holder>
                <div style={{display: 'flex'}}>
                  <Column>
                  <ListItemTitle>ALL GAMES</ListItemTitle>
                <StyledAbsolute onClick={() => {setSelectedPlayerMenu(false);setPlayerToUpdate({})}}><CloseChatRoomIcon /></StyledAbsolute>
                
                {playerToUpdate.injuryType !== null && (
                  <Holder style={{border: '3px solid red'}}>
                    <HolderRow>{playerToUpdate.injuryType}</HolderRow>
                    <HolderRow>{playerToUpdate.injuryReason}</HolderRow>
                  </Holder>
                )}
                  {/* {Object.entries(playerLeagueData).filter(([key, _]) => key !== 'team' && key !== 'league' && key !== "substitutes").map(([key, value]) => (
                    
                      <Holder key={key} style={{ marginBottom: '20px' }}>
                          <h3>{key.toUpperCase()}</h3>
                          <ListWrapper style={{width: '100%'}}>
                              
                              {typeof value === 'object' && !Array.isArray(value) ? (
                                  Object.entries(value).filter(([value, _]) => value !== 'rating').map(([innerKey, innerValue]) => (
                                    <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
                                      <ListItemWrapper key={innerKey}>
                                         <ListItemSpan>{innerKey}:</ListItemSpan>  <h3>{innerValue !== null ? innerValue : ''}</h3>
                                      </ListItemWrapper>
                                      
                                    
                                    {innerKey !== "captain" && (
                                        <>
                                    <button variant="contained"
                                        onClick={() => handleAction(key, innerKey, 'decrement-10')}
                                        style={{ marginLeft: '0px', width: '75px' }}
                                    >
                                        -10
                                    </button>
                                        <button variant="contained"
                                        onClick={() => handleAction(key, innerKey, 'decrement')}
                                        style={{ marginLeft: '0px', width: 'auto' }}
                                    >
                                        -1
                                    </button>
                                    <button variant="contained"
                                    onClick={() => handleAction(key, innerKey, 'decrement-0-1')}
                                    style={{ marginLeft: '0px', width: 'auto' }}
                                >
                                    -0.1
                                </button>
                                <button variant="contained"
                                    onClick={() => handleAction(key, innerKey, 'decrement-0-01')}
                                    style={{ marginLeft: '0px', width: 'auto' }}
                                >
                                    -0.01
                                </button>
                                <button variant="contained"
                                    onClick={() => handleAction(key, innerKey, 'increment-0-01')}
                                    style={{ marginLeft: '0px', width: 'auto' }}
                                >
                                    +0.01
                                </button>
                                    <button variant="contained"
                                    onClick={() => handleAction(key, innerKey, 'increment-0-1')}
                                    style={{ marginLeft: '0px', width: 'auto' }}
                                >
                                    +0.1
                                </button>
                                    <button variant="contained"
                                    onClick={() => handleAction(key, innerKey, 'increment')}
                                    style={{ marginLeft: '0px', width: 'auto' }}
                                >
                                    +1
                                </button>
                                <button variant="contained"
                                    onClick={() => handleAction(key, innerKey, 'increment-10')}
                                    style={{ marginLeft: '0px', width: 'auto' }}
                                >
                                    +10
                                </button>
                                <button variant="contained"
                                    onClick={() => handleAction(key, innerKey, 'increment-50')}
                                    style={{ marginLeft: '0px', width: 'auto' }}
                                >
                                    +50
                                </button>
                                <button variant="contained"
                                    onClick={() => handleAction(key, innerKey, 'increment-100')}
                                    style={{ marginLeft: '0px', width: 'auto' }}
                                >
                                    +100
                                </button>
                                </>
                                    )}
                                    </div>
                                  ))
                              ) : (
                                
                                  <ListItemWrapper>{key}: {value !== null ? value.toString() : 'N/A'}</ListItemWrapper>
                              )}
                          </ListWrapper>
                      </Holder>
                  ))} */}
                  </Column>
                  {/* <Column>
                    <EditPlayerMenu setSelectedPlayerMenu={setSelectedPlayerMenu} setPlayerToUpdate={setPlayerToUpdate} playerLeagueData={playerLeagueData} playerToUpdate={playerToUpdate}/>
                  </Column> */}
                <Column>
                <ListItemTitle>LAST GAME</ListItemTitle>
                  {Object.entries(latestGamesData).map(([key, value]) => (
                    value !== null && ( // Check if the value is not null before rendering the key
                      <Holder key={key} style={{ marginBottom: '20px' }}>
                        <h3>{key.toUpperCase()}</h3>
                        <ListWrapper style={{ width: '100%' }}>

                          {typeof value === 'object' && !Array.isArray(value) ? (
                            // If value is an object, loop through the inner keys
                            Object.entries(value).map(([innerKey, innerValue]) => (
                              innerValue !== null && ( // Ensure the inner value is not null
                                <div key={innerKey} style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                                  <ListItemWrapper>
                                    <ListItemSpan>{innerKey}:</ListItemSpan>
                                    <h3>{innerValue !== null ? innerValue : ''}</h3>
                                  </ListItemWrapper>
                                </div>
                              )
                            ))
                          ) : (
                            // If it's not an object, just display the value
                            <ListItemWrapper>{key}: {value !== null ? value.toString() : 'N/A'}</ListItemWrapper>
                          )}
                        </ListWrapper>
                      </Holder>
                    )
                  ))}
                </Column>
                </div>        

                </Section>
          </motion.div>
    </AnimatePresence>
  )
}

export default PlayerStatsMenu

