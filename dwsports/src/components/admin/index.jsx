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
    border: 1px solid red;
    ${props => props.theme.displayFlexCenter};
    h2{
        font-size: 18px;
        color: white;
    }
`;