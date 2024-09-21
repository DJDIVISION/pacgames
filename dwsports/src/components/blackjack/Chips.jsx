/* import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ChipContainer } from '../index';
import chip1 from '../../assets/chips/chip1.png'
import chip10 from '../../assets/chips/chip10.png'
import chip25 from '../../assets/chips/chip25.png'
import chip50 from '../../assets/chips/chip50.png'
import chip100 from '../../assets/chips/chip100.png'

const chipData = [
  { value: 1, image: chip1 },
  { value: 10, image: chip10 },
  { value: 25, image: chip25 },
  { value: 50, image: chip50 },
  { value: 100, image: chip100 }
];

const Chips = () => {
  return (
    <ChipContainer className="chips-container">
      {chipData.map((chip) => (
        <Chip key={chip.value} chipValue={chip.value} image={chip.image} />
      ))}
    </ChipContainer>
  );
};
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `chip-${chipValue}`,
    data: { chipValue },  // Passing chip value through drag data
  });

  // Apply transform styles during drag
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div className="chip" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <img src={image} alt={`Chip ${chipValue}`} width={50} height={50} />
    </div>
  );

export default Chips; */


import React from 'react';
import { useDraggable } from '@dnd-kit/core';
import { ChipContainer } from '../index';
import chip1 from '../../assets/chips/chip1.png'
import chip10 from '../../assets/chips/chip10.png'
import chip25 from '../../assets/chips/chip25.png'
import chip50 from '../../assets/chips/chip50.png'
import chip100 from '../../assets/chips/chip100.png'

const chipData = [
  { value: 1, image: chip1 },
  { value: 10, image: chip10 },
  { value: 25, image: chip25 },
  { value: 50, image: chip50 },
  { value: 100, image: chip100 }
];

const Chips = () => {
  return (
    <ChipContainer className="chips-container">
      {chipData.map((chip) => (
        <Chip key={chip.value} chipValue={chip.value} image={chip.image} />
      ))}
    </ChipContainer>
  );
};

const Chip = ({ chipValue, image }) => {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `chip-${chipValue}`,
    data: { chipValue, chipImage: image },  // Passing chip value through drag data
  });

  // Apply transform styles during drag
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
  };

  return (
    <div className="chip" ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <img src={image} alt={`Chip ${chipValue}`} width={30} height={30} />
    </div>
  );
};

export default Chips;
