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

  const fetchH2H = async () => {
    const options = {
      method: 'GET',
      url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures/headtohead',
      params: {h2h: '42-33'},
      headers: {
        'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
        'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
      }
    };
    
    try {
      const response = await axios.request(options);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  }
    

  return (
    <>
    <BetSection style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <StyledButton onClick={fetchH2H} /* onClick={() => navigate('/newroulette')} */>SEND</StyledButton>
    </BetSection>
    <SendFantasy />
    </>
  )
}

export default Admin


