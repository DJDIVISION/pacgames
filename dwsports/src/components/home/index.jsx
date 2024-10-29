import styled from 'styled-components'

export const HeroSection = styled.div`
    width: 100%;
    height: calc(100vh - 80px);
    background: ${props => props.theme.body};
    ${props => props.theme.displayFlexColumn};
    border: 1px solid aqua;
    padding: 10px;
    img{
        width: 100%;
        display: block;
        object-fit: cover;
    }
`;