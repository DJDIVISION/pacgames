import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { Button,IconButton } from '@mui/material';
import styled from 'styled-components';

export const Disconnect = styled(ExitToAppIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.5;
        background: transparent;
    }
`;

export const PlayerGridLoading = styled.div`
    width: 100%;
    height: 70vh;
    display: grid;
    place-items: center;
    border: 1px solid white;
    padding: 30px;
    position: relative;
`;

export const LoadingText = styled.div`
    width: 300px;
    height: 10vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props=> props.theme.text};
    font-size: 24px;
    text-align: center;
`;

export const LogOutContainer = styled.div`
    width: 100%;
    height: 10vh;
    display: flex;
    margin-bottom: auto;
    align-items: center;
    justify-content: flex-end;
    padding: 0 30px;
`;

export const LogOutText = styled.div`
    color: ${props=> props.theme.text};
    font-size: 16px; 
    margin: 0 20px;
`;