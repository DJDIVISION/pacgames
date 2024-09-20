import React, {useEffect, useRef,useState} from 'react'
import {motion,useInView} from 'framer-motion'
import { ButtonHoverAbsolute, item, VolumeDownIcon, VolumeIcon } from '../../pages'
import styled from 'styled-components'
import { CloseChatRoomIcon } from '../chats'
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Slider from '@mui/material/Slider';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import MusicOffIcon from '@mui/icons-material/MusicOff';
import Record from '../../assets/record.png'
import Effects from '../../assets/effects.png'
import Rap from '../../assets/logos/rap.png'
import Blues from '../../assets/logos/blues.png'
import Reggae from '../../assets/logos/Reggae.png'
import Funk from '../../assets/logos/funk.png'
import { useFetchMusicByGenre } from '../functions';

const AnimatedDiv = ({ children }) => {
    const ref = useRef(null);
    
    // Hook to check if the div is in view
    const isInView = useInView(ref, { once: true });
  
    return (
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 50 }}  // Initial state (off-screen)
        animate={isInView ? { opacity: 1, y: 0 } : {}} // Animate when in view
        transition={{ duration: 0.5, ease: "easeOut", type: 'tween' }} // Animation properties
        className="animated-div"
      >
        {children}
      </motion.div>
    );
  };

const MusicMenu = ({volumeMenuOpen,setVolumeMenuOpen,musicVolume,setMusicVolume,effectsVolume, setEffectsVolume,
    allowMusic,setAllowMusic,allowEffects,setAllowEffects,currentTrack, setCurrentTrack
}) => {
    
    const [selectedGenre, setSelectedGenre] = useState(''); // Track user selection
    const { musicFiles, loading, error, url, setUrl, songName, setSongName } = useFetchMusicByGenre(selectedGenre);
    
    
    console.log(musicVolume)
    const toggleVolumeMenu = () => {
        setVolumeMenuOpen(!volumeMenuOpen);
    }

    const handleVolumeChange = (event, newValue) => {
        const newVolume = newValue / 100; // Normalize value to 0-1 range
        setMusicVolume(newVolume); // Update the state with the new volume
    
        // If a track is currently playing, adjust its volume in real-time
        if (currentTrack) {
          currentTrack.volume = newVolume;
        }
      };

    const handleEffectVolume = (event, newValue) => {
        setEffectsVolume(newValue / 100); // Normalize value from 0-100 to 0-1
    };
    useEffect(() => {
        if(url){
            const audio = new Audio(url);
            audio.play();
            setCurrentTrack(audio);
        }
    }, [url])

    const handleGenreChange = (e) => {
        if(currentTrack){
            currentTrack.pause();
            setSongName(null)
        }
        setSelectedGenre(e)
    };
    

  return (
    <motion.div className="menu-container-six" variants={item}
                  initial={{height:0, opacity:0,}}
                  animate={{height:"100vh", opacity:1}}
                  transition={{duration:.5}}
                  exit="exit">
                <Section>
                <ButtonHoverAbsolute onClick={toggleVolumeMenu}><CloseChatRoomIcon /></ButtonHoverAbsolute>
                <AnimatedDiv><FirstRow>MUSIC SETTINGS</FirstRow></AnimatedDiv>
                <AnimatedDiv><SecondRow>
                    <Column>
                    <Image>
                        <ImageHolder><motion.img src={Record} alt="record" /></ImageHolder>
                        <TextHolder>Music</TextHolder>
                    </Image>
                    <SliderWrapper>
                    
                        <Stack spacing={2} direction="row" sx={{ height: '30%', alignItems: 'center', mb: 1, width: '90%' }}>
                          <MusicOff />
                          <Slider aria-label="Volume" value={musicVolume * 100} onChange={handleVolumeChange} />
                          <MusicOn />
                        </Stack>
                      
                    </SliderWrapper>
                    </Column>
                    <Column>
                    <Image>
                        <ImageHolder><motion.img src={Effects} alt="record" /></ImageHolder>
                        <TextHolder>Effects</TextHolder>
                    </Image>
                    <SliderWrapper>
                    <Stack spacing={2} direction="row" sx={{ height: '30%', alignItems: 'center', mb: 1, width: '90%' }}>
                          <VolumeDownIcon />
                          <Slider aria-label="Volume" value={effectsVolume * 100} onChange={handleEffectVolume} />
                          <VolumeIcon />
                        </Stack>
                    </SliderWrapper>
                    </Column>
                </SecondRow></AnimatedDiv>
                <GenreHolder>
                    <GenreTitle>CHOOSE YOUR FAVOURITE GENRE</GenreTitle>
                    <GenreWrapper>
                        <GenreColumn onClick={() => handleGenreChange("blues")}>
                            <ImageHolderTwo whileTap={{scale: 0.95}}><motion.img src={Blues} alt ="blues" /></ImageHolderTwo>
                            <TextHolder>BLUES</TextHolder>
                        </GenreColumn>
                        <GenreColumn onClick={() => handleGenreChange("rap")}>
                            <ImageHolderTwo whileTap={{scale: 0.95}}><motion.img src={Rap} alt ="blues" style={{width: '60%'}}/></ImageHolderTwo>
                            <TextHolder>RAP</TextHolder>
                        </GenreColumn>
                        <GenreColumn onClick={() => handleGenreChange("reggae")}>
                            <ImageHolderTwo whileTap={{scale: 0.95}}><motion.img src={Reggae} alt ="blues" /></ImageHolderTwo>
                            <TextHolder>REGGAE</TextHolder>
                        </GenreColumn>
                        <GenreColumn onClick={() => handleGenreChange("funky")}>
                            <ImageHolderTwo whileTap={{scale: 0.95}}><motion.img src={Funk} alt ="blues" /></ImageHolderTwo>
                            <TextHolder>FUNKY</TextHolder>
                        </GenreColumn>
                    </GenreWrapper>
                    <GenreTitle>{loading ? (
                        <div>NO MUSIC SELECTED</div>
                    ) : (
                        <div>{songName ? <div>{songName} playing now!</div> : ""}</div>
                    )}
                    </GenreTitle>
                </GenreHolder>
                </Section>
    </motion.div>
  )
}

