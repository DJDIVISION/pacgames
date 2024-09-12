import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styled from 'styled-components'
import {StyledButton} from './index'
import Swal from "sweetalert2";


// Array of content objects
const contents = [
  { title: 'Victor', description: 'This is the first card', bet: 50 },
  { title: 'David', description: 'This is the second card', bet: 75 },
  { title: 'Bittu', description: 'This is the third card', bet: 50 },
  { title: 'Rick', description: 'This is the fourth card', bet: 25},
  { title: 'Morty', description: 'This is the fifth card', bet: 100 }
];

const takePlayerName = async () => {
  const result = await Swal.fire({
    title: "Enter your name",
    input: "text",
    showCancelButton: true,
    buttonsStyling: false,  // Disables SweetAlert2 button styling
    customClass: {
      confirmButton: 'swal-ok',  // Custom class for confirm button
      cancelButton: 'swal-cancel',
      popup: 'custom-swal-modal'      // Custom class for cancel button
    },
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });

  return result;
};

const Slider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [playOnline, setPlayOnline] = useState(false)
  const [playerName, setPlayerName] = useState(null);
  const [playerAvatar, setPlayerAvatar] = useState(null);

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex - 1) % contents.length);
  };
  const goToPrev = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1 + contents.length) % contents.length);
  };
  const askSocket = async () => {
    //setMyId(user.id)
    setPlayerAvatar(user.user_metadata.avatar_url)
    const result = await takePlayerName();
    if (!result.isConfirmed) {
      return;
    }
    const username = result.value;
    setPlayerName(username);
    const newSocket = io("http://localhost:8080", {
      autoConnect: true,
    });
    newSocket?.emit("request_to_play", {
      playerName: username,
      id: user.id,
      avatar: user.user_metadata.avatar_url
    });
    setSocket(newSocket);
  }

  if(!playOnline){
    return(
      <BlackJackSection>
        <BlackJackTitle>BlackJack</BlackJackTitle>
          <StyledButton onClick={askSocket} id="button" style={{marginTop: '50px'}}>PLAY ONLINE</StyledButton>
      </BlackJackSection>
    )
  }

  return (
    <BlackJackSection>
      <BlackJackTitle>

      </BlackJackTitle>
      <BlackJackCards>
          {Array.from({ length: 5 }).map((_, i) => (
              <CardSpot
                key={i}
                transform={getTransformForIndex(i)}
                index={i}
                currentIndex={currentIndex}
              />
            ))}
      </BlackJackCards>
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
      <button onClick={goToPrev}>Previous</button>
      <button onClick={goToNext}>Next</button>
      </div>
      
    </BlackJackSection>
  );
};

// Function to get the transform based on the index
const getTransformForIndex = (index) => {
  const transforms = [
    'translateZ(0) rotateX(15deg)',
    'rotateY(10deg) translateX(520px) translateZ(-50px) rotateX(15deg) scale(1.05)',
    'rotateY(5deg) translateX(250px) translateZ(-50px) rotateX(15deg) scale(1.05)',
    'rotateY(-5deg) translateX(-250px) translateZ(-50px) rotateX(15deg) scale(1.05)',
    'rotateY(-10deg) translateX(-520px) translateZ(-50px) rotateX(15deg) scale(1.05)'
  ];
  return transforms[index];
};

const CardSpot = ({ transform, index, currentIndex }) => {
  const contentIndex = (index - currentIndex + contents.length) % contents.length;

  // Check if the content index exceeds the available contents
  const shouldRenderContent = index < contents.length;
  const content = shouldRenderContent ? contents[contentIndex] : null;

  return (
    <div className="card-spot" style={{ transform }}>
      {shouldRenderContent && content ? (
        <motion.div
          className="card-content"
          key={content.title}
          initial={{ opacity: 0, x: index > currentIndex ? 100 : -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: index > currentIndex ? -100 : 100 }}
          transition={{ duration: 0.5 }}
        >
          {/* Display dynamic content */}
          <UserAvatar></UserAvatar>
          <EmptyCardLine></EmptyCardLine>
          <EmptyCardLine>{content.title}</EmptyCardLine>
          
        </motion.div>
      ) : (
        <div className="card-content empty"></div> // Render empty content
      )}
    </div>
  );
};

export default Slider;

const BlackJackSection = styled.div`
    width: 100vw;
    min-height: 100vh;
    background: ${props => props.theme.body};
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const BlackJackTitle = styled.div`
    width: 100%;
    height: 40vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 98px;
`;

const EmptyCardLine = styled.div`
  width: 100%;
  height: 15%;
  color: ${props => props.theme.text};
  font-size: 26px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const PlayerName = styled.div`
  width: 100%;
  height: 10%;
  border: 1px solid white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = styled.div`
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: orange;
    position: absolute;
    top: 0;
    left: 50%;
    transform: translate(-50%, -50%);
`;

const BlackJackCards = styled.div`
    width: 100%;
    height: 58vh;
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${props => props.theme.text};
    font-size: 98px;
    border: 1px solid white;
    position: relative;
    perspective: 1000px;
`;