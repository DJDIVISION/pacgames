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

const Admin = () => {

    const navigate = useNavigate()
    const [allTeams, setAllTeams] = useState([])
    const [newTeams, setNewTeams] = useState([])
    const [startDate, setStartDate] = useState("2024-11-26 20:30:00")
    const [endDate, setEndDate] = useState('2024-12-01 23:00:00')
    /* console.log(leagues) */

    //const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchTeamsTwo = async () => {
        const { data: firstData, error: firstError } = await supabase
            .from('fantasyFootball')
            .select('nextMatch')
            
    
        if (firstError) {
            console.log("error", firstError);
        } else {
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

    console.log(leagues)

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
          setAllTeams(teams)
          console.log(teams);
          for (const team of teams) {
              const areas = Object.values(team.nextMatch.players);
              for (const area of areas) {
                  for (const player of area){
                      if(player.lastMatchRating === null){
                          player.lastMatchRating = null
                      }
                  } 
              }
              const { error: updateError } = await supabase
                      .from('fantasyFootball')
                      .update({ nextMatch: team.nextMatch}) 
                      .eq('id', team.nextMatch.userId); // Identify which user to update
                      if (updateError) {
                          console.error('Error updating user data:', updateError.message);
                      } else {
                          console.log("All teams have been saved!")
                      }
                  }
                }
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


    

  return (
    <>
    <BetSection style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <StyledButton onClick={fetchTeamsTwo}>REQUEST</StyledButton>
    </BetSection>
    <SendFantasy />
    </>
  )
}

export default Admin


