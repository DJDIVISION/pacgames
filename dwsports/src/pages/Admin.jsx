import React, {useEffect, useState} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { ArrowLeftRelative, BetSection, StyledButton } from './index'
import { first, set } from 'lodash'
import SendFantasy from '../components/admin/SendFantasy'
import { AbsoluteIconButtonLeft } from './indexThree'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../supabase/client'

const Admin = () => {

    const navigate = useNavigate()
    const [allTeams, setAllTeams] = useState([])
    
    const fetchTeams = async () => {
        const teams = []
        const { data: firstData, error: firstError } = await supabase
            .from('fantasyFootball')
            .select('nextMatch')
            

        if (firstError) {
            console.log("error", firstError);
        } else {
            console.log(firstData)
            const teams = []
            firstData.forEach((player) => {
                console.log(player.nextMatch)
            })
            setAllTeams(teams)
        }
    }

    console.log(allTeams)


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


