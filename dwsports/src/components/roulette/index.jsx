import styled from "styled-components";
import {motion} from 'framer-motion'

export const LastRowWrapper = styled.div`
width: calc(70vw * 2/12);
height: calc(70vw/12);
position: relative;
border: 1px solid ${props => props.theme.text};
${props => props.theme.displayFlexCenter};
color: ${props => props.theme.text};
font-size: 24px;
font-weight: bold;
cursor: pointer;
`;

export const BetPerRowsWrapper = styled.div`
width: calc(70vw * 4/12);
height: calc(70vw/12);
position: relative;
border: 1px solid ${props => props.theme.text};
${props => props.theme.displayFlexCenter};
color: ${props => props.theme.text};
font-size: 24px;
font-weight: bold;
cursor: pointer;
`;

export const NumberZeroWrapper = styled.div`
width: 70%;
height: 50%;
border-radius: 50%;
${props => props.theme.displayFlexCenter};
border: 1px solid orange;
`;

export const Zero = styled.div`
width: calc(70vw/12);
height: calc(70vw/12 * 1.5);
border: 1px solid ${props => props.theme.text};
position: relative;
${props => props.theme.displayFlexColumnCenter};
color: white;
font-size: 24px;
cursor: pointer;
`;

export const CornerLeft = styled(motion.div)`
position: absolute;
width: 30px;
height: 30px;
border-radius: 50px;
//background: aqua;
top: 0;
left: 0;
transform: translate(-50%,-50%);
z-index: 9000;
`;

export const BorderLeft = styled.div`
    width: 20px;
    height: 60%;
    background: transparent;
    position: absolute;
    top: 20%;
    left: -15%;
`;

export const BorderTop = styled.div`
width: 60%;
height: 20px;
background: transparent;
position: absolute;
top: -10%;
left: 20%;
`;

export const Number = styled.div`
width: calc(70vw/12);
height: calc(70vw/12);
border: 1px solid ${props => props.theme.text};
position: relative;
${props => props.theme.displayFlexColumnCenter};
color: white;
font-size: 24px;
cursor: pointer;
`;

export const NumberWrapper = styled.div`
width: 70%;
height: 70%;
border-radius: 50%;
${props => props.theme.displayFlexCenter};
border: 1px solid orange;
color: ${props => props.theme.text};
`;