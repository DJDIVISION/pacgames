import styled from "styled-components";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import { motion } from "framer-motion";
import FilterListIcon from '@mui/icons-material/FilterList';
import FilterListOffIcon from '@mui/icons-material/FilterListOff';
import { Button } from "@mui/material";
import shinobi from '../../assets/logos/shinobi.png'
import sho from '../../assets/logos/sho.png'
import ton from '../../assets/logos/ton.png'
import move from '../../assets/logos/move.jpg'
import fren from '../../assets/logos/fren.png'

export const FooterSection = styled.div`
    width: 100%;
    height: 50vh;
    ${props => props.theme.displayFlexCenter}
    background: ${props => props.theme.body};
    border-top: 1px solid ${props => props.theme.text};
    position: relative;
    overflow: hidden;
    box-shadow: ${props => props.theme.pacBoxShadow}, inset 0 0 25px ${props => props.theme.MainAccentTwo};
`;
export const SmartFooterSection = styled.div`
    width: 100%;
    height: 50vh;
    ${props => props.theme.displayFlexColumn}
    background: ${props => props.theme.body};
    border-top: 1px solid ${props => props.theme.text};
    position: relative;
    overflow: hidden;
    padding: 10px;
    box-shadow: ${props => props.theme.pacBoxShadow}, inset 0 0 25px ${props => props.theme.MainAccentTwo};
`;

export const Logo = styled.div`
    height: 100%;
    width: 30%;
    ${props => props.theme.displayFlexCenter}
    img{
        width: 65%;
        display: block;
        object-fit: cover;
    }
`;
export const Column = styled.div`
    height: 100%;
    width: 70%;
    display: flex;
    flex-direction: column;
`;

export const TopRow = styled.div`
    width: 60%;
    height: 35%;
    ${props => props.theme.displayFlexCenter};
    text-shadow: ${props => props.theme.textShadowTwo};
    h2{
        color: ${props => props.theme.MainAccentTwo};
        font-size: 54px;
        font-weight: bold;
        margin: auto;
    }
    svg{
        transform: translateY(-10px);
    }
`;
export const TopSmartRow = styled.div`
    width: 100%;
    height: 15%;
    ${props => props.theme.displayFlexCenter};
    text-shadow: ${props => props.theme.textShadowTwo};
    h2{
        color: ${props => props.theme.MainAccentTwo};
        font-size: 28px;
        font-weight: bold;
        margin: auto;
    }
    svg{
        transform: translateY(-10px);
    }
`;
export const TopSmartRowTwo = styled.div`
    width: 100%;
    height: 20%;
    ${props => props.theme.displayFlexCenter};
    text-shadow: ${props => props.theme.textShadowTwo};
    transform: translateY(-10px);
    h2{
        color: ${props => props.theme.MainAccentTwo};
        font-size: 28px;
        font-weight: bold;
        margin: auto;
    }
    svg{
        transform: translateY(10px);
    }
    @media(max-width: 498px){
        svg{
            transform: scale(0.8);
        }
    }
`;

export const TopSmartRowThree = styled.div`
    width: 100%;
    height: 45%;
    ${props => props.theme.displayFlexCenter};
    text-shadow: ${props => props.theme.textShadowTwo};
    transform: translateY(-10px);
    img{
        width: 30%;
        display: block;
        object-fit: cover;
    }
`;

export const BottomRow = styled.div`
    width: 90%;
    height: 30%;
    ${props => props.theme.displayFlex};
    justify-content: space-between;
`;

export const ButtonWrapper = styled.a`
    width: 10%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;
export const SmartButtonWrapper = styled.a`
    width: 20%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;

export const Partners = [
    {
        name: 'SHINOBI',
        website: 'https://sh1nobi.io',
        telegram: 'https://t.me/SHINOBIPORTAL',
        twitter: 'https://x.com/sibonihs?s=21&t=QRHKIh6sLsC1HoUdftHPYQ',
        whitepaper: "https://shinobi-3.gitbook.io/shinobi-revolutionizing-defi-ecosystems-with-shid",
        buy: 'https://pool.shido.io/pool/0x4aed39bda730a74874a576b7c0d68e2c641cf912',
        logo: shinobi,
        bot: null,
        app: null
    },
    {
        name: 'FREN',
        website: 'https://fren.tg',
        telegram: 'https://t.me/frentgnews',
        twitter: 'https://x.com/fren_airdrop',
        whitepaper: null,
        buy: null,
        logo: fren,
        bot: 'https://t.me/FrenTekBot',
        app: 'https://t.me/FrenTekBot/fren'
    },
    {
        name: 'MOVE',
        website:null,
        telegram: 'https://t.me/MoveOnTonBot',
        twitter: 'https://x.com/moveonton',
        whitepaper: null,
        buy: null,
        logo: move,
        bot: null,
        app: null
    },
    {
        name: 'TON',
        website:'https://ton.org',
        telegram: 'https://t.me/toncoin',
        twitter: 'https://x.com/ton_blockchain',
        whitepaper: null,
        buy: 'https://ton.org/en/buy-toncoin?filters[exchange_groups][slug][$eq]=buy-with-card&pagination[page]=1&pagination[pageSize]=100',
        logo: ton,
        bot: null,
        app: null
    }
]