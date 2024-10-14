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
import { message } from 'antd';

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

// Function to generate large chips
const generateLargeChip = (spinCount) => {
  let largeSize;

  // Determine size based on spin count
  if (spinCount % 10 === 0 && spinCount !== 0) {
    largeSize = { colSpan: 3, rowSpan: 3 };
  } else if (spinCount % 5 === 0 && spinCount !== 0) {
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
    image: randomSymbol.src, // Get the image source from the symbol
    value: randomSymbol.value, // Get the value from the symbol
    id: `${colStart}-${rowStart}-large-chip`, // Unique id for large chip
  };
};

// Check for overlap with large chip
const isOverlappingLargeChip = (col, row, largeChip) => {
  const { colStart, rowStart, colSpan, rowSpan } = largeChip;
  return col >= colStart && col < colStart + colSpan && row >= rowStart && row < rowStart + rowSpan;
};

// Function to add both small and large chips into the columns array
const populateGridWithChips = (largeChip, smallChips) => {
  const columns = [[], [], [], [], [], []];

  // Add large chip first if it exists
  if (largeChip) {
    for (let i = 0; i < largeChip.colSpan; i++) {
      const colIndex = largeChip.colStart - 1 + i;

      // Ensure the column index is within bounds
      if (colIndex < 6) {
        columns[colIndex].push({
          ...largeChip,
          isLarge: true,  // Mark this as a large chip
        });
      }
    }
  }

  // Now add small chips if they do not overlap with the large chip
  smallChips.forEach((chip) => {
    const isOverlappingLarge = largeChip &&
      chip.colStart >= largeChip.colStart &&
      chip.colStart < largeChip.colStart + largeChip.colSpan &&
      chip.rowStart >= largeChip.rowStart &&
      chip.rowStart < largeChip.rowStart + largeChip.rowSpan;

    // Only add the small chip if it doesn't overlap with the large chip
    if (!isOverlappingLarge) {
      columns[chip.colStart - 1].push(chip);
    }
  });

  return columns;
};

// The main SlotGame component
const SlotGame = () => {
  const [chips, setChips] = useState({ largeChip: null, smallChips: [] });
  const [columns, setColumns] = useState([[], [], [], [], [], []]); // State for columns
  const [animate, setAnimate] = useState(false);
  const [spinCount, setSpinCount] = useState(0);
  const [winnings, setWinnings] = useState(0); 

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
  
    // Track images in the first three columns
    for (let colIdx = 0; colIdx < 3; colIdx++) {
      const column = columns[colIdx] || []; // Fallback to empty array
      trackImageFromChips(column, colIdx);
    }
  
    const repeatedImages = Object.keys(imageOccurrences).filter((image) => imageOccurrences[image].size === 3);
  
    repeatedImages.forEach((image) => {
      let foundInAllColumns = true; 
      let lastColumnFound = 2; // Start from the third column (0-indexed)
  
      for (let colIdx = 3; colIdx < columns.length; colIdx++) {
        const column = columns[colIdx] || [];
        const imageInColumn = column.some((chip) => chip.image === image); 
  
        if (!imageInColumn) {
          console.log(`Image "${image}" is not found in column ${colIdx + 1}. Stopping at column ${colIdx}.`);
          foundInAllColumns = false; 
          break;
        } else {
          lastColumnFound = colIdx;
        }
      }
  
      if (foundInAllColumns || lastColumnFound >= 2) {
        console.log(`Image "${image}" is found across columns up to ${lastColumnFound + 1}.`);
        // Start removing chips one by one with delay, up to lastColumnFound
        removeRepeatedImagesOneByOne(image, columns, lastColumnFound);
      }
    });
    
    if (repeatedImages.length === 0) {
      console.log('No images repeated across the first three columns');
    }
  };

  const removeRepeatedImagesOneByOne = (imageToRemove, columns,lastColumnFound) => {
    let delay = 0;
  
    setTimeout(() => {
      const chipsToRemove = []; // Store the chips (by ID) to be removed

    // Collect the chips that need to be removed (by unique chip ID)
    for (let colIdx = 0; colIdx <= lastColumnFound; colIdx++) {
      const column = columns[colIdx];
      column.forEach((chip) => {
        if (chip.image === imageToRemove) {
          chipsToRemove.push({ colIdx, chipId: chip.id, chipValue: chip.value }); // Track the column, chip ID, and chip value
        }
      });
    }

    // Now, remove the collected chips one by one with delay
    chipsToRemove.forEach(({ colIdx, chipId, chipValue }, i) => {
      setTimeout(() => {
        setColumns((prevColumns) => {
          return prevColumns.map((col, index) => {
            if (index === colIdx) {
              // Remove the chip based on its unique ID (chipId), not index
              return col.filter((chip) => chip.id !== chipId);
            }
            return col;
          });
        });

        // Add the value of the removed chip to the balance
        setWinnings((prevBalance) => prevBalance + chipValue);

      }, delay);

      delay += 250; // 1 second delay between removals
    });
    }, 3000)
  };
  
  

  // Function to generate small chips and avoid large chip positions
  const generateSmallChips = (largeChip) => {
    const smallChips = [];
    for (let row = 1; row <= 3; row++) {
      for (let col = 1; col <= 6; col++) {
        // Ensure chips are not overlapping with large chip
        if (!largeChip || !isOverlappingLargeChip(col, row, largeChip)) {
          const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
          smallChips.push({
            colStart: col,
            rowStart: row,
            image: randomSymbol.src, // Get the image source from the symbol
            value: randomSymbol.value, // Get the value from the symbol
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
    setWinnings(0)
    setTimeout(() => {
      const newLargeChip = generateLargeChip(spinCount + 1);
      const newSmallChips = generateSmallChips(newLargeChip);

      // Populate the grid with both large and small chips
      const populatedColumns = populateGridWithChips(newLargeChip, newSmallChips);
      checkImagesAcrossAllColumns(populatedColumns, newLargeChip);
      setChips({ largeChip: newLargeChip, smallChips: newSmallChips });
      setColumns(populatedColumns); // Update columns in state
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

  console.log(columns)

  return (
      <Section>
        <SlotGrid>
          <AnimatePresence>
            {!animate && (
              <>
                {columns.map((column, colIdx) => (
                  <React.Fragment key={`column-${colIdx}`}>
                    {column.map((chip, chipIdx) => {
                      if (chip.isLarge) {
                        // Render large chip only in its first column (colStart)
                        if (chip.colStart === colIdx + 1) {
                          return (
                            <Chip
                              key={`large-chip-${chip.id}`}
                              style={{ backgroundImage: `url(${chip.image})` }}
                              colStart={chip.colStart}
                              rowStart={chip.rowStart}
                              colSpan={chip.colSpan}
                              rowSpan={chip.rowSpan}
                              initial={{ y: -200, opacity: 0 }}
                              animate={{
                                y: 0,
                                opacity: 1,
                                transition: {
                                  duration: 0.6,
                                  delay: chip.colStart * 0.2,
                                },
                              }}
                              exit={{ y: 200, opacity: 0 }}
                            />
                          );
                        } else {
                          return null; // Skip rendering in the other columns
                        }
                      } else {
                        // Render small chips as usual
                        return (
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
                        );
                      }
                    })}
                  </React.Fragment>
                ))}
              </>
            )}
          </AnimatePresence>
        </SlotGrid>
        <h2>Winnings: {winnings}</h2>
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
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
