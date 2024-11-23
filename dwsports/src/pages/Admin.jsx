import React, {useEffect, useState} from 'react'
import axios from 'axios'
import styled from 'styled-components'
import { BetSection, StyledButton } from './index'
import { set } from 'lodash'

const Admin = () => {

    const [matches, setMatches] = useState([])

    const fetchData = async () => {
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: { live: 'all' },
            headers: {
                'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            console.log(response.data.response)
            const matches = []
            response.data.response.forEach((match) => {
                if (match.league.id === 39 || match.league.id === 140 || match.league.id === 135 || match.league.id === 61 || match.league.id === 78) {
                    matches.push(match)
                }
            })
            processMatchEvents(matches, sendTelegramMessage);
        } catch (error) {
            console.error(error);
        }
    }

    let processedEvents = {}; // Global dictionary to track processed events per match

    function processMatchEvents(matches, sendTelegramMessage) {
        matches.forEach(match => {
            const matchId = match.fixture.id;
            const events = match.events;

            // Initialize processed events for this match if not already done
            if (!processedEvents[matchId]) {
                processedEvents[matchId] = new Set();
            }

            events.forEach(event => {
                console.log(event)
                // Generate a unique identifier for the event
                const eventId = `${matchId}-${event.time.elapsed}-${event.team.id}-${event.player.id}-${event.type}`;

                // Check if the event has already been processed for this match
                if (!processedEvents[matchId].has(eventId)) {
                    // Process the new event and send it to Telegram
                    const messageToSend = `Match ${match.teams.home.name} vs ${match.teams.away.name}:\n${event.detail} - ${event.player.name} (${event.team.name}) at ${event.time.elapsed}'`;
                    sendTelegramMessage(messageToSend);

                    // Mark this event as processed
                    processedEvents[matchId].add(eventId);
                }
            });
        });
    }

    async function sendTelegramMessages(messages) {
        for (const message of messages) {
            await sendTelegramMessage(message); // Send message
            await delay(1000); // Add 1 second delay between messages
        }
    }
    
    function delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Example function to send a Telegram message
    async function sendTelegramMessage(messageToSend) {
        console.log(`Sending to Telegram: ${messageToSend}`);
        try {
            const response = await axios.post(
                'https://pacgames-roulette-server.onrender.com/send-message',
                { messageToSend }
            );
    
            if (response.data.success) {
                console.log('Message sent successfully!');
            } else {
                console.log('Failed to send message');
            }
        } catch (error) {
            console.log('Error sending message');
        }
    }

    // Example fetch function
    async function fetchLiveMatches() {
        const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: { live: 'all' },
            headers: {
                'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
        };

        try {
            const response = await axios.request(options);
            console.log(response.data);
            console.log(response.data.response)
            const matches = []
            response.data.response.forEach((match) => {
                if (match.league.id === 39 || match.league.id === 140 || match.league.id === 135 || match.league.id === 61 || match.league.id === 78) {
                    matches.push(match)
                }
            })
            processMatchEvents(matches, sendTelegramMessage);
        } catch (error) {
            console.error(error);
        }
    }

    // Simulate live fetches
    fetchLiveMatches(); // First fetch
    setTimeout(fetchLiveMatches, 15000); // Second fetch (only new events are sent)



  return (
    <BetSection style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
      <StyledButton onClick={fetchData} style={{fontSize: '18px'}}>REQUEST</StyledButton>
    </BetSection>
  )
}

export default Admin

const Section = styled.div`

`;
