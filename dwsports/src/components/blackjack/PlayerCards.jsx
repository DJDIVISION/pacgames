import React, {useMemo,useRef,useEffect,useState} from 'react'
import {BlackJackCards,UserAvatar,UserChipSum,EmptyCardLine,CardHolder,SportsCarousel,InnerSportsCarousel,
    Card,
} from './index'
import { IconButton, Avatar } from '@mui/material'
import { motion } from 'framer-motion'
import chipImage from '../../assets/chips/emptyChip.png'
import { transitionLong,animationFour } from '../../animations';

const PlayerCards = ({players,player,activePlayer}) => {

    const carroussel = useRef();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [width, setWidth] = useState(0);

    useEffect(() => {
        if (player?.hand && carroussel.current) {
          // Scroll to the end of the container when player.hand updates
          carroussel.current.scrollLeft = carroussel.current.scrollWidth;
        }
      }, [player?.hand,carroussel]);

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

    const CardSpot = React.memo(({ transform, index, currentIndex }) => {
        if (!players || players.length === 0) return null;
    
        // Calculate the content index for this card spot
        const contentIndex = (index - currentIndex + players.length) % players.length;
    
        // Check if we should render content
        const shouldRenderContent = index < players.length;
        const player = shouldRenderContent ? players[contentIndex] : null;
    
        return (
          <div className="card-spot" style={{ transform }}>
            {shouldRenderContent && players ? (
              <motion.div
                className="card-content"
                key={player.id}
                initial={{ opacity: 0 }} // Only animate opacity, no x movement
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
              >
                {/* Display dynamic content */}
                <UserAvatar><Avatar alt="Image" src={player.avatar} sx={{ width: 80, height: 80 }} /></UserAvatar>
                <UserChipSum id="chipSum" style={{ backgroundImage: `url(${chipImage})`, backgroundPosition: 'center' }}>{player.bet}</UserChipSum>
                <EmptyCardLine></EmptyCardLine>
                <EmptyCardLine>{player.name}</EmptyCardLine>
                <CardHolder>
                <SportsCarousel ref={carroussel}>
                <InnerSportsCarousel drag="x" dragConstraints={{right: 0, left: -width}} whileTap={{cursor: 'grabbing'}}>
                  {player.hand.map((card) => {
                    return (
                      <Card key={card} style={{backgroundImage: `url(./assets/cards/${card}.png)`,
                      backgroundSize: 'contain',}} initial="out" animate="in" variants={animationFour} transition={transitionLong} activePlayer={activePlayer}></Card>
                    )
                  })}
                  </InnerSportsCarousel>
                  </SportsCarousel>
                  <EmptyCardLine>POINTS: {player.playerSum}</EmptyCardLine>
                </CardHolder>
              </motion.div>
            ) : (
              <div className="card-content empty"></div> // Render empty content
            )}
          </div>
        );
    });

  return (
    <BlackJackCards animate={{ height: activePlayer ? '55vh' : '60vh' }}
        initial={{ height: '70vh' }}
        transition={{ duration: 0.5 }}>
          {/* <IconButton  onClick={disconnect}><Disconnect /></IconButton> */}
          {Array.from({ length: 5 }).map((_, i) => (
              <CardSpot
                key={i}
                transform={getTransformForIndex(i)}
                index={i}
                currentIndex={currentIndex}
                players={players}
              />
            ))}
        </BlackJackCards>
  )
}

export default PlayerCards
