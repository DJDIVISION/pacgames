import React, { useEffect, useState } from 'react';
import { motion, useTransform, useViewportScroll } from 'framer-motion';
import styled from 'styled-components'

const Airdrop = () => {
  return (
    <Section>
      AIRDROP
    </Section>
  )
}

export default Airdrop

const Section = styled.div`
    width: 100vw;
    height: 100vh;
    background: #818180;
    display: grid;
    place-content: center;
`;
