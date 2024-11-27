import React from 'react'
import {FantasySection,Title} from './index.jsx'
import axios from 'axios'
import { StyledButton } from '../index.jsx'
import { supabase } from '../../supabase/client.jsx'
import { message } from 'antd'

const SendFantasy = () => {

  const getData = async () => {
    const allIds = [];
    const { data: firstData, error: firstError } = await supabase
        .from('footballPlayers')
        .select('id')
        .eq("leagueName", "Ligue 1");

    if (firstError) {
        console.log("firstError", firstError);
    } else {
        firstData.forEach((el) => {
            allIds.push(el.id);
        });
    }

    console.log(allIds);
    await writeData(allIds);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const writeData = async (allIds) => {
    for (const id of allIds) {
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players',
        params: {
          id: id,
          season: '2024'
        },
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      try {
        const response = await axios.request(options);
        console.log(response.data.response);
        for(const player of response.data.response){
          for(const stat of player.statistics){
            if(stat.league.name === "Ligue 1"){
              const rating = stat.games.rating
              const parsed = parseFloat(rating).toFixed(2)
              console.log(parsed)
              const { data: firstData, error: firstError } = await supabase
              .from('footballPlayers')
              .update({rating: parsed})
              .eq("id", response.data.response[0].player.id);
  
            if (firstError) {
              console.log("firstError", firstError);
            } else {
              console.log(`updated data for ${player.player.name}`)
            }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
      await delay(1000);
    }
  }

  const fetchTeam = async () => {
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/players',
      params: {
        id: '17',
        season: '2024'
      },
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    
    
    try {
      const response = await axios.request(options);
      console.log(response.data.response[0])
      response.data.response[0].forEach((player) => {
        console.log(player)
        /* if(stat.league.name === "Serie A"){
          const rating = stat.games.rating
          const parsed = parseFloat(rating).toFixed(2)
          console.log(parsed)
          console.log(player)
        } */
      })
    } catch (error) {
      console.error(error);
    }
  }


  return (
    <FantasySection>
      <Title><h2>Ligue 1</h2></Title>
      <StyledButton onClick={getData}>REQUEST</StyledButton>
    </FantasySection>
  )
}

export default SendFantasy
