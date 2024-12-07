import styled from "styled-components";

export const FantasySection = styled.div`
    width: 100vw;
    height: 100vh;
    ${props => props.theme.displayFlexColumn}
    background: ${props => props.theme.body};
    border: 1px solid white;
`;

export const Title = styled.div`
    width: 100%;
    height: 10vh;
    margin-bottom: 40px;
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 18px;
        color: white;
    }
`;

export const leagues = [
    {
        league: "Premier League",
        name: "England",
        id: 1,
        currentRound: 15
    },
    {
        league: "La Liga",
        name: "Spain",
        id: 2,
        currentRound: 16
    },
    {
        league: "Serie A",
        name: "Italy",
        id: 3,
        currentRound: 15
    },
    {
        league: "Ligue 1",
        name: "France",
        id: 4,
        currentRound: 14
    },
    {
        league: "Bundesliga",
        name: "Germany",
        id: 5,
        currentRound: 13
    }
]