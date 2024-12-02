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

  
    

  return (
    <>
    <BetSection style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <StyledButton /* onClick={fetchH2H} */ onClick={() => navigate('/crypto-prediction')}>GO</StyledButton>
    </BetSection>
    <SendFantasy />
    </>
  )
}

export default Admin


