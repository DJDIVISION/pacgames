import styled from "styled-components";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { motion } from "framer-motion";
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Button } from "@mui/material";

export const FilterContainer = styled(motion.div)`
    width: 90%;
    height: 80px;
    //border: 1px solid white;
    position: relative;
    justify-content: space-around;
    border-radius: 10px;
    //background: rgba(0, 0, 0, 0.8);
    //backdrop-filter: blur(10px);
    //margin: 20px 0;
    ${props => props.theme.displayFlex};
    //padding: 10px;
`;

export const AbsoluteAvatar = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    width: 60px;
    height: 60px;
    border: 1px solid white;
    border-radius: 50%;
    ${props => props.theme.displayFlexCenter};
    transform: translate(-50%,-50%);
`;

export const AvatarHolder = styled.div`
    width: 100%;
    height: 40px;
    ${props => props.theme.displayFlexCenter};
    text-align: center;
`;

export const TeamsLogo = styled.div`
    width: 7.5%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
`;

export const TeamsName = styled.div`
    width: 35%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
    text-align: center;
    color: ${props => props.theme.text};
    font-size: 20px;
    @media(max-width: 968px){
        font-size: 16px;
    }
`;

export const TeamsStatus = styled.div`
    width: 5%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
    text-align: center;
    color: ${props => props.theme.text};
    font-size: 20px;
`;

export const TeamsDate = styled.div`
    width: 15%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
    text-align: center;
    color: ${props => props.theme.text};
    font-size: 16px;
    @media(max-width: 968px){
        font-size: 14px;
    }
`;

export const HalfColumn = styled.div`
    width: 100%;
    height: 100%;
    ${props => props.theme.displayFlexColumn};
    justify-content: flex-end;
    color: ${props => props.theme.text};
    font-size: 20px;
    text-align: center;
    span{
        font-size: 30px;
        color: green;
    }
    strong{
        color: aqua;
        margin: 10px;
    }
    @media(max-width: 968px){
        font-size: 14px;
        span{
            font-size: 22px;
        }
    }
`;

export const TypeofBet = styled.div`
    width: 10%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
    font-size: 20px;
    text-align: center;
`;

export const StatsWrapper = styled.div`
    width: 90%;
    height: auto;
    border: 1px solid white;
    position: relative;
    border-radius: 10px;
    background: rgba(0, 0, 0, 0.8);
    backdrop-filter: blur(10px);
    margin: 20px 0;
    ${props => props.theme.displayFlex};
    padding: 10px;
    @media(max-width: 968px){
        width: 300%;
        margin-left: 200%;
    }
`;

export const BetSection = styled.div`
    width: 100%;
    height: 100%;
    overflow-y: scroll;
    ${props => props.theme.displayFlexColumn};
    //background: ${props => props.theme.body};
    padding: 30px;
    @media(max-width: 968px){
        padding-top: 50px;
        overflow-x: scroll;
    }
`;

export const BalanceWrapper = styled.div`
    width: 100%;
    height: 50px;
    ${props => props.theme.displayFlexCenter};
    h2{
        color: ${props => props.theme.text};
        font-size: 20px;
        font-weight: bold;
    }
`;

export const DepositWrapper = styled.div`
    width: 60%;
    height: 20vh;
    border: 2px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexColumn};
    text-align: center;
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
    overflow: hidden;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    span{
        color: ${props => props.theme.MainAccent};
        margin: 5px;
    }
    @media(max-width: 490px){
        width: 90%; 
        height: 25vh;
    }
`;
export const SmallDepositWrapper = styled.div`
    width: 60%;
    height: 15vh;
    border: 2px solid ${props => props.theme.text};
    ${props => props.theme.displayFlexColumn};
    text-align: center;
    border-radius: 10px;
    padding: 10px;
    margin: 10px 0;
    overflow: hidden;
    background: rgba(0,0,0,0.5);
    backdrop-filter: blur(10px);
    span{
        color: ${props => props.theme.MainAccent};
        margin: 5px;
    }
    @media(max-width: 490px){
        width: 90%; 
        height: 20vh;
    }
`;

export const DepositTokenRow = styled.div`
    width: 100%;
    height: 50%;
    ${props => props.theme.displayFlexColumn};
