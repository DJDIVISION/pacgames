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


  /// GET BEST PLAYERS 

  const allIds = [];
      const { data: firstData, error: firstError } = await supabase
          .from('footballPlayers')
          .select('*')
          .gt('rating', 7)
          .lt('value', 40);
  
      if (firstError) {
          console.log("firstError", firstError);
      } else {
          firstData.forEach((el) => {
              allIds.push(el.name,el.rating,el.value);
          });
      }
  
      console.log(allIds);



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
                    if(event.detail === "Normal Goal" && !processedEvents[matchId].has(eventId) && event.player.name !== null){
                        const messageToSend = `\n${league} GOAL!!! ⚽️ \n${match.teams.home.name} vs ${match.teams.away.name}:\n${event.player.name} (${event.team.name}) at ${event.time.elapsed}'\n\n${match.goals.home} - ${match.goals.away}`;
                        await sendTelegramMessage(messageToSend,event.team.logo);
                        processedEvents[matchId].add(eventId);
                    }
                    if((event.detail === "Penalty" && event.type === "Goal") && !processedEvents[matchId].has(eventId) && event.player.name !== null){
                        const messageToSend = `\n${league} PENALTY GOAL!!! ⚽️ \n${match.teams.home.name} vs ${match.teams.away.name}:\n${event.player.name} (${event.team.name}) at ${event.time.elapsed}'\n\n${match.goals.home} - ${match.goals.away}`;
                        await sendTelegramMessage(messageToSend,event.team.logo);
                        processedEvents[matchId].add(eventId);
                    }
                    if((event.detail === "Red Card") && !processedEvents[matchId].has(eventId) && event.player.name !== null){
                        const messageToSend = `\n${league} RED CARD!!! 🟥 \n${match.teams.home.name} vs ${match.teams.away.name}:\n${event.comments} - ${event.player.name} (${event.team.name}) at ${event.time.elapsed}'\n\n${match.goals.home} - ${match.goals.away}`;
                        await sendTelegramMessage(messageToSend,event.team.logo);
                        processedEvents[matchId].add(eventId);
                    }
                    if(event.detail.startsWith("Goal Disallowed") && !processedEvents[matchId].has(eventId) && event.player.name !== null){
                        const messageToSend = `\n${league} GOAL DISALLOWED!!! ❌ \n${match.teams.home.name} vs ${match.teams.away.name}:\n${event.player.name} (${event.team.name}) at ${event.time.elapsed}'\n\n${match.goals.home} - ${match.goals.away}`;
                        await sendTelegramMessage(messageToSend,event.team.logo);
                        processedEvents[matchId].add(eventId);
                    }
                    // Generate a unique identifier for the event
                    //const eventId = `${matchId}-${event.time.elapsed}-${event.team.id}-${event.player.id}-${event.type}`;
    
                    // Check if the event has already been processed for this match
                    if (!processedEvents[matchId].has(eventId)) {
                        // Prepare the message
                        //const messageToSend = `Match ${match.teams.home.name} vs ${match.teams.away.name}:\n${event.detail} - ${event.player.name} (${event.team.name}) at ${event.time.elapsed}'`;
    
                        // Send message to Telegram with a delay between each call
                        //await sendTelegramMessage(messageToSend,imageUrl);
                        await delay(3000); // 1-second delay to avoid flooding the endpoint
    
                        // Mark this event as processed
                        processedEvents[matchId].add(eventId);
                    }
                }
            }
        }
    
        async function sendTelegramMessage(messageToSend, imageUrl) { // Default 60 seconds
          console.log(`Sending to Telegram: ${messageToSend}`);
          try {
              const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend, imageUrl });
              console.log("response.data.message_id",response.data.message_id)
              if (response.data.success && response.data.message_id) {
                  console.log('Message sent successfully!');
      
                  // Schedule message deletion
                  const messageId = response.data.message_id; // Assuming the API returns message_id
                  console.log("messageID", messageId)
                  setTimeout(async () => {
                      await deleteTelegramMessage(messageId);
                  }, 6000000);
              } else {
                  console.log('Failed to send message');
              }
          } catch (error) {
              console.log('Error sending message:', error);
          }
      }
      
      async function deleteTelegramMessage(messageId) {
          try {
              const response = await axios.post('https://temp-server-pi.vercel.app/api/delete-message', { messageId });
              if (response.data.success) {
                  console.log(`Message ${messageId} deleted successfully!`);
              } else {
                  console.log(`Failed to delete message ${messageId}`);
              }
          } catch (error) {
              console.log(`Error deleting message ${messageId}:`, error);
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
          
        let currentRound;
        const filter = leagues.filter((el) => el.league === player.leagueName);
        console.log("filter", filter)
        currentRound = filter[0]?.currentRound;
        const id = player.leagueName === "Premier League" ? 39 : player.leagueName === "La Liga" ? 140 : player.leagueName === "Serie A" ? 135
        : player.leagueName === "Bundesliga" ? 78 : 61
        if (currentRound) {
          const options = {
            method: 'GET',
            url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
            params: {
              league: id,
              season: '2024',
              round: `Regular Season - ${currentRound}`
            },
            headers: {
              'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
              'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
            }
          };
          
          try {
            const response = await axios.request(options);
            console.log(response.data.response);
            response.data.response.forEach((match) => {
              // Collect the Promise from fetchFixtureData
              const fetchPromise = fetchFixtureData(
                match.fixture.id,
                player.id,
                player.teamName,
                teams
              );
              allFetchPromises.push(fetchPromise); // Add the Promise to the array
            })
          } catch (error) {
            console.error(error);
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
                      //console.log("Found player:", player);
        
                      const playerRating = player.statistics[0].games.rating;
                      
                      //console.log("Player rating:", playerRating);
        
                      // Now, let's ensure the teams data gets updated
                      const areas = Object.values(teams);
                      areas.forEach((team) => {
                        const players = team.nextMatch.players;
                        Object.keys(players).forEach((area) => {
                          players[area].forEach((p) => {
                            if (p.id === playerId) {
                              //console.log(`Updating player: ${p.name}`);
                              p.lastMatchRating = playerRating ? parseFloat(parseFloat(playerRating).toFixed(2)) : null;
                              p.isMatchCancelled = false
                            }
                          });
                        });
                      });
                    }
                  });
                }
              });
            } else if(response.data.response[0].fixture.status.short === "PST"){
              response.data.response[0].players.forEach((el) => {
                if (el.team.name === teamName) {
                  // Check if player matches and update rating
                  el.players.forEach((player) => {
                    if (player.player.id === playerId) {
                      //console.log("Found player:", player);
        
                      const playerRating = player.rating
                      
                      //console.log("Player rating:", playerRating);
        
                      // Now, let's ensure the teams data gets updated
                      const areas = Object.values(teams);
                      areas.forEach((team) => {
                        const players = team.nextMatch.players;
                        Object.keys(players).forEach((area) => {
                          players[area].forEach((p) => {
                            if (p.id === playerId) {
                              //console.log(`Updating player: ${p.name}`);
                              p.lastMatchRating = playerRating ? parseFloat(parseFloat(playerRating).toFixed(2)) : null;
                              p.isMatchCancelled = true
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


////FETCH 10 TOP PLAYERS ////////////////////////

const fetchTopPlayers = async () => {
  const dates = ["2024-12-06", "2024-12-07", "2024-12-08"]; // Add your desired dates here.
  const options = (date) => ({
    method: 'GET',
    url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
    params: { date },
    headers: {
      'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
      'x-rapidapi-host': 'api-football-v1.p.rapidapi.com',
    },
  });

  try {
    let matches = [];

    // Fetch data for all dates concurrently
    const responses = await Promise.all(
      dates.map((date) => axios.request(options(date)))
    );

    // Process each response to extract fixture IDs
    responses.forEach((response) => {
      for (const match of response.data.response) {
        if (
          match.league.id === 39 || // Example league IDs
          match.league.id === 61 ||
          match.league.id === 78 ||
          match.league.id === 135 ||
          match.league.id === 140
        ) {
          matches.push(match.fixture.id);
        }
      }
    });

    console.log("Collected Matches:", matches);

    // Call fetchPlayerRating with all matches
    await fetchPlayerRating(matches);

    // Optional: Delay if needed
    await delay(500);
  } catch (error) {
    console.error("Error fetching top players:", error);
  }
};

  const fetchPlayerRating = async (matches) => {
    for (const match of matches){
      const options = {
        method: 'GET',
        url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
        params: {id: match},
        headers: {
          'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
          'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
        }
      };
      try {
        const response = await axios.request(options);
        console.log(response.data.response);
        const players = []
        response.data.response[0].players.forEach((team) => {
          for(const player of team.players){
            //console.log(player)
            const rating = player.statistics[0].games.rating
            const parsed = parseFloat(parseFloat(rating).toFixed(2))
            player.player.rating = parsed
            players.push(player.player)
          }
          
        })
        setAllPlayers((prevPlayers) => [...prevPlayers, ...players]);
      } catch (error) {
        console.error(error);
      }
      await delay(1000);
    }
    setMatchesProcessed(true);
  }

  const processData = () => {
    //console.log('All players:', allPlayers);
    const topTenPlayers = allPlayers
    .filter(player => !isNaN(player.rating)) // Exclude players with NaN ratings
    .sort((a, b) => b.rating - a.rating)    // Sort by rating in descending order
    .slice(0, 10);                          // Take the first 10 players

    setTopPlayers(topTenPlayers);
    const images = []
    for (const player of topTenPlayers){
      images.push(player.photo)
    }
    setImageUrls(images)
    setImagesProcessed(true)
  };

  const processImages = async () => {
    console.log(imageUrls)
    let result = topPlayers.map((player, index) => {
          let icon
          if(index === 0){
            icon = "1️⃣"
          }
          if(index === 1){
            icon = "2️⃣"
          }
          if(index === 2){
            icon = "3️⃣"
          }
          if(index === 3){
            icon = "4️⃣"
          }
          if(index === 4){
            icon = "5️⃣"
          }
          if(index === 5){
            icon = "6️⃣"
          }
          if(index === 6){
            icon = "7️⃣"
          }
          if(index === 7){
            icon = "8️⃣"
          }
          if(index === 8){
            icon = "9️⃣"
          }
          if(index === 9){
            icon = "🔟"
          }
      return `\n${icon} ${player.name} - ${player.rating}`
    }).join("\n")
    const messageToSend = `📊 Top 10 players of 2024/12/01 📊 \n ${result}`
    console.log(messageToSend)
    try {
    
      const response = await axios.post('https://temp-server-pi.vercel.app/api/send-message', { messageToSend,imageUrls });
      
      if (response.data.success) {
        console.log('Message sent successfully!');
      } else {
        console.log('Failed to send message');
      }
    } catch (error) {
      console.log('Error sending message', error);
    }
  }

  

  useEffect(() => {
    if (imagesProcessed) {
      processImages();
    }
  }, [imagesProcessed]);
  useEffect(() => {
    if (matchesProcessed) {
      processData();
    }
  }, [matchesProcessed, allPlayers]);


  /// SEND TOP FANTASY TEAMS TO TELEGRAM

  const fetchTopFantasyTeams = async () => {
    const teams = []
    const { data: firstData, error: firstError } = await supabase
    .from('fantasyFootball')
    .select('secondRound')
    .not('secondRound', 'is', null)
    if (firstError) {
      console.error('Error inserting/updating user session data:', firstError.message)
    } else {
      console.log(firstData)
      for (const team of firstData){
        teams.push(team.secondRound)
      }
      const sorted = teams.sort((a, b) => b.finalAverage - a.finalAverage)
      console.log(sorted)
      let result = sorted.map((player, index) => {
        console.log(index)
        let rank
        if (index === 0){
          rank = "1st"
        } else if (index === 1){
          rank = "2nd"
        } else if (index === 2){
          rank = "3rd"
        } else {
          rank = `${index + 1}th`
        }
        return `\n${rank} - ${player.userName}\n\nTeam Rating: ${player.teamAverage}\nPush for trainings: +${player.addedAverage}\nFinal Rating: ${player.finalAverage}`
      }).join("\n")
      const imageUrl = "https://i.imghippo.com/files/cyeP4327wmw.png"
      const messageToSend = `🏆 Ranking of the last round of Fantasy Football 🏆 \n ${result} \n\nCongratulations to the winners!!! 🎉🎉🎉`
      console.log(messageToSend)
      try {

        const response = await axios.post('http://localhost:8080/send-message', { messageToSend,imageUrl });
        
        if (response.data.success) {
          console.log('Message sent successfully!');
        } else {
          console.log('Failed to send message');
        }
      } catch (error) {
        console.log('Error sending message', error);
      }
    }
  }


  ///SEND GREATEST COMEBACKS

  const getFixture = async () => {
    const { data, error } = await supabase
      .from("fixtures").select('fixtures').eq('leagueName', "Bundesliga")
      if(error){
        console.log(error)
      }
      if(data){
        console.log(data)
        data[0].fixtures.forEach(async(el) => {
          if(el.teams.home.name === "VfL Wolfsburg" && el.teams.away.name === "FSV Mainz 05"){
            console.log(el.fixture.id)
            const options = {
              method: 'GET',
              url: 'https://api-football-v1.p.rapidapi.com/v3/fixtures',
              params: {id: el.fixture.id},
              headers: {
                'x-rapidapi-key': '5f83c32a37mshefe9d439246802bp166eb8jsn5575c8e3a6f2',
                'x-rapidapi-host': 'api-football-v1.p.rapidapi.com'
              }
            };
            const goals = []
            try {
              const response = await axios.request(options);
              console.log(response.data.response[0].events);
              for(const event of response.data.response[0].events){
                if(event.type === "Goal"){
                  goals.push(event)
                }
              }
              setGoals(goals)
            } catch (error) {
              console.error(error);
            }
          }
        })
      }
  }

const sendComebackMessage = async (messageToSend, imageUrl) =>{
  try {

    const response = await axios.post('http://localhost:8080/send-message', { messageToSend,imageUrl });
    
    if (response.data.success) {
      console.log('Message sent successfully!');
    } else {
      console.log('Failed to send message');
    }
  } catch (error) {
    console.log('Error sending message', error);
  }
}

useEffect(() => {
  if(goals){
    console.log(goals)
    let homeGoals = 1
    let awayGoals = 2
    
    let result = goals.filter((goal) => goal.time.elapsed > 55).map((goal, index) => {
      if(goal.team.name === "VfL Wolfsburg"){
        homeGoals++
      } else if(goal.team.name === "FSV Mainz 05"){
        awayGoals++
      }
      return `\n${goal.team.name}\n${goal.time.elapsed}' - ${goal.player.name}\n${homeGoals} - ${awayGoals}`
    }).join("\n")
    console.log(result)
    const messageToSend = `😲 PAST WEEKEND GREATEST COMEBACKS 😲\n\nVfL Wolfsburg vs FSV Mainz 05\n ${result}`
    console.log(messageToSend)
    const imageUrl = "https://i.imghippo.com/files/UVF9972hNE.webp"
    //sendComebackMessage(messageToSend, imageUrl)
  }
}, [goals])



  /// UPDATE FANTASY FOOTBALL TEAMS RATING

  const readFantasyRatings = async (player) => {
    console.log("player",player)
    let rate = 0
    const userPlayersData = player.players || {}; 
    userPlayersData.players = userPlayersData.players || []; 
    console.log("before",userPlayersData)
    for (const player of userPlayersData.players){
      const { data: firstData, error: firstError } = await supabase
        .from('footballPlayers')
        .select('rating')
        .eq('id', player.id)
      if (firstError) {
          console.log("firstError", firstError);
      } else {
        console.log("firstData",firstData[0].rating)
        rate += firstData[0].rating
        player.rating = firstData[0].rating
        await delay(1000)
      }
    }
    const rating = rate / userPlayersData.players.length
    const parsed = parseFloat(parseFloat(rating).toFixed(2))
    console.log("after",userPlayersData)
    const { data: firstData, error: firstError } = await supabase
        .from('fantasyFootball')
        .update({players: userPlayersData, teamRating: parsed})
        .eq('id', player.id)
      if (firstError) {
          console.log("firstError", firstError);
      } else {
        console.log(`data updated for ${player.id}`)
      }
    await delay(1000);
  }

  const getFantasyRatings = async () => {
    const allIds = [];
    const { data: firstData, error: firstError } = await supabase
        .from('fantasyFootball')
        .select('*')
        

    if (firstError) {
        console.log("firstError", firstError);
    } else {
      console.log(firstData)
        for (const player of firstData){
          if(player.players !== null){
            allIds.push(player)
            await readFantasyRatings(player);
          }
        }
    }
    
  };

