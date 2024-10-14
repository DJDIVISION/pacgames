import React, { useState } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

// Import images
import wolves from '../assets/wolves.png';
import arsenal from '../assets/arsenal.png';
import chelsea from '../assets/chelsea.png';
import barça from '../assets/barça.png';
import napoli from '../assets/napoli.png';
import girona from '../assets/girona.png';

// Sample images with id, src, and value
const symbols = [
  { id: 1, src: wolves, value: 10 },
  { id: 2, src: arsenal, value: 20 },
  { id: 3, src: chelsea, value: 30 },
  { id: 4, src: barça, value: 40 },
  { id: 5, src: napoli, value: 50 },
  { id: 6, src: girona, value: 60 },
];

// Grid Container
const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr); /* 6 columns */
  grid-template-rows: ${({ rows }) => `repeat(${rows}, 1fr)`};
  gap: 10px;
  width: 600px;
  height: ${({ rows }) => `${rows * 100}px`};
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
  box-shadow: 0 2px 5px rgba(255, 255, 255, 0.2);
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

// Function to generate large chips
const generateLargeChip = (spinCount) => {
  let largeSize;

  // Determine size based on spin count
  if (spinCount % 5 === 0 && spinCount !== 0) {
    largeSize = { colSpan: 3, rowSpan: 3 };
  } else if (spinCount % 2.5 === 0 && spinCount !== 0) {
    largeSize = { colSpan: 2, rowSpan: 2 };
  } else {
    return null; // No large chip
  }

  // Calculate random starting position
  const maxColumnStart = 6 - largeSize.colSpan;
  const maxRowStart = 3 - largeSize.rowSpan;
  const colStart = Math.floor(Math.random() * (maxColumnStart + 1)) + 1;
  const rowStart = Math.floor(Math.random() * (maxRowStart + 1)) + 1;

  // Select a random symbol for the large chip
  const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
  
  return {
    ...largeSize,
    colStart: colStart,
    rowStart: rowStart,
    image: randomSymbol.src,
    value: randomSymbol.value,
    id: `${colStart}-${rowStart}-large-chip`, // Unique id for large chip
  };
};

// Check for overlap with large chip
const isOverlappingLargeChip = (col, row, largeChip) => {
  if (!largeChip) return false; // Avoid checking if no large chip exists
  const { colStart, rowStart, colSpan, rowSpan } = largeChip;
  return col >= colStart && col < colStart + colSpan && row >= rowStart && row < rowStart + rowSpan;
};

// The main SlotGame component
const SlotGame = () => {
  const [chips, setChips] = useState({ largeChip: null, smallChips: [] });
  const [animate, setAnimate] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [rows] = useState(3); 
  const [prevChips, setPrevChips] = useState([]); 

  const checkImagesAcrossAllColumns = (columns, largeChip) => {
    const imageOccurrences = {}; 

    // Function to track images from chips
    const trackImageFromChips = (chips = [], colIdx) => {
      if (!chips || !Array.isArray(chips)) return; // Ensure chips is an array
      chips.forEach((chip) => {
        const image = chip.image;
        if (!imageOccurrences[image]) {
          imageOccurrences[image] = new Set();
        }
        imageOccurrences[image].add(colIdx);
      });
    };

    // Loop over the first three columns and track small chips
    for (let colIdx = 0; colIdx < 3; colIdx++) {
      const column = columns[colIdx] || []; // Fallback to empty array
      trackImageFromChips(column, colIdx);
    }

    // If there is a large chip, account for it as well
    if (largeChip) {
      const { colStart, rowStart, colSpan, rowSpan, image } = largeChip;
      for (let row = rowStart; row < rowStart + rowSpan; row++) {
        for (let col = colStart; col < colStart + colSpan; col++) {
          const colIndex = col - 1; 
          if (colIndex >= 0 && colIndex < columns.length) {
            if (!imageOccurrences[image]) {
              imageOccurrences[image] = new Set();
            }
            imageOccurrences[image].add(colIndex);
          }
        }
      }
    }

    // Check if any image appears in all three columns
    const repeatedImages = Object.keys(imageOccurrences).filter((image) => imageOccurrences[image].size === 3);
    
    repeatedImages.forEach((image) => {
      let foundInAllColumns = true; 
      for (let colIdx = 3; colIdx < columns.length; colIdx++) {
        const column = columns[colIdx] || [];
        const imageInColumn = column.some((chip) => chip.image === image); 
        if (!imageInColumn) {
          console.log(`Image "${image}" is not found in column ${colIdx + 1}. Returning.`);
          foundInAllColumns = false; 
          break; 
        }
      }
      if (foundInAllColumns) {
        console.log(`Image "${image}" is found in all columns.`);
      }
    });
    
    if (repeatedImages.length === 0) {
      console.log('No images repeated across the first three columns');
    }
  };

  const generateSmallChips = (largeChip) => {
    const smallChips = [];
    for (let row = 1; row <= 3; row++) {
      for (let col = 1; col <= 6; col++) {
        if (!isOverlappingLargeChip(col, row, largeChip)) {
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          smallChips.push({
            colStart: col,
            rowStart: row,
            image: randomSymbol.src,
            value: randomSymbol.value,
            id: Math.random(), 
          });
        }
      }
    }
    return smallChips;
  };

  const handleSpinClick = () => {
    setSpinCount(spinCount + 1);
    setAnimate(true);
    
    setTimeout(() => {
      const newLargeChip = generateLargeChip(spinCount + 1);
      const newSmallChips = generateSmallChips(newLargeChip);
      
      const newColumns = [[], [], [], [], [], []];
      newSmallChips.forEach((chip) => {
        newColumns[chip.colStart - 1].push(chip);
      });
      
      checkImagesAcrossAllColumns(newColumns, newLargeChip);
      
      setChips({ largeChip: newLargeChip, smallChips: newSmallChips });
      setPrevChips(newSmallChips);
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
        delay: i * 0.1, 
      },
    }),
  };

  return (
    <>
      <SlotGrid rows={rows}>
        <AnimatePresence>
          {largeChip && (
            <Chip
              key={largeChip.id}
              colStart={largeChip.colStart}
              rowStart={largeChip.rowStart}
              colSpan={largeChip.colSpan}
              rowSpan={largeChip.rowSpan}
              style={{ backgroundImage: `url(${largeChip.image})` }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerAnimation}
              custom={0}
            />
          )}
          {smallChips.map((chip, index) => (
            <Chip
              key={chip.id}
              colStart={chip.colStart}
              rowStart={chip.rowStart}
              colSpan={1}
              rowSpan={1}
              style={{ backgroundImage: `url(${chip.image})` }}
              initial="hidden"
              animate="visible"
              exit="hidden"
              variants={staggerAnimation}
              custom={index}
            />
          ))}
        </AnimatePresence>
      </SlotGrid>
      <SpinButton onClick={handleSpinClick}>Spin</SpinButton>
    </>
  );
};

export default SlotGame;
