import React,{useEffect, useState, useRef} from 'react'
import styled from 'styled-components'
import { motion,AnimatePresence } from 'framer-motion'
import { FantasyState } from '../../context/FantasyContext';
import { ButtonAbsolute, CloseChatRoomIcon } from '../chats';
import { StyledAbsolute } from '../../pages/indexTwo';
import { supabase } from '../../supabase/client';
import {Section, Holder, Title, ListItemWrapper,ListWrapper,ListItemSpan,PlayerDataWrapper,PlayerLogo,PlayerStatsWrapper,
    PlayerStatsName,PlayerStatCountry,StatsCountryLocation,PlayerStatsRating,TeamRatingTitle,TeamRating,PlayerStatsNameSmall,
    RatingsContainer,RatingWrapper
} from './index'
import { Avatar, Button, TextField } from '@mui/material';
import CountUp from '../../animations/CountUp';
import { message } from 'antd';


const PlayerStatsMenu = ({selectedPlayerMenu,setSelectedPlayerMenu}) => {

    const {playerToUpdate, setPlayerToUpdate} = FantasyState();
    const [playerLeagueData, setPlayerLeagueData] = useState({})
    const [playerChampionsData, setPlayerChampionsData] = useState({})
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

    const saveDataToSupabase = async (updatedData) => {
        const one = parseFloat(document.getElementById("one").value)
        const two = parseFloat(document.getElementById("two").value)
        const three = parseFloat(document.getElementById("three").value)
        const four = parseFloat(document.getElementById("four").value)
        const five = parseFloat(document.getElementById("five").value)
        const six = parseFloat(document.getElementById("six").value)
        const seven = parseFloat(document.getElementById("seven").value)
        const eight = parseFloat(document.getElementById("eight").value)
        const nine = parseFloat(document.getElementById("nine").value)
        const ten = parseFloat(document.getElementById("ten").value)
        const eleven = parseFloat(document.getElementById("eleven").value)
        const twelve = parseFloat(document.getElementById("twelve").value)
        const thirteen = parseFloat(document.getElementById("thirteen").value)
        const fourteen = parseFloat(document.getElementById("fourteen").value)
        const fifteen = parseFloat(document.getElementById("fifteen").value)
        const sixteen = parseFloat(document.getElementById("sixteen").value)
        const seventeen = parseFloat(document.getElementById("seventeen").value)
        const eighteen = parseFloat(document.getElementById("eighteen").value)
        const nineteen = parseFloat(document.getElementById("nineteen").value)
        const twenty = parseFloat(document.getElementById("twenty").value)
        const twentyone = parseFloat(document.getElementById("twentyone").value)
        const twentytwo = parseFloat(document.getElementById("twentytwo").value)
        const twentythree = parseFloat(document.getElementById("twentythree").value)
        const twentyfour = parseFloat(document.getElementById("twentyfour").value)
        const twentyfive = parseFloat(document.getElementById("twentyfive").value)
        const twentysix = parseFloat(document.getElementById("twentysix").value)
        const twentyseven = parseFloat(document.getElementById("twentyseven").value)
        const twentyeight = parseFloat(document.getElementById("twentyeight").value)
        const twentynine = parseFloat(document.getElementById("twentynine").value)
        const thirty = parseFloat(document.getElementById("thirty").value)
        const thirtyone = parseFloat(document.getElementById("thirtyone").value)
        const thirtytwo = parseFloat(document.getElementById("thirtytwo").value)
        const thirtythree = parseFloat(document.getElementById("thirtythree").value)
        const thirtyfour = parseFloat(document.getElementById("thirtyfour").value)
        const thirtyfive = parseFloat(document.getElementById("thirtyfive").value)
        const thirtysix = parseFloat(document.getElementById("thirtysix").value)
        const thirtyseven = parseFloat(document.getElementById("thirtyseven").value)
        const thirtyeight = parseFloat(document.getElementById("thirtyeight").value)
        const thirtynine = parseFloat(document.getElementById("thirtynine").value)
        const fourty = parseFloat(document.getElementById("fourty").value)
        const fourtyone = parseFloat(document.getElementById("fourtyone").value)
        const fourtytwo = parseFloat(document.getElementById("fourtytwo").value)

        const updatedDataTwo = [
            {
              "main stats": {
                "goals": one,
                "assists": two,
                "appearences": three,
                "lineups": four,
                "minutes played": five,
                "yellow cards": six,
                "red cards": seven
              },
              "shots": {
                "goals": eight,
                "expected goals": nine,
                "total shots": ten,
                "shots on target": eleven
              },
              "passes": {
                "assists": twelve,
                "expected assists": thirteen,
                "successfull passes": fourteen,
                "passes accuracy": fifteen,
                "long balls": sixteen,
                "long balls accuracy": seventeen,
                "big chances created": eighteen,
                "crosses": nineteen,
                "crosses accuracy": twenty
              },
              "possession": {
                "dribbles": twentyone,
                "dribbles accuracy": twentytwo,
                "touches": twentythree,
                "touches opposite half": twentyfour,
                "possession lost": twentyfive,
                "was fouled": twentysix,
                "penalty won": twentyseven
              },
              "defense": {
                "penalties commited": twentyeight,
                "tackles": twentynine,
                "tackles accuracy": thirty,
                "won duels": thirtyone,
                "won duels accuracy": thirtytwo,
                "aerial duels won": thirtythree,
                "aerial duels accuracy": thirtyfour,
                "interceptions": thirtyfive,
                "blocked": thirtysix,
                "fouls commited": thirtyseven,
                "balls recovered": thirtyeight,
                "possession won opp. half": thirtynine,
                "dribbled": fourty
              },
              "discipline": {
                "yellow cards": fourtyone,
                "red cards": fourtytwo
              }
            }
          ]

        console.log(updatedDataTwo)
        /* console.log(updatedData)
        const dataThree = [
            updatedData
        ]*/
        const { data, error } = await supabase
          .from('footballPlayers') // replace with your table name
          .update([{laLigaStats: updatedDataTwo}])
          .eq('id', playerToUpdate.id); // replace with the specific record identifier
    
        if (error) {
          console.error('Error updating Supabase:', error);
        } else {
          console.log('Data successfully updated:', data);
          message.success("Data saved successfully!");
          setSelectedPlayerMenu(false)
          setPlayerToUpdate([])
        } 
    };

    const fetchData = async () => {
        const item = localStorage.getItem("mainStats")
        const json = JSON.parse(item)
        setPlayerLeagueData(json)
    }

    useEffect(() => {
        fetchData();
    }, [])

    const item={
        initial: { height: 0, opacity: 0 },
        animate: { height: "100vh", opacity: 1, transition: { duration: 0.7 } },
        exit: { height: 0, opacity: 0, transition: { duration: 0.7 } }
    }

    
    const sendPlayerRatings = async () => {
        
        const sum = latestRatings.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / latestRatings.length;
        const number = parseFloat(parseFloat(average).toFixed(2))
        const { data, error } = await supabase
            .from('footballPlayers')
            .update({ ratings: latestRatings, rating: number })
            .eq('id', playerToUpdate.id); // Match by player ID

        if (error) {
            console.error('Error updating data:', error);
        } else {
            console.log('Data updated successfully:', data);
            message.success("Data inserted succesfully!")
        }
        setSelectedPlayerMenu(false)
        setPlayerToUpdate([])
        /* const sum = arrayValue.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
        const average = sum / arrayValue.length;
        const number = parseFloat(average).toFixed(2)
        console.log(number)
        const { data, error } = await supabase
            .from('footballPlayers')
            .update({ ratings: arrayValue, rating: number })
            .eq('id', playerToUpdate.id); // Match by player ID

        if (error) {
            console.error('Error updating data:', error);
        } else {
            console.log('Data updated successfully:', data);
            message.success("Data inserted succesfully!")
        } */
    }

    const updatePlayerRatings = async () => {
        console.log(newRating)
        const number = parseFloat(newRating)
        console.log(number)
        console.log(typeof number)
        setLatestRatings((prevArray) => [...prevArray, number]); // Add new element to the array

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

    /* const fetchData = async () => {
        const { data, error } = await supabase
        .from('footballPlayers')
        .select('*')
        .eq("id", playerToUpdate.id)
        if (error) {
        console.error('Error inserting/updating user session data:', error.message)
        } else {
            setPlayerLeagueData(data[0].laLigaStats[0])
            const str = JSON.stringify(data[0].laLigaStats[0])
            localStorage.setItem("mainStats", str);
            setPlayerChampionsData(data[0].championsStats[0])            
        }
    } */

    console.log(latestRatings)
    console.log(playerToUpdate)
  return (
    <AnimatePresence>
          <motion.div className="menu-container-one" variants={item}
              initial="initial"
              animate="animate"
              exit="exit">
                <Section>
                <StyledAbsolute onClick={() => {setSelectedPlayerMenu(false);setPlayerToUpdate({})}}><CloseChatRoomIcon /></StyledAbsolute>
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
                <Holder>
                <h3>RATINGS</h3>
                <RatingsContainer>
                    {playerToUpdate.ratings?.map((el) => {
                        return(
                            <RatingWrapper key={el} style={{background: getBackgroundColor(el)}}>{el}</RatingWrapper>
                        )
                    })}
                    {latestRatings?.map((el) => {
                        return(
                            <RatingWrapper key={el}  style={{background: getBackgroundColor(el)}}>{el}</RatingWrapper>
                        )
                    })}
                </RatingsContainer>
                <input type="number" style={{width: '200px', height: '50px'}} onChange={((e) => setNewRating(e.target.value))}></input>
                <Button variant="contained" onClick={updatePlayerRatings}>ADD</Button>
                <Button variant="contained" onClick={sendPlayerRatings}>SEND</Button>
                </Holder>
                <Holder>
                <h3>MAIN STATS</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="goles"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="one"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="ASSISTS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="two"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="LINEUPS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="four"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="APPEARANCES"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="three"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                
                  <TextField
                    variant="outlined"
                    type="number"
                    label="MINUTES PLAYED"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="five"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="YELLOW"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="six"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="RED"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="seven"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}
                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                <Holder>
                <h3>TIROS</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="goles"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="eight"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="goles expected"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="nine"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="tiros"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="ten"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="a puerta"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="eleven"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  <Holder>
                  <h3>PASES</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="assists"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twelve"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="expected assists"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirteen"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="passes"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fourteen"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="acc passes"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fifteen"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="long shots"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="sixteen"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="acc long"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="seventeen"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="chances created"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="eighteen"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="crosses"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="nineteen"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="acc crosses"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twenty"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  <Holder>
                  <h3>POSESION</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="regates"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="regates"
                    id="twentyone"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="acc regates"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentytwo"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="toques"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentythree"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="toques opposite"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentyfour"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="perdidas"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentyfive"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="faltas recibidas"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentysix"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="penalty won"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentyseven"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  
                  <Holder>
                  <h3>DEFENSA</h3>
                <TextField
                    variant="outlined"
                    type="number"
                    label="PENALTIES"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentyeight"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="tackles"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="twentynine"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="tackles acc"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirty"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="DUELOS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyone"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="DUELOS GANADOS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtytwo"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="AEREOS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtythree"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}
                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="AEREOS GANADOS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyfour"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="intercepciones"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyfive"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="BLOCKED"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtysix"
                    defaultValue='0'
                    
                    slotProps={{
                      input:{
                        style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                      },
                      helperText:{
                        style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                      }
                    }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="FALTAS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyseven"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="RECUPERACIONES"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtyeight"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="POSSESION WON"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="thirtynine"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                <TextField
                    variant="outlined"
                    type="number"
                    label="DRIBBLED"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fourty"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
                  <Holder>
                    <h3>DISCIPLINE</h3>
                    <TextField
                    variant="outlined"
                    type="number"
                    label="AMARILLAS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fourtyone"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  <TextField
                    variant="outlined"
                    type="number"
                    label="ROJAS"
                    sx={{ border: '1px solid white', margin: '0px 0px 10px 0', color: 'white' }}
                    name="goles"
                    id="fourtytwo"
                    defaultValue='0'
                    slotProps={{
                        input:{
                          style: {  color: "white" }
                        },
                        helperText:{
                          style: { fontFamily: "Quicksand", textTransform: "uppercase", color: "white" }
                        }
                      }}

                    style={{ width: '200px', borderRadius: '5px' }}
                  />
                  </Holder>
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
                        <Button variant="contained" onClick={() => saveDataToSupabase(playerLeagueData)}>Save Changes</Button>

                </Section>
          </motion.div>
    </AnimatePresence>
  )
}

export default PlayerStatsMenu

