import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import styled from 'styled-components';
import {CloseStats} from './index'
import { item } from '../../pages';
import axios from 'axios';
import { FantasyState } from '../../context/FantasyContext';

const LeagueStats = ({leagueStatsMenu,setLeagueStatsMenu}) => {

    const {activeLeagueId, setActiveLeagueId} = FantasyState();
    const [teams, setTeams] = useState({})
    const [league, setLeague] = useState({})
    console.log(activeLeagueId)
    const fetchStandings = async () => {
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/standings',
            params: {
              league: activeLeagueId,
              season: '2024'
            },
            headers: {
              'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
          };
          
          try {
              const response = await axios.request(options);
              console.log(response)
              setTeams(response.data.response[0].league.standings);
              setLeague(response.data.response[0].league)
          } catch (error) {
              console.error(error);
          }
    }

    useEffect(() => {
        fetchStandings();
    }, [activeLeagueId])

    console.log(teams[0])
    console.log(league)

    const closeLeagueMenu = () => {
        setLeagueStatsMenu(false)
      }

  return (
    <StyledMenu>
      <CloseStats onClick={closeLeagueMenu} style={{top: '60px', left: '50px'}}/>
      <LeagueHolder>
        <LeagueName><h2>{league.name}</h2></LeagueName>
        <LeagueLogo>
            <LeagueLogoHolder style={{backgroundImage: `url(${league.logo})`, backgroundSize: '90%',
        backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}></LeagueLogoHolder>
        </LeagueLogo>
        <LeagueName><h2>{league.season}</h2></LeagueName>
      </LeagueHolder>
      <TeamsHolder initial="hidden"
        animate="visible"
        variants={{
            hidden: { opacity: 0 },
            visible: {
            opacity: 1,
            transition: { staggerChildren: 0.3 }
            },
        }}>
            <StaggerTopRow initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3}} >
                    <TeamPositionContainer><h2>{}</h2></TeamPositionContainer>
                    <TeamLogoContainer>
                        
                    </TeamLogoContainer>
                    <TeamNameContainer><h2></h2></TeamNameContainer>
                    <TeamPointsContainer><h2>M</h2></TeamPointsContainer>
                    <TeamPointsContainer><h2>W</h2></TeamPointsContainer>
                    <TeamPointsContainer><h2>D</h2></TeamPointsContainer>
                    <TeamPointsContainer><h2>L</h2></TeamPointsContainer>
                    <TeamPointsContainer><h2>DIFF</h2></TeamPointsContainer>
                    <TeamPointsContainer><h2>GOALS</h2></TeamPointsContainer>
                    <TeamPointsContainer><h2>POINTS</h2></TeamPointsContainer>
                </StaggerTopRow>
            {teams[0]?.map((team,index) => {
                return(
                    <StaggerRow initial={{ opacity: 0, y: 40 }} 
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 * index }} >
                    <TeamPositionContainer><h2>{team.rank}</h2></TeamPositionContainer>
                    <TeamLogoContainer>
                        <TeamLogo style={{backgroundImage: `url(${team.team.logo})`, backgroundSize: '90%',
        backgroundRepeat: 'no-repeat', backgroundPosition: 'center'}}></TeamLogo>
                    </TeamLogoContainer>
                    <TeamNameContainer><h2>{team.team.name}</h2></TeamNameContainer>
                    <TeamPositionContainer><h2>{team.all.played}</h2></TeamPositionContainer>
                    <TeamPositionContainer><h2>{team.all.win}</h2></TeamPositionContainer>
                    <TeamPositionContainer><h2>{team.all.draw}</h2></TeamPositionContainer>
                    <TeamPositionContainer><h2>{team.all.lose}</h2></TeamPositionContainer>
                    <TeamPositionContainer><h2>{team.goalsDiff}</h2></TeamPositionContainer>
                    <TeamPointsContainer><h2>{team.all.goals.for} / {team.all.goals.against}</h2></TeamPointsContainer>
                    <TeamPositionContainer><h2>{team.points}</h2></TeamPositionContainer>
                </StaggerRow>
                )
            })}
      </TeamsHolder>
    </StyledMenu>
  )
}

export default LeagueStats

const TeamLogoContainer = styled.div`
    width: 15%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;

const TeamNameContainer = styled.div`
    width: 25%;
    height: 100%;
    ${props => props.theme.displayFlex};
    padding: 0 5px;
    white-space: nowrap;      
    overflow: hidden;         
    text-overflow: ellipsis;
    h2{
        color: ${props => props.theme.text};
        font-size: 12px;
        font-weight: bold;
    }
`;

const TeamPointsContainer = styled.div`
    width: 10%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
    h2{
        color: ${props => props.theme.text};
        font-size: 6px;
        font-weight: bold;
    }
`;


const TeamPositionContainer = styled.div`
    width: 10%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    h2{
        color: ${props => props.theme.text};
        font-size: 16px;
        font-weight: bold;
    }
`;

const TeamLogo = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    border: 3px solid ${props => props.theme.text};
`;

const StaggerRow = styled(motion.div)`
    width: 98%;
    min-height: 50px;
    ${props => props.theme.displayFlexCenter};
    margin: 2px 0;
    border: 1px solid ${props => props.theme.text};
    border-radius: 8px;
`;

const StaggerTopRow = styled(motion.div)`
    width: 98%;
    min-height: 20px;
    ${props => props.theme.displayFlexCenter};
    margin: 2px 0;
    border: 1px solid ${props => props.theme.text};
    border-radius: 8px;
`;

const StyledMenu = styled(motion.div)`
    &&&{
    background-color: ${({ theme }) => theme.darkBg};
    width: 100vw;
    max-height: 100vh;
    position: absolute;
    top: 0;
    left: 0;
    padding: 20px;
    ${props => props.theme.displayFlexColumnCenter};
    z-index: 2;
    }
`;

const LeagueHolder = styled.div`
    width: 100%;
    height: 200px;
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexColumn};
    background: ${props => props.theme.card};
    box-shadow: inset 0 0 25px ${props => props.theme.text};
    border-radius: 10px;
`;

const TeamsHolder = styled(motion.div)`
    width: 100%;
    height: calc(100vh - 220px);
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexColumn};
    background: ${props => props.theme.card};
    box-shadow: inset 0 0 25px ${props => props.theme.text};
    border-radius: 10px;
    margin: 10px 0;
    overflow-y: auto;
    padding: 10px;
`;

const LeagueName = styled.div`
    width: 100%;
    height: 15%;
    text-align: center;
    ${props => props.theme.displayFlexCenter};
    h2{
        color: ${props => props.theme.text};
        font-size: 20px;
        font-weight: bold;
    }
`;

const LeagueLogo = styled.div`
    width: 100%;
    height: 70%;
    ${props => props.theme.displayFlexColumnCenter};
`;

const LeagueLogoHolder = styled.div`
    width: 130px;
    height: 130px;
    border-radius: 50%;
    border: 3px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexColumn};
`;
