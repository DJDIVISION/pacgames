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
    const [allPlayers, setAllPlayers] = useState([])
    const [topPlayers, setTopPlayers] = useState([])
    const [matchesProcessed, setMatchesProcessed] = useState(false);
    const [imagesProcessed, setImagesProcessed] = useState(false);
    const [imageUrls, setImageUrls] = useState([])
    const [newTeams, setNewTeams] = useState([])
    const [startDate, setStartDate] = useState("2024-11-26 20:30:00")
    const [endDate, setEndDate] = useState('2024-12-01 23:00:00')
    /* console.log(leagues) */

    const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    const fetchTopPlayers = async () => {
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {date: '2024-12-01'},
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      
      try {
        let matches = []
        const response = await axios.request(options);
        console.log(response.data.response);
        for (const match of response.data.response){
          if(match.league.id === 39 || match.league.id === 61 || match.league.id === 78 ||
            match.league.id === 135 ||match.league.id === 140){
              matches.push(match.fixture.id)
            }
        }
        await fetchPlayerRating(matches)
        await delay(1000);
      } catch (error) {
        console.error(error);
      }
    }

    const fetchPlayerRating = async (matches) => {
      for (const match of matches){
        const options = {
          method: 'GET',
          url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
          params: {id: match},
          headers: {
            'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
            'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
          }
        };
        try {
          const response = await axios.request(options);
          console.log(response.data.response);
          const players = []
          response.data.response[0].players.forEach((team) => {
            for(const player of team.players){
              //console.log(player)
              const rating = player.statistics[0].games.rating
              const parsed = parseFloat(parseFloat(rating).toFixed(2))
              player.player.rating = parsed
              players.push(player.player)
            }
            
          })
          setAllPlayers((prevPlayers) => [...prevPlayers, ...players]);
        } catch (error) {
          console.error(error);
        }
        await delay(1000);
      }
      setMatchesProcessed(true);
    }

    const processData = () => {
      //console.log('All players:', allPlayers);
      const topTenPlayers = allPlayers
      .filter(player => !isNaN(player.rating)) // Exclude players with NaN ratings
      .sort((a, b) => b.rating - a.rating)    // Sort by rating in descending order
      .slice(0, 10);                          // Take the first 10 players

      setTopPlayers(topTenPlayers);
      const images = []
      for (const player of topTenPlayers){
        images.push(player.photo)
      }
      setImageUrls(images)
      setImagesProcessed(true)
    };

    const processImages = async () => {
      console.log(imageUrls)
      let result = topPlayers.map((player, index) => {
            let icon
            if(index === 0){
              icon = "1️⃣"
            }
            if(index === 1){
              icon = "2️⃣"
            }
            if(index === 2){
              icon = "3️⃣"
            }
            if(index === 3){
              icon = "4️⃣"
            }
            if(index === 4){
              icon = "5️⃣"
            }
            if(index === 5){
              icon = "6️⃣"
            }
            if(index === 6){
              icon = "7️⃣"
            }
            if(index === 7){
              icon = "8️⃣"
            }
            if(index === 8){
              icon = "9️⃣"
            }
            if(index === 9){
              icon = "🔟"
            }
        return `\n${icon} ${player.name} - ${player.rating}`
      }).join("\n")
      const messageToSend = `📊 Top 10 players of 2024/12/01 📊 \n ${result}`
      console.log(messageToSend)
      try {
      
        const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend,imageUrls });
        
        if (response.data.success) {
          console.log('Message sent successfully!');
        } else {
          console.log('Failed to send message');
        }
      } catch (error) {
        console.log('Error sending message', error);
      }
    }

    
  
    useEffect(() => {
      if (imagesProcessed) {
        processImages();
      }
    }, [imagesProcessed]);
    useEffect(() => {
      if (matchesProcessed) {
        processData();
      }
    }, [matchesProcessed, allPlayers]);
    

  return (
    <>
    <BetSection style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <StyledButton onClick={fetchTopPlayers} /* onClick={() => navigate('/newroulette')} */>REQUEST</StyledButton>
    </BetSection>
    <SendFantasy />
    </>
  )
}

export default Admin


