import React, {useEffect, useState} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { ArrowLeftRelative, BetSection, StyledButton } from './index'
import { first, set } from 'lodash'
import SendFantasy from '../components/admin/SendFantasy'
import { AbsoluteIconButtonLeft } from './indexThree'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'
import { leagues } from '../components/admin'
import { message } from 'antd'

const Admin = () => {

    const navigate = useNavigate()
    const [allPlayers, setAllPlayers] = useState([])
    const [goals, setGoals] = useState([])
    const [matches, setMatches] = useState([])
    const [allTeams, setAllTeams] = useState([])
    const [topPlayers, setTopPlayers] = useState([])
    const [matchesProcessed, setMatchesProcessed] = useState(false);
    const [imagesProcessed, setImagesProcessed] = useState(false);
    const [imageUrls, setImageUrls] = useState([])
    const [newTeams, setNewTeams] = useState([])
    const [startDate, setStartDate] = useState("2024-12-03 20:30:00")
    const [endDate, setEndDate] = useState('2024-12-09 10:00:00')
    /* console.log(leagues) */

    function delay(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    const sendMatchesStarted = async (matches) => {
      for(const match of matches){
        console.log(match)
        const imageUrls = [match.teams.home.logo, match.teams.away.logo]
        
        const messageToSend = `⏳ Match Started ⏳\n\n🇪🇺 UEFA CHAMPIONS LEAGUE\n\n${match.teams.home.name} vs ${match.teams.away.name}\n\nStadium: ${match.fixture.venue.name}\nCity: ${match.fixture.venue.city}`
        console.log(messageToSend)
        try {
    
          const response = await axios.post('http://localhost:8080/send-message', { messageToSend,imageUrls });
          
          if (response.data.success) {
            console.log('Message sent successfully!');
          } else {
            console.log('Failed to send message');
          }
        } catch (error) {
          console.log('Error sending message', error);
        }
        await delay(1000)
      }
      
    }
    
    const sendMatchStarted = async () => {
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {date: '2024-12-11'},
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      const matches = []
      try {
        const response = await axios.request(options);
        console.log(response.data.response);
        const now = new Date();

        // Format date and time components
        const year = now.getUTCFullYear();
        const month = String(now.getUTCMonth() + 1).padStart(2, '0'); // Months are 0-indexed
        const day = String(now.getUTCDate()).padStart(2, '0');
        const hours = String(now.getUTCHours()).padStart(2, '0');
        const minutes = String(now.getUTCMinutes()).padStart(2, '0');
        const seconds = String(now.getUTCSeconds()).padStart(2, '0');

        // Construct the final ISO-like string
        const formattedDate = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}+00:00`;

        console.log(formattedDate);
        for (const match of response.data.response) {
          if (match.league.id === 2 && match.fixture.date > formattedDate) {
            matches.push(match)
          }
        }
        console.log(matches)
        setMatches(matches)
        await sendMatchesStarted(matches)
        
      } catch (error) {
        console.error(error);
      }
    }
        
        
    console.log(matches)    

    

    const readFantasyRatings = async (player) => {
      console.log("player",player)
      let rate = 0
      const userPlayersData = player.players || {}; 
      userPlayersData.players = userPlayersData.players || []; 
      console.log("before",userPlayersData)
      for (const player of userPlayersData.players){
        const { data: firstData, error: firstError } = await supabase
          .from('footballPlayers')
          .select('rating')
          .eq('id', player.id)
        if (firstError) {
            console.log("firstError", firstError);
        } else {
          console.log("firstData",firstData[0].rating)
          rate += firstData[0].rating
          player.rating = firstData[0].rating
          await delay(1000)
        }
      }
      const rating = rate / userPlayersData.players.length
      const parsed = parseFloat(parseFloat(rating).toFixed(2))
      console.log("after",userPlayersData)
      const { data: firstData, error: firstError } = await supabase
          .from('fantasyFootball')
          .update({players: userPlayersData, teamRating: parsed})
          .eq('id', player.id)
        if (firstError) {
            console.log("firstError", firstError);
        } else {
          console.log(`data updated for ${player.id}`)
        }
      await delay(1000);
    }
  
    const getFantasyRatings = async () => {
      const allIds = [];
      const { data: firstData, error: firstError } = await supabase
          .from('fantasyFootball')
          .select('*')
          
  
      if (firstError) {
          console.log("firstError", firstError);
      } else {
        console.log(firstData)
          for (const player of firstData){
            if(player.players !== null){
              allIds.push(player)
              await readFantasyRatings(player);
            }
          }
      }
      
    };

  return (
    <>
    <BetSection style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <StyledButton style={{fontSize: '18px', margin: '20px 0'}} /* onClick={getFantasyRatings} */ onClick={() => navigate('/newroulette')}>newroulette</StyledButton>
    </BetSection>
    <SendFantasy />
    </>
  )
}

export default Admin


///FETCH FINAL FANTASY FINAL FINAL

/* const fetchTeamsTwo = async () => {
  const { data: firstData, error: firstError } = await supabase
      .from('fantasyFootball')
      .select('nextMatch')
      .not('nextMatch', 'is', null);
      

  if (firstError) {
      console.log("error", firstError);
  } else {
    console.log(firstData)
      const teams = []
      firstData.forEach((player) => {
          if(player.nextMatch !== null){
              
              console.log(player)
              const start = new Date(startDate)
              const end = new Date(endDate)
              const now = new Date(player.nextMatch.date);
              if(now >= start && now <= end){
                  teams.push(player)
              }
          }
      })
      fetchRatingTwo(teams)
      console.log(teams)
  }
}

function delay(ms) {
return new Promise((resolve) => setTimeout(resolve, ms));
}

const writeFantasyTeams = async () => {
for(const team of allTeams){
  console.log(team)
  const { data: updateData, error: updateError } = await supabase
      .from('fantasyFootball')
      .select('trainingsNumber') 
      .eq('id', team.nextMatch.userId); // Identify which user to update
      if (updateError) {
          console.error('Error updating user data:', updateError.message);
      } else {
          console.log("hereeeeeeeee",updateData[0].trainingsNumber)
          const allPlayers = Object.values(team.nextMatch.players).flat();
          const totalRating = allPlayers.reduce((sum, player) => sum + player.lastMatchRating, 0);
          const averageRating = totalRating / allPlayers.length;
          const parsed = parseFloat(parseFloat(averageRating).toFixed(2))
          const added = updateData[0].trainingsNumber
          const addedAverage = added * 0.1
          console.log(addedAverage)
          const finalRating = parseFloat(parseFloat(parsed + addedAverage).toFixed(2))
          team.nextMatch.teamAverage = parsed
          team.nextMatch.addedAverage = addedAverage
          team.nextMatch.finalAverage = finalRating
          const updatedData = {
            firstRound: team.nextMatch,
            nextMatch: null,
            trainingsNumber: 0,
            lastTraining: null
          }
          const { data: insertData, error: insertError } = await supabase
          .from('fantasyFootball')
          .update([updatedData]) 
          .eq('id', team.nextMatch.userId); // Identify which user to update
          if (insertError) {
              console.error('Error updating user data:', insertError.message);
          } else {
            console.log(`data updated for ${team.nextMatch.userId}`)
          }
    }
    await delay(1000);
}
}

useEffect(() => {
if(allTeams){
  writeFantasyTeams()
}
},[allTeams])

const fetchRatingTwo = async (teams) => {
  const allFetchPromises = []; // To track all fetchFixtureData calls
  
  for (const team of teams) {
    const areas = Object.values(team.nextMatch.players);
    console.log("areas", areas)
    for (const area of areas) {
      for (const player of area) {
          console.log("player", player)
        let currentRound;
        const filter = leagues.filter((el) => el.league === player.leagueName);
        console.log("filter", filter)
        currentRound = filter[0]?.currentRound;
          
        if (currentRound) {
          const { data, error } = await supabase
            .from("fixtures")
            .select(`${currentRound}`)
            .eq("leagueName", player.leagueName);

          if (error) {
            console.error(`Error fetching data for ${player.leagueName}:`, error);
            return null;
          } else {
            data[0][currentRound].forEach((match) => {
              // Collect the Promise from fetchFixtureData
              const fetchPromise = fetchFixtureData(
                match.fixture.id,
                player.id,
                player.teamName,
                teams
              );
              allFetchPromises.push(fetchPromise); // Add the Promise to the array
            });
          }
        }

        // Add delay here to avoid overwhelming the server with requests
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
    await Promise.allSettled(allFetchPromises);
    console.log("All fetchFixtureData tasks completed!");
  
    // Update the state after all tasks finish
    
    
    for (const team of teams) {
        const areas = Object.values(team.nextMatch.players);
        for (const area of areas) {
            for (const player of area){
                if(player.lastMatchRating === null){
                    player.lastMatchRating = 0
                }
            } 
          }
            }
          }
          setAllTeams(teams)
        }

        async function fetchFixtureData(fixtureId, playerId, teamName, teams) {
          const options = {
            method: "GET",
            url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
            params: { id: fixtureId },
            headers: {
              "x-rapidapi-key": "5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2",
              "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
            },
          };
        
          try {
            const response = await axios.request(options);
        
            // Check if the fixture status is "FT" (Full Time)
            if (response.data.response[0].fixture.status.short === "FT") {
              response.data.response[0].players.forEach((el) => {
                if (el.team.name === teamName) {
                  // Check if player matches and update rating
                  el.players.forEach((player) => {
                    if (player.player.id === playerId) {
                      console.log("Found player:", player);
        
                      const playerRating = player.statistics[0].games.rating;
                      
                      console.log("Player rating:", playerRating);
        
                      // Now, let's ensure the teams data gets updated
                      const areas = Object.values(teams);
                      areas.forEach((team) => {
                        const players = team.nextMatch.players;
                        Object.keys(players).forEach((area) => {
                          players[area].forEach((p) => {
                            if (p.id === playerId) {
                              console.log(`Updating player: ${p.name}`);
                              p.lastMatchRating = playerRating ? parseFloat(parseFloat(playerRating).toFixed(2)) : null;
                            }
                          });
                        });
                      });
                    }
                  });
                }
              });
            }
          } catch (error) {
            console.error(`Error fetching fixture ${fixtureId}:`, error);
          }
        
          // Adding delay to throttle the requests
          await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay
        }  

 */