export default MusicMenu

const GenreImage = styled.div`

`;

const GenreColumn = styled.div`
    width: 25%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
`;

const GenreWrapper = styled.div`
    width: 100%;
    height: 70%;
    ${props => props.theme.displayFlexCenter};
`;

const GenreTitle = styled.div`
    width: 100%;
    height: 15%;
    ${props => props.theme.dosisWhite};
    ${props => props.theme.displayFlexCenter};
    font-size: 32px;
`;

const GenreHolder = styled.div`
    width: 80vw;
    height: 60vh;
    ${props => props.theme.displayFlexColumnCenter};
    
    border-radius: 10px;
    padding: 10px;
`;

const TextHolder = styled.div`
    width: 100%;
    height: 30%;
    ${props => props.theme.displayFlexCenter};
    ${props => props.theme.dosisWhite};
    font-size: 1.8rem;
`;

const ImageHolderTwo = styled(motion.div)`
    width: 100%;
    height: 80%;
    ${props => props.theme.displayFlexCenter};
    cursor: pointer;
    img{
        width: 75%;
        display: block;
        object-fit: cover;
    }
`;

const ImageHolder = styled.div`
    width: 100%;
    height: 80%;
    ${props => props.theme.displayFlexCenter};
    img{
        width: 100%;
        display: block;
        object-fit: cover;
    }
`;

const SliderWrapper = styled.div`
    width: 70%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
`;

const Image = styled.div`
    width: 30%;
    height: 100%;
    ${props => props.theme.displayFlexColumnCenter};
`;

const Column = styled.div`
    width: 50%;
    height: 100%;
    ${props => props.theme.displayFlexCenter};
`;

const SecondRow = styled.div`
    min-width: 60vw;
    min-height: 25vh;
    ${props => props.theme.displayFlexCenter};
    
    border-radius: 10px;
    padding: 10px;
`;

const MusicOff = styled(MusicOffIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.2;
    }
`;

const MusicOn = styled(MusicNoteIcon)`
    &&&{
        color: ${props => props.theme.text};
        scale: 1.2;
    }
`;

const Section = styled.div`
    width: 100vw;
    height: 100vh;
    background: transparent;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const FirstRow = styled.div`
    width: 100%;
    height: 15vh;
    ${props => props.theme.displayFlexCenter};
    ${props => props.theme.dosisAqua};
    font-size: 4.5rem;
`;
