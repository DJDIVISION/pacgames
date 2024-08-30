import React, {useEffect, useState, useRef} from 'react'
import {Section,LeagueCarousel,InnerLeagueCarousel,LeagueButton} from './index'
import axios from 'axios';
import {Button,CircularProgress } from '@mui/material'
import {message} from 'antd'

const Matches = () => {

    const [loading, setLoading] = useState(false)
    const [sports, setSports] = useState([])
    const [segunda, setSegunda] = useState([])
    const [premier, setPremier] = useState([])
    const [championship, setChampionship] = useState([])
    const [national, setNational] = useState([])
    const [champions, setChampions] = useState([])
    const leagues = localStorage.getItem("leagues")
    const matchDetails = localStorage.getItem("matchDetails")
    const [width, setWidth] = useState();
    const carroussel = useRef();

    useEffect(() => {
        const getWidth = () => {
            if(carroussel.current === undefined){
                setWidth(0)
            } else {
                setWidth(carroussel.current.scrollWidth - carroussel.current.offsetWidth);
            }
        };
        getWidth();
    }, [carroussel]);

    const options = {
        method: 'GET',
        url: 'https://pinnacle-odds.p.rapidapi.com/kit/v1/sports',
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'pinnacle-odds.p.rapidapi.com'
        }
    };

    /* const getSports = async () => {
        try {
            const response = await axios.request(options);
            console.log(response.data);
            setSports(response.data)
            const str = JSON.stringify(response.data)
            localStorage.setItem("sports", str)
            message.success("sports fetched")
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getSports();
    }, []) */

    const getEvents = async () => {
        
        if(matchDetails === null){
            setLoading(true)
            try{
                const response = await axios.request(options);
                console.log(response.data);
                const str = JSON.stringify(response.data)
                localStorage.setItem("matchDetails", str)
            } catch (err) {
                console.log(err)
            }
            setLoading(false)
            message.success("leagues collected!")
        } else {
            setLoading(true)
            const json = JSON.parse(matchDetails)
            const events = json.events
            console.log(events)
            const liga = []
            const seg = []
            const prem = []
            const cham = []
            const nat = []
            events.forEach(el => {
                if(el.league_id === 2196){
                    liga.push(el)
                }
                if(el.league_id === 2432){
                    seg.push(el)
                }
                if(el.league_id === 1980){
                    prem.push(el)
                }
                if(el.league_id === 1978){
                    nat.push(el)
                }
                if(el.league_id === 1977){
                    cham.push(el)
                }
                setSegunda(seg)
                setPremier(prem)
                setNational(nat)
                setChampionship(cham)
            })
            setLoading(false)
        }
    }

    /* console.log(laLiga)
    console.log(segunda)
    console.log(premier)
    console.log(national)
    console.log(championship) */

    useEffect(() => {
        getEvents();
    }, [])

  return (
    <Section>
        {loading ? (
            <CircularProgress color="secondary" />
        ) : (
            <LeagueCarousel ref={carroussel}>
                <InnerLeagueCarousel drag="x" dragConstraints={{right: 0, left: -width}} whileTap={{cursor: 'grabbing'}}>
                    {laLiga.length > 0 && <LeagueButton>LA LIGA</LeagueButton>}
                    {segunda.length > 0 && <LeagueButton>SEGUNDA</LeagueButton>}
                    {premier.length > 0 && <LeagueButton>PREMIER LEAGUE</LeagueButton>}
                    {championship.length > 0 && <LeagueButton>CHAMPIONSHIP</LeagueButton>}
                    {national.length > 0 && <LeagueButton>NATIONAL</LeagueButton>}
                    {champions.length > 0 && <LeagueButton>CHAMPIONS</LeagueButton>}
                </InnerLeagueCarousel>
            </LeagueCarousel>
        )}
        
    </Section>
  )
}

export default Matches
