// SEND ALL PLAYERS TO DATABASE

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

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