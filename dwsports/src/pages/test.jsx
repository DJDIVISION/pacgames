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
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  grid-column: ${({ colStart, colSpan }) => `${colStart} / span ${colSpan}`};
  grid-row: ${({ rowStart, rowSpan }) => `${rowStart} / span ${rowSpan}`};
`;

// Button styling
const SpinButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  font-size: 18px;
  background-color:${({ disabled }) => (disabled ? "#c2c2c2" : "#19f1f1")};
  
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:hover {
    background-color: #ddda0b;
  }
`;

// Function to generate large chips
const generateLargeChip = (spinCount,existingLargeChip) => {
   if (existingLargeChip) return null; 
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
    type: "largeChip",
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
  const [rows, setRows] = useState(3)
  const [shake, setShake] = useState(false);
  const [disabled, setDisabled] = useState(false)

  const triggerShakeAnimation = () => {
    // Trigger the shake animation by toggling the shake state
    setShake(true);
    setTimeout(() => {
      setShake(false); // Stop the animation after it runs
    }, 500); // Match the animation duration
  };

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
      setDisabled(false)
    }
  };

  
  const repopulateChips = () => {
    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((column, colIdx) => {
        const newColumn = [...column]; // Create a copy of the current column
        const largeChip = newColumn.find(chip => chip && chip.type === "largeChip");
  
        // If there's a large chip, mark where the small chips can go
        const hasLargeChip = !!largeChip;
  
        for (let row = 0; row < newColumn.length; row++) {
          // Only fill empty slots if there is no large chip in the column
          if (newColumn[row] === null && !hasLargeChip) {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            newColumn[row] = {
              colStart: colIdx + 1,
              rowStart: row + 1,
              type: "smallChip",
              image: randomSymbol.src,
              value: randomSymbol.value,
              id: Math.random(), // Ensure unique keys
            };
          }
        }
  
        return newColumn; // Return the updated column
      });
  
      return newColumns; // Update the columns state with new columns
    });
    setTimeout(() => {
      console.log("Checking for repeated images after repopulating chips...");
      checkImagesAcrossAllColumns(columns, chips.largeChip); 
    }, 0); // 0 delay to ensure it runs after state update
  };
  
  

  const shiftAllChipsDown = () => {
    setColumns((prevColumns) => {
      // Loop through each column and shift down the chips to fill the empty spaces
      const shiftedColumns = prevColumns.map((column) => {
        // Filter out the `null` spaces (empty slots)
        const chipsInColumn = column.filter(chip => chip !== null);
  
        // Fill from the bottom: calculate new rowStart for each chip
        const filledColumn = Array(column.length).fill(null); // Create a new column filled with `null`
        chipsInColumn.forEach((chip, index) => {
          // Place each chip starting from the bottom (last available row)
          const newRowStart = column.length - chipsInColumn.length + index + 1;
          filledColumn[newRowStart - 1] = {
            ...chip,
            rowStart: newRowStart, // Update the rowStart based on the new position
          };
        });
  
        return filledColumn; // Return the new column with chips shifted down
      });
  
      console.log("Columns after shifting all chips down:", shiftedColumns); // Log the updated columns after shift
      return shiftedColumns; // Update state with the new columns
    });
  };

const addNewRowAtTop = () => {
  setColumns((prevColumns) => {
    // Add a new empty slot at the top of each column
    const updatedColumns = prevColumns.map((column) => {
      // Add a null (empty space) at the start of each column
      const newColumn = [null, ...column];

      // Adjust rowStart for each chip, since the new row shifts everything down
      const shiftedColumn = newColumn.map((chip, index) => {
        if (chip !== null) {
          return {
            ...chip,
            rowStart: chip.rowStart + 1, // Shift each chip down by 1
          };
        }
        return chip;
      });

      return shiftedColumn;
    });

    console.log("Columns after adding new row at the top:", updatedColumns); // Log the updated columns
    return updatedColumns; // Return the updated columns with new row
  });

  // Increase the total number of rows by 1
  setRows((prevRows) => prevRows + 1);
};

const removeRepeatedImagesOneByOne = (imageToRemove, columns, lastColumnFound) => {
  let delay = 0;
  let newRowAdded = false
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

    console.log("Chips to remove:", chipsToRemove); // Log the chips to remove

    // Now, remove the collected chips one by one with delay
    chipsToRemove.forEach(({ colIdx, chipId, chipValue }, i) => {
      setTimeout(() => {
        setColumns((prevColumns) => {
          console.log(`Before removal in column ${colIdx}:`, prevColumns[colIdx]); // Log the column before removal

          const updatedColumns = prevColumns.map((col, index) => {
            if (index === colIdx) {
              // Instead of removing the chip completely, mark it as `null`
              const newColumn = col.map((chip) => chip && chip.id === chipId ? null : chip);

              console.log(`After marking chip as null in column ${colIdx}:`, newColumn); // Log the column after marking chips

              return newColumn; // Return the updated column with nulls
            }
            return col;
          });

          console.log("Updated columns after marking as null:", updatedColumns); // Log the updated columns

          return updatedColumns; // Return the updated columns
        });

        // Add the value of the removed chip to the balance
        setWinnings((prevBalance) => {
          const newBalance = prevBalance + chipValue;
          console.log(`Updated winnings: ${newBalance}`); // Log updated winnings
          return newBalance;
        });

        // If it's the last chip removal, add a new row and shift chips
        if (i === chipsToRemove.length - 1 && !newRowAdded) {
          newRowAdded = true
          setTimeout(() => {
            addNewRowAtTop(); // Add a new row at the top
            shiftAllChipsDown();
            triggerShakeAnimation(); // After adding the new row, shift all remaining chips down
            repopulateChips();
          }, 500); // Small delay before shifting down
        }

      }, delay);

      delay += 100; // Delay between each removal
    });

  }, 2000);
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
            type: "smallChip",
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
    setDisabled(true)
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
      setColumns(populatedColumns);
      setAnimate(false);
      triggerShakeAnimation();
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

  
  return (
      <Section>
        <SlotGrid rows={rows} className={`slot-grid ${shake ? 'shake' : ''}`}>
          <AnimatePresence>
            {!animate && (
              <>
                {columns.map((column, colIdx) => (
                  <React.Fragment key={`column-${colIdx}`}>
                    {column.map((chip, chipIdx) => {
                      if (!chip) {
                        return null; // Skip rendering if chip is undefined
                      }
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
        <SpinButton disabled={disabled} onClick={handleSpinClick}>Spin</SpinButton>
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

