import styled from 'styled-components'

export const HeroSection = styled.div`
    width: 100%;
    height: 130vh;
    background: ${props => props.theme.body};
    ${props => props.theme.displayFlexColumn};
    padding: 10px;
    img{
        width: 100%;
        display: block;
        object-fit: cover;
    }
`;