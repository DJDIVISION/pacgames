// SEND ALL PLAYERS TO DATABASE



const writeData = async (allIds) => {
    for (const id of allIds) {
        const { data: firstData, error: firstError } = await supabase
            .from('footballPlayers')
            .select('*')
            .eq("leagueName", "Ligue 1")
            .eq("teamId", id);

        if (firstError) {
            console.log("error", firstError);
        } else {
            console.log(firstData)
            const teamName = firstData[0].team
            const leagueName = firstData[0].leagueName
            const options = {
                method: 'GET',
                url: 'https://api-football-v1.p.rapidapi.com/v3/players/squads',
                params: { team: id },
                headers: {
                    'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
                    'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
                }
            };

            try {
                const response = await axios.request(options);
                console.log(response.data.response[0].players);

                const repeatedElements = response.data.response[0].players.filter(item1 =>
                    firstData.some(item2 => item1.id === item2.id)
                );

                const uniqueToArray1 = response.data.response[0].players.filter(item1 =>
                    !firstData.some(item2 => item1.id === item2.id)
                );

                for (const player of uniqueToArray1) {
                    const { error: insertError } = await supabase
                        .from('footballPlayers')
                        .upsert([{
                            id: player.id,
                            name: player.name,
                            age: player.age,
                            photo: player.photo,
                            number: player.number,
                            leagueName: leagueName,
                            topPlayer: true,
                            position: player.position,
                            team: teamName,
                            teamId: id,
                            teamLogo: `https://media.api-sports.io/football/teams/${id}.png`
                        }]);

                    if (insertError) {
                        console.log(insertError);
                    } else {
                        console.log(`Data inserted for ${player.name}`);
                    }
                }
            } catch (error) {
                console.error(error);
            }
        }

        // Introduce a delay between processing each team
        await delay(1500);
    }
};

const getData = async () => {
    const allIds = [];
    const { data: firstData, error: firstError } = await supabase
        .from('teams')
        .select('teamId')
        .eq("league", "Ligue 1");

    if (firstError) {
        console.log("firstError", firstError);
    } else {
        firstData.forEach((el) => {
            allIds.push(el.teamId);
        });
    }

    console.log(allIds);
    await writeData(allIds);
};


// SEND PLAYER RATINGS TO DATABASE

const getDataTwo = async () => {
    const allIds = [];
    const { data: firstData, error: firstError } = await supabase
        .from('footballPlayers')
        .select('id')
        .eq("leagueName", "Ligue 1");

    if (firstError) {
        console.log("firstError", firstError);
    } else {
        firstData.forEach((el) => {
            allIds.push(el.id);
        });
    }

    console.log(allIds);
    await writeDataTwo(allIds);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
  
  const writeDataTwo = async (allIds) => {
    for (const id of allIds) {
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/players',
        params: {
          id: id,
          season: '2024'
        },
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      try {
        const response = await axios.request(options);
        console.log(response.data.response);
        for(const player of response.data.response){
          for(const stat of player.statistics){
            if(stat.league.name === "Ligue 1"){
              const rating = stat.games.rating
              const parsed = parseFloat(rating).toFixed(2)
              console.log(parsed)
              const { data: firstData, error: firstError } = await supabase
              .from('footballPlayers')
              .update({rating: parsed})
              .eq("id", response.data.response[0].player.id);
  
            if (firstError) {
              console.log("firstError", firstError);
            } else {
              console.log(`updated data for ${player.player.name}`)
            }
            }
          }
        }
      } catch (error) {
        console.error(error);
      }
      await delay(1000);
    }
  }




//SEND LIVE MATCHES GOALS TO TELEGRAM

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
            const response = await axios.post('https://pacgames-roulette-server.onrender.com/send-message', { messageToSend });
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



//////// FANTASY FOOTBALL FETCH

const fetchTeams = async () => {
    const teams = []
    const { data: firstData, error: firstError } = await supabase
        .from('fantasyFootball')
        .select('nextMatch')
        

    if (firstError) {
        console.log("error", firstError);
    } else {
        const teams = []
        firstData.forEach((player) => {
            if(player.nextMatch !== null){
                
                console.log(player)
                const start = new Date(startDate)
                const end = new Date(endDate)
                const now = new Date(player.nextMatch.date);
                if(now >= start && now <= end){
                    teams.push(player)
                }
            }
        })
        setAllTeams(teams)
    }
}

async function fetchFixtureData(fixtureId,playerId,teamName) {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {id: fixtureId},
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };

    try {
        const response = await axios.request(options);
        /* console.log(response.data.response) */
        response.data.response[0].players.forEach((el) => {
            /* console.log(el) */
            if(el.team.name === teamName && response.data.response[0].fixture.status.short === "FT"){
                el.players.forEach((player) => {
                    if(player.player.id === playerId){
                        console.log("player", player)
                        const areas = Object.values(allTeams)
                        console.log(areas)
                        for (const area of areas){
                            for (const man of area.nextMatch){
                                if(man.id === playerId){
                                    if(player.statistics[0].games.rating === null){
                                        man.lastMatchRating = 0  
                                    } else {
                                        //localStorage.setItem(`${player.player.name}`, `${player.statistics[0].games.rating}`)
                                        man.lastMatchRating = parseFloat(parseFloat(player.statistics[0].games.rating).toFixed(2))
                                    }
                                    
                                }
                                
                            }
                        }
                        /* const areas = Object.values(allTeams)
                        for (const area of areas){
                            for (const man of area){
                                if(man.id === playerId){
                                    if(player.statistics[0].games.rating === null){
                                        man.lastMatchRating = 0  
                                    } else {
                                        //localStorage.setItem(`${player.player.name}`, `${player.statistics[0].games.rating}`)
                                        man.lastMatchRating = parseFloat(parseFloat(player.statistics[0].games.rating).toFixed(2))
                                    }
                                    
                                }
                                
                            }
                            console.log(man)
                        } */
                        
                    }
                    
                })
            }
        })

    } catch (error) {
        console.error(`Error fetching fixture ${fixtureId}:`, error);
        return null;
    }
}