`;
export const DepositTokenRowSmall = styled.div`
    width: 90%;
    height: 50%;
    ${props => props.theme.displayFlexCenter};
    text-align: center;
    h2{
        color: ${props => props.theme.text};
        font-size: 14px;
        font-weight: bold;
    }
    span{
        color: ${props => props.theme.MainAccentTwo};
        font-size: 18px;
        font-weight: bold; 
        margin: 0 5px;
    }
`;
export const DepositTokenFrom = styled.div`
    width: 100%;
    height: 30%;
    ${props => props.theme.displayFlex};
    padding: 0 10px;
    transform: translateY(-5px);
    h2{
        color: ${props => props.theme.text};
        font-size: 12px;
        font-weight: bold;
    }
`;

export const FromTitle = styled.div`
    width: 50%;
    height: 100%;
    ${props => props.theme.displayFlex};
    h2{
        color: ${props => props.theme.text};
        font-size: 12px;
        font-weight: bold;
    }
`;
export const DepositTokenToken = styled.div`
    width: 100%;
    height: 70%;
    ${props => props.theme.displayFlex};
    padding: 0 10px;
    h2{
        color: ${props => props.theme.text};
        font-size: 12px;
        font-weight: bold;
    }
`;

export const TokenHolder = styled(Button)`
    &&&{
        width: 100px;
        height: 70%;
        border: 1px solid ${props => props.theme.card};
        border-radius: 20px;
        background: #504949;
        ${props => props.theme.displayFlexCenter};
        
    }
`;

export const LogoHolder = styled.div`
    width: 30%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    img{
        width: 100%;
        display: block;
        object-fit: cover;
    }
`;
export const SmallLogoHolder = styled.div`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
    img{
        width: 75%;
        display: block;
        object-fit: cover;
    }
    h2{
        color: ${props => props.theme.text};
        font-size: 16px;
        font-weight: bold;
    }
    @media(min-width: 1100px){
        img{
        width: 25%;
    }
    }
`;

export const InputInput = styled.input`
    width: 80%;
    height: 80%;
    border: 1px solid ${props => props.theme.text};
    ${props => props.theme.displayFlex};
    background: transparent;
    border-radius: 10px;
    color:  ${props => props.theme.text};
    font-size: 18px;
    text-align: right;
    padding: 0 10px;
    font-weight: bold;
`;
export const InputHolder = styled.div`
    width: 60%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;
export const TokenNameHolder = styled.div`
    width: 70%;
    height: 100%;
    ${props => props.theme.displayFlex};
    padding: 0 5px;
    h2{
        color: ${props => props.theme.text};
        font-size: 14px !important;
        font-weight: bold;
    }
`;

export const DepositBigTitle = styled.div`
    width: 95%;
    height: 10%;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    margin-bottom: 20px;
    line-height:1.4;
    h2{
        font-size: 20px;
        font-weight: bold;
        color: ${props => props.theme.text};
    }
`;
export const Tiers = styled.div`
    width: 98%;
    height: 30%;
    ${props => props.theme.displayFlex};
    justify-content: space-around;
    margin-bottom: 20px;
`;

export const TopTierRow = styled.div`
    width: 100%;
    height: 25%;
    ${props => props.theme.displayFlexCenter};
    h2{
        color: ${props => props.theme.text};
        font-size: 32px;
        font-weight: bold;
    }
`;
export const SecondTierRow = styled.div`
    width: 100%;
    height: 10%;
    ${props => props.theme.displayFlexCenter};
    h2{
        color: ${props => props.theme.text};
        font-size: 10px;
    }
    h3{
        color: ${props => props.theme.text};
        font-size: 14px;
    }
`;
export const BigTierRow = styled.div`
    width: 100%;
    height: 20%;
    ${props => props.theme.displayFlexCenter}
    h2{
        color: ${props => props.theme.text};
        font-size: 18px;
    }
`;
export const Tier = styled.div`
    width: 31%;
    height: 95%;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexColumn};
    border-radius: 10px;
`;
export const TokenColumn = styled.div`
    width: 50%;
    height: 100%;
    font-size: 20px;
    text-align: center;
    font-weight: bold;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
`;

export const DepositTitle = styled.div`
    width: 100%;
    height: 16.6%;
    font-size: 20px;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    span{
        color: ${props => props.theme.MainAccent};
        margin: 5px;
    }
`;

