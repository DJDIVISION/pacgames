import React, {useState} from 'react'
import {FantasySection,Title} from './index.jsx'
import axios from 'axios'
import { StyledButton } from '../index.jsx'
import { supabase } from '../../supabase/client.jsx'
import { message } from 'antd'  

const SendFantasy = () => {

  const [allFantasyTeams, setAllFantasyTeams] = useState([])

  const getAllFantasyTeams = async () => {
    
      const { data: rows, error: firstError } = await supabase
          .from('fantasyFootball')
          .select('*')
          .not('nextMatch', 'is', null);

      if (firstError) {
          console.log("error", firstError);
      } else {
        setAllFantasyTeams(rows)
        console.log(rows)
      }
  }


  return (
    <FantasySection>
      <Title><h2>FANTASY</h2></Title>
      <StyledButton onClick={getAllFantasyTeams}>REQUEST</StyledButton>
    </FantasySection>
  )
}

export default SendFantasy