useEffect(()=> {
    if(allTeams){
        fetchRating(allTeams)
    }
}, [allTeams])

const fetchRating = async () => {
    for(const team of allTeams){
        console.log(team)
        const areas = Object.values(team.nextMatch.players)
            for (const area of areas) {
                for (const player of area){
                    let currentRound
                    const filter = leagues.filter((el) => el.league === player.leagueName)
                    
                    currentRound = filter[0].currentRound
                    
                    if(currentRound){
                        const {data, error} = await supabase
                        .from("fixtures")
                        .select(`${currentRound}`)
                        .eq("leagueName", player.leagueName);
                        if (error) {
                            console.error(`Error fetching data for ${leagueName}:`, response.error);
                            return null;
                        } else {
                            console.log(data)
                            data[0][currentRound].forEach(async (match) => {
                                
                                await fetchFixtureData(match.fixture.id,player.id,player.teamName)
                            })
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                }
            }
        /* const start = new Date(startDate)
        const end = new Date(endDate)
        const now = new Date(team.date);
        console.log(now)
        const isBetween = now >= start && now <= end;
        if(isBetween){
            console.log(team.players)
            const areas = Object.values(team.players)
            for (const area of areas) {
                for (const player of area){
                    let currentRound
                    const filter = leagues.filter((el) => el.league === player.leagueName)
                    
                    currentRound = filter[0].currentRound
                    
                    if(currentRound){
                        const {data, error} = await supabase
                        .from("fixtures")
                        .select(`${currentRound}`)
                        .eq("leagueName", player.leagueName);
                        if (error) {
                            console.error(`Error fetching data for ${leagueName}:`, response.error);
                            return null;
                        } else {
                            console.log(data)
                            data[0][currentRound].forEach(async (match) => {
                                
                                await fetchFixtureData(match.fixture.id,player.id,player.teamName)
                            })
                        }
                    }
                    await new Promise(resolve => setTimeout(resolve, 1000)); 
                }
            }
        } */
    }
}


//////// SEND INJURIES

const writeDataInjuries = async (id,type,reason) => {
    console.log(id)
    console.log(type)
    console.log(reason)
    const { data: firstData, error: firstError } = await supabase
          .from('footballPlayers')
          .update({injuryType: type, injuryReason: reason})
          .eq("id", id);

        if (firstError) {
          console.log("firstError", firstError);
        } else {
            console.log(`data written for player ${id}`)
    }
    await delay(1000);
}

const fetchInjuries = async () => {
    const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/injuries',
        params: {date: '2024-12-02'},
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      
      try {
          const response = await axios.request(options);
          console.log(response.data.response);
          for (const player of response.data.response){
            console.log(player)
            const id = player.player.id
            const type = player.player.type
            const reason = player.player.reason
            if(player.league.id === 39 || player.league.id === 140 || player.league.id === 61 || 
                player.league.id === 78 || player.league.id === 135
            ){
                await writeData(player.player.id,player.player.type,player.player.reason)
            }
            
          }
      } catch (error) {
          console.error(error);
      }
      await new Promise(resolve => setTimeout(resolve, 1500)); 
}



/////FANTASY FOOTBALL FETCH 2

const fetchTeamsTwo = async () => {
    const { data: firstData, error: firstError } = await supabase
        .from('fantasyFootball')
        .select('nextMatch')
        

    if (firstError) {
        console.log("error", firstError);
    } else {
        const teams = []
        firstData.forEach((player) => {
            if(player.nextMatch !== null){
                
                console.log(player)
                const start = new Date(startDate)
                const end = new Date(endDate)
                const now = new Date(player.nextMatch.date);
                if(now >= start && now <= end){
                    teams.push(player)
                }
            }
        })
        fetchRatingTwo(teams)
        console.log(teams)
    }
}

console.log(leagues)

const fetchRatingTwo = async (teams) => {
    const allFetchPromises = []; // To track all fetchFixtureData calls
    
    for (const team of teams) {
      const areas = Object.values(team.nextMatch.players);
      console.log("areas", areas)
      for (const area of areas) {
        for (const player of area) {
            console.log("player", player)
          let currentRound;
          const filter = leagues.filter((el) => el.league === player.leagueName);
          console.log("filter", filter)
          currentRound = filter[0]?.currentRound;
            
          if (currentRound) {
            const { data, error } = await supabase
              .from("fixtures")
              .select(`${currentRound}`)
              .eq("leagueName", player.leagueName);
  
            if (error) {
              console.error(`Error fetching data for ${player.leagueName}:`, error);
              return null;
            } else {
              data[0][currentRound].forEach((match) => {
                // Collect the Promise from fetchFixtureData
                const fetchPromise = fetchFixtureData(
                  match.fixture.id,
                  player.id,
                  player.teamName,
                  teams
                );
                allFetchPromises.push(fetchPromise); // Add the Promise to the array
              });
            }
          }
  
          // Add delay here to avoid overwhelming the server with requests
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
      }
      await Promise.allSettled(allFetchPromises);
      console.log("All fetchFixtureData tasks completed!");
    
      // Update the state after all tasks finish
      setAllTeams(teams)
      console.log(teams);
      for (const team of teams) {
          const areas = Object.values(team.nextMatch.players);
          for (const area of areas) {
              for (const player of area){
                  if(player.lastMatchRating === null){
                      player.lastMatchRating = null
                  }
              } 
          }
          const { error: updateError } = await supabase
                  .from('fantasyFootball')
                  .update({ nextMatch: team.nextMatch}) 
                  .eq('id', team.nextMatch.userId); // Identify which user to update
                  if (updateError) {
                      console.error('Error updating user data:', updateError.message);
                  } else {
                      console.log("All teams have been saved!")
                  }
              }
            }
          }

          async function fetchFixtureData(fixtureId, playerId, teamName, teams) {
            const options = {
              method: "GET",
              url: "https://api-football-v1.p.rapidapi.com/v3/fixtures",
              params: { id: fixtureId },
              headers: {
                "x-rapidapi-key": "5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2",
                "x-rapidapi-host": "api-football-v1.p.rapidapi.com",
              },
            };
          
            try {
              const response = await axios.request(options);
          
              // Check if the fixture status is "FT" (Full Time)
              if (response.data.response[0].fixture.status.short === "FT") {
                response.data.response[0].players.forEach((el) => {
                  if (el.team.name === teamName) {
                    // Check if player matches and update rating
                    el.players.forEach((player) => {
                      if (player.player.id === playerId) {
                        console.log("Found player:", player);
          
                        const playerRating = player.statistics[0].games.rating;
                        
                        console.log("Player rating:", playerRating);
          
                        // Now, let's ensure the teams data gets updated
                        const areas = Object.values(teams);
                        areas.forEach((team) => {
                          const players = team.nextMatch.players;
                          Object.keys(players).forEach((area) => {
                            players[area].forEach((p) => {
                              if (p.id === playerId) {
                                console.log(`Updating player: ${p.name}`);
                                p.lastMatchRating = playerRating ? parseFloat(parseFloat(playerRating).toFixed(2)) : null;
                              }
                            });
                          });
                        });
                      }
                    });
                  }
                });
              }
            } catch (error) {
              console.error(`Error fetching fixture ${fixtureId}:`, error);
            }
          
            // Adding delay to throttle the requests
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Delay
          }