export const SmallDepositTitle = styled.div`
    width: 100%;
    height: 16.6%;
    font-size: 14px;
    color: ${props => props.theme.text};
    ${props => props.theme.displayFlexCenter};
    span{
        color: ${props => props.theme.MainAccent};
        margin: 5px;
    }
`;

export const Section = styled.div`
    width: 100%;
    height: auto;
    ${props => props.theme.displayFlexColumn};
    background: ${props => props.theme.body};
    padding: 30px;
    @media(max-width: 498px){
        padding: 5px;
        padding-top: 30px;
    }
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
    ${props => props.theme.displayFlexCenter};
`;

export const HolderRowAround = styled.div`
    width: 80%;
    height: 40px;
    color: ${props => props.theme.MainAccent};
    font-size: 24px;
    text-align: center;
    ${props => props.theme.displayFlex};
    justify-content: space-between;
    @media(max-width: 498px){
        width: 100%;
    }
`;

export const SmallHolderRowAround = styled.div`
    width: 80%;
    height: 40px;
    color: ${props => props.theme.MainAccent};
    font-size: 24px;
    text-align: center;
    ${props => props.theme.displayFlex};
    justify-content: space-evenly;
    h2{
        font-size: 18px;
        color: ${props => props.theme.text};
        text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
    }
`;

export const LeaguesHolder = styled.div`
    width: 100%;
    height: auto;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 10px;
    margin-bottom: 50px;
    @media(max-width: 498px){
        grid-template-columns: 1fr 1fr 1fr;
    }
`;

export const Row = styled.div`
    width: 100%;
    height: auto;
    ${props => props.theme.displayFlexCenter};
    justify-content: space-around;
    @media(max-width: 498px){
        flex-direction: column;
    }
`;

export const Holder = styled.div`
    width: 45vw;
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
    @media(max-width: 498px){
        width: 90vw;
    }
`;

export const LinkInputField = styled.input`
    padding: 0 15px;
    border: ${props => props.theme.pacBorder};
    border-radius: 10px;
    outline: none;
    font-size: 18px;
    text-align: center;
    color: ${props => props.theme.pacColor};
    background-color: transparent;
    box-shadow: ${props => props.theme.pacBoxShadow};
    width: 60%;
    z-index: 4000;
    height: 80%;
    @media(max-width: 490px){
        width: 95%;
    }
`;

export const DepositRow = styled.div`
    width: 100%;
    height: 30%;
    ${props => props.theme.displayFlexColumn};
    margin: 10px;
`;

export const CloseStats = styled(HighlightOffIcon)`
  &&&{
    position: fixed;
    top: 30px;
    left: 30px;
    transform: scale(1.8);
    background: transparent;
    z-index: 9999;
    outline: none;
    color: ${props => props.theme.text};
  }
`;

export const CloseFilter = styled(FilterListIcon)`
  &&&{
    position: fixed;
    top: 30px;
    right: 30px;
    transform: scale(1.8);
    background: transparent;
    z-index: 9999;
    outline: none;
    color: ${props => props.theme.text};
  }
`;
export const CloseFilterTwo = styled(FilterListOffIcon)`
  &&&{
    position: fixed;
    top: 30px;
    right: 30px;
    transform: scale(1.8);
    background: transparent;
    z-index: 9999;
    outline: none;
    color: ${props => props.theme.text};
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
    @media(max-width: 498px){
        width: 98%;
        height: 120px;
    }
`;

export const PlayerLogo = styled.div`
    width: 20%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
`;

export const MobileWrapper = styled.div`
    width: 37.5%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
    align-items: center;
    text-shadow: ${props => props.theme.body} -1px 2px,  ${props => props.theme.body} -2px 2px,  ${props => props.theme.body} -3px 3px;
    span{
        font-size: 16px;
    }
    @media(max-width: 968px){
        font-size: 22px;
    }
    @media(max-width: 498px){
        font-size: 12px;
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
    width: 100px;
    height: 100%;
    display: flex;
    align-items: center;
    font-weight: bold;
    font-size: 24px;
    @media(max-width: 968px){
        font-size: 22px;
    }
    @media(max-width: 498px){
        font-size: 14px;
        width: 60px;
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