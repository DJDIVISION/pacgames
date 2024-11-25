import React from 'react'
import {FantasySection,Title} from './index.jsx'
import axios from 'axios'
import { StyledButton } from '../index.jsx'
import { supabase } from '../../supabase/client.jsx'
import { message } from 'antd'

const SendFantasy = () => {

    const getData = async () => {
        const { data: firstData, error: firstError } = await supabase
            .from('footballPlayers')
            .select('*')
            .eq("leagueName", "Ligue 1")
            .eq("teamId", id);

        if (firstError) {
            console.log("error", firstError);
        }
    }

  return (
    <FantasySection>
      <Title><h2>FANTASY FOOTBALL</h2></Title>
      <StyledButton onClick={getData}>REQUEST</StyledButton>
    </FantasySection>
  )
}

export default SendFantasy
