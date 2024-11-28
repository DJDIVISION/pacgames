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
    const [startDate, setStartDate] = useState("2024-11-15 20:30:00")
    const [endDate, setEndDate] = useState('2024-11-25 23:00:00')
    /* console.log(leagues) */

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchTeams = async () => {
      const teams = []
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
          setAllTeams(teams)
      }
  }

  console.log(allTeams)

  useEffect(() => {
    if(allTeams){
      fetchRating(allTeams)
      console.log(allTeams)
    }
  }, [allTeams])

  const fetchRating = async () => {
    for(const team of allTeams){
        console.log(team)
        const areas = Object.values(team.nextMatch.players)
            for (const area of areas) {
                for (const player of area){
                    let currentRound
                    const filter = leagues.filter((el) => el.league === player.leagueName)
                    
                    currentRound = filter[0].currentRound
                    
                    if(currentRound){
                        const {data, error} = await supabase
                        .from("fixtures")
                        .select(`${currentRound}`)
                        .eq("leagueName", player.leagueName);
                        if (error) {
                            console.error(`Error fetching data for ${leagueName}:`, response.error);
                            return null;
                        } else {
                            console.log(data)
                            data[0][currentRound].forEach(async (match) => {
                                
                                await fetchFixtureData(match.fixture.id,player.id,player.teamName)
                            })
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                }
            }
        /* const start = new Date(startDate)
        const end = new Date(endDate)
        const now = new Date(team.date);
        console.log(now)
        const isBetween = now >= start && now <= end;
        if(isBetween){
            console.log(team.players)
            const areas = Object.values(team.players)
            for (const area of areas) {
                for (const player of area){
                    let currentRound
                    const filter = leagues.filter((el) => el.league === player.leagueName)
                    
                    currentRound = filter[0].currentRound
                    
                    if(currentRound){
                        const {data, error} = await supabase
                        .from("fixtures")
                        .select(`${currentRound}`)
                        .eq("leagueName", player.leagueName);
                        if (error) {
                            console.error(`Error fetching data for ${leagueName}:`, response.error);
                            return null;
                        } else {
                            console.log(data)
                            data[0][currentRound].forEach(async (match) => {
                                
                                await fetchFixtureData(match.fixture.id,player.id,player.teamName)
                            })
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                }
            }
        } */
    }
}
  
  async function fetchFixtureData(fixtureId,playerId,teamName) {
      const options = {
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
          params: {id: fixtureId},
          headers: {
            'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
          }
        };
  
      try {
          const response = await axios.request(options);
          /* console.log(response.data.response) */
          response.data.response[0].players.forEach((el) => {
              
              if(el.team.name === teamName && response.data.response[0].fixture.status.short === "FT"){
                  el.players.forEach((player) => {
                      if(player.player.id === playerId){
                          //console.log("player", player)
                          const areas = Object.values(allTeams)
                          console.log(areas)
                          for (const area of areas){
                            console.log(area.nextMatch)
                            for (const man of area.nextMatch.players){
                              if(man.id === playerId){
                                  if(player.statistics[0].games.rating === null){
                                      man.lastMatchRating = 0  
                                  } else {
                                      //localStorage.setItem(`${player.player.name}`, `${player.statistics[0].games.rating}`)
                                      man.lastMatchRating = parseFloat(parseFloat(player.statistics[0].games.rating).toFixed(2))
                                  }
                                  
                              }
                              
                          }
                          }
                      }
                      
                  })
              }
          })
  
      } catch (error) {
          console.error(`Error fetching fixture ${fixtureId}:`, error);
          return null;
      }
      await delay(1000);
  }

    

  return (
    <>
    <BetSection style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <StyledButton onClick={fetchTeams}>REQUEST</StyledButton>
    </BetSection>
    <SendFantasy />
    </>
  )
}

export default Admin


