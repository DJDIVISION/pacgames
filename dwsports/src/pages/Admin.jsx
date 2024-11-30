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
    const [allTeams, setAllTeams] = useState([])
    const [newTeams, setNewTeams] = useState([])
    const [startDate, setStartDate] = useState("2024-11-15 20:30:00")
    const [endDate, setEndDate] = useState('2024-11-25 23:00:00')
    /* console.log(leagues) */

    //const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

    let processedEvents = {}; // Global dictionary to track processed events per match

    function delay(ms) {
        return new Promise((resolve) => setTimeout(resolve, ms));
    }

    async function processMatchEvents(matches, sendTelegramMessage) {
        for (const match of matches) { // Use `for...of` to handle async operations
            const matchId = match.fixture.id;
            const events = match.events;
            console.log(match)
            let league
            if(match.league.name === "Premier League"){
                league = "🇬🇧"
            }
            if(match.league.name === "La Liga"){
                league = "🇪🇸"
            }
            if(match.league.name === "Serie A"){
                league = "🇮🇹"
            }
            if(match.league.name === "Bundesliga"){
                league = "🇩🇪"
            }
            if(match.league.name === "Ligue 1"){
                league = "🇫🇷"
            }
            // Initialize processed events for this match if not already done
            if (!processedEvents[matchId]) {
                processedEvents[matchId] = new Set();
            }

            for (const event of events) {
                console.log(event)
                const eventId = `${matchId}-${event.time.elapsed}-${event.team.id}-${event.player.id}-${event.type}`;
                if(event.detail === "Normal Goal" && !processedEvents[matchId].has(eventId)){
                    const messageToSend = `\n${league} GOAL!!! ⚽️ \n${match.teams.home.name} vs ${match.teams.away.name}:\n${event.detail} - ${event.player.name} (${event.team.name}) at ${event.time.elapsed}'`;
                    await sendTelegramMessage(messageToSend);
                    processedEvents[matchId].add(eventId);
                }
                if((event.detail === "Penalty" && event.type === "Goal") && !processedEvents[matchId].has(eventId)){
                    const messageToSend = `\n${league} PENALTY GOAL!!! ⚽️ \n${match.teams.home.name} vs ${match.teams.away.name}:\n${event.detail} - ${event.player.name} (${event.team.name}) at ${event.time.elapsed}'`;
                    await sendTelegramMessage(messageToSend);
                    processedEvents[matchId].add(eventId);
                }
                if(event.detail.startsWith("Goal Disallowed") && !processedEvents[matchId].has(eventId)){
                    const messageToSend = `\n${league} GOAL DISALLOWED!!! ❌ \n${match.teams.home.name} vs ${match.teams.away.name}:\n${event.detail} - ${event.player.name} (${event.team.name}) at ${event.time.elapsed}'`;
                    await sendTelegramMessage(messageToSend);
                    processedEvents[matchId].add(eventId);
                }
                // Generate a unique identifier for the event
                //const eventId = `${matchId}-${event.time.elapsed}-${event.team.id}-${event.player.id}-${event.type}`;

                // Check if the event has already been processed for this match
                if (!processedEvents[matchId].has(eventId)) {
                    // Prepare the message
                    const messageToSend = `Match ${match.teams.home.name} vs ${match.teams.away.name}:\n${event.detail} - ${event.player.name} (${event.team.name}) at ${event.time.elapsed}'`;

                    // Send message to Telegram with a delay between each call
                    await sendTelegramMessage(messageToSend);
                    await delay(3000); // 1-second delay to avoid flooding the endpoint

                    // Mark this event as processed
                    processedEvents[matchId].add(eventId);
                }
            }
        }
    }

    async function sendTelegramMessage(messageToSend) {
        console.log(`Sending to Telegram: ${messageToSend}`);
        try {
            const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend });
            if (response.data.success) {
                console.log('Message sent successfully!');
            } else {
                console.log('Failed to send message');
            }
        } catch (error) {
            console.log('Error sending message:', error);
        }
    }

    async function fetchLiveMatches() {
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: { live: 'all' },
            headers: {
                'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
            },
        };

        try {
            const response = await axios.request(options);
            console.log(response.data.response);

            const matches = [];
            response.data.response.forEach((match) => {
                if ([39, 140, 135, 61, 78].includes(match.league.id)) { // Filter relevant leagues
                    matches.push(match);
                }
            });

            // Process events from the fetched matches
            await processMatchEvents(matches, sendTelegramMessage);
        } catch (error) {
            console.error('Error fetching live matches:', error);
        }
    }

    // Fetch live matches every 15 seconds
    React.useEffect(() => {
        const intervalId = setInterval(fetchLiveMatches, 60000); // Set interval for fetching matches
        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, []);



    

  return (
    <>
    <BetSection style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <AbsoluteIconButtonLeft onClick={() => navigate('/')}><ArrowLeftRelative style={{transform: 'translateY(0) rotate(90deg)'}}/></AbsoluteIconButtonLeft>
      <StyledButton onClick={fixRatings}>REQUEST</StyledButton>
    </BetSection>
    <SendFantasy />
    </>
  )
}

export default Admin


