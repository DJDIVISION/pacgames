import React, {useState,useEffect} from 'react'
import Sports from '../components/Sports'
import {BetSection,ArrowUp,SportsButtonRow,item,Match,BetWrapper,MatchColumn,MatchDate,MatchLogo,MatchTime,
    MatchOdds,OddsColumn,StatsIcon,MatchWrapper,MatchTeam,ArrowLeft
} from './index'
import Countries from '../components/Countries'
import { BetState } from '../context/BetsContext'
import Leagues from '../components/Leagues'
import { motion } from 'framer-motion'
import {CircularProgress,IconButton} from '@mui/material';
import {premierLeague,laLiga, serieA} from '../data/sportsData'
import {premierMatches,laLigaMatches} from '../data/nextMatches'
import MatchStats from '../components/MatchStats'
import SelectedBet from '../components/SelectedBet'
import {Link as LinkR} from 'react-router-dom'
import { animationOne, animationTwo, transition, transitionLong } from '../animations'

const Bets = () => {

    const [activeSportMenu, setActiveSportMenu] = useState(true);
    const [activeCountryMenu, setActiveCountryMenu] = useState(false);
    const [activeLeaguesMenu, setActiveLeaguesMenu] = useState(false);
    const [selectedBetMenu, setSelectedBetMenu] = useState(false);
    const [betsMenu, setBetsMenu] = useState(false);
    const {activeSport, setActiveSport} = BetState();
    const {activeCountry, setActiveCountry} = BetState();
    const {activeLeague, setActiveLeague} = BetState();
    const {activeMatches, setActiveMatches} = BetState();
    const {homeTeam, setHomeTeam} = BetState([])
    const {awayTeam, setAwayTeam} = BetState([])
    const {matchToBet, setMatchToBet} = BetState([])
    const [matchStatsMenu, setMatchStatsMenu] = useState(false)
    const [selectedBet, setSelectedBet] = useState(null);
    const {homeTeamLogo, setHomeTeamLogo} = BetState()
    const {awayTeamLogo, setAwayTeamLogo} = BetState()
    const {homeTeamPlayers, setHomeTeamPlayers} = BetState()
    const {awayTeamPlayers, setAwayTeamPlayers} = BetState()

    useEffect(() => {
        if(activeCountry === 'England'){
            setActiveLeague(premierLeague)
        }
        if(activeCountry === 'Spain'){
            setActiveLeague(laLiga)
        }
        if(activeCountry === 'Italy'){
            setActiveLeague(serieA)
        }
    }, [activeCountry])



    const Switch = () => {
        if(activeCountryMenu === true){
            setActiveCountryMenu(false)
            setActiveSportMenu(true)
        }
        if(activeLeaguesMenu === true){
            setActiveLeaguesMenu(false)
            setActiveCountryMenu(true)
        }
        setBetsMenu(false)
    }

    /* const [dataLoaded, setDataLoaded] = useState(false);

    useEffect(() => {
        if (premierLeague && premierMatches) {
            setDataLoaded(true);
        }
    }, []);

    if(!dataLoaded){
        return(
            <CircularProgress color="secondary" />
        )
    } */

    const setBet = (match, odd) => {
        console.log(match)
        console.log(odd.target.innerText)
    }

    const setStats = (match,homeTeam,awayTeam) => {
        setHomeTeam(match.home)
        setAwayTeam(match.away)
        setMatchToBet(match)
        setMatchStatsMenu(true)
    }

    console.log(selectedBet)

    const handleBetClick = (match, betType, oddValue, homeTeam, awayTeam) => {
        if(selectedBet === null){
            setSelectedBet({ match, betType, oddValue });
            setSelectedBetMenu(true)
            setHomeTeamLogo(homeTeam.logo)
            setAwayTeamLogo(awayTeam.logo)
            //setBetsMenu(false)
            console.log(match)
            console.log(betType)
            console.log(oddValue)
        } else {
            setSelectedBet(null)
        }
        // Perform additional actions if needed, such as updating the state elsewhere or logging
    };

    return (
        <motion.div initial="out" animate="in" variants={animationOne} transition={transition}>
        <BetSection>
            <SportsButtonRow>
            { !activeCountryMenu && !activeLeaguesMenu && !selectedBetMenu && <LinkR to="/"><ArrowLeft /></LinkR>}
            {activeSportMenu && (
                <Sports activeSportMenu={activeSportMenu} setActiveSportMenu={setActiveSportMenu} activeCountryMenu={activeCountryMenu} setActiveCountryMenu={setActiveCountryMenu}/>
            )}
            {activeCountryMenu && (
            <>
            <ArrowUp onClick={Switch} />
                 <Countries activeSportMenu={activeSportMenu} setActiveSportMenu={setActiveSportMenu} activeCountryMenu={activeCountryMenu} setActiveCountryMenu={setActiveCountryMenu}
                activeLeaguesMenu={activeLeaguesMenu} setActiveLeaguesMenu={setActiveLeaguesMenu} betsMenu={betsMenu} setBetsMenu={setBetsMenu}/>
                </>
            )}
            {activeLeaguesMenu && (
                <>
                <ArrowUp onClick={Switch} />
                <Leagues />
                </>
            )}
            {selectedBetMenu && (
                <SelectedBet selectedBetMenu={selectedBetMenu} setSelectedBetMenu={setSelectedBetMenu} setSelectedBet={setSelectedBet} selectedBet={selectedBet}/>
            )}
            </SportsButtonRow>
                {betsMenu && (
                <>
                {!selectedBetMenu && <ArrowUp onClick={Switch} />}
                <BetWrapper>
                <motion.div  variants={item}
                initial={{height:0,opacity:0}}
                animate={{height: '100%', opacity:1}}
                transition={{duration:.5}}
                exit="exit">
                        {activeMatches.map((match) => {
                            const homeTeam = activeLeague[match.home];
                            const awayTeam = activeLeague[match.away];
                            if(homeTeam && awayTeam){
                                setHomeTeamPlayers(homeTeam.players)
                                setAwayTeamPlayers(awayTeam.players)
                            }
                            if (!homeTeam || !awayTeam) {
                                console.warn(`Team data missing for: ${match.home} or ${match.away}`);
                                return null;
                            }
                    return(
                        <MatchWrapper key={match.id}>
                        <Match >
                            <MatchColumn>
                                <MatchLogo>
                                    <img src={homeTeam.logo} alt="homeTeam" />
                                </MatchLogo>
                                <MatchTeam>{homeTeam.name}</MatchTeam>
                            </MatchColumn>
                            <MatchColumn>
                                <MatchDate>{match.date}</MatchDate>
                                <MatchTime>{match.time}</MatchTime>
                                <MatchOdds>
                                    <OddsColumn isSelected={selectedBet?.match.id === match.id && selectedBet?.betType === '1'}
                                        onClick={() => handleBetClick(match, '1', match[1], homeTeam, awayTeam)}><span>1 - </span>{(match[1]).toFixed(2)}</OddsColumn>
                                    <OddsColumn isSelected={selectedBet?.match.id === match.id && selectedBet?.betType === 'X'}
                                        onClick={() => handleBetClick(match, 'X', match.X, homeTeam, awayTeam)}><span>X - </span>{(match.X).toFixed(2)}</OddsColumn>
                                    <OddsColumn isSelected={selectedBet?.match.id === match.id && selectedBet?.betType === '2'}
                                        onClick={() => handleBetClick(match, '2', match[2], homeTeam, awayTeam)}><span>2 - </span>{(match[2]).toFixed(2)}</OddsColumn>
                                </MatchOdds>
                            </MatchColumn>
                            <MatchColumn>
                                <MatchLogo>
                                    <img src={awayTeam.logo} alt="awayTeam" />
                                </MatchLogo>
                                <MatchTeam>{awayTeam.name}</MatchTeam>
                            </MatchColumn>
                        </Match>
                        <StatsIcon onClick={() => setStats(match,homeTeam,awayTeam)}/>
                        </MatchWrapper>
                    )
                })}
                </motion.div>
                </BetWrapper>
                </>
            )}
            {matchStatsMenu && (
                <MatchStats matchStatsMenu={matchStatsMenu} setMatchStatsMenu={setMatchStatsMenu}/>
            )}
            
        </BetSection>
        </motion.div>
    );
}

export default Bets
