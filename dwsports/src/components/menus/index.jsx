import styled from "styled-components";

export const Section = styled.div`
    width: 100%;
    height: auto;
    ${props => props.theme.displayFlexColumn};
    background: ${props => props.theme.body};
    padding: 30px;
`;

export const Column = styled.div`
    width: 50%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    margin: 1vw;
`;

export const ListItemWrapper = styled.li`
    font-size: 24px;
    color: ${props => props.theme.text};
    text-transform: capitalize;
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    //${props => props.theme.displayFlex};
`;

export const ListWrapper = styled.ul`
    width: 100%;
`;

export const ListItemSpan = styled.span`
    color: ${props => props.theme.text};
    margin: 0 10px;
    font-size: 16px;
    font-weight: bold;
    text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;

`;


export const ListItemTitle = styled.span`
    color: ${props => props.theme.MainAccent};
    margin: 10px 0px;
    font-size: 24px;
    font-weight: bold;
    text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;

`;

export const RatingsContainer = styled.div`
    width: 100%;
    height: 100px;
    ${props => props.theme.displayFlexCenter};
    overflow-x: scroll;
`;

export const RatingWrapper = styled.div`
    width: 40px;
    height: 50px;
    ${props => props.theme.displayFlexCenter};
    border-radius: 10px;
    font-size: 18px;
    font-weight: bold;
    color: ${props => props.theme.body};
    margin: 0 10px;
`;

export const HolderRow = styled.div`
    width: 80%;
    height: 40px;
    color: ${props => props.theme.MainAccent};
    font-size: 24px;
    text-align: center;
`;

export const Holder = styled.div`
    width: 48vw;
    height: auto;
    border: 2px solid black;
    padding: 20px;
    border-radius: 10px;
    margin: 10px 0;
    ${props => props.theme.displayFlexColumnCenter};
    background: rgba(170, 167, 167, 0.1);
    backdrop-filter: blur(10px);
    h3{
        font-size: 22px;
        color: aqua;
        text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
    }
`;



export const Title = styled.div`
    width: 100%;
    height: 50px;
    color: ${props => props.theme.body};
    font-size: 20px; 
    font-weight: bold;
`;

export const PlayerDataWrapper = styled.div`
    width: 90%;
    height: 150px;
    border: 1px solid ${props => props.theme.MainAccent};
    display: flex;
    align-items: center;
    border-radius: 10px;
    margin-top: 50px;
    margin-bottom: 30px;
    padding: 10px;
    background: rgba(83, 83, 83, 0.1);

`;

export const PlayerLogo = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
`;

export const PlayerStatsWrapper = styled.div`
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    //align-items: center;
    padding: 0 15px;
`;

export const PlayerStatsName = styled.div`
    width: 100%;
    height: 33%;
    color: white;
    font-size: 38px;
    padding: 0 5px; 
    font-weight: bold;
    text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
    @media(max-width: 968px){
        font-size: 28px;
    }
`;

export const PlayerStatsNameSmall = styled.div`
    width: 100%;
    height: 25%;
    color: white;
    font-size: 24px;
    padding: 0 5px; 
    font-weight: bold;
    display: flex;
    text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
    @media(max-width: 968px){
        font-size: 22px;
    }
`;

export const PlayerStatCountry = styled.div`
    width: 50%;
    height: 33%;
    color: white;
    font-size: 38px;
    padding: 0 5px;
    display: flex;
    @media(max-width: 968px){
        font-size: 28px;
        width: 80%;
    }
`;

export const StatsCountryLocation = styled.div`
    width: 50%;
    height: 100%;
    display: flex;
    align-items: center;
    //padding: 0 10px;
    color: ${props => props.theme.text};
    font-size: 22px;
    font-weight: bold;
    @media(max-width: 968px){
        font-size: 18px;
        width: 100%;
    }
`;

export const PlayerStatsRating = styled.div`
    width: 100%;
    height: 33%;
    color: white;
    font-size: 20px;
    padding: 0 5px; 
    display: flex;
    align-items: center;
`;

export const TeamRatingTitle = styled.div`
    width: 150px;
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 24px;
    @media(max-width: 968px){
        font-size: 22px;
    }
`;

export const TeamRating = styled.div`
    width: 70px;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    strong{
        font-size: 24px;
        font-weight: bold;
        transform: translateY(-5%) translateX(-20px);
        width: 70px;
        border-radius: 10px;
        height: 40px;
        ${props => props.theme.displayFlexCenter};
        color: ${props => props.theme.MainAccent};
        border: 1px solid ${props => props.theme.MainAccent};
        text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
    }
`;