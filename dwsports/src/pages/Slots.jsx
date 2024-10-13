import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

import wolves from '../assets/wolves.png';
import arsenal from '../assets/arsenal.png';
import chelsea from '../assets/chelsea.png';
import barça from '../assets/barça.png';
import napoli from '../assets/napoli.png';
import girona from '../assets/girona.png';

// Grid Container
const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 columns */
  grid-template-rows: repeat(3, 1fr); /* 3 rows */
  gap: 10px;
  width: 600px;
  height: 300px;
  border: 10px solid #ba3d00;
  padding: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  position: relative;
`;

// Chip Component for large and small chips
const Chip = styled(motion.div)`
  background-size: cover;
  background-position: center;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  grid-column: ${({ colStart, colSpan }) => `${colStart} / span ${colSpan}`};
  grid-row: ${({ rowStart, rowSpan }) => `${rowStart} / span ${rowSpan}`};
`;

// Button styling
const SpinButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  background-color: #ba3d00;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #a32c00;
  }
`;

// Sample images
const symbols = [wolves, arsenal, chelsea, barça, napoli, girona];

// Function to generate large chips
const generateLargeChip = (spinCount) => {
  let largeSize;

  if (spinCount % 20 === 0 && spinCount !== 0) {
    largeSize = { colSpan: 3, rowSpan: 3 };
  } else if (spinCount % 10 === 0 && spinCount !== 0) {
    largeSize = { colSpan: 2, rowSpan: 2 };
  } else {
    return null; // No large chip
  }

  const maxColumnStart = 6 - largeSize.colSpan;
  const maxRowStart = 3 - largeSize.rowSpan;

  return {
    ...largeSize,
    colStart: Math.floor(Math.random() * (maxColumnStart + 1)) + 1,
    rowStart: Math.floor(Math.random() * (maxRowStart + 1)) + 1,
    image: symbols[Math.floor(Math.random() * symbols.length)],
    id: Math.random(),
  };
};

// Check for overlap with large chip
const isOverlappingLargeChip = (col, row, largeChip) => {
  const { colStart, rowStart, colSpan, rowSpan } = largeChip;
  return col >= colStart && col < colStart + colSpan && row >= rowStart && row < rowStart + rowSpan;
};

// The main SlotGame component
const SlotGame = () => {
  const [chips, setChips] = useState({ largeChip: null, smallChips: [] });
  const [animate, setAnimate] = useState(false);
  const [spinCount, setSpinCount] = useState(0);

  // Function to generate small chips and avoid large chip positions
  const generateSmallChips = (largeChip) => {
    const smallChips = [];
    for (let row = 1; row <= 3; row++) {
      for (let col = 1; col <= 6; col++) {
        // Ensure chips are not overlapping with large chip
        if (!largeChip || !isOverlappingLargeChip(col, row, largeChip)) {
          smallChips.push({
            colStart: col,
            rowStart: row,
            image: symbols[Math.floor(Math.random() * symbols.length)],
            id: Math.random(), // Ensure unique keys
          });
        }
      }
    }
    return smallChips;
  };

  // Handle click to spin
  const handleSpinClick = () => {
    setSpinCount(spinCount + 1);
    setAnimate(true);

    setTimeout(() => {
      const newLargeChip = generateLargeChip(spinCount + 1);
      const newSmallChips = generateSmallChips(newLargeChip);
      setChips({ largeChip: newLargeChip, smallChips: newSmallChips });
      setAnimate(false);
    }, 100);
  };

  const { largeChip, smallChips } = chips;

  // Animation stagger logic
  const staggerAnimation = {
    hidden: { opacity: 0, y: -200 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2, // Stagger animation by columns
      },
    }),
    exit: { opacity: 0, y: 200 },
  };

  // Group small chips by columns
  const columns = [[], [], [], [], [], []];
  smallChips.forEach((chip) => {
    columns[chip.colStart - 1].push(chip);
  });

  return (
    <Section>
      <SlotGrid>
        <AnimatePresence>
          {!animate && (
            <>
              {columns.map((column, colIdx) => (
                <React.Fragment key={`column-${colIdx}`}>
                  {column.map((chip) => (
                    <Chip
                      key={`small-chip-${chip.id}`}
                      colStart={chip.colStart}
                      rowStart={chip.rowStart}
                      colSpan={1}
                      rowSpan={1}
                      variants={staggerAnimation}
                      initial="hidden"
                      animate="visible"
                      exit="exit"
                      custom={colIdx} // Custom stagger based on column index
                      style={{ backgroundImage: `url(${chip.image})` }}
                    />
                  ))}
                </React.Fragment>
              ))}

              {largeChip && (
                <Chip
                  key={`large-chip-${largeChip.id}`}
                  style={{ backgroundImage: `url(${largeChip.image})` }}
                  colStart={largeChip.colStart}
                  rowStart={largeChip.rowStart}
                  colSpan={largeChip.colSpan}
                  rowSpan={largeChip.rowSpan}
                  initial={{ y: -200, opacity: 0 }}
                  animate={{
                    y: 0,
                    opacity: 1,
                    transition: {
                      duration: 0.6,
                      delay: largeChip.colStart * 0.2,
                    },
                  }}
                  exit={{ y: 200, opacity: 0 }}
                />
              )}
            </>
          )}
        </AnimatePresence>
      </SlotGrid>

      {/* Button to trigger spin */}
      <SpinButton onClick={handleSpinClick}>Spin</SpinButton>
    </Section>
  );
};

export default SlotGame;

const Section = styled.div`
  width: 100vw;
  height: 100vh;
  background: ${(props) => props.theme.body};
  ${(props) => props.theme.displayFlexColumnCenter};
`;
